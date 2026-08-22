<div align="center">

# ⚡ Dayflow HRMS
### *Next-Generation Enterprise Human Resource Management System*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.0+-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Event**: Odoo × NMIT Hackathon 2026  
**Theme**: Cyber Cyan (`#06B6D4`) Dual-Themed (Dark Luxe & Crisp Light)  
**Responsive Design**: Fluid REM Architecture (Mobile, Tablet, Laptop & 4K)

[Explore API Docs](http://localhost:8000/docs) • [View System Flows](docs/SYSTEM_FLOWS.md) • [API Contract](docs/API_CONTRACT.md) • [Database Schema](docs/DATABASE_SCHEMA.sql)

</div>

---

## 📑 Table of Contents

- [Executive Overview](#-executive-overview)
- [Key Enterprise Features](#-key-enterprise-features)
- [System Architecture & Data Flows](#-system-architecture--data-flows)
- [Dynamic Wage & Attendance Calculation Engine](#-dynamic-wage--attendance-calculation-engine)
- [Judge & Evaluator Demo Personas](#-judge--evaluator-demo-personas)
- [Monorepo Architecture](#-monorepo-architecture)
- [Quickstart & Local Setup](#-quickstart--local-setup)
- [REST API Specification](#-rest-api-specification)
- [Verification & Automated Test Suite](#-verification--automated-test-suite)
- [Cloud Production Deployment](#-cloud-production-deployment)
- [The 10-Step Winning Demo Flow](#-the-10-step-winning-demo-flow)
- [Security & Compliance](#-security--compliance)

---

## 🌟 Executive Overview

**Dayflow HRMS** is an enterprise-grade, high-performance Human Resource Management System built for organizational transparency, frictionless employee operations, and real-time payroll governance.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                   THE 5 CORE PILLARS                                     │
├──────────────────────────┬───────────────────────────────────────────────────────────────┤
│ 1. DYNAMIC WAGE ENGINE   │ Changing Wage (CTC) triggers instantaneous auto-recalculation │
│                          │ of Basic (50%), HRA, Standard, Bonus, LTA, PF, PT, & Net Pay. │
├──────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 2. ATTENDANCE → PAYROLL  │ Present days + Approved Paid leaves determine `payable_days`, │
│    PIPELINE              │ calculating accurate prorated monthly take-home payouts.      │
├──────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 3. 1-CLICK PDF PAYSLIP   │ Instant client-side & server-side downloadable branded PDF    │
│                          │ salary slips with company watermark and statutory breakdown.  │
├──────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 4. LIVE ATTENDANCE PULSE │ Real-time ticking work-session stopwatch with check-in/out,   │
│                          │ break tracking, and presence state indicators.                │
├──────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 5. 1-CLICK JUDGE DEMO    │ Sticky top bar allows judges to switch instantaneously between│
│                          │ Sarah (HR Director), Alex (Lead Engineer), & Admin personas.  │
└──────────────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Enterprise Features

### 🏢 Employee Self-Service (ESS) Portal
- **Live Stopwatch & Attendance Check-In**: One-click check-in with live session counter, automatic hour calculation, and half-day thresholds.
- **Leave Quota Manager**: Real-time quota balance tracking (`PAID: 18`, `SICK: 10`, `CASUAL: 6`, `UNPAID: 0`) and request history.
- **Statutory Salary Slip Viewer**: Transparent breakdown of earnings, statutory deductions, and 1-click PDF payslip export.

### 🛡️ HR & Admin Command Center
- **Executive KPI Analytics**: Real-time headcount, live attendance velocity, pending leave counts, and department-level payroll burn rates.
- **Company Attendance Matrix**: Real-time multi-department attendance board with status filters (`PRESENT`, `ABSENT`, `HALF_DAY`, `ON_LEAVE`).
- **Urgent Leave Review Queue**: 1-click approve/reject actions with automated employee status updates and calendar attendance synchronization.
- **Dynamic Salary Matrix**: Instant base wage adjustment with real-time recalculation across all statutory formula components.

---

## 📐 System Architecture & Data Flows

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Presentation (Next.js 15)"]
        Hero["Cinematic Landing & Bento Grid"]
        DemoBar["Sticky 1-Click Judge Persona Bar"]
        EmpPortal["Employee Portal (Stopwatch / Leaves / Salary)"]
        AdminPortal["HR Command Center (Matrix / Approvals / Analytics)"]
    end

    subgraph APILayer ["FastAPI REST Services (/api/v1)"]
        AuthRouter["/auth (JWT + Bcrypt RBAC)"]
        EmpRouter["/employees (Profile & Directory)"]
        AttRouter["/attendance (Clock In/Out & Matrix)"]
        LeaveRouter["/leaves (Quota & 1-Click Review)"]
        PayRouter["/payroll (Dynamic Wage Recalculation)"]
        AnalyticsRouter["/analytics (Executive Dashboard KPIs)"]
    end

    subgraph ServicesLayer ["Core Business Logic Engines"]
        PayrollEngine["Dynamic Payroll Service (50% Basic, HRA, PF, PT, Net)"]
        AttendanceEngine["Attendance Engine (Work Hour & State Machine)"]
        LeaveEngine["Leave Sync Service (Calendar & Employee State Sync)"]
        AnalyticsEngine["Analytics Aggregator (Real DB SQL Rollups)"]
    end

    subgraph DataLayer ["PostgreSQL Database (Supabase)"]
        ProfilesTable[("profiles")]
        EmployeesTable[("employees")]
        AttendanceTable[("attendance")]
        LeavesTable[("leave_requests & leave_types")]
        PayrollTable[("salary_structures")]
        NotifTable[("notifications")]
    end

    ClientLayer --> APILayer
    APILayer --> ServicesLayer
    ServicesLayer --> DataLayer
```

---

## 🧮 Dynamic Wage & Attendance Calculation Engine

Dayflow incorporates a centralized **Dynamic Wage & Payroll Engine** ([`payroll_service.py`](file:///home/cholan0415/ODOOXNMITX2026/backend/app/services/payroll_service.py)) that recalculates all statutory earnings and deductions whenever an employee's base monthly wage changes.

```
Wage (CTC Input, e.g. ₹75,000 / month)
 ├── Basic Salary (50% of Wage)            -> ₹37,500.00
 ├── House Rent Allowance (50% of Basic)   -> ₹18,750.00
 ├── Standard Tax Allowance (Fixed)        -> ₹4,167.00
 ├── Performance Bonus (8.33% of Basic)    -> ₹3,123.75
 ├── Leave Travel Allowance (8.33% Basic)  -> ₹3,123.75
 └── Fixed Allowance (Residual Balance)    -> ₹8,335.50
 ─────────────────────────────────────────────────────────
 Gross Salary = Sum of Earnings            -> ₹75,000.00

Statutory Deductions:
 ├── Provident Fund (12% of Basic)         -> ₹4,500.00
 └── Professional Tax (Standard State PT)  -> ₹200.00
 ─────────────────────────────────────────────────────────
 Total Deductions = PF + PT                -> ₹4,700.00

Net Take-Home Salary:
 Net Salary = Gross Salary - Deductions    -> ₹70,300.00
```

### Attendance $\rightarrow$ Payable Days Proration
$$\text{Payable Days} = \text{Present Days} + \text{Approved Paid Leaves} + \text{Approved Casual Leaves}$$
$$\text{Effective Net Monthly Payout} = \text{Net Salary} \times \left( \frac{\text{Payable Days}}{\text{Total Working Days in Month}} \right)$$

---

## 👥 Judge & Evaluator Demo Personas

The system includes **11 pre-seeded enterprise employee profiles** ready for testing. All accounts share the password: `password123`.

| Persona Role | Name | Designation | Department | Email | Monthly Wage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **👑 Super Admin** | Arthur Morgan | Chief Executive Officer | Management | `admin@dayflow.io` | ₹120,000 |
| **👩‍💼 HR Director** | Sarah Jenkins | HR Director | Human Resources | `sarah.hr@dayflow.io` | ₹90,000 |
| **👨‍💻 Lead Engineer** | Alex Rivera | Senior Full Stack Engineer | Engineering | `alex.rivera@dayflow.io` | ₹75,000 |
| **🎨 Staff Architect** | Elena Rostova | Staff Frontend Architect | Engineering | `elena.rostova@dayflow.io` | ₹85,000 |
| **☁️ DevOps Lead** | David Chen | DevOps & Cloud Lead | Engineering | `david.chen@dayflow.io` | ₹70,000 |
| **⚙️ Backend Engineer**| Priya Sharma | Backend Engineer | Engineering | `priya.sharma@dayflow.io` | ₹55,000 |
| **📦 Product Manager** | Marcus Vance | Principal Product Manager | Product | `marcus.vance@dayflow.io` | ₹80,000 |
| **🖌️ Lead Designer** | Chloe Dupont | Lead UI/UX Designer | Product | `chloe.dupont@dayflow.io` | ₹65,000 |
| **💼 Enterprise Sales** | Jordan Bell | VP of Enterprise Sales | Sales | `jordan.bell@dayflow.io` | ₹95,000 |
| **📢 Growth Lead** | Aisha Khan | Growth & Brand Specialist | Marketing | `aisha.khan@dayflow.io` | ₹50,000 |
| **📊 Financial Controller**| Liam Nelson | Financial Controller | Finance | `liam.nelson@dayflow.io` | ₹82,000 |

---

## 📂 Monorepo Architecture

```
ODOOXNMITX2026/
├── backend/                               # FastAPI High-Performance Backend
│   ├── app/
│   │   ├── main.py                        # FastAPI entrypoint with CORS & lifespan DB init
│   │   ├── config.py                      # Pydantic v2 Settings (DB URL, JWT secrets, CORS)
│   │   ├── database.py                    # Async engine & sessionmaker (PostgreSQL / SQLite)
│   │   ├── seed.py                        # Asynchronous database seeder (11 personas)
│   │   ├── core/                          # Security, JWT encoding, and RBAC guards
│   │   ├── models/                        # SQLAlchemy 2.0 ORM database models
│   │   ├── schemas/                       # Pydantic v2 validation and response schemas
│   │   ├── services/                      # Dynamic payroll, attendance, leave & analytics engines
│   │   └── api/                           # REST API routes mounted under /api/v1
│   ├── tests/                             # Pytest automated test suite (11/11 passing)
│   ├── pyproject.toml                     # Managed via uv
│   └── .env.example                       # Environment configuration template
│
├── frontend/                              # Next.js 15 Modern Responsive Frontend
│   ├── app/                               # Next.js App Router pages (Landing, Portals, Admin)
│   ├── components/                        # Cyber Cyan modular UI components
│   ├── lib/                               # Unified API client, PDF generator, and tokens
│   ├── public/                            # Static assets and icons
│   └── package.json                       # Managed via pnpm
│
├── docs/                                  # Shared Single Source of Truth
│   ├── API_CONTRACT.md                    # Official REST API schema contract
│   ├── DATABASE_SCHEMA.sql                # Production PostgreSQL DDL schema
│   ├── SEED_DATA.sql                      # SQL seed scripts with real sample data
│   ├── BACKEND_SPEC.md                    # Complete backend implementation specifications
│   ├── SYSTEM_FLOWS.md                    # Architecture & state machine diagrams
│   └── AI_PROMPT_FOR_BACKEND.md           # Master backend scaffolding instructions
│
├── package.json                           # Root scripts
└── README.md                              # Enterprise project documentation
```

---

## 🛠️ Quickstart & Local Setup

### 1. Backend Setup (`backend/`)

```bash
cd backend

# Install dependencies using uv
uv sync

# Configure environment variables
cp .env.example .env

# Seed the database with 11 demo accounts, attendance logs & salaries
uv run python -m app.seed

# Launch the backend server
uv run uvicorn app.main:app --reload --port 8000
```
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

### 2. Frontend Setup (`frontend/`)

```bash
cd frontend

# Install dependencies
pnpm install

# Start Next.js development server
pnpm dev
```
- **Frontend Portal**: [http://localhost:3000](http://localhost:3000)

---

## 📡 REST API Specification

All endpoints are versioned under `/api/v1` and protected via `Authorization: Bearer <JWT_TOKEN>`.

| Module | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/login` | Public | Login with email & password, returns JWT & user session |
| | `POST` | `/api/v1/auth/register` | Public | Register new employee profile & user account |
| | `GET` | `/api/v1/auth/me` | Authenticated | Get current authenticated user profile |
| **Employees** | `GET` | `/api/v1/employees/me` | Authenticated | Get detailed profile of logged-in employee |
| | `GET` | `/api/v1/employees` | HR / Admin | List all employees with department & search filters |
| | `GET` | `/api/v1/employees/{id}` | Authenticated | Get employee profile by ID or Employee ID (e.g. `EMP-003`) |
| | `PUT` | `/api/v1/employees/{id}` | Auth / HR | Update profile (self-edit contacts or HR full edit) |
| **Attendance**| `POST` | `/api/v1/attendance/check-in` | Employee | Clock in for today; prevents duplicate check-ins |
| | `POST` | `/api/v1/attendance/check-out` | Employee | Clock out and calculate worked hours & half-day status |
| | `GET` | `/api/v1/attendance/me` | Employee | Get monthly attendance history and today's status |
| | `GET` | `/api/v1/attendance` | HR / Admin | Company attendance matrix by date and department |
| **Leaves** | `POST` | `/api/v1/leaves` | Employee | Submit leave request with date range and reason |
| | `GET` | `/api/v1/leaves/me` | Employee | Get leave quota balances (`PAID`, `SICK`, `CASUAL`) |
| | `GET` | `/api/v1/leaves` | HR / Admin | Get list of leave requests filterable by status |
| | `PATCH`| `/api/v1/leaves/{id}/approve`| HR / Admin | Approve leave & auto-sync attendance dates |
| | `PATCH`| `/api/v1/leaves/{id}/reject` | HR / Admin | Reject leave request with HR review remarks |
| **Payroll** | `GET` | `/api/v1/payroll/me` | Employee | Get full salary breakdown and payable days summary |
| | `GET` | `/api/v1/admin/payroll/{id}` | HR / Admin | Get salary structure of specified employee |
| | `PUT` | `/api/v1/admin/payroll/{id}/salary`| HR / Admin | **Update wage and trigger dynamic component recalculation** |
| | `POST`| `/api/v1/admin/payroll/{id}/calculate`| HR / Admin | Preview recalculation breakdown without saving |
| **Analytics** | `GET` | `/api/v1/analytics/dashboard` | HR / Admin | Live executive KPI metrics, payroll spend & trends |
| **Notifs** | `GET` | `/api/v1/notifications` | Authenticated | List all user in-app notifications |
| | `PATCH`| `/api/v1/notifications/{id}/read` | Authenticated | Mark notification as read |

---

## 🧪 Verification & Automated Test Suite

The backend includes a **comprehensive Pytest test suite** covering the authentication cycle, RBAC permissions, dynamic salary formulas, leave approval state transitions, and executive dashboard analytics.

```bash
cd backend
uv run pytest -v
```

### Test Results:
```text
============================= test session starts ==============================
platform linux -- Python 3.14.6, pytest-9.1.1, pluggy-1.6.0
rootdir: /home/cholan0415/ODOOXNMITX2026/backend
configfile: pyproject.toml
plugins: asyncio-1.4.0, anyio-4.14.2
asyncio: mode=Mode.AUTO

tests/test_api_endpoints.py::test_health_check PASSED                    [  9%]
tests/test_api_endpoints.py::test_login_and_auth_flow PASSED             [ 18%]
tests/test_api_endpoints.py::test_payroll_dynamic_recalculation_endpoint PASSED [ 27%]
tests/test_api_endpoints.py::test_leaves_workflow_and_approval PASSED    [ 36%]
tests/test_api_endpoints.py::test_executive_analytics_dashboard PASSED   [ 45%]
tests/test_dynamic_payroll.py::test_salary_structure_formula_50k PASSED  [ 54%]
tests/test_dynamic_payroll.py::test_salary_structure_formula_60k PASSED  [ 63%]
tests/test_dynamic_payroll.py::test_salary_structure_formula_75k PASSED  [ 72%]
tests/test_dynamic_payroll.py::test_salary_structure_formula_90k PASSED  [ 81%]
tests/test_dynamic_payroll.py::test_payable_days_payout_full PASSED      [ 90%]
tests/test_dynamic_payroll.py::test_payable_days_payout_with_unpaid PASSED [100%]

============================== 11 passed in 3.65s ==============================
```

---

## 🌐 Cloud Production Deployment

### 1. PostgreSQL Database (Supabase)
1. Create a project at [supabase.com](https://supabase.com).
2. Run [`docs/DATABASE_SCHEMA.sql`](file:///home/cholan0415/ODOOXNMITX2026/docs/DATABASE_SCHEMA.sql) in the Supabase SQL Editor.
3. Run [`docs/SEED_DATA.sql`](file:///home/cholan0415/ODOOXNMITX2026/docs/SEED_DATA.sql) to seed the database.
4. Copy the connection string into your backend `.env`.

### 2. Backend Service (Render / Railway)
- **Runtime**: Python 3.12+
- **Build Command**: `pip install uv && uv sync`
- **Start Command**: `uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `DATABASE_URL`: `postgresql+asyncpg://postgres:PASSWORD@db.REF.supabase.co:5432/postgres`
  - `JWT_SECRET_KEY`: `dayflow_super_secret_jwt_key_2026_hackathon`
  - `CORS_ORIGINS`: `["https://your-frontend.vercel.app","http://localhost:3000"]`

### 3. Frontend Application (Vercel)
- **Framework**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `pnpm build`
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL`: `https://your-backend.onrender.com/api/v1`
  - `NEXT_PUBLIC_USE_MOCK`: `false`

---

## 🏆 The 10-Step Winning Demo Flow

1. **Step 1**: Open Dayflow Landing Page (`/`) and explore the Cyber Cyan Bento Grid.
2. **Step 2**: Click **"Alex (Lead Engineer)"** in the top Judge Persona bar to authenticate as Alex Rivera (`EMP-003`).
3. **Step 3**: On `/dashboard/employee`, click **"Clock In Now"** — the live stopwatch turns green and begins tracking session hours.
4. **Step 4**: Click **"Apply Leave"** — submit a 2-day Sick Leave request with a medical note.
5. **Step 5**: Click **"Sarah (HR Director)"** in the top Judge Persona bar to switch to HR mode.
6. **Step 6**: On `/dashboard/admin`, review Alex's request in the **Urgent Leave Review Queue** and click **"Approve Leave"**.
7. **Step 7**: Open the **Company Payroll Matrix** (`/dashboard/admin/payroll`) — edit Alex's monthly wage from ₹75,000 to ₹90,000.
8. **Step 8**: Observe the entire table dynamically recalculate Basic, HRA, PF, PT, and Net Take-Home Pay in real-time.
9. **Step 9**: Click **"Payslip"** on Alex's record and download the official, branded PDF salary statement.
10. **Step 10**: Navigate to **Executive Analytics** (`/dashboard/admin/analytics`) to view live presence velocity and department payroll expenditure!

---

## 🔒 Security & Compliance

- **Password Hashing**: Direct 12-round salted `bcrypt` cryptography.
- **Stateless Authentication**: Signed `PyJWT` (HS256) bearer tokens with configurable expiration.
- **Role-Based Guards**: Strictly validated route access (`ADMIN`, `HR`, `EMPLOYEE`) preventing privilege escalation.
- **SQL Injection Immune**: 100% parameterized queries via SQLAlchemy 2.0 ORM expressions.
- **CORS Protection**: Explicit allow-list middleware guarding against unauthorized cross-origin requests.

---

<div align="center">

**Dayflow HRMS** — Built with ❤️ for the **Odoo × NMIT Hackathon 2026**

</div>
