"""SAGZFX ACADEMY - MT5 demo binding status.

Read-only view of whether the signed-in user has linked an Exness account,
plus the partner link used to open one. No credentials are generated or
returned here: SAGZFX Practice Trading is the free practice path, and live
MT5 provisioning requires the Exness MT5 Manager API partnership.

Endpoints:
    GET /mt5-demo/status -> current binding state
"""
from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.core.config import settings
from app.models import User
from app.schemas.mt5_demo import MT5DemoStatus

router = APIRouter(prefix="/mt5-demo", tags=["mt5-demo"])


@router.get("/status", response_model=MT5DemoStatus)
async def status_endpoint(user: User = Depends(get_current_user)):
    bound = bool(user.exness_demo_account_number)
    return MT5DemoStatus(
        bound=bound,
        login=user.exness_demo_account_number,
        server="Exness-MT5Trial9" if bound else None,
        exness_affiliate_id=user.exness_affiliate_id,
        exness_ib_link=settings.EXNESS_IB_LINK,
    )
