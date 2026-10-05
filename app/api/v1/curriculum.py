"""
SAGZFX ACADEMY - Curriculum routes.

Two endpoints:
  GET /curriculum/modules             -> full tier-projected catalog
  GET /curriculum/modules/{module_id} -> single module (402/403 if locked)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import CourseModule, PremiumPurchase, User
from app.schemas.curriculum import CatalogResponse, ModuleDetail, ModuleSummary

router = APIRouter(prefix="/curriculum", tags=["curriculum"])


# ─── Helpers ─────────────────────────────────────────────────

def _is_unlocked(module: CourseModule, tier: str) -> bool:
    """
    Tier rules for SAGZFX curriculum:
      - Premium users: everything is unlocked.
      - Tuition users: everything except is_premium_locked=True rows.
      - Registered users: only rows that are NOT premium-locked. Beginners
        (tier_level='Beginner') are free previews; everything else is
        considered locked behind tuition.
    """
    if tier == "premium":
        return True
    if tier == "tuition":
        return not module.is_premium_locked
    # registered
    return module.tier_level == "Beginner" and not module.is_premium_locked


async def _resolve_tier(user: User, db: AsyncSession) -> str:
    """Return 'premium' | 'tuition' | 'registered' based on DB state."""
    # Check for an active premium purchase
    stmt = (
        select(PremiumPurchase)
        .where(
            PremiumPurchase.user_id == user.user_id,
            PremiumPurchase.subscription_status == "active",
        )
        .limit(1)
    )
    result = await db.execute(stmt)
    if result.scalar_one_or_none() is not None:
        return "premium"
    if user.has_paid_tuition:
        return "tuition"
    return "registered"


# ─── Endpoints ───────────────────────────────────────────────

@router.get("/modules", response_model=CatalogResponse)
async def list_modules(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    tier = await _resolve_tier(user, db)

    rows = (
        await db.execute(select(CourseModule).order_by(CourseModule.sort_order))
    ).scalars().all()

    modules: list[ModuleSummary] = []
    unlocked_count = 0
    for m in rows:
        unlocked = _is_unlocked(m, tier)
        if unlocked:
            unlocked_count += 1
        modules.append(
            ModuleSummary(
                module_id=m.module_id,
                tier_level=m.tier_level,
                title=m.title,
                sort_order=m.sort_order,
                is_premium_locked=m.is_premium_locked,
                unlocked=unlocked,
            )
        )

    return CatalogResponse(
        access_tier=tier,
        total=len(modules),
        unlocked_count=unlocked_count,
        modules=modules,
    )


@router.get("/modules/{module_id}", response_model=ModuleDetail)
async def get_module(
    module_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    module = await db.get(CourseModule, module_id)
    if module is None:
        raise HTTPException(status_code=404, detail="Module not found.")

    tier = await _resolve_tier(user, db)
    unlocked = _is_unlocked(module, tier)

    # Locked content -> 402 (payment required) for tuition-tier content,
    # 403 (forbidden) for premium-tier content.
    if not unlocked:
        code = (
            status.HTTP_403_FORBIDDEN
            if module.is_premium_locked
            else status.HTTP_402_PAYMENT_REQUIRED
        )
        raise HTTPException(
            status_code=code,
            detail=(
                "Premium purchase required for this module."
                if module.is_premium_locked
                else "Tuition payment required for this module."
            ),
        )

    return ModuleDetail(
        module_id=module.module_id,
        tier_level=module.tier_level,
        title=module.title,
        sort_order=module.sort_order,
        is_premium_locked=module.is_premium_locked,
        unlocked=True,
        video_url_slug=module.video_url_slug,
    )
