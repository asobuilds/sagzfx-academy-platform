"""API schemas for SAGZFX Practice Trading."""
from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class PracticeAccountOut(BaseModel):
    account_id: UUID
    starting_balance: Decimal
    balance: Decimal
    currency: str
    status: str
    reset_count: int
    execution_enabled: bool = False

    model_config = {"from_attributes": True}


class PracticeOrderOut(BaseModel):
    order_id: UUID
    symbol: str
    side: str
    order_type: str
    lot_size: Decimal
    requested_price: Decimal | None
    stop_loss: Decimal | None
    take_profit: Decimal | None
    status: str
    fill_price: Decimal | None
    opened_at: datetime | None
    closed_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}
