"""
SAGZFX ACADEMY — Application settings.
Reads from .env at project root.
"""
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = ROOT / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        case_sensitive=False,
        extra="ignore",
    )

    # App
    APP_NAME: str = "SAGZFX ACADEMY"
    ENV: str = "development"
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14
    ALGORITHM: str = "HS256"

    # Database
    DATABASE_URL: str

    # Brand
    BRAND_NAME: str = "SAGZFX ACADEMY"
    BRAND_RC: str = "8064497"
    BRAND_SLOGAN: str = "Profits Forever | Learn, Trade, Grow"
    CAMPUS_ADDRESS: str = "Shop 5 Aib Plaza, Keffi, Abuja Express Way"
    SOCIAL_HANDLE: str = "@sagzfxacademy"
    PHONE_PRIMARY: str = "+2349152100856"
    PHONE_SECONDARY: str = "+2348064963367"

    # Payments
    PAYSTACK_SECRET_KEY: str | None = None
    FLUTTERWAVE_SECRET_KEY: str | None = None
    DEFAULT_CURRENCY: str = "NGN"

    # Browser origins allowed to call the API in production.
    CORS_ORIGINS: str = "http://localhost:3000"

    # Exness
    EXNESS_IB_LINK: str = "https://one.exnessonelink.com/a/ut6xqvmg34"
    MT5_BRIDGE_MODE: str = "disabled"

    # Community
    SUPABASE_URL: str | None = None
    SUPABASE_ANON_KEY: str | None = None
    DISCORD_WEBHOOK_TUITION: str | None = None
    DISCORD_WEBHOOK_PREMIUM: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
