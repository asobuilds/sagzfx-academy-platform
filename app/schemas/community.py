"""
SAGZFX ACADEMY - Pydantic schemas for community endpoints.
"""
from pydantic import BaseModel, Field


class RealtimeConfig(BaseModel):
    """Config the frontend needs to open a Supabase Realtime channel."""
    supabase_url: str | None
    supabase_anon_key: str | None
    channel: str
    access_tier: str


class AnnounceRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    channel: str = Field(default="tuition", pattern="^(tuition|premium)$")


class AnnounceResponse(BaseModel):
    delivered: bool
    channel: str
    webhook_configured: bool
