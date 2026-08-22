# Dayflow HRMS — Backend Developer Implementation Guide

> **Target Role**: Backend Engineer (FastAPI + Supabase PostgreSQL + uv)  
> **Hackathon Goal**: Deliver rock-solid, production-grade business logic & REST endpoints in < 5 hours.  
> **Swagger UI**: Accessible at `http://localhost:8000/docs`  

---

## 1. Quickstart & Environment Setup with `uv`

Run these commands inside the `backend/` directory:

```bash
cd backend

# 1. Initialize project with uv
uv init --name dayflow-backend .

# 2. Add dependencies
uv add fastapi "uvicorn[standard]" "sqlalchemy[asyncio]>=2.0.0" asyncpg pydantic pydantic-settings "pyjwt[crypto]" "passlib[bcrypt]" alembic httpx python-multipart python-dotenv

# 3. Create .env file
cat << 'EOF' > .env
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.YOUR_SUPABASE_REF.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_SUPABASE_REF.supabase.co:5432/postgres
JWT_SECRET_KEY=dayflow_super_secret_jwt_key_2026_hackathon
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001","https://dayflow-frontend.vercel.app"]
EOF
```

---

## 2. Backend Directory Architecture

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI app, CORS, global error handlers, route inclusion
│   ├── config.py                     # Pydantic Settings class reading .env
│   ├── database.py                   # Async SQLAlchemy engine & async_sessionmaker
│   ├── core/
│   │   ├── security.py               # create_access_token, verify_password, get_password_hash
│   │   └── permissions.py            # get_current_user, require_role(roles) dependencies
│   ├── models/                       # SQLAlchemy 2.0 Base Models
│   │   ├── __init__.py
│   │   ├── profile.py                # Profile (id, email, password_hash, role)
│   │   ├── employee.py               # Employee (employee_id, name, dept, status, avatar)
│   │   ├── attendance.py             # Attendance (work_date, check_in, check_out, total_hours)
│   │   ├── leave.py                  # LeaveType, LeaveRequest
│   │   ├── payroll.py                # SalaryStructure
│   │   └── notification.py           # Notification
│   ├── schemas/                      # Pydantic v2 Request/Response Schemas
│   │   ├── auth.py
│   │   ├── employee.py
│   │   ├── attendance.py
│   │   ├── leave.py
│   │   ├── payroll.py
│   │   └── analytics.py
│   ├── services/                     # Core Business Logic Engines
│   │   ├── attendance_service.py     # Check-in duplicate guard, check-out duration calc
│   │   ├── leave_service.py          # Quota balance deduction & attendance status sync
│   │   ├── payroll_service.py        # DYNAMIC SALARY RECALCULATION ENGINE
│   │   └── analytics_service.py      # Real DB aggregations for KPIs
│   └── api/                          # FastAPI APIRouter endpoints
│       ├── auth.py
│       ├── employees.py
│       ├── attendance.py
│       ├── leaves.py
│       ├── payroll.py
│       └── analytics.py
├── pyproject.toml
├── requirements.txt                  # Render fallback
├── render.yaml                       # 1-Click Render Web Service Blueprint
└── .env
```

---

## 3. Core Business Logic Implementation

### 3.1 Dynamic Payroll Calculation Service (`app/services/payroll_service.py`)

> **CRITICAL RULE**: Whenever Wage changes, all dependent salary components MUST recalculate automatically.

```python
from decimal import Decimal
from typing import Dict, Any

