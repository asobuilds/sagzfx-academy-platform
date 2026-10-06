"""Authenticated SAGZFX Practice Trading account endpoints.

Account/history access is live. Trade execution is intentionally absent until
an approved live market-data adapter is configured.
"""
from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import PracticeAccount, PracticeLedgerEntry, PracticeOrder, User
from app.schemas.practice_trading import PracticeAccountOut, PracticeLedgerEntryOut, PracticeOrderCreate, PracticeOrderOut
from app.services.practice_trading import unrealized_pnl
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
                amount=Decimal("10000.00"),
                balance_after=Decimal("10000.00"),
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
    result = await db.execute(
        select(PracticeAccount)
        .where(PracticeAccount.user_id == user.user_id)
        .with_for_update()
    )
    account = result.scalar_one_or_none()
    if account is None:
        raise HTTPException(status_code=404, detail="Practice account not activated")

    reset_amount = account.starting_balance - account.balance
    account.balance = account.starting_balance
    account.reset_count += 1
    db.add(
        PracticeLedgerEntry(
            account_id=account.account_id,
            entry_type="reset",
            amount=reset_amount,
            balance_after=account.starting_balance,
            note=f"Practice account reset #{account.reset_count}",
        )
    )
    await db.commit()
    await db.refresh(account)
    return account


@router.get("/ledger", response_model=list[PracticeLedgerEntryOut])
async def list_ledger_entries(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    account = await _account_for_user(db, user)
    if account is None:
        return []
    result = await db.execute(
        select(PracticeLedgerEntry)
        .where(PracticeLedgerEntry.account_id == account.account_id)
        .order_by(PracticeLedgerEntry.created_at.desc())
    )
    return list(result.scalars().all())


EXECUTABLE_USD_QUOTE_PAIRS = {"EURUSD", "GBPUSD", "AUDUSD"}


@router.post("/orders", response_model=PracticeOrderOut)
async def open_market_order(
    payload: PracticeOrderCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    symbol = payload.symbol.upper().replace("/", "")
    side = payload.side.lower()
    if symbol not in EXECUTABLE_USD_QUOTE_PAIRS:
        raise HTTPException(status_code=400, detail="Practice execution currently supports EURUSD, GBPUSD and AUDUSD")
    if side not in {"buy", "sell"}:
        raise HTTPException(status_code=400, detail="side must be buy or sell")

    account_result = await db.execute(
        select(PracticeAccount)
        .where(PracticeAccount.user_id == user.user_id)
        .with_for_update()
    )
    account = account_result.scalar_one_or_none()
    if account is None:
        raise HTTPException(status_code=404, detail="Practice account not activated")
    if account.status != "active":
        raise HTTPException(status_code=409, detail="Practice account is not active")

    try:
        quote = fetch_reference_quote(symbol)
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    order = PracticeOrder(
        account_id=account.account_id,
        symbol=symbol,
        side=side,
        order_type="market",
        lot_size=payload.lot_size,
        requested_price=quote.rate,
        fill_price=quote.rate,
        quote_date=quote.rate_date,
        status="open",
        opened_at=datetime.now(timezone.utc),
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)
    return order


@router.post("/orders/{order_id}/close", response_model=PracticeOrderOut)
async def close_market_order(
    order_id: UUID,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    account_result = await db.execute(
        select(PracticeAccount)
        .where(PracticeAccount.user_id == user.user_id)
        .with_for_update()
    )
    account = account_result.scalar_one_or_none()
    if account is None:
        raise HTTPException(status_code=404, detail="Practice account not activated")

    order_result = await db.execute(
        select(PracticeOrder)
        .where(
            PracticeOrder.order_id == order_id,
            PracticeOrder.account_id == account.account_id,
        )
        .with_for_update()
    )
    order = order_result.scalar_one_or_none()
    if order is None:
        raise HTTPException(status_code=404, detail="Practice order not found")
    if order.status != "open" or order.fill_price is None:
        raise HTTPException(status_code=409, detail="Practice order is not open")

    try:
        quote = fetch_reference_quote(order.symbol)
    except (ValueError, RuntimeError) as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    pnl = unrealized_pnl(order.side, order.lot_size, order.fill_price, quote.rate).quantize(Decimal("0.01"))
    new_balance = account.balance + pnl
    if new_balance < 0:
        raise HTTPException(status_code=409, detail="Closing this position would exceed the virtual account balance")

    account.balance = new_balance
    order.close_price = quote.rate
    order.realized_pnl = pnl
    order.quote_date = quote.rate_date
    order.status = "closed"
    order.closed_at = datetime.now(timezone.utc)
    db.add(
        PracticeLedgerEntry(
            account_id=account.account_id,
            entry_type="realized_pnl",
            amount=pnl,
            balance_after=new_balance,
            reference_type="practice_order",
            reference_id=order.order_id,
            note=f"{order.symbol} {order.side} realized P/L",
        )
    )
    await db.commit()
    await db.refresh(order)
    return order


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


@router.get("/history/{symbol}")
async def reference_history(symbol: str, _user: User = Depends(get_current_user)):
    normalized = symbol.upper().replace("/", "")
    if normalized not in EXECUTABLE_USD_QUOTE_PAIRS:
        raise HTTPException(status_code=400, detail="Chart history currently supports EURUSD, GBPUSD and AUDUSD")
    base, quote = normalized[:3], normalized[3:]
    from datetime import date as _date, timedelta
    from urllib.parse import urlencode
    from urllib.request import Request, urlopen
    import json as _json
    start = (_date.today() - timedelta(days=120)).isoformat()
    url = f"https://api.frankfurter.dev/v1/{start}..?{urlencode({'base': base, 'symbols': quote})}"
    try:
        with urlopen(Request(url, headers={"Accept": "application/json", "User-Agent": "SAGZFX-Academy/1.0"}), timeout=8) as response:
            payload = _json.loads(response.read().decode("utf-8"))
        return [{"date": day, "rate": rates[quote]} for day, rates in sorted(payload["rates"].items()) if quote in rates]
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Reference chart history is unavailable") from exc


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
