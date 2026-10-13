"""
SAGZFX ACADEMY - Pydantic schemas for the curriculum API.
"""
from typing import Any

from pydantic import BaseModel


class ModuleSummary(BaseModel):
    """One row in the catalog listing. Never includes video_url_slug or lesson_body."""
    module_id: str
    tier_level: str
    title: str
    sort_order: int
    is_premium_locked: bool
    unlocked: bool


class ModuleDetail(BaseModel):
    """
    Single module. Includes video URL and full lesson content ONLY if unlocked.
    """
    module_id: str
    tier_level: str
    title: str
    sort_order: int
    is_premium_locked: bool
    unlocked: bool

    # Video
    video_url_slug: str | None = None

    # Lesson content — populated only when unlocked
    lesson_body: str | None = None
    learning_outcomes: list[str] = []
    assignment: str | None = None
    checkpoint_questions: Any | None = None   # JSONB-shaped dict or None
    estimated_minutes: int | None = None
    lesson_status: str | None = None


class CatalogResponse(BaseModel):
    """Full catalog response, with the caller's tier attached."""
    access_tier: str
    total: int
    unlocked_count: int
    modules: list[ModuleSummary]
