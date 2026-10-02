"""
SAGZFX ACADEMY - ORM model for the `course_modules` table.
Mirrors schema.sql exactly.
"""
from sqlalchemy import Boolean, Integer, String, text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class CourseModule(Base):
    __tablename__ = "course_modules"

    module_id: Mapped[str] = mapped_column(String(20), primary_key=True)
    tier_level: Mapped[str] = mapped_column(String(30), nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    video_url_slug: Mapped[str | None] = mapped_column(String(255))
    is_premium_locked: Mapped[bool] = mapped_column(
        Boolean, server_default=text("FALSE")
    )
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False)
