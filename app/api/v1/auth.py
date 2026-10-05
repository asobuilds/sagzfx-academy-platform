"""
SAGZFX ACADEMY - Authentication routes.

Endpoints:
    POST /auth/register   - create a new user
    POST /auth/login      - dual-mode login (JSON or form)
    POST /auth/refresh    - exchange refresh token for new pair
    GET  /auth/me         - return the current user
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models import User
from app.schemas.auth import (
    RefreshRequest,
    RegisterRequest,
    TokenPair,
    UserPublic,
)

router = APIRouter(prefix="/auth", tags=["auth"])


# ─── Register ────────────────────────────────────────────────

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(User).where(User.email == payload.email))
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered.",
        )

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# ─── Login ───────────────────────────────────────────────────
# Accepts both:
#   - JSON:  {"email": "...", "password": "..."}   (frontend, curl)
#   - Form:  username=<email>&password=<pw>        (Swagger Authorize button)

@router.post("/login", response_model=TokenPair)
async def login(request: Request, db: AsyncSession = Depends(get_db)):
    email: str | None = None
    password: str | None = None

    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        try:
            body = await request.json()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Malformed JSON body.",
            )
        email = body.get("email")
        password = body.get("password")
    else:
        form = await request.form()
        email = form.get("username")
        password = form.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email and password are required.",
        )

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    return TokenPair(
        access_token=create_access_token(str(user.user_id)),
        refresh_token=create_refresh_token(str(user.user_id)),
    )


# ─── Refresh ─────────────────────────────────────────────────

@router.post("/refresh", response_model=TokenPair)
async def refresh(payload: RefreshRequest, db: AsyncSession = Depends(get_db)):
    try:
        claims = decode_token(payload.refresh_token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid refresh token.")

    if claims.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Wrong token type.")

    user = await db.get(User, claims["sub"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found.")

    return TokenPair(
        access_token=create_access_token(str(user.user_id)),
        refresh_token=create_refresh_token(str(user.user_id)),
    )


# ─── Me ──────────────────────────────────────────────────────

@router.get("/me", response_model=UserPublic)
async def me(current: User = Depends(get_current_user)):
    return current
