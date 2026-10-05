"""
SAGZFX ACADEMY - Payments API.

Endpoints:
  POST /payments/init                - start a checkout session
  POST /payments/webhook/paystack    - receive Paystack confirmation

Flow:
  1. Frontend calls /init with a product_slug.
  2. We create a Paystack session, return the checkout URL.
  3. User pays on Paystack's hosted page.
  4. Paystack sends us a webhook; we verify the signature,
     then either flip has_paid_tuition or insert a premium_purchases row.
"""
import json

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import PremiumPurchase, User
from app.services.payments import init_paystack_checkout, verify_paystack_signature

router = APIRouter(prefix="/payments", tags=["payments"])


# ─── Product catalog ─────────────────────────────────────────
# Amounts are in kobo (NGN * 100).
# Adjust these to real prices when the client signs off.

PRODUCTS = {
    "tuition": {
        "amount_kobo": 150_000_00,   # NGN 150,000
        "description": "SAGZFX ACADEMY Full Tuition",
    },
    "masterclass-pass": {
        "amount_kobo": 75_000_00,    # NGN 75,000
        "description": "SAGZFX Masterclass Access",
    },
    "vip-smc-indicators": {
        "amount_kobo": 25_000_00,    # NGN 25,000
        "description": "VIP SMC Indicators Bundle",
    },
}


class InitPaymentRequest(BaseModel):
    product_slug: str
    callback_url: str  # where Paystack sends the user after payment


class InitPaymentResponse(BaseModel):
    provider: str
    checkout_url: str
    reference: str


# ─── Init endpoint ───────────────────────────────────────────

@router.post("/init", response_model=InitPaymentResponse)
async def init_payment(
    payload: InitPaymentRequest,
    user: User = Depends(get_current_user),
):
    product = PRODUCTS.get(payload.product_slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown product: {payload.product_slug}",
        )

    init = await init_paystack_checkout(
        email=user.email,
        amount_kobo=product["amount_kobo"],
        callback_url=payload.callback_url,
        metadata={
            "user_id": str(user.user_id),
            "product_slug": payload.product_slug,
        },
    )

    return InitPaymentResponse(
        provider=init.provider,
        checkout_url=init.checkout_url,
        reference=init.reference,
    )


# ─── Webhook endpoint ────────────────────────────────────────
# IMPORTANT: This endpoint MUST read the raw body (not parsed JSON)
# because the signature is computed over the raw bytes.

@router.post("/webhook/paystack", status_code=status.HTTP_200_OK)
async def paystack_webhook(
    request: Request,
    x_paystack_signature: str | None = Header(default=None, alias="x-paystack-signature"),
    db: AsyncSession = Depends(get_db),
):
    raw_body = await request.body()

    if not verify_paystack_signature(raw_body, x_paystack_signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Paystack signature.",
        )

    try:
        event = json.loads(raw_body)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON.")

    # Paystack sends many event types; we only care about charge.success
    if event.get("event") != "charge.success":
        return {"received": True, "ignored": event.get("event")}

    data = event.get("data", {})
    metadata = data.get("metadata") or {}
    user_id = metadata.get("user_id")
    product_slug = metadata.get("product_slug")

    if not user_id or not product_slug:
        # Acknowledge so Paystack doesn't retry, but log the mismatch.
        return {"received": True, "warning": "missing metadata"}

    # Fetch the user
    user = await db.get(User, user_id)
    if user is None:
        return {"received": True, "warning": "unknown user"}

    # Idempotency: has this reference already been processed?
    reference = data.get("reference")
    existing = await db.execute(
        select(PremiumPurchase).where(
            PremiumPurchase.user_id == user.user_id,
            PremiumPurchase.product_slug == f"paid:{reference}",
        )
    )
    if existing.scalar_one_or_none() is not None:
        return {"received": True, "already_processed": True}

    # Apply the product effect
    if product_slug == "tuition":
        user.has_paid_tuition = True
    else:
        purchase = PremiumPurchase(
            user_id=user.user_id,
            product_slug=product_slug,
            is_recurring_subscription=False,
            subscription_status="active",
        )
        db.add(purchase)

    # Insert an idempotency marker so retried webhooks don't double-apply.
    marker = PremiumPurchase(
        user_id=user.user_id,
        product_slug=f"paid:{reference}",
        is_recurring_subscription=False,
        subscription_status="processed",
    )
    db.add(marker)

    await db.commit()

    return {
        "received": True,
        "applied": product_slug,
        "user_id": str(user.user_id),
    }
