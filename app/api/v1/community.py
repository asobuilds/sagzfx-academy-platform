"""
SAGZFX ACADEMY - Community endpoints.

Endpoints:
    GET  /community/realtime-config   -> Supabase config + channel for caller
    POST /community/announce          -> admin-only: post to Discord webhook
"""
from fastapi import APIRouter, Depends
 from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_admin
from app.core.config import settings
from app.core.database import get_db
from app.models import User
from app.schemas.community import (
    AnnounceRequest,
    AnnounceResponse,
    RealtimeConfig,
)
from app.services.community import (
    post_discord_announcement,
    realtime_channel_for_tier,
)

router = APIRouter(prefix="/community", tags=["community"])


def _mentorship_channel(user: User) -> str:
    """Return the live mentorship channel only to paid lifetime members."""
    if not user.mentorship_lifetime:
        return "registered"
    return user.learning_plan


@router.get("/realtime-config", response_model=RealtimeConfig)
async def realtime_config(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Return the config the frontend uses to subscribe to Supabase Realtime.
    Lifetime mentorship remains available after the one-month class expires.
    """
    tier = _mentorship_channel(user)

    return RealtimeConfig(
        supabase_url=settings.SUPABASE_URL or None,
        supabase_anon_key=settings.SUPABASE_ANON_KEY or None,
        channel=realtime_channel_for_tier(tier),
        access_tier=tier,
    )


@router.post("/announce", response_model=AnnounceResponse)
async def announce(
    payload: AnnounceRequest,
    _admin: User = Depends(require_admin),
):
    """Post an announcement to the matching Discord channel. Admin only."""
    result = await post_discord_announcement(payload.message, payload.channel)
    return AnnounceResponse(**result)
