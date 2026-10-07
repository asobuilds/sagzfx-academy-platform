from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user, require_admin
from app.core.database import get_db
from app.models import User
from app.models.feedback import UserFeedback, UserReview
from app.schemas.feedback import FeedbackCreate, ReviewCreate, ReviewModerate, PublicReview

router=APIRouter(prefix="/feedback",tags=["feedback"])

@router.get("/reviews",response_model=list[PublicReview])
async def public_reviews(db:AsyncSession=Depends(get_db)):
    rows=(await db.execute(select(UserReview,User.full_name).join(User,User.user_id==UserReview.user_id).where(UserReview.status=="approved").order_by(UserReview.created_at.desc()).limit(12))).all()
    return [PublicReview(review_id=r.review_id,full_name=name,rating=r.rating,body=r.body,created_at=r.created_at) for r,name in rows]

@router.post("")
async def submit_feedback(payload:FeedbackCreate,user:User=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    row=UserFeedback(user_id=user.user_id,message=payload.message.strip()); db.add(row); await db.commit()
    return {"submitted":True}

@router.post("/reviews")
async def submit_review(payload:ReviewCreate,user:User=Depends(get_current_user),db:AsyncSession=Depends(get_db)):
    row=UserReview(user_id=user.user_id,rating=payload.rating,body=payload.body.strip()); db.add(row); await db.commit()
    return {"submitted":True,"status":"pending"}

@router.patch("/reviews/{review_id}")
async def moderate_review(review_id:str,payload:ReviewModerate,_admin:User=Depends(require_admin),db:AsyncSession=Depends(get_db)):
    try: import uuid; rid=uuid.UUID(review_id)
    except ValueError: raise HTTPException(400,"Invalid review id")
    row=await db.get(UserReview,rid)
    if not row: raise HTTPException(404,"Review not found")
    row.status=payload.status; await db.commit()
    return {"review_id":review_id,"status":row.status}
