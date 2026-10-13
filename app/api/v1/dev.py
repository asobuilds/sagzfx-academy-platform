"""
SAGZFX ACADEMY - Development-only helpers.

These endpoints only exist when ENV=development. They are strictly for QA —
they let a developer flip a test user through the paid tiers without going
through Paystack.

They also set the newer fields (learning_plan, class_started_at,
class_expires_at, mentorship_lifetime) that the access_policy module checks.
"""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models import PremiumPurchase, User

router = APIRouter(prefix="/dev", tags=["dev"])


def _guard():
    if settings.ENV != "development":
        raise HTTPException(status_code=404, detail="Not found.")


# ─── Tuition / Beginner class activation ─────────────────────

@router.post("/activate-tuition")
async def activate_tuition(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    DEV ONLY: mark the current user as a paid beginner-class student.

    Sets:
      has_paid_tuition = True
      learning_plan = 'beginner'
      class_started_at = now
      class_expires_at = now + 90 days (default class duration)
    """
    _guard()
    now = datetime.now(timezone.utc)
    user.has_paid_tuition = True
    user.learning_plan = "beginner"
    user.class_started_at = now
    user.class_expires_at = now + timedelta(days=90)
    await db.commit()
    return {
        "user_id": str(user.user_id),
        "has_paid_tuition": True,
        "learning_plan": user.learning_plan,
        "class_started_at": user.class_started_at.isoformat(),
        "class_expires_at": user.class_expires_at.isoformat(),
    }


# ─── Premium / Advanced / Masterclass activation ─────────────

@router.post("/grant-premium")
async def grant_premium(
    product_slug: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    DEV ONLY: create an active premium_purchases row and upgrade the plan.

    Product slug mapping:
      'advance'             -> plan 'advanced'
      'one-on-one'          -> plan 'masters', mentorship_lifetime = True
      'masterclass-pass'    -> plan 'masters' (legacy slug, kept for compat)
      anything else         -> plan stays as-is, only the purchase row is created
    """
    _guard()
    now = datetime.now(timezone.utc)

    # Determine the target plan from the product slug
    plan_map = {
        "advance": "advanced",
        "advance-class": "advanced",
        "one-on-one": "masters",
        "masterclass-pass": "masters",
        "masterclass": "masters",
    }
    target_plan = plan_map.get(product_slug)

    if target_plan:
        user.learning_plan = target_plan
        if target_plan == "masters":
            user.mentorship_lifetime = True
        # Ensure an active class period exists
        if not user.class_expires_at or user.class_expires_at < now:
            user.class_started_at = now
            user.class_expires_at = now + timedelta(days=365)

    purchase = PremiumPurchase(
        user_id=user.user_id,
        product_slug=product_slug,
        is_recurring_subscription=False,
        subscription_status="active",
    )
    db.add(purchase)
    await db.commit()

    return {
        "user_id": str(user.user_id),
        "product_slug": product_slug,
        "status": "active",
        "learning_plan": user.learning_plan,
        "class_expires_at": user.class_expires_at.isoformat()
        if user.class_expires_at
        else None,
    }


# ─── Reset (dev convenience) ─────────────────────────────────

@router.post("/reset-plan")
async def reset_plan(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """DEV ONLY: put the current user back to 'registered' with no class period."""
    _guard()
    user.has_paid_tuition = False
    user.learning_plan = "registered"
    user.class_started_at = None
    user.class_expires_at = None
    user.mentorship_lifetime = False
    await db.commit()
    return {
        "user_id": str(user.user_id),
        "learning_plan": user.learning_plan,
        "has_paid_tuition": user.has_paid_tuition,
    }
