import uuid
from datetime import datetime
from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    message: str = Field(min_length=5,max_length=2000)

class ReviewCreate(BaseModel):
    rating: int = Field(ge=1,le=5)
    body: str = Field(min_length=10,max_length=1200)

class ReviewModerate(BaseModel):
    status: str = Field(pattern="^(approved|rejected)$")

class PublicReview(BaseModel):
    review_id: uuid.UUID
    full_name: str
    rating: int
    body: str
    created_at: datetime
