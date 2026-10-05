"""
SAGZFX ACADEMY - Pydantic schemas for the MT5 demo endpoints.
"""
from datetime import datetime

from pydantic import BaseModel


class MT5DemoStatus(BaseModel):
    bound: bool
    login: str | None = None
    server: str | None = None
    exness_affiliate_id: str | None = None
    exness_ib_link: str
    note: str = (
        "Connect your live Exness account via the IB link to keep your "
        "learning progress and unlock live-market tools."
    )


class MT5DemoCredentials(BaseModel):
    """Returned ONCE on provisioning. Not retrievable afterward."""
    login: str
    password: str
    investor_password: str
    server: str
    exness_ib_link: str
    created_at: datetime
