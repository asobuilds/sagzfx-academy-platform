"""
SAGZFX ACADEMY - Shared FastAPI dependencies.
"""
import uuid

from fastapi import Cookie, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_token
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

_CREDS_EXC = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    access_cookie: str | None = Cookie(default=None, alias="sagzfx_access"),
    db: AsyncSession = Depends(get_db),
) -> User:
    # Prefer the HttpOnly session cookie. Bearer remains supported for
    # Swagger and non-browser API clients during the migration.
    credential = access_cookie or token
    if not credential:
        raise _CREDS_EXC
    try:
        payload = decode_token(credential)
    except ValueError:
        raise _CREDS_EXC

    if payload.get("type") != "access":
        raise _CREDS_EXC

    try:
        user_uuid = uuid.UUID(payload["sub"])
    except (KeyError, ValueError):
        raise _CREDS_EXC

    user = await db.get(User, user_uuid)
    if not user:
        raise _CREDS_EXC
    return user

# ─── Access tier guards ──────────────────────────────────────
from sqlalchemy import select  # noqa: E402

from app.models import PremiumPurchase, UserRole  # noqa: E402


async def require_tuition_student(
    user: User = Depends(get_current_user),
) -> User:
    """402 Payment Required if the user has not paid tuition."""
    if not user.has_paid_tuition:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Tuition payment required to access this content.",
        )
    return user


async def require_premium(
    product_slug: str | None = None,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    403 Forbidden unless the user has an active purchase.
    If product_slug is given, scopes the check to that product.
    """
    stmt = select(PremiumPurchase).where(
        PremiumPurchase.user_id == user.user_id,
        PremiumPurchase.subscription_status == "active",
    )
    if product_slug:
        stmt = stmt.where(PremiumPurchase.product_slug == product_slug)

    result = await db.execute(stmt.limit(1))
    if result.scalar_one_or_none() is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                f"Premium access required"
                + (f" for {product_slug}" if product_slug else "")
                + "."
            ),
        )
    return user


async def require_admin(
    user: User = Depends(get_current_user),
) -> User:
    """403 Forbidden unless the user's role is admin."""
    if user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required.",
        )
    return user
