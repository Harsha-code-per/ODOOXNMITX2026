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
        .options(selectinload(Profile.employee))
    )
    result = await db.execute(stmt)
    profile = result.scalar_one_or_none()

    if not profile or not verify_password(req.password, profile.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    role_str = profile.role.value if hasattr(profile.role, "value") else str(profile.role)
    access_token = create_access_token(subject=profile.id, role=role_str)

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
        employee=emp_summary,
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        token=access_token,
        user=user_out,
    )


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    req: RegisterRequest,
    current_user: Profile = Depends(require_roles(["ADMIN", "HR"])),
    db: AsyncSession = Depends(get_db),
):
    # Check if email or employee_id exists
    stmt = select(Profile).where(Profile.email == req.email.lower())
    res = await db.execute(stmt)
    if res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )

    emp_stmt = select(Employee).where(Employee.employee_id == req.employee_id)
    emp_res = await db.execute(emp_stmt)
    if emp_res.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An employee with this employee_id already exists",
        )

    hashed_pw = get_password_hash(req.password)
    user_role = req.role or UserRole.EMPLOYEE

    profile = Profile(
        email=req.email.lower(),
        password_hash=hashed_pw,
        role=user_role,
    )
    db.add(profile)
    await db.flush()

    employee = Employee(
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

    # Create default salary structure (₹60,000)
    salary_calc = calculate_salary_structure(60000.0)
    salary = SalaryStructure(
        employee_id=employee.id,
        **salary_calc,
    )
    db.add(salary)

    await db.commit()

    return RegisterResponse(
        message="User registered successfully",
        user_id=profile.id,
        employee_id=employee.employee_id,
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
        employee=emp_summary,
    )
