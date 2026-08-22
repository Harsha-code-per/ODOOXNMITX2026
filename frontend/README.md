<div align="center">

# ⚡ Dayflow HRMS — Web Application
### *Next-Generation Enterprise Human Resource Management Frontend*

[![Next.js](https://img.shields.io/badge/Next.js-16.3+-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black.svg?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Recharts](https://img.shields.io/badge/Recharts-v3.10-22c55e.svg?style=for-the-badge&logo=d3.js&logoColor=white)](https://recharts.org)
[![Radix UI](https://img.shields.io/badge/Radix_UI-Primitives-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white)](https://www.radix-ui.com)

**Design Architecture**: Unified Light Studio with Responsive 3D WebGL Canvas  
**Layout Engine**: Fixed-Viewport Shell with Collapsible Rail Sidebar (`Ctrl+B`)  
**Deployment Target**: Vercel

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Interactive Component Highlights](#-interactive-component-highlights)
- [Complete 22-Route Sitemap](#-complete-22-route-sitemap)
- [Design System & Layout Architecture](#-design-system--layout-architecture)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Environment Variables](#-environment-variables)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Dual Data Engine: Real Backend vs Mock Mode](#-dual-data-engine-real-backend-vs-mock-mode)
- [Statutory PDF Payslip Generation](#-statutory-pdf-payslip-generation)
- [Production Deployment to Vercel](#-production-deployment-to-vercel)

---

## 🌟 Overview

The **Dayflow Frontend** is a modern, responsive web application engineered with **Next.js 16 (Turbopack)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It delivers an intuitive user experience for employees, HR directors, company founders, and platform operations staff with fluid typography, real-time stopwatch session counters, dynamic wage matrix recalculations, interactive flowcharts, Recharts attendance graphs, and real-time leave Kanban boards.

---

## ⚡ Interactive Component Highlights

### 1. 🔄 Workforce Architecture Flowchart ([`WorkforceFlowchart.tsx`](components/dashboard/WorkforceFlowchart.tsx))
- **6-Stage SaaS Lifecycle**:
  1. *SaaS Tenant Provisioning* (`Platform Owner`)
  2. *Founder 1st Login Reset* (`Zero-Trust Handover`)
  3. *HR Director Role Setup* (`Sarah Jenkins`)
  4. *Staff Directory Pipeline* (`11 Active Staff`)
  5. *Biometrics & Attendance Sync* (`91% Presence Velocity`)
  6. *Automated Payroll Engine* (`₹10.31L Batch`)
- **Click-to-Inspect**: Clicking any node opens a live telemetry inspection drawer with subsystem status and direct navigation.

### 2. 📋 Real-Time Leave Governance Kanban Board ([`LeaveKanbanBoard.tsx`](components/dashboard/LeaveKanbanBoard.tsx))
- Multi-column board: 🟡 **Pending Review** | 🟢 **Approved & Active** | 🔴 **Rejected / Declined**.
- 1-Click quick approval with celebration confetti (`canvas-confetti`) and real-time state synchronization.
- Filter pills by leave category (`ALL`, `PAID`, `SICK`, `UNPAID`) and search indexing.

### 3. 📈 Attendance Velocity Recharts Visualizer ([`AttendanceVelocityChart.tsx`](components/dashboard/AttendanceVelocityChart.tsx))
- Multi-period data switches (`This Week`, `Monthly`).
- Dual visual styles: **Area Trend** (gradient shading) and **Bar Grid**.
- Rich hover tooltips with presence rates, on-duty headcount, and late arrivals.

### 4. ⏱️ Employee Shift Progress Ring & Stopwatch ([`ShiftProgressRing.tsx`](components/dashboard/ShiftProgressRing.tsx))
- Animated circular SVG gauge tracking live shift percentage against an 8-hour target.
- 1-Click **Punch In / Punch Out** stopwatch with live duration timer.
- Visual leave quota balances with a direct "Apply for Time-Off" modal trigger.

### 5. 🎛️ Fixed-Viewport Shell & Collapsible Rail Sidebar ([`Sidebar.tsx`](components/shared/Sidebar.tsx))
- Fixed-viewport architecture (`h-screen overflow-hidden`) locking the top navbar and left sidebar while isolating content scrolling to `<main>`.
- Sidebar smoothly toggles between expanded full width (`256px`) and compact icon rail (`72px`) with floating hover tooltips.
- Keyboard shortcut `Ctrl + B` (or `Cmd + B`) and `localStorage` persistence.

---

## 🗺️ Complete 22-Route Sitemap

```
Route (app)                              Description
┌ ○ /                                    3D WebGL Particle Hero Landing Page
├ ○ /contact                             SaaS Pricing Tiers & Client Inquiries Form
├ ○ /login                               Client Workspace Sign In & Persona Quick Access
├ ○ /signup                              New Workspace User Registration
├ ○ /force-password-reset                Zero-Trust Forced 1st-Login Password Reset Gate
├ ○ /platform-admin                      Platform Super Admin Tenant Control Plane
├ ○ /platform-admin/login                Dedicated Platform Operations Login Gate
│
├ ○ /dashboard/admin                     HR Command Center (Pulse, Kanban, Flowchart)
├ ○ /dashboard/admin/analytics           Executive Intelligence, Headcount & Cost Charts
├ ○ /dashboard/admin/attendance          Company-Wide Daily & Weekly Attendance Matrix
├ ○ /dashboard/admin/employees           Staff Directory, Search & Onboarding Drawer
├ ○ /dashboard/admin/leaves              Leave Approvals & Decision Review Queue
├ ○ /dashboard/admin/payroll             Automated Payroll Engine & Salary Ledger
│
├ ○ /dashboard/employee                  Employee Self-Service (Stopwatch, Shift Ring)
├ ○ /dashboard/employee/attendance       Personal Attendance Calendar & Work Sessions
├ ○ /dashboard/employee/leaves           Leave Quota Application & History
├ ○ /dashboard/employee/payroll          Statutory Payslip Breakdown & Vector PDF Viewer
├ ○ /dashboard/employee/profile          Personal Profile, Job Details & Documents Hub
└ ○ /_not-found                          Custom 404 Error Page
```

---

## 🎨 Design System & Layout Architecture

Dayflow utilizes a **Unified Light Studio Design System** tailored for high readability and enterprise aesthetics:

```css
/* Core Color Tokens */
--background: #fafafc;      /* Crisp Studio Light */
--foreground: #0f172a;      /* Deep Slate Typography */
--primary: #0891b2;         /* Cyan Accent */
--card-bg: #ffffff;         /* Pure White Glass Panels */
--border-subtle: #e2e8f0;   /* Slate 200 Borders */
```

---

## 💻 Tech Stack

- **Framework**: Next.js 16.3.1 (App Router & Turbopack)
- **UI Runtime**: React 19.2.8
- **Language**: TypeScript 5.0+
- **Styling**: Tailwind CSS v4
- **3D Graphics**: Three.js WebGL Particle Mesh
- **Charting**: Recharts 3.10
- **PDF Generation**: jsPDF
- **Micro-Animations & Effects**: Canvas Confetti, Lucide Icons, Sonner Notifications

---

## 📁 Project Directory Structure

```
frontend/
├── app/
│   ├── contact/                         # Pricing & Inquiries
│   ├── dashboard/
│   │   ├── admin/                       # HR Command Center views
│   │   └── employee/                    # Employee Self-Service views
│   ├── force-password-reset/            # Forced Reset Security Gate
│   ├── login/                           # Client Authentication
│   ├── platform-admin/                  # Super Admin Operations
│   │   └── login/                       # Dedicated Super Admin Gate
│   ├── signup/                          # Registration
│   ├── layout.tsx                       # Root Layout
│   └── page.tsx                         # 3D Landing Page
│
├── components/
│   ├── attendance/                      # Matrix & Stopwatch components
│   ├── dashboard/                       # Flowchart, Kanban, Velocity Chart, Shift Ring
│   ├── leaves/                          # Leave Approval Drawer & Apply Modal
│   ├── payroll/                         # Payslip Modal & Dynamic Salary Editor
│   └── shared/                          # Persona Demo Bar, Sidebar, Navbar, FlowAI
│
├── lib/
│   ├── api.ts                           # Unified API Client (Mock & Backend)
│   ├── auth-context.tsx                 # Multi-Persona Auth Context
│   ├── mock-data.ts                     # Enterprise Mock Dataset & State Store
│   ├── salary-calculator.ts             # Statutory Salary Engine
│   └── utils.ts                         # Formatters & Helpers
│
├── package.json                         # Dependencies & Scripts
└── README.md                            # Frontend Documentation
```

---

## 🔧 Environment Variables

Create a `.env.local` file in the `frontend/` root:

```bash
# Set to 'false' to connect to live FastAPI backend, or 'true' for standalone mock mode
NEXT_PUBLIC_USE_MOCK=true

# Live Backend REST API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🚀 Getting Started & Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Run local development server
pnpm dev

# 3. Build for production
pnpm build
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📄 Statutory PDF Payslip Generation

The client-side PDF payslip engine (`components/payroll/PayslipModal.tsx`) compiles professional vector PDF salary statements directly in the browser:
- Header with company identity, logo, and pay period.
- Employee metadata (Designation, Department, Bank Account, PAN/ID).
- Itemized earnings (Basic, HRA, Allowances) and deductions (PF, Professional Tax).
- Net take-home salary in INR formatted words and figures with official authorization stamp.

---

## 🚢 Production Deployment to Vercel

```bash
# Deploy with Vercel CLI
npx vercel --prod
```

Or connect your GitHub repository directly to Vercel:
1. **Framework Preset**: Next.js
2. **Root Directory**: `frontend`
3. **Build Command**: `next build`
4. **Output Directory**: `.next`

---

<div align="center">
  <p>© 2026 Dayflow Technologies Inc. • Frontend Architecture Guide</p>
</div>
