"""
SAGZFX ACADEMY - Password hashing and JWT helpers.

Uses bcrypt directly (passlib is unmaintained and incompatible with bcrypt 5.x).
"""
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from jose import JWTError, jwt

from app.core.config import settings

# bcrypt only handles the first 72 bytes of a password. We truncate to be safe.
_BCRYPT_MAX_BYTES = 72


def _to_bytes(password: str) -> bytes:
    """Encode a password to bytes and truncate to bcrypt's 72-byte limit."""
    return password.encode("utf-8")[:_BCRYPT_MAX_BYTES]


def hash_password(raw: str) -> str:
    """Return a bcrypt hash as a UTF-8 string."""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(_to_bytes(raw), salt)
    return hashed.decode("utf-8")


def verify_password(raw: str, hashed: str) -> bool:
    """Constant-time comparison of a plaintext against a stored hash."""
    try:
        return bcrypt.checkpw(_to_bytes(raw), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def _create_token(subject: str, expires_delta: timedelta, token_type: str) -> str:
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
        "type": token_type,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_access_token(subject: str) -> str:
    return _create_token(
        subject,
        timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        "access",
    )


def create_refresh_token(subject: str) -> str:
    return _create_token(
        subject,
        timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        "refresh",
    )


def decode_token(token: str) -> dict[str, Any]:
    """Raises ValueError if the token is invalid or expired."""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc
