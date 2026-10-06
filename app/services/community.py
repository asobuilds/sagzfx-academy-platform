"""
SAGZFX ACADEMY - Community integration service.

Two responsibilities:
  1. Post announcements to Discord via incoming webhooks.
  2. (Future) Manage Supabase Realtime channels for live chat.

Discord webhooks are a free, no-auth HTTP endpoint. We POST a JSON body
to the URL configured per channel and Discord handles the rest.
"""
import httpx

from app.core.config import settings


async def post_discord_announcement(
    message: str,
    channel: str = "tuition",
) -> dict:
    """
    Post a message to the configured Discord webhook.

    Returns a dict with delivery status. Never raises if the webhook is
    missing — callers should surface a friendly "not configured" state.
    """
    webhook_url = (
        settings.DISCORD_WEBHOOK_PREMIUM
        if channel == "premium"
        else settings.DISCORD_WEBHOOK_TUITION
    )

    if not webhook_url:
        return {
            "delivered": False,
            "channel": channel,
            "webhook_configured": False,
        }

    payload = {
        "content": message,
        "username": "SAGZFX ACADEMY",
        "allowed_mentions": {"parse": []},  # never ping anyone
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.post(webhook_url, json=payload)
        response.raise_for_status()

    return {
        "delivered": True,
        "channel": channel,
        "webhook_configured": True,
    }


def realtime_channel_for_tier(access_tier: str) -> str:
    """Map account learning plans to their mentorship realtime channel."""
    mapping = {
        "masters": "sagzfx:masters",
        "advanced": "sagzfx:advanced",
        "beginner": "sagzfx:beginner",
        "registered": "sagzfx:free",
    }
    return mapping.get(access_tier, "sagzfx:free")
