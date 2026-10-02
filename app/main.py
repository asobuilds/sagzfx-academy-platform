"""
SAGZFX ACADEMY - FastAPI application entrypoint.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models import CourseModule

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description=f"{settings.BRAND_SLOGAN} | RC {settings.BRAND_RC}",
    docs_url="/docs" if settings.ENV != "production" else None,
)

# CORS - wide open for now, tightened in a later step
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API = "/api/v1"


@app.get("/", tags=["system"])
async def root():
    return {
        "service": settings.APP_NAME,
        "rc": settings.BRAND_RC,
        "slogan": settings.BRAND_SLOGAN,
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok", "env": settings.ENV}


@app.get(f"{API}/brand", tags=["system"])
async def brand():
    return {
        "name": settings.BRAND_NAME,
        "rc": settings.BRAND_RC,
        "slogan": settings.BRAND_SLOGAN,
        "campus": settings.CAMPUS_ADDRESS,
        "social": settings.SOCIAL_HANDLE,
        "phones": [settings.PHONE_PRIMARY, settings.PHONE_SECONDARY],
        "exness_ib_link": settings.EXNESS_IB_LINK,
    }


@app.get(f"{API}/db-check", tags=["system"])
async def db_check():
    """Prove the app can reach Neon and read a real row count."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(func.count()).select_from(CourseModule))
        count = result.scalar_one()
    return {"database": "connected", "course_modules_count": count}
