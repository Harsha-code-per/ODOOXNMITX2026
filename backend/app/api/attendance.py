from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.core.permissions import get_current_user
from app.models.profile import Profile
from app.models.employee import Employee
from app.schemas.attendance import (
    CheckInRequest,
    CheckOutRequest,
    AttendanceOut,
    AttendanceHistoryResponse,
    CompanyAttendanceItem,
)
from app.services.attendance_service import (
    process_check_in,
    process_check_out,
    get_employee_attendance_history,
    get_company_attendance,
)

router = APIRouter(prefix="/attendance", tags=["Attendance"])


@router.post("/check-in", response_model=AttendanceOut)
async def check_in(
    req: CheckInRequest = None,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not have an associated employee profile to check in",
        )

    notes = req.notes if req else None
    attendance = await process_check_in(db, current_user.employee.id, notes)
    return attendance


@router.post("/check-out", response_model=AttendanceOut)
async def check_out(
    req: CheckOutRequest = None,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not have an associated employee profile to check out",
        )

    notes = req.notes if req else None
    attendance = await process_check_out(db, current_user.employee.id, notes)
    return attendance


@router.get("/me", response_model=AttendanceHistoryResponse)
async def get_my_attendance_history(
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)"),
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found",
        )

    history = await get_employee_attendance_history(
        db, current_user.employee.id, start_date, end_date
    )
    return history


@router.get("", response_model=List[CompanyAttendanceItem])
async def list_company_attendance(
    date: Optional[date] = Query(None, description="Target date (default: today)"),
    department: Optional[str] = Query(None, description="Filter by department or 'all'"),
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_company_attendance(db, date, department)


@router.get("/{id_or_emp_id}", response_model=AttendanceHistoryResponse)
async def get_employee_attendance(
    id_or_emp_id: str,
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Lookup employee
    stmt = select(Employee).where(
        or_(Employee.id == id_or_emp_id, Employee.employee_id == id_or_emp_id)
    )
    res = await db.execute(stmt)
    emp = res.scalar_one_or_none()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {id_or_emp_id} not found",
        )

    return await get_employee_attendance_history(db, emp.id, start_date, end_date)
