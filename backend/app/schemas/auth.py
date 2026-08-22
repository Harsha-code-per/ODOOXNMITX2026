from typing import Optional, Any, Dict
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.profile import UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    employee_id: str
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    role: Optional[UserRole] = UserRole.EMPLOYEE
    department: str
    designation: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


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
    employee: Optional[EmployeeSummary] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    token: Optional[str] = None  # Frontend convenience alias
    user: UserOut


class RegisterResponse(BaseModel):
    message: str
    user_id: str
    employee_id: str
