import uuid
from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, SmallInteger, String, Text, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class UserFeedback(Base):
    __tablename__="user_feedback"
    feedback_id: Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),primary_key=True,server_default=text("uuid_generate_v4()"))
    user_id: Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),ForeignKey("users.user_id",ondelete="CASCADE"),nullable=False,index=True)
    message: Mapped[str]=mapped_column(Text,nullable=False)
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now())

class UserReview(Base):
    __tablename__="user_reviews"
    review_id: Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),primary_key=True,server_default=text("uuid_generate_v4()"))
    user_id: Mapped[uuid.UUID]=mapped_column(UUID(as_uuid=True),ForeignKey("users.user_id",ondelete="CASCADE"),nullable=False,index=True)
    rating: Mapped[int]=mapped_column(SmallInteger,nullable=False)
    body: Mapped[str]=mapped_column(Text,nullable=False)
    status: Mapped[str]=mapped_column(String(20),nullable=False,server_default=text("'pending'"))
    created_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now())
    updated_at: Mapped[datetime]=mapped_column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())
