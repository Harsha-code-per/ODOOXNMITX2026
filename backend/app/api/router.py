from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.employees import router as employees_router
from app.api.attendance import router as attendance_router
from app.api.leaves import router as leaves_router
from app.api.payroll import router as payroll_router
from app.api.analytics import router as analytics_router
from app.api.notifications import router as notifications_router
from app.api.super_admin import router as super_admin_router
from app.api.inquiries import router as inquiries_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(employees_router)
api_router.include_router(attendance_router)
api_router.include_router(leaves_router)
api_router.include_router(payroll_router)
api_router.include_router(analytics_router)
api_router.include_router(notifications_router)
api_router.include_router(super_admin_router)
api_router.include_router(inquiries_router)
