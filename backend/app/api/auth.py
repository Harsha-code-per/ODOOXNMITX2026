from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.permissions import get_current_user, require_roles
from app.models.profile import Profile, UserRole
from app.models.employee import Employee
from app.models.payroll import SalaryStructure
from app.services.payroll_service import calculate_salary_structure
from app.schemas.auth import (
    LoginRequest,
    PasswordChangeRequest,
    RegisterRequest,
    TokenResponse,
    UserOut,
    RegisterResponse,
    EmployeeSummary,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Profile)
        .where(Profile.email == req.email.lower())
        .options(selectinload(Profile.employee), selectinload(Profile.company))
    )
    result = await db.execute(stmt)
    profile = result.scalar_one_or_none()

    if not profile or not verify_password(req.password, profile.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not profile.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account has been deactivated or disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )

    role_str = profile.role.value if hasattr(profile.role, "value") else str(profile.role)
    access_token = create_access_token(
        subject=profile.id,
        role=role_str,
        company_id=profile.company_id,
    )

    emp_summary = None
    if profile.employee:
        emp = profile.employee
        emp_summary = EmployeeSummary(
            id=emp.id,
            employee_id=emp.employee_id,
            first_name=emp.first_name,
            last_name=emp.last_name,
            department=emp.department,
            designation=emp.designation,
            avatar_url=emp.avatar_url,
        )

    user_out = UserOut(
        id=profile.id,
        email=profile.email,
        role=role_str,
        company_id=profile.company_id,
        company_name=profile.company.name if profile.company else None,
        must_reset_password=profile.must_reset_password,
        is_active=profile.is_active,
        employee=emp_summary,
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        token=access_token,
        must_reset_password=profile.must_reset_password,
        user=user_out,
    )


@router.post("/change-password")
async def change_password(
    req: PasswordChangeRequest,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not verify_password(req.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed",
        )

    if len(req.new_password.strip()) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long",
        )

    current_user.password_hash = get_password_hash(req.new_password)
    current_user.must_reset_password = False
    current_user.password_changed_at = datetime.now(timezone.utc)

    await db.commit()
    return {"message": "Password updated successfully. Previous sessions invalidated."}


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    req: RegisterRequest,
    current_user: Profile = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_role = str(current_user.role.value if hasattr(current_user.role, "value") else current_user.role)

    # 1. Negative RBAC checks on role assignment
    if user_role == "EMPLOYEE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employees do not have permission to register new users",
        )

    target_role = req.role or UserRole.EMPLOYEE
    target_role_str = target_role.value if hasattr(target_role, "value") else str(target_role)

    if user_role == "HR" and target_role_str != "EMPLOYEE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="HR personnel can only onboard standard employees",
        )

    if user_role == "ADMIN" and target_role_str == "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot assign additional ADMIN role within the company",
        )

    # 2. Check duplicate email or employee_id within tenant
    stmt = select(Profile).where(Profile.email == req.email.lower())
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    emp_stmt = select(Employee).where(
        Employee.company_id == current_user.company_id,
        Employee.employee_id == req.employee_id,
    )
    emp_res = await db.execute(emp_stmt)
    if emp_res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An employee with this employee_id already exists in this company",
        )

    # 3. Transactional multi-record creation
    hashed_pw = get_password_hash(req.password)

    profile = Profile(
        company_id=current_user.company_id,
        email=req.email.lower(),
        password_hash=hashed_pw,
        role=target_role,
        must_reset_password=True,
    )
    db.add(profile)
    await db.flush()

    employee = Employee(
        company_id=current_user.company_id,
        user_id=profile.id,
        employee_id=req.employee_id,
        first_name=req.first_name,
        last_name=req.last_name,
        email=req.email.lower(),
        phone=req.phone,
        department=req.department,
        designation=req.designation,
        avatar_url=req.avatar_url,
    )
    db.add(employee)
    await db.flush()

    # Create default salary structure
    wage_amount = req.wage or 60000.0
    salary_calc = calculate_salary_structure(wage_amount)
    salary = SalaryStructure(
        company_id=current_user.company_id,
        employee_id=employee.id,
        **salary_calc,
    )
    db.add(salary)

    await db.commit()

    return RegisterResponse(
        message="User onboarded successfully into company",
        user_id=profile.id,
        employee_id=employee.employee_id,
        company_id=current_user.company_id,
    )


@router.get("/me", response_model=UserOut)
async def get_me(current_user: Profile = Depends(get_current_user)):
    role_str = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)
    emp_summary = None
    if current_user.employee:
        emp = current_user.employee
        emp_summary = EmployeeSummary(
            id=emp.id,
            employee_id=emp.employee_id,
            first_name=emp.first_name,
            last_name=emp.last_name,
            department=emp.department,
            designation=emp.designation,
            avatar_url=emp.avatar_url,
        )

    return UserOut(
        id=current_user.id,
        email=current_user.email,
        role=role_str,
        company_id=current_user.company_id,
        company_name=current_user.company.name if current_user.company else None,
        must_reset_password=current_user.must_reset_password,
        is_active=current_user.is_active,
        employee=emp_summary,
    )

