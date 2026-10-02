"""
SAGZFX ACADEMY - Development-only helpers.
These endpoints only exist when ENV=development.
"""
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models import PremiumPurchase, User

router = APIRouter(prefix="/dev", tags=["dev"])


def _guard():
    if settings.ENV != "development":
        raise HTTPException(status_code=404, detail="Not found.")


@router.post("/activate-tuition")
async def activate_tuition(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """DEV ONLY: mark the current user as having paid tuition."""
    _guard()
    user.has_paid_tuition = True
    await db.commit()
    return {"user_id": str(user.user_id), "has_paid_tuition": True}


@router.post("/grant-premium")
async def grant_premium(
    product_slug: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """DEV ONLY: create an active premium_purchases row for the current user."""
    _guard()
    purchase = PremiumPurchase(
        user_id=user.user_id,
        product_slug=product_slug,
        is_recurring_subscription=False,
        subscription_status="active",
    )
    db.add(purchase)
    await db.commit()
    return {"user_id": str(user.user_id), "product_slug": product_slug, "status": "active"}
