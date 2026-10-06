"""Pure calculations for the SAGZFX paper-trading engine.

These functions never source a price themselves. Callers must supply prices from
an approved market-data adapter before any executable trading route is enabled.
"""
from decimal import Decimal


def unrealized_pnl(side: str, quantity: Decimal, entry_price: Decimal, market_price: Decimal) -> Decimal:
    if quantity <= 0:
        raise ValueError("quantity must be positive")
    if side == "buy":
        return (market_price - entry_price) * quantity
    if side == "sell":
        return (entry_price - market_price) * quantity
    raise ValueError("side must be buy or sell")


def validate_protective_prices(side: str, entry_price: Decimal, stop_loss: Decimal | None, take_profit: Decimal | None) -> None:
    if side not in {"buy", "sell"}:
        raise ValueError("side must be buy or sell")
    if entry_price <= 0:
        raise ValueError("entry price must be positive")
    if side == "buy":
        if stop_loss is not None and stop_loss >= entry_price:
            raise ValueError("buy stop loss must be below entry")
        if take_profit is not None and take_profit <= entry_price:
            raise ValueError("buy take profit must be above entry")
    else:
        if stop_loss is not None and stop_loss <= entry_price:
            raise ValueError("sell stop loss must be above entry")
        if take_profit is not None and take_profit >= entry_price:
            raise ValueError("sell take profit must be below entry")
