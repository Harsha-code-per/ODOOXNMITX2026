"""Initial database schema before multi-tenancy

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-08-22 13:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Profiles Table
    op.create_table(
        'profiles',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('ADMIN', 'HR', 'EMPLOYEE', name='userrole'), server_default='EMPLOYEE', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_profiles_email', 'profiles', ['email'], unique=True)

    # 2. Employees Table
    op.create_table(
        'employees',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('employee_id', sa.String(length=50), nullable=False),
        sa.Column('first_name', sa.String(length=100), nullable=False),
        sa.Column('last_name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('department', sa.String(length=100), server_default='General', nullable=False),
        sa.Column('designation', sa.String(length=100), server_default='Staff', nullable=False),
        sa.Column('manager_id', sa.String(length=36), sa.ForeignKey('employees.id', ondelete='SET NULL'), nullable=True),
        sa.Column('joining_date', sa.Date(), server_default=sa.func.current_date(), nullable=False),
        sa.Column('status', sa.Enum('ACTIVE', 'ON_LEAVE', 'TERMINATED', name='employeestatus'), server_default='ACTIVE', nullable=False),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('emergency_contact', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index('ix_employees_employee_id', 'employees', ['employee_id'], unique=True)

    # 3. Attendance Table
    op.create_table(
        'attendance',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('employee_id', sa.String(length=36), sa.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False),
        sa.Column('work_date', sa.Date(), server_default=sa.func.current_date(), nullable=False),
        sa.Column('check_in', sa.DateTime(timezone=True), nullable=True),
        sa.Column('check_out', sa.DateTime(timezone=True), nullable=True),
        sa.Column('total_hours', sa.Float(), server_default='0.0', nullable=False),
        sa.Column('status', sa.Enum('PRESENT', 'ABSENT', 'HALF_DAY', 'ON_LEAVE', name='attendancestatus'), server_default='PRESENT', nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint('employee_id', 'work_date', name='uq_employee_work_date'),
    )
    op.create_index('ix_attendance_work_date', 'attendance', ['work_date'], unique=False)

    # 4. Leave Types Table
    op.create_table(
        'leave_types',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.Enum('PAID', 'SICK', 'CASUAL', 'UNPAID', name='leavetypeenum'), nullable=False, unique=True),
        sa.Column('is_paid', sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column('default_allocation', sa.Integer(), server_default='10', nullable=False),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 5. Leave Requests Table
    op.create_table(
        'leave_requests',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('employee_id', sa.String(length=36), sa.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False),
        sa.Column('leave_type_id', sa.String(length=36), sa.ForeignKey('leave_types.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('total_days', sa.Integer(), server_default='1', nullable=False),
        sa.Column('reason', sa.Text(), nullable=False),
        sa.Column('attachment_url', sa.String(length=500), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'APPROVED', 'REJECTED', name='leavestatus'), server_default='PENDING', nullable=False),
        sa.Column('hr_comments', sa.Text(), nullable=True),
        sa.Column('reviewed_by', sa.String(length=36), sa.ForeignKey('profiles.id', ondelete='SET NULL'), nullable=True),
        sa.Column('reviewed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 6. Salary Structures Table
    op.create_table(
        'salary_structures',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('employee_id', sa.String(length=36), sa.ForeignKey('employees.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('effective_from', sa.Date(), server_default=sa.func.current_date(), nullable=False),
        sa.Column('wage', sa.Float(), server_default='60000.0', nullable=False),
        sa.Column('basic', sa.Float(), server_default='30000.0', nullable=False),
        sa.Column('hra', sa.Float(), server_default='15000.0', nullable=False),
        sa.Column('standard_allowance', sa.Float(), server_default='4167.0', nullable=False),
        sa.Column('performance_bonus', sa.Float(), server_default='2499.0', nullable=False),
        sa.Column('lta', sa.Float(), server_default='2499.0', nullable=False),
        sa.Column('fixed_allowance', sa.Float(), server_default='5835.0', nullable=False),
        sa.Column('pf', sa.Float(), server_default='3600.0', nullable=False),
        sa.Column('professional_tax', sa.Float(), server_default='200.0', nullable=False),
        sa.Column('gross_salary', sa.Float(), server_default='60000.0', nullable=False),
        sa.Column('total_deductions', sa.Float(), server_default='3800.0', nullable=False),
        sa.Column('net_salary', sa.Float(), server_default='56200.0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    # 7. Notifications Table
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('profiles.id', ondelete='CASCADE'), nullable=False),
        sa.Column('type', sa.String(length=50), server_default='GENERAL', nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('notifications')
    op.drop_table('salary_structures')
    op.drop_table('leave_requests')
    op.drop_table('leave_types')
    op.drop_table('attendance')
    op.drop_table('employees')
    op.drop_table('profiles')
