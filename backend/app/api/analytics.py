from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.core.permissions import get_current_user
from app.models.profile import Profile
from app.schemas.analytics import AnalyticsDashboardOut
from app.services.analytics_service import get_executive_dashboard

router = APIRouter(prefix="/analytics", tags=["Executive HR Analytics"])


@router.get("/dashboard", response_model=AnalyticsDashboardOut)
async def get_dashboard_summary(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_executive_dashboard(db)
