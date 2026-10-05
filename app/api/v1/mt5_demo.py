"""
SAGZFX ACADEMY - MT5 demo endpoints.

Every authenticated user (any tier) can get a sandbox MT5 demo account.
The account is one-per-user; calling /provision twice returns the same
login (idempotent).

Endpoints:
    GET  /mt5-demo/status       -> current binding state
    POST /mt5-demo/provision    -> create if missing
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models import User
from app.schemas.mt5_demo import MT5DemoCredentials, MT5DemoStatus
from app.services.mt5_bridge import provision_demo_account

router = APIRouter(prefix="/mt5-demo", tags=["mt5-demo"])


@router.get("/status", response_model=MT5DemoStatus)
async def status_endpoint(user: User = Depends(get_current_user)):
    return MT5DemoStatus(
        bound=bool(user.exness_demo_account_number),
        login=user.exness_demo_account_number,
        server="Exness-MT5Trial9" if user.exness_demo_account_number else None,
        exness_affiliate_id=user.exness_affiliate_id,
        exness_ib_link=settings.EXNESS_IB_LINK,
    )


@router.post(
    "/provision",
    response_model=MT5DemoCredentials,
    status_code=status.HTTP_200_OK,
)
async def provision_endpoint(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Idempotent: if user already has one, we don't overwrite — we just
    # cannot return the password again. Force re-provisioning only via admin.
    if user.exness_demo_account_number:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "You already have an MT5 demo account. "
                "Contact support if you need to reset it."
            ),
        )

    acct = await provision_demo_account(user.email)

    user.exness_demo_account_number = acct.login
    # We do NOT store the password — return it exactly once.
    await db.commit()
    await db.refresh(user)

    return MT5DemoCredentials(
        login=acct.login,
        password=acct.password,
        investor_password=acct.investor_password,
        server=acct.server,
        exness_ib_link=settings.EXNESS_IB_LINK,
        created_at=datetime.now(timezone.utc),
    )
