"""Authenticated SAGZFX Practice Trading account endpoints.

Account/history access is live. Trade execution is intentionally absent until
an approved live market-data adapter is configured.
"""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import PracticeAccount, PracticeOrder, User
from app.schemas.practice_trading import PracticeAccountOut, PracticeOrderOut

router = APIRouter(prefix="/practice-trading", tags=["practice-trading"])


async def _account_for_user(db: AsyncSession, user: User) -> PracticeAccount | None:
    result = await db.execute(
        select(PracticeAccount).where(PracticeAccount.user_id == user.user_id)
    )
    return result.scalar_one_or_none()


@router.get("/account", response_model=PracticeAccountOut | None)
async def get_account(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await _account_for_user(db, user)


@router.post("/account", response_model=PracticeAccountOut)
async def create_account(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Database-level ON CONFLICT makes simultaneous first-use requests
    # idempotent; the unique user_id constraint remains the authority.
    await db.execute(
        insert(PracticeAccount)
        .values(user_id=user.user_id)
        .on_conflict_do_nothing(index_elements=[PracticeAccount.user_id])
    )
    await db.commit()
    account = await _account_for_user(db, user)
    if account is None:  # Defensive: successful insert/select must yield one.
        raise RuntimeError("Practice account creation did not persist")
    return account


@router.get("/orders", response_model=list[PracticeOrderOut])
async def list_orders(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    account = await _account_for_user(db, user)
    if account is None:
        return []
    result = await db.execute(
        select(PracticeOrder)
        .where(PracticeOrder.account_id == account.account_id)
        .order_by(PracticeOrder.created_at.desc())
    )
    return list(result.scalars().all())
