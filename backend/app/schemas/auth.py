from typing import Optional, Any, Dict
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.profile import UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class RegisterRequest(BaseModel):
    employee_id: str
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: Optional[UserRole] = UserRole.EMPLOYEE
    department: Optional[str] = "General"
    designation: Optional[str] = "Staff"
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    wage: Optional[float] = 60000.0



class CompanyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    currency: str = "INR"


class EmployeeSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    employee_id: str
    first_name: str
    last_name: str
    department: str
    designation: str
    avatar_url: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    role: str
    company_id: Optional[str] = None
    company_name: Optional[str] = None
    must_reset_password: bool = False
    is_active: bool = True
    employee: Optional[EmployeeSummary] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    token: Optional[str] = None  # Frontend convenience alias
    must_reset_password: bool = False
    user: UserOut


class RegisterResponse(BaseModel):
    message: str
    user_id: str
    employee_id: str
    company_id: str

