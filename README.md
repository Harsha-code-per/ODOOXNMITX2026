# ⚡ Dayflow HRMS — Enterprise Human Resource Management System

> **Tagline**: *"Every workday, perfectly aligned."*  
> **Event**: Odoo × NMIT Hackathon 2026 (8-Hour Hackathon Sprint)  
> **Architecture**: High-Performance Monorepo (`frontend/` + `backend/` + `docs/`)  
> **Color Theme**: Cyber Cyan (`#06B6D4`) Dual-Themed (Dark Luxe & Crisp Light)  
> **Responsive Core**: Fluid REM Architecture (Flawless scaling on Mobile, Tablet, Laptop, and 4K)  

---

## 🌟 Executive Summary & Standout Differentiators

Dayflow is a modern, responsive, full-stack HRMS built for speed, transparency, and automated governance. 

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                   THE 5 WINNING PILLARS                                  │
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

## 🚀 1-Click Judge Demo Personas

| Persona | Name | Designation | Default Route |
| :--- | :--- | :--- | :--- |
| **👩‍💼 HR Director** | Sarah Jenkins | HR Director (`EMP-002`) | `/dashboard/admin` |
| **👨‍💻 Lead Engineer** | Alex Rivera | Senior Full Stack Engineer (`EMP-003`) | `/dashboard/employee` |
| **👨‍💼 Super Admin** | Arthur Morgan | Chief Executive Officer (`EMP-001`) | `/dashboard/admin` |

*Default password for all test accounts*: `password123`

---

## 📂 Monorepo Structure

```
ODOOXNMITX2026/
├── docs/                                 # Shared Single Source of Truth
│   ├── API_CONTRACT.md                   # Complete REST API specification
│   ├── DATABASE_SCHEMA.sql               # Supabase PostgreSQL DDL script
│   ├── SEED_DATA.sql                     # 15 realistic employees, attendance, leaves, salaries
│   ├── BACKEND_SPEC.md                   # Step-by-step FastAPI developer handbook
│   ├── AI_PROMPT_FOR_BACKEND.md          # Master prompt for backend AI scaffolding
│   └── SYSTEM_FLOWS.md                   # State machines and sequence diagrams
├── frontend/                             # Next.js 15 + TypeScript + Tailwind CSS + Lucide
│   ├── app/                              # App router pages (Landing, Login, Employee, Admin)
│   ├── components/                       # UI components (Attendance pulse, Leaves, Payroll)
│   ├── lib/                              # Unified API client, PDF generator, Salary formula
│   └── package.json                      # Managed via pnpm
├── backend/                              # FastAPI Service
│   ├── pyproject.toml                    # Managed via uv
│   └── .env.example
├── package.json                          # Root monorepo scripts
└── README.md
```

---

## 🛠️ Quickstart & Development

### 1. Frontend Development
```bash
cd frontend
pnpm install
pnpm dev
# App will launch at http://localhost:3000
```

### 2. Backend Development (For Your Colleague)
Your colleague can reference `docs/BACKEND_SPEC.md` and `docs/AI_PROMPT_FOR_BACKEND.md`:
```bash
cd backend
uv init --name dayflow-backend .
uv add fastapi "uvicorn[standard]" "sqlalchemy[asyncio]>=2.0.0" asyncpg pydantic pydantic-settings "pyjwt[crypto]" "passlib[bcrypt]" alembic httpx python-multipart python-dotenv
uv run uvicorn app.main:app --reload --port 8000
# Swagger API docs available at http://localhost:8000/docs
```

### 3. Supabase Setup
1. Create a free project on [Supabase](https://supabase.com).
2. Open the **SQL Editor**.
3. Copy and run `docs/DATABASE_SCHEMA.sql`.
4. Copy and run `docs/SEED_DATA.sql`.

---

## 🌐 Cloud Deployment Guide

### Frontend → Vercel
1. Connect repository to [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Set Build Command to `pnpm build`.
4. Add environment variable `NEXT_PUBLIC_USE_MOCK=false` (or leave default for standalone offline demo) and `NEXT_PUBLIC_API_URL`.

### Backend → Render
1. Create a new Web Service on [Render](https://render.com).
2. Set Root Directory to `backend`.
3. Set Start Command: `uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. Add environment variable `DATABASE_URL` pointing to your Supabase PostgreSQL connection string.

---

## 🏆 10-Step Winning Walkthrough Flow

1. **Step 1**: Open Dayflow Landing Page (`/`) and admire the Cyber Cyan glowing hero and Bento Grid.
2. **Step 2**: Click **"Try as Employee (Alex Rivera)"** in the top Judge Demo bar.
3. **Step 3**: On `/dashboard/employee`, click **"Clock In Now"** — watch the live stopwatch tick and status change to `ON DUTY (PRESENT)`.
4. **Step 4**: Click **"Apply Leave"** — submit a 2-day Sick Leave request with reason.
5. **Step 5**: Click **"Sarah (HR Lead)"** in the top Judge Demo bar to switch personas instantly.
6. **Step 6**: On `/dashboard/admin`, see Alex's request in the **Urgent Leave Review Queue** and click **"Approve Leave"**.
7. **Step 7**: Open the **Company Payroll Matrix** (`/dashboard/admin/payroll`) — edit Alex's monthly wage from ₹75,000 to ₹90,000.
8. **Step 8**: Observe the entire table and summary dynamically recalculate Basic, HRA, PF, PT, and Net Take-Home Pay in real-time.
9. **Step 9**: Click **"Payslip"** on Alex's record and download the official, branded PDF salary statement.
10. **Step 10**: Navigate to **Executive Analytics** (`/dashboard/admin/analytics`) to view live attendance velocity and department payroll charts!
