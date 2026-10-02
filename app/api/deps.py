"""
SAGZFX ACADEMY - Shared FastAPI dependencies.
"""
import uuid

from fastapi import Depends, HTTPException, status
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
    db: AsyncSession = Depends(get_db),
) -> User:
    if not token:
        raise _CREDS_EXC
    try:
        payload = decode_token(token)
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
