"""
SAGZFX ACADEMY - SQLAlchemy async engine and session factory.

Handles two Neon/asyncpg quirks:
  1. SQLAlchemy wants the `+asyncpg` driver marker in the URL.
  2. asyncpg rejects `sslmode=` and `channel_binding=` URL params.
     We strip them and force SSL via connect_args instead.
"""
import ssl
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


def _async_url(url: str) -> str:
    """Convert the .env URL into something SQLAlchemy + asyncpg both accept."""
    # Add the +asyncpg driver marker
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)

    # asyncpg rejects these params — strip them. We handle SSL via connect_args.
    for bad in (
        "&sslmode=require",
        "?sslmode=require",
        "&channel_binding=require",
        "?channel_binding=require",
    ):
        url = url.replace(bad, "")

    return url


# Force TLS for Neon (their servers require it).
_ssl_ctx = ssl.create_default_context()

engine = create_async_engine(
    _async_url(settings.DATABASE_URL),
    echo=(settings.ENV == "development"),
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args={"ssl": _ssl_ctx},
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """All ORM models inherit from this."""
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: yields a database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
