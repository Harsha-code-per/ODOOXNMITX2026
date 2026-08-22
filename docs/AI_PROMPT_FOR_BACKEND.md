# Dayflow HRMS — Master AI Prompt for Backend Developer

> **Instructions for Backend Developer**:  
> Copy and paste the prompt below into your AI IDE / Assistant (Cursor, Antigravity, Claude, or ChatGPT) after opening the `backend/` workspace. It instructs the AI to build the entire FastAPI backend adhering strictly to our `docs/` contracts.

---

```text
You are an expert Senior Python Backend Engineer building the backend for Dayflow — an Enterprise Human Resource Management System (HRMS) for the Odoo × NMIT Hackathon.

Please read and follow the specifications provided in the `docs/` directory:
- `docs/DATABASE_SCHEMA.sql`
- `docs/SEED_DATA.sql`
- `docs/API_CONTRACT.md`
- `docs/BACKEND_SPEC.md`

### Tech Stack:
- Python 3.12+
- FastAPI with Uvicorn
- SQLAlchemy 2.0 (Async) + asyncpg connected to PostgreSQL (Supabase)
- Pydantic v2 schemas
- PyJWT + Passlib (bcrypt) for authentication & RBAC
- uv package manager

### Deliverables to build in `backend/`:
1. `app/config.py`: Load DATABASE_URL, JWT_SECRET_KEY, CORS_ORIGINS from environment using Pydantic Settings.
2. `app/database.py`: Configure async_engine and async_sessionmaker for PostgreSQL.
3. `app/core/security.py`: Password hashing (bcrypt) and JWT encode/decode functions.
4. `app/core/permissions.py`: `get_current_user` and `require_role(roles)` FastAPI dependency guards.
5. `app/models/`: SQLAlchemy 2.0 ORM models for Profile, Employee, Attendance, LeaveType, LeaveRequest, SalaryStructure, and Notification.
6. `app/schemas/`: Pydantic v2 schemas for Auth, Employee, Attendance, Leave, Payroll, and Analytics matching `docs/API_CONTRACT.md`.
7. `app/services/`:
   - `payroll_service.py`: MUST implement `calculate_salary_structure(wage)` where Basic=50% of Wage, HRA=50% of Basic, Standard Allowance=4167, Bonus=8.33%, LTA=8.33%, PF=12%, PT=200, Fixed Allowance=balance, Gross=Wage, Total Deductions=PF+PT, Net=Gross-Deductions. When wage changes, recalculate all components!
   - `attendance_service.py`: Check-in duplicate guard, Check-out duration calculation.
   - `leave_service.py`: Leave status transition & attendance date synchronization.
   - `analytics_service.py`: Real database aggregations for total employees, presence %, leave count, and department payroll totals.
8. `app/api/`: REST API routers mounted under `/api/v1`:
   - `/auth` (login, register, /me)
   - `/employees` (/me, list with search/filter, update, get by id)
   - `/attendance` (check-in, check-out, /me history, company grid, admin override)
   - `/leaves` (apply, /me balances & history, admin queue, approve, reject)
   - `/payroll` (/me salary breakdown, admin salary matrix, wage update with auto-recalculate)
   - `/analytics` (executive dashboard summary KPIs)
9. `app/main.py`: Main FastAPI entrypoint with CORS middleware, exception handlers, and router inclusion.

Make sure every endpoint returns exact JSON response shapes matching `docs/API_CONTRACT.md`.
```
