from datetime import date, datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, ConfigDict
from app.models.leave import LeaveTypeEnum, LeaveStatus


class LeaveApplyRequest(BaseModel):
    leave_type: LeaveTypeEnum
    start_date: date
    end_date: date
    total_days: int = 1
    reason: str
    attachment_url: Optional[str] = None


class LeaveReviewRequest(BaseModel):
    hr_comments: Optional[str] = ""


class LeaveRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    employee_id: str
    employee_name: Optional[str] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None
    leave_type: str
    start_date: date
    end_date: date
    total_days: int
    reason: str
    attachment_url: Optional[str] = None
    status: str
    hr_comments: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class LeaveBalanceItem(BaseModel):
    allocated: int
    used: int
    remaining: int


class LeaveBalanceResponse(BaseModel):
    balances: Dict[str, LeaveBalanceItem]
    requests: List[LeaveRequestOut]
