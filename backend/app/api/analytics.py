from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.core.permissions import require_roles
from app.models.profile import Profile
from app.schemas.analytics import AnalyticsDashboardOut
from app.services.analytics_service import get_executive_dashboard

router = APIRouter(prefix="/analytics", tags=["Executive HR Analytics"])


@router.get("/dashboard", response_model=AnalyticsDashboardOut)
async def get_dashboard_summary(
    current_user: Profile = Depends(require_roles(["ADMIN", "HR"])),
    db: AsyncSession = Depends(get_db),
):
    return await get_executive_dashboard(db, current_user.company_id)


