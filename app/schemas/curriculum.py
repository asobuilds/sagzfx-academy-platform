"""
SAGZFX ACADEMY - Pydantic schemas for the curriculum API.
"""
from pydantic import BaseModel


class ModuleSummary(BaseModel):
    """One row in the catalog listing. Never includes video_url_slug."""
    module_id: str
    tier_level: str
    title: str
    sort_order: int
    is_premium_locked: bool
    unlocked: bool


class ModuleDetail(BaseModel):
    """Single module. Includes the video URL only if unlocked."""
    module_id: str
    tier_level: str
    title: str
    sort_order: int
    is_premium_locked: bool
    unlocked: bool
    video_url_slug: str | None = None


class CatalogResponse(BaseModel):
    """Full catalog response, with the caller's tier attached."""
    access_tier: str
    total: int
    unlocked_count: int
    modules: list[ModuleSummary]
