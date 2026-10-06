"""SAGZFX ACADEMY - Paystack checkout and learning-plan activation."""
import json
from calendar import monthrange
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import PremiumPurchase, User
from app.services.payments import init_paystack_checkout, verify_paystack_signature

router = APIRouter(prefix="/payments", tags=["payments"])

PRODUCTS = {
    "beginner": {
        "amount_kobo": 150_000_00,
        "description": "SAGZFX Beginner Class - 1 Month + Lifetime Mentorship",
    },
    "advanced": {
        "amount_kobo": 250_000_00,
        "description": "SAGZFX Advanced Class - 1 Month + Lifetime Mentorship",
    },
    "masters": {
        "amount_kobo": 500_000_00,
        "description": "SAGZFX Masters & One-on-One - 1 Month + Lifetime Mentorship",
    },
}


def _one_month_after(value: datetime) -> datetime:
    year = value.year + (1 if value.month == 12 else 0)
    month = 1 if value.month == 12 else value.month + 1
    day = min(value.day, monthrange(year, month)[1])
    return value.replace(year=year, month=month, day=day)


class InitPaymentRequest(BaseModel):
    product_slug: str
    callback_url: str


class InitPaymentResponse(BaseModel):
    provider: str
    checkout_url: str
    reference: str


@router.post("/init", response_model=InitPaymentResponse)
async def init_payment(payload: InitPaymentRequest, user: User = Depends(get_current_user)):
    product = PRODUCTS.get(payload.product_slug)
    if not product:
        raise HTTPException(status_code=404, detail=f"Unknown product: {payload.product_slug}")

    init = await init_paystack_checkout(
        email=user.email,
        amount_kobo=product["amount_kobo"],
        callback_url=payload.callback_url,
        metadata={"user_id": str(user.user_id), "product_slug": payload.product_slug},
    )
    return InitPaymentResponse(
        provider=init.provider, checkout_url=init.checkout_url, reference=init.reference
    )


@router.post("/webhook/paystack", status_code=status.HTTP_200_OK)
async def paystack_webhook(
    request: Request,
    x_paystack_signature: str | None = Header(default=None, alias="x-paystack-signature"),
    db: AsyncSession = Depends(get_db),
):
    raw_body = await request.body()
    if not verify_paystack_signature(raw_body, x_paystack_signature):
        raise HTTPException(status_code=401, detail="Invalid Paystack signature.")

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
    reference = data.get("reference")
    product = PRODUCTS.get(product_slug)

    if not user_id or not reference or product is None:
        return {"received": True, "warning": "invalid payment metadata"}

    # Never grant entitlement from metadata alone: amount and currency must match.
    if data.get("amount") != product["amount_kobo"] or data.get("currency") != "NGN":
        return {"received": True, "warning": "payment amount or currency mismatch"}

    user = await db.get(User, user_id)
    if user is None:
        return {"received": True, "warning": "unknown user"}

    existing = await db.execute(
        select(PremiumPurchase).where(
            PremiumPurchase.user_id == user.user_id,
            PremiumPurchase.product_slug == f"paid:{reference}",
        )
    )
    if existing.scalar_one_or_none() is not None:
        return {"received": True, "already_processed": True}

    activated_at = datetime.now(timezone.utc)
    expires_at = _one_month_after(activated_at)
    user.learning_plan = product_slug
    user.class_started_at = activated_at
    user.class_expires_at = expires_at
    user.mentorship_lifetime = True
    # Preserve legacy flag temporarily for old code paths during migration.
    user.has_paid_tuition = True
    user.tuition_activated_at = activated_at

    db.add(PremiumPurchase(
        user_id=user.user_id,
        product_slug=product_slug,
        is_recurring_subscription=False,
        subscription_status="active",
        expires_at=expires_at,
    ))
    db.add(PremiumPurchase(
        user_id=user.user_id,
        product_slug=f"paid:{reference}",
        is_recurring_subscription=False,
        subscription_status="processed",
    ))
    await db.commit()

    return {
        "received": True,
        "applied": product_slug,
        "user_id": str(user.user_id),
        "class_expires_at": expires_at.isoformat(),
        "mentorship_lifetime": True,
    }
