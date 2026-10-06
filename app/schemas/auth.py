"""
SAGZFX ACADEMY - Pydantic schemas for auth endpoints.
"""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserPublic(BaseModel):
    """Public view of a user. Never includes password_hash."""
    user_id: UUID
    full_name: str
    email: EmailStr
    role: str
    has_paid_tuition: bool
    learning_plan: str = "registered"
    class_started_at: datetime | None = None
    class_expires_at: datetime | None = None
    mentorship_lifetime: bool = False
    exness_demo_account_number: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str
