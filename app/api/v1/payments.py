"""
SAGZFX ACADEMY - Payments API.

Endpoints:
  POST /payments/init                - start a checkout session
  POST /payments/webhook/paystack    - receive Paystack confirmation
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
# Amounts in kobo (NGN * 100).
# Client-confirmed pricing (2026-10-12):
#   Beginners class  = NGN 150,000
#   Advance class    = NGN 250,000
#   One-on-one       = NGN 500,000

PRODUCTS = {
    "tuition": {
        "amount_kobo": 150_000_00,     # NGN 150,000
        "description": "SAGZFX Beginners Class - Full Tuition",
    },
    "advance": {
        "amount_kobo": 250_000_00,     # NGN 250,000
        "description": "SAGZFX Advance Class",
    },
    "one-on-one": {
        "amount_kobo": 500_000_00,     # NGN 500,000
        "description": "SAGZFX One-on-One Mentorship",
    },
}


class InitPaymentRequest(BaseModel):
    product_slug: str
    callback_url: str


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

    if event.get("event") != "charge.success":
        return {"received": True, "ignored": event.get("event")}

    data = event.get("data", {})
    metadata = data.get("metadata") or {}
    user_id = metadata.get("user_id")
    product_slug = metadata.get("product_slug")

    if not user_id or not product_slug:
        return {"received": True, "warning": "missing metadata"}

    user = await db.get(User, user_id)
    if user is None:
        return {"received": True, "warning": "unknown user"}

    reference = data.get("reference")
    existing = await db.execute(
        select(PremiumPurchase).where(
            PremiumPurchase.user_id == user.user_id,
            PremiumPurchase.product_slug == f"paid:{reference}",
        )
    )
    if existing.scalar_one_or_none() is not None:
        return {"received": True, "already_processed": True}

    # Apply product effect:
    #   tuition       -> unlocks Beginner + Market Structure tiers (has_paid_tuition)
    #   advance       -> same as tuition, plus marks advance access
    #   one-on-one    -> has_paid_tuition + premium purchase row for masters
    if product_slug in ("tuition", "advance"):
        user.has_paid_tuition = True

    purchase = PremiumPurchase(
        user_id=user.user_id,
        product_slug=product_slug,
        is_recurring_subscription=False,
        subscription_status="active",
    )
    db.add(purchase)

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