class PayrollService:
    @staticmethod
    def calculate_salary_structure(wage: float) -> Dict[str, float]:
        """
        Calculates all salary breakdown components given the total monthly base Wage (CTC).
        """
        w = float(wage)
        
        # 1. Basic = 50% of Wage
        basic = round(w * 0.50, 2)
        
        # 2. HRA = 50% of Basic (25% of Wage)
        hra = round(basic * 0.50, 2)
        
        # 3. Standard Allowance (Fixed statutory)
        standard_allowance = 4167.00
        
        # 4. Performance Bonus (8.33% of Basic)
        performance_bonus = round(basic * 0.0833, 2)
        
        # 5. LTA (8.33% of Basic)
        lta = round(basic * 0.0833, 2)
        
        # 6. Fixed Allowance = Remaining balancing component
        gross_subtotal = basic + hra + standard_allowance + performance_bonus + lta
        fixed_allowance = round(max(0.0, w - gross_subtotal), 2)
        
        # Gross Total (Equals Wage)
        gross_salary = round(basic + hra + standard_allowance + performance_bonus + lta + fixed_allowance, 2)
        
        # Deductions:
        # PF = 12% of Basic
        pf = round(basic * 0.12, 2)
        # Professional Tax = ₹200 fixed
        professional_tax = 200.00
        total_deductions = round(pf + professional_tax, 2)
        
        # Net Salary
        net_salary = round(gross_salary - total_deductions, 2)
        
        return {
            "wage": w,
            "basic": basic,
            "hra": hra,
            "standard_allowance": standard_allowance,
            "performance_bonus": performance_bonus,
            "lta": lta,
            "fixed_allowance": fixed_allowance,
            "gross_salary": gross_salary,
            "pf": pf,
            "professional_tax": professional_tax,
            "total_deductions": total_deductions,
            "net_salary": net_salary,
        }

    @staticmethod
    def calculate_payable_salary(net_salary: float, total_working_days: int, present_days: float, paid_leaves: float) -> Dict[str, Any]:
        """
        Adjusts net salary based on payable days (present + paid leave).
        """
        payable_days = present_days + paid_leaves
        ratio = min(1.0, payable_days / total_working_days) if total_working_days > 0 else 1.0
        effective_payout = round(net_salary * ratio, 2)
        
        return {
            "total_working_days": total_working_days,
            "payable_days": payable_days,
            "unpaid_days": total_working_days - payable_days,
            "effective_net_payout": effective_payout
        }
```

### 3.2 Attendance Service (`app/services/attendance_service.py`)

```python
from datetime import datetime, timezone

class AttendanceService:
    @staticmethod
    def calculate_hours(check_in: datetime, check_out: datetime) -> float:
        duration = (check_out - check_in).total_seconds()
        hours = max(0.0, duration / 3600.0)
        return round(hours, 2)
```

---

## 4. Render 1-Click Deployment Configuration

Create `backend/render.yaml`:
```yaml
services:
  - type: web
    name: dayflow-backend
    runtime: python
    buildCommand: "pip install uv && uv sync"
    startCommand: "uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET_KEY
        generateValue: true
      - key: CORS_ORIGINS
        value: "https://dayflow-frontend.vercel.app,http://localhost:3000"
```

And `backend/requirements.txt`:
```text
fastapi
uvicorn[standard]
sqlalchemy[asyncio]>=2.0.0
asyncpg
pydantic
pydantic-settings
pyjwt[crypto]
passlib[bcrypt]
alembic
httpx
python-multipart
python-dotenv
```

---

## 5. Development Checklist & Order of Execution

1. [ ] Run `docs/DATABASE_SCHEMA.sql` and `docs/SEED_DATA.sql` in Supabase SQL Editor.
2. [ ] Test Supabase DB connection via `database.py`.
3. [ ] Implement `app/core/security.py` (bcrypt + JWT) and `POST /api/v1/auth/login`.
4. [ ] Implement `app/api/employees.py` (`/me` and `GET /`).
5. [ ] Implement `app/api/attendance.py` (Check-in, Check-out, History).
6. [ ] Implement `app/api/leaves.py` (Apply, Approve, Reject).
7. [ ] Implement `app/api/payroll.py` (Salary structure + dynamic recalculation).
8. [ ] Implement `app/api/analytics.py` (Dashboard KPI metrics).
9. [ ] Run `uv run uvicorn app.main:app --reload` and verify every endpoint at `http://localhost:8000/docs`.
