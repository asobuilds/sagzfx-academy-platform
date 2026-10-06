"""Pure calculations for SAGZFX Practice Trading.

Prices must be supplied by an approved market-data adapter. The calculation
layer never invents or fetches a price.
"""
from decimal import Decimal

STANDARD_FX_CONTRACT_SIZE = Decimal("100000")


def unrealized_pnl(side: str, lot_size: Decimal, entry_price: Decimal, market_price: Decimal, contract_size: Decimal = STANDARD_FX_CONTRACT_SIZE) -> Decimal:
    if lot_size <= 0:
        raise ValueError("lot size must be positive")
    units = lot_size * contract_size
    if side == "buy":
        return (market_price - entry_price) * units
    if side == "sell":
        return (entry_price - market_price) * units
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
