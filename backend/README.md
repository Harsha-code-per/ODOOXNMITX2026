# Dayflow HRMS — FastAPI Backend

Enterprise-grade Human Resource Management System (HRMS) backend built with **FastAPI**, **SQLAlchemy 2.0 (Async)**, **PostgreSQL (Supabase)**, **Pydantic v2**, and **PyJWT / bcrypt**.

---

## 🌟 Key Features

1. **Dynamic Salary Engine (`app/services/payroll_service.py`)**:
   - Automatically recalculates **Basic (50%)**, **HRA (50% of Basic)**, **Standard Allowance (₹4,167)**, **Performance Bonus (8.33%)**, **LTA (8.33%)**, **Fixed Allowance (balancing component)**, **PF (12%)**, and **PT (₹200)** whenever base wage is updated.
   - Computes payable days and effective net payouts based on actual attendance and approved paid/unpaid leaves.
2. **Attendance State Machine**:
   - Duplicate check-in prevention (`400 Bad Request`).
   - Clock-out duration calculator (`total_hours`, `HALF_DAY` vs `PRESENT`).
3. **Leave Workflow & Attendance Sync**:
   - Quota tracking (`PAID: 18`, `SICK: 10`, `CASUAL: 6`, `UNPAID: 0`).
   - 1-Click HR Approval/Rejection queue.
   - Automatically updates employee status to `ON_LEAVE` and populates attendance records for approved leave dates.
4. **Live Executive Analytics**:
   - Real-time PostgreSQL database aggregations for total headcount, presence %, department payroll totals, and 5-day attendance trends.
5. **Role-Based Access Control (RBAC)**:
   - PyJWT + bcrypt authentication guarding `ADMIN`, `HR`, and `EMPLOYEE` permissions.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Python 3.12+ (or 3.14+)
- [`uv`](https://github.com/astral-sh/uv) package manager

### 2. Setup & Install
```bash
cd backend
uv sync
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
DATABASE_URL=sqlite+aiosqlite:///./dayflow.db
# For Supabase PostgreSQL:
# DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.YOUR_SUPABASE_REF.supabase.co:5432/postgres
JWT_SECRET_KEY=dayflow_super_secret_jwt_key_2026_hackathon
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001","https://dayflow-frontend.vercel.app","*"]
ENVIRONMENT=development
```

### 4. Database Migrations (Alembic)

Run existing migrations to upgrade the schema to the latest version:
```bash
uv run alembic upgrade head
```

#### Inspect Current Revision:
```bash
uv run alembic current
```

#### View Available Revision Heads:
```bash
uv run alembic heads
```

#### Create a New Migration:
```bash
uv run alembic revision -m "description_of_migration"
# Or autogenerate based on SQLAlchemy models:
uv run alembic revision --autogenerate -m "description_of_migration"
```

#### Roll Back / Downgrade:
```bash
# Roll back by 1 revision
uv run alembic downgrade -1

# Roll back to initial base schema
uv run alembic downgrade base
```

### 5. Database Seeding (11 Demo Personas)
```bash
uv run python -m app.seed
```

### 6. Run the Server
```bash
uv run uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`
- Health Check: `http://localhost:8000/health`

### 7. Run Test Suite
```bash
uv run pytest -v
```


---

## 👥 Demo Personas (Password: `password123`)

| Name | Role | Email | Employee ID | Monthly Wage |
| :--- | :--- | :--- | :--- | :--- |
| **Arthur Morgan** | `ADMIN` | `admin@dayflow.io` | `EMP-001` | ₹120,000 |
| **Sarah Jenkins** | `HR` | `sarah.hr@dayflow.io` | `EMP-002` | ₹90,000 |
| **Alex Rivera** | `EMPLOYEE` | `alex.rivera@dayflow.io` | `EMP-003` | ₹75,000 |
| **Elena Rostova** | `EMPLOYEE` | `elena.rostova@dayflow.io` | `EMP-004` | ₹85,000 |
| **David Chen** | `EMPLOYEE` | `david.chen@dayflow.io` | `EMP-005` | ₹70,000 |
| **Priya Sharma** | `EMPLOYEE` | `priya.sharma@dayflow.io` | `EMP-006` | ₹55,000 |
| **Marcus Vance** | `EMPLOYEE` | `marcus.vance@dayflow.io` | `EMP-007` | ₹80,000 |
| **Chloe Dupont** | `EMPLOYEE` | `chloe.dupont@dayflow.io` | `EMP-008` | ₹65,000 |
| **Jordan Bell** | `EMPLOYEE` | `jordan.bell@dayflow.io` | `EMP-009` | ₹95,000 |
| **Aisha Khan** | `EMPLOYEE` | `aisha.khan@dayflow.io` | `EMP-010` | ₹50,000 |
| **Liam Nelson** | `EMPLOYEE` | `liam.nelson@dayflow.io` | `EMP-011` | ₹82,000 |

---

## 📡 REST API Summary

- **Auth**: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `GET /api/v1/auth/me`
- **Employees**: `GET /api/v1/employees/me`, `GET /api/v1/employees`, `GET /api/v1/employees/{id}`, `PUT /api/v1/employees/{id}`
- **Attendance**: `POST /api/v1/attendance/check-in`, `POST /api/v1/attendance/check-out`, `GET /api/v1/attendance/me`, `GET /api/v1/attendance`
- **Leaves**: `POST /api/v1/leaves`, `GET /api/v1/leaves/me`, `GET /api/v1/leaves`, `PATCH /api/v1/leaves/{id}/approve`, `PATCH /api/v1/leaves/{id}/reject`
- **Payroll**: `GET /api/v1/payroll/me`, `GET /api/v1/admin/payroll/{id}`, `PUT /api/v1/admin/payroll/{id}/salary`, `POST /api/v1/admin/payroll/{id}/calculate`
- **Analytics**: `GET /api/v1/analytics/dashboard`
- **Notifications**: `GET /api/v1/notifications`, `PATCH /api/v1/notifications/{id}/read`
