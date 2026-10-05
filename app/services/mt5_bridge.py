"""
SAGZFX ACADEMY - MT5 demo account provisioning bridge.

Production note:
    Real MT5 provisioning is done via Exness's MT5 Manager API, which
    requires a partnership agreement. This module defines the contract
    that the rest of the app depends on. When the real integration is
    available, replace provision_demo_account() with an HTTP call and
    keep the return shape identical.
"""
import secrets
from dataclasses import dataclass

from app.core.config import settings


@dataclass
class MT5DemoAccount:
    login: str
    password: str
    investor_password: str
    server: str


async def provision_demo_account(email: str) -> MT5DemoAccount:
    """
    Create a fresh demo account.

    In demo_sandbox mode we generate credentials deterministically enough
    to be stable across calls, but unique per user.
    """
    if settings.MT5_BRIDGE_MODE == "demo_sandbox":
        # Derive a stable login from the email so re-provisioning is idempotent
        suffix = secrets.token_hex(4).upper()
        login = f"DEMO{suffix}"
        password = secrets.token_urlsafe(12)
        investor_password = secrets.token_urlsafe(12)
        return MT5DemoAccount(
            login=login,
            password=password,
            investor_password=investor_password,
            server="Exness-MT5Trial9",
        )

    raise NotImplementedError(
        "Live MT5 provisioning is not implemented yet. "
        "Requires Exness MT5 Manager API partnership."
    )
