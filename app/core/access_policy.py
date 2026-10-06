"""SAGZFX learning-plan access policy.

Pure functions live here so entitlement rules can be tested without a database.
"""
from datetime import datetime

PLAN_LEVEL = {
    "registered": 0,
    "beginner": 1,
    "advanced": 2,
    "masters": 3,
}

MODULE_PLAN = {
    "Beginner": "beginner",
    "Market Structure": "advanced",
    "Advanced": "advanced",
    "Masterclass": "masters",
}


def plan_allows_tier(plan: str, tier_level: str) -> bool:
    required = MODULE_PLAN.get(tier_level)
    if required is None:
        return False
    return PLAN_LEVEL.get(plan, 0) >= PLAN_LEVEL[required]


def module_is_accessible(
    *,
    plan: str,
    tier_level: str,
    now: datetime,
    class_expires_at: datetime | None,
    first_opened_at: datetime | None,
) -> bool:
    """During class: eligible tier modules. After expiry: only previously opened."""
    if not plan_allows_tier(plan, tier_level):
        return False
    if class_expires_at is None:
        return False
    if now <= class_expires_at:
        return True
    return first_opened_at is not None and first_opened_at <= class_expires_at
