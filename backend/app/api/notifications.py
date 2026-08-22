from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.core.permissions import get_current_user
from app.models.profile import Profile
from app.schemas.notification import NotificationOut
from app.services.notification_service import (
    get_user_notifications,
    mark_notification_as_read,
)

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationOut])
async def list_notifications(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_user_notifications(db, current_user.id)


@router.patch("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    success = await mark_notification_as_read(db, notification_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    return {"message": "Notification marked as read", "id": notification_id}
