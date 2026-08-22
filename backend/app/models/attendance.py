import uuid
from datetime import datetime, date, timezone
import enum
from sqlalchemy import Column, String, Date, DateTime, Float, ForeignKey, Enum as SAEnum, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class AttendanceStatus(str, enum.Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    HALF_DAY = "HALF_DAY"
    ON_LEAVE = "ON_LEAVE"


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String(36), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    employee_id = Column(String(36), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    work_date = Column(Date, default=date.today, nullable=False, index=True)
    check_in = Column(DateTime(timezone=True), nullable=True)
    check_out = Column(DateTime(timezone=True), nullable=True)
    total_hours = Column(Float, default=0.0, nullable=False)
    status = Column(SAEnum(AttendanceStatus, native_enum=False), default=AttendanceStatus.PRESENT, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint("company_id", "employee_id", "work_date", name="unique_company_employee_work_date"),
    )

    # Relationships
    employee = relationship("Employee", back_populates="attendance_records")

