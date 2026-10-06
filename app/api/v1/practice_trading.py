"""Authenticated SAGZFX Practice Trading account endpoints.

Account/history access is live. Trade execution is intentionally absent until
an approved live market-data adapter is configured.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import PracticeAccount, PracticeLedgerEntry, PracticeOrder, User
from app.schemas.practice_trading import PracticeAccountOut, PracticeOrderOut
from app.services.reference_fx import fetch_reference_quote

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
    result = await db.execute(
        insert(PracticeAccount)
        .values(user_id=user.user_id)
        .on_conflict_do_nothing(index_elements=[PracticeAccount.user_id])
        .returning(PracticeAccount.account_id)
    )
    created_account_id = result.scalar_one_or_none()
    if created_account_id is not None:
        db.add(
            PracticeLedgerEntry(
                account_id=created_account_id,
                entry_type="account_opened",
                amount=10000,
                balance_after=10000,
                note="Initial SAGZFX virtual practice balance",
            )
        )
    await db.commit()
    account = await _account_for_user(db, user)
    if account is None:  # Defensive: successful insert/select must yield one.
        raise RuntimeError("Practice account creation did not persist")
    return account

@router.post("/account/reset", response_model=PracticeAccountOut)
async def reset_account(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    account = await _account_for_user(db, user)
    if account is None:
        raise HTTPException(status_code=404, detail="Practice account not activated")
    account.balance = account.starting_balance
    account.reset_count += 1
    db.add(
        PracticeLedgerEntry(
            account_id=account.account_id,
            entry_type="reset",
            amount=0,
            balance_after=account.starting_balance,
            note=f"Practice account reset #{account.reset_count}",
        )
    )
    await db.commit()
    await db.refresh(account)
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


@router.get("/quote/{symbol}")
async def get_reference_quote(
    symbol: str,
    _user: User = Depends(get_current_user),
):
    """Return a dated educational reference rate, never a broker execution quote."""
    try:
        quote = fetch_reference_quote(symbol)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return {
        "symbol": quote.symbol,
        "rate": str(quote.rate),
        "rate_date": quote.rate_date.isoformat(),
        "provider": quote.provider,
        "price_type": quote.price_type,
        "realtime": quote.realtime,
        "execution_enabled": False,
        "disclaimer": "Educational reference rate only; not a broker bid/ask or real-time execution price.",
    }
