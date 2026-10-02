"""
SAGZFX ACADEMY - ORM model for the `premium_purchases` table.
Mirrors schema.sql exactly.
"""
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class PremiumPurchase(Base):
    __tablename__ = "premium_purchases"

    purchase_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("uuid_generate_v4()"),
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False,
    )
    product_slug: Mapped[str] = mapped_column(String(100), nullable=False)
    is_recurring_subscription: Mapped[bool] = mapped_column(
        Boolean, server_default=text("FALSE")
    )
    subscription_status: Mapped[str] = mapped_column(
        String(20), server_default=text("'active'")
    )
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    user: Mapped["User"] = relationship("User", back_populates="purchases")
