"""SAGZFX ACADEMY - Curriculum routes with plan and expiry enforcement."""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.access_policy import module_is_accessible, plan_allows_tier
from app.core.database import get_db
from app.models import CourseModule, StudentProgress, User
from app.schemas.curriculum import CatalogResponse, ModuleDetail, ModuleSummary

router = APIRouter(prefix="/curriculum", tags=["curriculum"])


async def _progress_for_user(db: AsyncSession, user: User) -> dict[str, StudentProgress]:
    rows = (
        await db.execute(select(StudentProgress).where(StudentProgress.user_id == user.user_id))
    ).scalars().all()
    return {row.module_id: row for row in rows}


def _unlocked(module: CourseModule, user: User, progress: StudentProgress | None, now: datetime) -> bool:
    return module_is_accessible(
        plan=user.learning_plan,
        tier_level=module.tier_level,
        now=now,
        class_expires_at=user.class_expires_at,
        first_opened_at=progress.first_opened_at if progress else None,
    )


@router.get("/modules", response_model=CatalogResponse)
async def list_modules(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    now = datetime.now(timezone.utc)
    progress = await _progress_for_user(db, user)
    rows = (
        await db.execute(select(CourseModule).order_by(CourseModule.sort_order))
    ).scalars().all()

    modules = []
    unlocked_count = 0
    for module in rows:
        unlocked = _unlocked(module, user, progress.get(module.module_id), now)
        unlocked_count += int(unlocked)
        modules.append(ModuleSummary(
            module_id=module.module_id,
            tier_level=module.tier_level,
            title=module.title,
            sort_order=module.sort_order,
            is_premium_locked=module.is_premium_locked,
            unlocked=unlocked,
        ))

    return CatalogResponse(
        access_tier=user.learning_plan,
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

    now = datetime.now(timezone.utc)
    result = await db.execute(
        select(StudentProgress).where(
            StudentProgress.user_id == user.user_id,
            StudentProgress.module_id == module_id,
        )
    )
    progress = result.scalar_one_or_none()

    if not _unlocked(module, user, progress, now):
        if not plan_allows_tier(user.learning_plan, module.tier_level):
            detail = "Your learning plan does not include this module."
        elif user.class_expires_at and now > user.class_expires_at:
            detail = "Your class period has ended and this module was not opened during it."
        else:
            detail = "An active class period is required to open this module."
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

    # First successful access during the active class permanently records the module.
    if (
        user.class_expires_at
        and now <= user.class_expires_at
        and (progress is None or progress.first_opened_at is None)
    ):
        if progress is None:
            progress = StudentProgress(
                user_id=user.user_id,
                module_id=module.module_id,
                first_opened_at=now,
            )
            db.add(progress)
        else:
            progress.first_opened_at = now
        await db.commit()

    return ModuleDetail(
        module_id=module.module_id,
        tier_level=module.tier_level,
        title=module.title,
        sort_order=module.sort_order,
        is_premium_locked=module.is_premium_locked,
        unlocked=True,
        video_url_slug=module.video_url_slug,
    )
