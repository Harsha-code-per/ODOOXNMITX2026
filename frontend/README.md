<div align="center">

# ⚡ Dayflow HRMS — Web Application
### *Next-Generation Enterprise Human Resource Management Frontend*

[![Next.js](https://img.shields.io/badge/Next.js-16.3+-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.0+-FF0055.svg?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Primitives-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com)

**Theme**: Cyber Cyan (`#06B6D4`) Dual-Themed (Dark Luxe & Crisp Light)  
**Responsive Core**: Fluid REM Architecture (Mobile, Tablet, Laptop & 4K)  
**Deployment Target**: Vercel

</div>

---

## 📑 Table of Contents

- [Executive Overview](#-executive-overview)
- [Key User Interfaces & Modules](#-key-user-interfaces--modules)
- [Design System & Fluid REM Architecture](#-design-system--fluid-rem-architecture)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started & Development](#-getting-started--development)
- [Dual Data Engine: Real API vs Mock Mode](#-dual-data-engine-real-api-vs-mock-mode)
- [PDF Payslip Generation Engine](#-pdf-payslip-generation-engine)
- [Production Deployment](#-production-deployment)

---

## 🌟 Executive Overview

The **Dayflow Frontend** is a modern, responsive web application engineered with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It delivers an intuitive, micro-animated user experience for both employees and HR leaders with fluid typography, real-time stopwatch session counters, dynamic wage matrix recalculations, and 1-click statutory PDF payslip generation.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND CORE HIGHLIGHTS                               │
├──────────────────────────┬───────────────────────────────────────────────────────────────┤
│ 1. 1-CLICK DEMO BAR      │ Sticky top bar for judges to switch personas seamlessly       │
│                          │ between Sarah (HR), Alex (Lead Dev), and Arthur (CEO).        │
├──────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 2. LIVE ATTENDANCE PULSE │ Stopwatch session counter with live presence indicators,      │
│                          │ half-day thresholds, and one-tap clock-in/out.                │
├──────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 3. DYNAMIC WAGE MATRIX   │ Real-time wage adjustment UI reflecting instant Basic (50%),  │
│                          │ HRA, Allowances, PF, PT, and Take-Home recalculations.        │
├──────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 4. STATUTORY PDF PAYSLIP │ Branded, client-side downloadable PDF payslips formatted with │
│                          │ company watermark, statutory components, and proration info.   │
├──────────────────────────┼───────────────────────────────────────────────────────────────┤
│ 5. FLUID REM ARCHITECTURE│ Scalable CSS clamp() typography ensuring flawless layouts     │
│                          │ from 360px smartphones to 4K Ultra-HD displays.               │
└──────────────────────────┴───────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Key User Interfaces & Modules

### 1. 🌐 Cinematic Landing & Bento Grid (`/`)
- High-impact visual hero with Cyber Cyan (`#06B6D4`) glow aesthetics.
- Interactive Bento Grid highlighting dynamic payroll, attendance telemetry, and leave governance.
- 1-Click Judge Persona access directly from the hero header.

### 2. 👨‍💻 Employee Self-Service Portal (`/dashboard/employee`)
- **Live Attendance Card**: Real-time ticking work session timer, one-click Clock-In/Clock-Out, and daily presence badges.
- **Leave Balances & Request Widget**: Visual quota rings for `PAID (18)`, `SICK (10)`, `CASUAL (6)`, and `UNPAID (0)`.
- **Salary Breakdown & PDF Export**: Transparent view of monthly base wage, itemized earnings, deductions, and 1-click official PDF payslip download.

### 3. 👩‍💼 HR Command Center (`/dashboard/admin`)
- **Executive KPI Dashboard**: Live headcount, present today, absent today, employees on leave, and monthly payroll burn rate.
- **Employee Directory (`/dashboard/admin/employees`)**: Searchable, filterable staff roster with department tags, role chips, and View-As inspector.
- **Company Attendance Grid (`/dashboard/admin/attendance`)**: Multi-department live attendance board with status filters (`PRESENT`, `ABSENT`, `HALF_DAY`, `ON_LEAVE`).
- **Urgent Leave Review Queue (`/dashboard/admin/leaves`)**: 1-click Approve and Reject controls with automatic attendance calendar synchronization.
- **Dynamic Salary Matrix (`/dashboard/admin/payroll`)**: Instant wage editor triggering automatic component recalculations across all employee tiers.
- **Executive Analytics (`/dashboard/admin/analytics`)**: Recharts-powered department cost distribution and 5-day attendance velocity charts.

---

## 🎨 Design System & Fluid REM Architecture

Dayflow utilizes a **Fluid REM Typography & Spacing System** designed to scale proportionally across any viewport without layout shifts:

```css
/* Fluid Typography & Root Scaling */
:root {
  font-size: clamp(14px, 0.85rem + 0.35vw, 18px);
}

/* Fluid Container Sizing */
.fluid-container {
  width: 100%;
  max-width: clamp(320px, 92vw, 1600px);
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(1rem, 2vw, 2.5rem);
  padding-right: clamp(1rem, 2vw, 2.5rem);
}
```

- **Primary Accent**: Cyber Cyan (`#06B6D4`) with luminous gradient overlays.
- **Dual Themes**: Fully integrated Dark Luxe (`#0B0F17`) and Crisp Light (`#F8FAFC`) with smooth CSS transitions.
- **Accessible Touch Targets**: Minimum 44px interactive touch targets across mobile viewports.

---

## 📦 Tech Stack & Architecture

- **Framework**: Next.js 16.3 (App Router)
- **UI Library**: React 19.2
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS v4 + Vanilla CSS Fluid System
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **PDF Generation**: jsPDF
- **Notifications & Modals**: Sonner + Radix UI Primitives
- **Package Manager**: `pnpm`

---

## 📂 Project Directory Structure

```
frontend/
├── app/                                   # Next.js App Router Routes
│   ├── page.tsx                           # Cinematic Landing Page with Bento Showcase
│   ├── layout.tsx                         # Root Layout with Theme & Auth Providers
│   ├── globals.css                        # Design system tokens & fluid REM clamp() styles
│   ├── login/                             # Login Page with Persona Quick-Select
│   ├── signup/                            # Registration Page
│   └── dashboard/                         # Protected Application Routes
│       ├── layout.tsx                     # Dashboard Navigation Shell & Persona Bar
│       ├── employee/                      # Employee Self-Service Portal
│       └── admin/                         # HR Admin Command Center
│           ├── page.tsx                   # Overview KPI Command Center
│           ├── employees/                 # Employee Directory & Profiles
│           ├── attendance/                # Company-Wide Attendance Matrix
│           ├── leaves/                    # Leave Approval & Review Queue
│           ├── payroll/                   # Dynamic Salary Matrix & Wage Editor
│           └── analytics/                 # Executive Analytics & Charts
│
├── components/                            # Modular React UI Components
│   ├── attendance/                        # Attendance stopwatch, status badges, log tables
│   ├── employees/                         # Staff cards, employee forms, avatar uploaders
│   ├── leaves/                            # Leave balance rings, application modals, review cards
│   ├── payroll/                           # Salary breakdown cards, wage slider, payslip viewer
│   └── shared/                            # Sticky Persona Demo Bar, Glass Sidebar, Navbar
│
├── lib/                                   # Client Logic, State & Utilities
│   ├── api.ts                             # Unified DayflowApiClient (REST + Mock fallback)
│   ├── auth-context.tsx                   # Authentication Context & Session Provider
│   ├── theme-context.tsx                  # Dark/Light Theme Switcher Provider
│   ├── mock-data.ts                       # High-fidelity mock state with 11 demo personas
│   ├── pdf-generator.ts                   # Client-side statutory PDF payslip engine (jsPDF)
│   ├── salary-calculator.ts               # Dynamic wage formula & payable days engine
│   └── utils.ts                           # Tailwind class merging (clsx + twMerge)
│
├── public/                                # Static images, icons, and branding assets
├── package.json                           # Managed with pnpm
└── tsconfig.json                          # TypeScript configuration
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in `frontend/`:

```env
# URL pointing to the FastAPI backend service
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Set to "false" to connect to real FastAPI backend.
# Set to "true" for standalone offline browser demo with LocalStorage persistence.
NEXT_PUBLIC_USE_MOCK=false
```

---

## 🚀 Getting Started & Development

### 1. Install Dependencies
```bash
cd frontend
pnpm install
```

### 2. Run Local Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
pnpm build
pnpm start
```

### 4. Lint Codebase
```bash
pnpm lint
```

---

## 🔄 Dual Data Engine: Real API vs Mock Mode

The frontend includes a **Dual-Mode API Client** ([`lib/api.ts`](file:///home/cholan0415/ODOOXNMITX2026/frontend/lib/api.ts)):

1. **Connected Mode (`NEXT_PUBLIC_USE_MOCK=false`)**:
   - Makes standard `fetch` requests with `Authorization: Bearer <token>` to the FastAPI backend (`http://localhost:8000/api/v1`).
2. **Autonomous Offline Mode (`NEXT_PUBLIC_USE_MOCK=true`)**:
   - Operates with zero external network dependencies using a high-fidelity `localStorage` state manager pre-seeded with 11 realistic employees, attendance records, and leave requests.
   - Ideal for offline judge evaluations and presentations.

---

## 📄 PDF Payslip Generation Engine

The payslip engine ([`lib/pdf-generator.ts`](file:///home/cholan0415/ODOOXNMITX2026/frontend/lib/pdf-generator.ts)) generates client-side, branded PDF documents containing:
- Company Header & Watermark branding.
- Employee Details (Name, Employee ID, Department, Designation, Joining Date).
- Statutory Itemized Earnings (Basic, HRA, Standard Allowance, Performance Bonus, LTA, Fixed Allowance).
- Statutory Deductions (Provident Fund, Professional Tax).
- Prorated Attendance Summary ($\text{Payable Days} / \text{Working Days}$) and Effective Net Take-Home Pay.

---

## 🌐 Production Deployment

### Deploying to Vercel
1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `frontend`.
4. Configure environment variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-service.onrender.com/api/v1`
   - `NEXT_PUBLIC_USE_MOCK`: `false`
5. Click **Deploy**.

---

<div align="center">

**Dayflow HRMS Frontend** — Crafted with precision for the **Odoo × NMIT Hackathon 2026**

</div>
