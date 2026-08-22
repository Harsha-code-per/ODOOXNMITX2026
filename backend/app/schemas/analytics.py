from typing import List
from pydantic import BaseModel


class DashboardMetricsOut(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
    on_leave_today: int
    pending_leaves: int
    attendance_rate: float
    monthly_payroll_total: float


class DepartmentDistributionItem(BaseModel):
    name: str
    count: int
    payroll: float


class AttendanceTrendItem(BaseModel):
    date: str
    present: int
    absent: int
    leave: int


class AnalyticsDashboardOut(BaseModel):
    metrics: DashboardMetricsOut
    department_distribution: List[DepartmentDistributionItem]
    attendance_trends: List[AttendanceTrendItem]
