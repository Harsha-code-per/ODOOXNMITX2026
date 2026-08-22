import uuid
from datetime import datetime, date, timezone
from sqlalchemy import Column, String, Date, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class SalaryStructure(Base):
    __tablename__ = "salary_structures"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    company_id = Column(String(36), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    employee_id = Column(String(36), ForeignKey("employees.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    effective_from = Column(Date, default=date.today, nullable=False)
    wage = Column(Float, nullable=False)  # Total monthly base / CTC (e.g. 60000.0)
    basic = Column(Float, nullable=False)  # 50% of Wage
    hra = Column(Float, nullable=False)  # 50% of Basic
    standard_allowance = Column(Float, default=4167.0, nullable=False)
    performance_bonus = Column(Float, default=0.0, nullable=False)  # 8.33% of Basic
    lta = Column(Float, default=0.0, nullable=False)  # 8.33% of Basic
    fixed_allowance = Column(Float, default=0.0, nullable=False)  # Balancing component
    pf = Column(Float, nullable=False)  # 12% of Basic
    professional_tax = Column(Float, default=200.0, nullable=False)
    gross_salary = Column(Float, nullable=False)
    total_deductions = Column(Float, nullable=False)
    net_salary = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    employee = relationship("Employee", back_populates="salary_structure")

