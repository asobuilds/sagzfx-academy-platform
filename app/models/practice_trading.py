"""Persistent virtual-money models for SAGZFX Practice Trading."""
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class PracticeAccount(Base):
    __tablename__ = "practice_accounts"
    account_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    starting_balance: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("10000.00"))
    balance: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False, server_default=text("10000.00"))
    currency: Mapped[str] = mapped_column(String(10), nullable=False, server_default=text("'USD'"))
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'active'"))
    reset_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("0"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())
    orders: Mapped[list["PracticeOrder"]] = relationship("PracticeOrder", back_populates="account", cascade="all, delete-orphan")
    ledger_entries: Mapped[list["PracticeLedgerEntry"]] = relationship("PracticeLedgerEntry", back_populates="account", cascade="all, delete-orphan")


class PracticeOrder(Base):
    __tablename__ = "practice_orders"
    order_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    account_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("practice_accounts.account_id", ondelete="CASCADE"), nullable=False)
    symbol: Mapped[str] = mapped_column(String(30), nullable=False)
    side: Mapped[str] = mapped_column(String(4), nullable=False)
    order_type: Mapped[str] = mapped_column(String(10), nullable=False)
    lot_size: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    requested_price: Mapped[Decimal | None] = mapped_column(Numeric(18, 8))
    stop_loss: Mapped[Decimal | None] = mapped_column(Numeric(18, 8))
    take_profit: Mapped[Decimal | None] = mapped_column(Numeric(18, 8))
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'pending'"))
    fill_price: Mapped[Decimal | None] = mapped_column(Numeric(18, 8))
    opened_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    closed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    account: Mapped[PracticeAccount] = relationship("PracticeAccount", back_populates="orders")



class PracticeLedgerEntry(Base):
    """Append-only accounting event for a virtual practice account."""

    __tablename__ = "practice_ledger_entries"
    entry_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, server_default=text("uuid_generate_v4()"))
    account_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("practice_accounts.account_id", ondelete="CASCADE"), nullable=False)
    entry_type: Mapped[str] = mapped_column(String(30), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    balance_after: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    reference_type: Mapped[str | None] = mapped_column(String(30))
    reference_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    note: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    account: Mapped[PracticeAccount] = relationship("PracticeAccount", back_populates="ledger_entries")
