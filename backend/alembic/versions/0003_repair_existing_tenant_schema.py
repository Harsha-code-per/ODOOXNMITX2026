"""Repair existing tenant schema and enforce multi-tenancy idempotently

Revision ID: 0003_repair_existing_tenant_schema
Revises: 0002_multi_tenant_saas
Create Date: 2026-08-22 14:25:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '0003_repair_existing_tenant_schema'
down_revision: Union[str, None] = '0002_multi_tenant_saas'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

DEFAULT_COMPANY_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc'


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    # 1. Ensure Companies Table Exists
    if 'companies' not in tables:
        op.create_table(
            'companies',
            sa.Column('id', sa.String(length=36), primary_key=True),
            sa.Column('name', sa.String(length=255), nullable=False),
            sa.Column('slug', sa.String(length=100), nullable=False),
            sa.Column('currency', sa.String(length=10), server_default='INR', nullable=False),
            sa.Column('owner_id', sa.String(length=36), nullable=True),
            sa.Column('is_active', sa.Boolean(), server_default=sa.text('1'), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        )
        op.create_index('ix_companies_slug', 'companies', ['slug'], unique=True)

    # 2. Ensure Default Company Exists
    op.execute(
        f"""
        INSERT INTO companies (id, name, slug, currency, owner_id, is_active, created_at, updated_at)
        SELECT '{DEFAULT_COMPANY_ID}', 'Dayflow Technologies Inc.', 'dayflow', 'INR', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        WHERE NOT EXISTS (SELECT 1 FROM companies WHERE id = '{DEFAULT_COMPANY_ID}');
        """
    )

    # 3. Profiles Table Repair
    if 'profiles' in tables:
        profile_cols = [c['name'] for c in inspector.get_columns('profiles')]
        with op.batch_alter_table('profiles') as batch_op:
            if 'company_id' not in profile_cols:
                batch_op.add_column(sa.Column('company_id', sa.String(length=36), nullable=True))
            if 'is_active' not in profile_cols:
                batch_op.add_column(sa.Column('is_active', sa.Boolean(), server_default=sa.text('1'), nullable=False))
            if 'must_reset_password' not in profile_cols:
                batch_op.add_column(sa.Column('must_reset_password', sa.Boolean(), server_default=sa.text('0'), nullable=False))
            if 'password_changed_at' not in profile_cols:
                batch_op.add_column(sa.Column('password_changed_at', sa.DateTime(timezone=True), nullable=True))

        op.execute(f"UPDATE profiles SET company_id = '{DEFAULT_COMPANY_ID}' WHERE company_id IS NULL;")
        op.execute("UPDATE profiles SET is_active = 1 WHERE is_active IS NULL;")
        op.execute("UPDATE profiles SET must_reset_password = 0 WHERE must_reset_password IS NULL;")

        if 'company_id' not in profile_cols:
            with op.batch_alter_table('profiles') as batch_op:
                batch_op.alter_column('company_id', nullable=False, existing_type=sa.String(length=36))
                batch_op.create_foreign_key('fk_profiles_company', 'companies', ['company_id'], ['id'], ondelete='CASCADE')

    # Ensure Company Owner Foreign Key
    with op.batch_alter_table('companies') as batch_op:
        try:
            batch_op.create_foreign_key('fk_company_owner', 'profiles', ['owner_id'], ['id'], ondelete='SET NULL')
        except Exception:
            pass

    # 4. Employees Table Repair
    if 'employees' in tables:
        emp_cols = [c['name'] for c in inspector.get_columns('employees')]
        if 'company_id' not in emp_cols:
            with op.batch_alter_table('employees') as batch_op:
                batch_op.add_column(sa.Column('company_id', sa.String(length=36), nullable=True))

            op.execute(f"UPDATE employees SET company_id = '{DEFAULT_COMPANY_ID}' WHERE company_id IS NULL;")

            with op.batch_alter_table('employees') as batch_op:
                batch_op.alter_column('company_id', nullable=False, existing_type=sa.String(length=36))
                batch_op.create_foreign_key('fk_employees_company', 'companies', ['company_id'], ['id'], ondelete='CASCADE')
                batch_op.create_unique_constraint('uq_company_employee_id', ['company_id', 'employee_id'])

    # 5. Attendance Table Repair
    if 'attendance' in tables:
        att_cols = [c['name'] for c in inspector.get_columns('attendance')]
        if 'company_id' not in att_cols:
            with op.batch_alter_table('attendance') as batch_op:
                batch_op.add_column(sa.Column('company_id', sa.String(length=36), nullable=True))

            op.execute(f"UPDATE attendance SET company_id = '{DEFAULT_COMPANY_ID}' WHERE company_id IS NULL;")

            with op.batch_alter_table('attendance') as batch_op:
                batch_op.alter_column('company_id', nullable=False, existing_type=sa.String(length=36))
                batch_op.create_foreign_key('fk_attendance_company', 'companies', ['company_id'], ['id'], ondelete='CASCADE')
                batch_op.create_unique_constraint('uq_company_employee_work_date', ['company_id', 'employee_id', 'work_date'])

    # 6. Leave Types Table Repair
    if 'leave_types' in tables:
        lt_cols = [c['name'] for c in inspector.get_columns('leave_types')]
        if 'company_id' not in lt_cols:
            with op.batch_alter_table('leave_types') as batch_op:
                batch_op.add_column(sa.Column('company_id', sa.String(length=36), nullable=True))

            op.execute(f"UPDATE leave_types SET company_id = '{DEFAULT_COMPANY_ID}' WHERE company_id IS NULL;")

            with op.batch_alter_table('leave_types') as batch_op:
                batch_op.alter_column('company_id', nullable=False, existing_type=sa.String(length=36))
                batch_op.create_foreign_key('fk_leave_types_company', 'companies', ['company_id'], ['id'], ondelete='CASCADE')
                batch_op.create_unique_constraint('uq_company_leave_type_name', ['company_id', 'name'])

    # 7. Leave Requests Table Repair
    if 'leave_requests' in tables:
        lr_cols = [c['name'] for c in inspector.get_columns('leave_requests')]
        if 'company_id' not in lr_cols:
            with op.batch_alter_table('leave_requests') as batch_op:
                batch_op.add_column(sa.Column('company_id', sa.String(length=36), nullable=True))

            op.execute(f"UPDATE leave_requests SET company_id = '{DEFAULT_COMPANY_ID}' WHERE company_id IS NULL;")

            with op.batch_alter_table('leave_requests') as batch_op:
                batch_op.alter_column('company_id', nullable=False, existing_type=sa.String(length=36))
                batch_op.create_foreign_key('fk_leave_requests_company', 'companies', ['company_id'], ['id'], ondelete='CASCADE')

    # 8. Salary Structures Table Repair
    if 'salary_structures' in tables:
        ss_cols = [c['name'] for c in inspector.get_columns('salary_structures')]
        if 'company_id' not in ss_cols:
            with op.batch_alter_table('salary_structures') as batch_op:
                batch_op.add_column(sa.Column('company_id', sa.String(length=36), nullable=True))

            op.execute(f"UPDATE salary_structures SET company_id = '{DEFAULT_COMPANY_ID}' WHERE company_id IS NULL;")

            with op.batch_alter_table('salary_structures') as batch_op:
                batch_op.alter_column('company_id', nullable=False, existing_type=sa.String(length=36))
                batch_op.create_foreign_key('fk_salary_structures_company', 'companies', ['company_id'], ['id'], ondelete='CASCADE')

    # 9. Notifications Table Repair
    if 'notifications' in tables:
        notif_cols = [c['name'] for c in inspector.get_columns('notifications')]
        if 'company_id' not in notif_cols:
            with op.batch_alter_table('notifications') as batch_op:
                batch_op.add_column(sa.Column('company_id', sa.String(length=36), nullable=True))

            op.execute(f"UPDATE notifications SET company_id = '{DEFAULT_COMPANY_ID}' WHERE company_id IS NULL;")

            with op.batch_alter_table('notifications') as batch_op:
                batch_op.alter_column('company_id', nullable=False, existing_type=sa.String(length=36))
                batch_op.create_foreign_key('fk_notifications_company', 'companies', ['company_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    pass
