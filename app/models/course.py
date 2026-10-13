"""
SAGZFX ACADEMY - ORM model for the `course_modules` table.

Columns 1-6 come from the original schema (migrations 001-005 untouched them).
Columns 7-16 were added by migration 006_lesson_content.sql.
"""
import uuid
from datetime import datetime

from sqlalchemy import (
    ARRAY,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class CourseModule(Base):
    __tablename__ = "course_modules"

    # ─── Original columns (schema.sql) ────────────────────────
    module_id: Mapped[str] = mapped_column(String(20), primary_key=True)
    tier_level: Mapped[str] = mapped_column(String(30), nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    video_url_slug: Mapped[str | None] = mapped_column(String(255))
    is_premium_locked: Mapped[bool] = mapped_column(
        Boolean, server_default=text("FALSE")
    )
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)

    # ─── Added by migration 006_lesson_content.sql ────────────
    lesson_body: Mapped[str | None] = mapped_column(Text)
    learning_outcomes: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    assignment: Mapped[str | None] = mapped_column(Text)
    checkpoint_questions: Mapped[dict | None] = mapped_column(JSONB)
    formula_snippets: Mapped[dict | None] = mapped_column(JSONB)
    estimated_minutes: Mapped[int] = mapped_column(
        Integer, server_default=text("45"), nullable=False
    )
    lesson_status: Mapped[str] = mapped_column(
        String(20), server_default=text("'draft'"), nullable=False
    )
    lesson_updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    reviewed_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id", ondelete="SET NULL"),
        nullable=True,
    )
