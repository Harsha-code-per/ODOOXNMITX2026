from typing import Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.core.permissions import get_current_user, require_roles
from app.models.profile import Profile
from app.models.employee import Employee
from app.schemas.payroll import (
    SalaryBreakdownOut,
    WageUpdateRequest,
    SalaryRecalculationResponse,
    SalaryComponents,
)
from app.services.payroll_service import (
    calculate_salary_structure,
    update_employee_salary,
    get_employee_payroll_summary,
)

router = APIRouter(tags=["Payroll & Dynamic Salary Engine"])


@router.get("/payroll/me", response_model=SalaryBreakdownOut)
async def get_my_payroll(
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee profile not found",
        )

    summary = await get_employee_payroll_summary(db, current_user.employee)
    return summary


@router.get("/admin/payroll/{id_or_emp_id}", response_model=SalaryBreakdownOut)
@router.get("/payroll/{id_or_emp_id}", response_model=SalaryBreakdownOut)
async def get_employee_payroll(
    id_or_emp_id: str,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Employee)
        .where(or_(Employee.id == id_or_emp_id, Employee.employee_id == id_or_emp_id))
        .options(selectinload(Employee.salary_structure))
    )
    res = await db.execute(stmt)
    emp = res.scalar_one_or_none()

    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {id_or_emp_id} not found",
        )

    return await get_employee_payroll_summary(db, emp)


@router.put("/admin/payroll/{id_or_emp_id}/salary", response_model=SalaryRecalculationResponse)
@router.put("/payroll/{id_or_emp_id}/salary", response_model=SalaryRecalculationResponse)
async def update_wage_and_recalculate(
    id_or_emp_id: str,
    req: WageUpdateRequest,
    current_user: Profile = Depends(require_roles(["ADMIN", "HR"])),
    db: AsyncSession = Depends(get_db),
):
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

    updated_structure = await update_employee_salary(db, emp.id, req.wage)

    return SalaryRecalculationResponse(
        message="Salary structure successfully recalculated and saved",
        employee_id=emp.employee_id,
        wage=updated_structure.wage,
        basic=updated_structure.basic,
        hra=updated_structure.hra,
        standard_allowance=updated_structure.standard_allowance,
        performance_bonus=updated_structure.performance_bonus,
        lta=updated_structure.lta,
        fixed_allowance=updated_structure.fixed_allowance,
        pf=updated_structure.pf,
        professional_tax=updated_structure.professional_tax,
        gross_salary=updated_structure.gross_salary,
        total_deductions=updated_structure.total_deductions,
        net_salary=updated_structure.net_salary,
    )


@router.post("/admin/payroll/{id_or_emp_id}/calculate", response_model=SalaryComponents)
async def preview_salary_calculation(
    id_or_emp_id: str,
    req: WageUpdateRequest,
    current_user: Profile = Depends(get_current_user),
):
    calc = calculate_salary_structure(req.wage)
    return SalaryComponents(**calc)
