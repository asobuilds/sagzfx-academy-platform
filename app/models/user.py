"""
SAGZFX ACADEMY - ORM model for the `users` table.
Mirrors schema.sql exactly.
"""
import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserRole(str, enum.Enum):
    student = "student"
    alumni = "alumni"
    moderator = "moderator"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("uuid_generate_v4()"),
    )
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role", create_type=False),
        server_default=text("'student'"),
    )

    has_paid_tuition: Mapped[bool] = mapped_column(
        Boolean, server_default=text("FALSE")
    )
    tuition_activated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    exness_affiliate_id: Mapped[str | None] = mapped_column(String(50))
    exness_demo_account_number: Mapped[str | None] = mapped_column(String(50))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    purchases: Mapped[list["PremiumPurchase"]] = relationship(
        "PremiumPurchase", back_populates="user", cascade="all, delete-orphan"
    )

    def access_tier(self) -> str:
        """Returns 'registered' | 'tuition' | 'premium'."""
        if self.purchases and any(
            p.subscription_status == "active" for p in self.purchases
        ):
            return "premium"
        if self.has_paid_tuition:
            return "tuition"
        return "registered"
