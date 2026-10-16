"""
SAGZFX ACADEMY - FastAPI application entrypoint.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import func, select

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models import CourseModule
from app.api.v1.auth import router as auth_router
from app.api.v1.dev import router as dev_router
from app.api.v1.curriculum import router as curriculum_router
from app.api.v1.payments import router as payments_router
from app.api.v1.practice_trading import router as practice_trading_router
from app.api.v1.community import router as community_router
from app.api.v1.feedback import router as feedback_router

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description=f"{settings.BRAND_SLOGAN} | RC {settings.BRAND_RC}",
    docs_url="/docs" if settings.ENV != "production" else None,
)

# Parse CORS origins
cors_origins = [
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
]

# Trusted origins for CSRF middleware:
#   - The configured CORS origins (frontend)
#   - The API's own origin (so Swagger UI works locally)
LOCAL_ORIGINS = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]
TRUSTED_ORIGINS = set(cors_origins) | set(LOCAL_ORIGINS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API = "/api/v1"


@app.middleware("http")
async def reject_cross_site_unsafe_requests(request: Request, call_next):
    """
    CSRF protection for cookie-authenticated state-changing routes.

    Rules:
      1. Only applies to state-changing methods (POST/PUT/PATCH/DELETE).
      2. Only enforced when an auth cookie is present (i.e., the browser
         was authenticated via cookies). Token-in-header requests and
         no-auth requests are unaffected.
      3. If an Origin header is present, it must be in the trusted list.
      4. If no Origin header is present (curl, Postman, mobile, webhooks,
         Swagger UI on the same origin), the request is allowed.
    """
    if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
        has_auth_cookie = bool(
            request.cookies.get("sagzfx_access") or request.cookies.get("sagzfx_refresh")
        )
        origin = request.headers.get("origin")

        if has_auth_cookie and origin and origin not in TRUSTED_ORIGINS:
            return JSONResponse(
                status_code=403,
                content={"detail": "Untrusted request origin."},
            )

    return await call_next(request)


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


# ─── Route registration ──────────────────────────────────────
app.include_router(auth_router, prefix=API)
app.include_router(curriculum_router, prefix=API)
app.include_router(payments_router, prefix=API)
app.include_router(practice_trading_router, prefix=API)
app.include_router(community_router, prefix=API)
app.include_router(feedback_router, prefix=API)
if settings.ENV == "development":
    app.include_router(dev_router, prefix=API)
