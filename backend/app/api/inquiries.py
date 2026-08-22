from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.super_admin import InquiryCreate, InquiryOut
from app.services.super_admin_service import create_inquiry

router = APIRouter(prefix="/inquiries", tags=["Public Inquiries & Pricing"])


@router.post("", response_model=InquiryOut, status_code=status.HTTP_201_CREATED)
async def submit_public_inquiry(
    req: InquiryCreate,
    db: AsyncSession = Depends(get_db),
):
    return await create_inquiry(db, req)
