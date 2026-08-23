<div align="center">

# ⚡ Dayflow HRMS — Web Application
### *Next-Generation Enterprise Human Resource Management Frontend*

[![Live on Vercel](https://img.shields.io/badge/Vercel-Live_Production-000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://dayflow-hrms-chi.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3+(Turbopack)-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.2+-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black.svg?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![Recharts](https://img.shields.io/badge/Recharts-v3.10-22c55e.svg?style=for-the-badge&logo=d3.js&logoColor=white)](https://recharts.org)

<br/>

**Design System**: Unified Light Studio with Responsive 3D WebGL Canvas  
**Layout Engine**: Fixed-Viewport Shell with Collapsible Rail Sidebar (`Ctrl+B`)  
**Production URL**: [https://dayflow-hrms-chi.vercel.app/](https://dayflow-hrms-chi.vercel.app/)

</div>

---

## 📑 Table of Contents

- [🌟 Overview](#-overview)
- [⚡ Interactive Component Highlights](#-interactive-component-highlights)
- [🗺️ Complete 22-Route Sitemap](#️-complete-22-route-sitemap)
- [🎨 Design System & Layout Architecture](#-design-system--layout-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Directory Structure](#-directory-structure)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🚀 Local Development](#-local-development)
- [🔄 Dual Data Engine (Live API vs Mock Mode)](#-dual-data-engine-live-api-vs-mock-mode)
- [📄 Vector PDF Payslip Generator](#-vector-pdf-payslip-generator)
- [☁️ Vercel Deployment & pnpm 11 Configuration](#️-vercel-deployment--pnpm-11-configuration)

---

## 🌟 Overview

The **Dayflow Frontend** is a modern, responsive enterprise web application built with **Next.js 16 (Turbopack)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It delivers an intuitive, fast user experience across four core roles (Platform Super Admin, Company Admin, HR Director, Employee) with real-time attendance velocity tracking, interactive flowcharts, live shift stopwatches, and 1-click Kanban leave governance.

---

## ⚡ Interactive Component Highlights

### 1. 🔄 Workforce Architecture Flowchart ([`WorkforceFlowchart.tsx`](components/dashboard/WorkforceFlowchart.tsx))
- **6-Stage SaaS Lifecycle**:
  1. *SaaS Tenant Provisioning* (`Platform Owner`)
  2. *Founder 1st Login Reset* (`Zero-Trust Handover`)
  3. *HR Director Role Setup* (`Sarah Jenkins`)
  4. *Staff Directory Pipeline* (`11 Active Staff`)
  5. *Biometrics & Attendance Sync* (`91% Presence Velocity`)
  6. *Automated Statutory Payroll* (`₹10.31L Batch`)
- **Click-to-Inspect Telemetry**: Clicking any node opens a live telemetry inspection drawer with direct navigation and subsystem diagnostics.

### 2. 📋 Real-Time Leave Governance Kanban Board ([`LeaveKanbanBoard.tsx`](components/dashboard/LeaveKanbanBoard.tsx))
- Multi-column board: 🟡 **Pending Review** | 🟢 **Approved & Active** | 🔴 **Rejected / Declined**.
- 1-Click quick approval with celebration confetti (`canvas-confetti`) and real-time state synchronization.
- Filter pills by leave category (`ALL`, `PAID`, `SICK`, `UNPAID`) with real-time text search.

### 3. 📈 Attendance Velocity Recharts Visualizer ([`AttendanceVelocityChart.tsx`](components/dashboard/AttendanceVelocityChart.tsx))
- Multi-period data switches (`This Week`, `Monthly`).
- Dual visual modes: **Area Trend** (gradient elevation) and **Bar Grid**.
- Rich hover tooltips with presence rates, on-duty headcount, and late arrivals.

### 4. ⏱️ Employee Shift Progress Ring & Stopwatch ([`ShiftProgressRing.tsx`](components/dashboard/ShiftProgressRing.tsx))
- Animated circular SVG gauge tracking live shift percentage against an 8-hour target.
- 1-Click **Punch In / Punch Out** stopwatch with live duration counter.
- Visual leave quota balance cards with a direct "Apply for Time-Off" modal trigger.

### 5. 🎛️ Fixed-Viewport Shell & Collapsible Rail Sidebar ([`Sidebar.tsx`](components/shared/Sidebar.tsx))
- Fixed-viewport architecture (`h-screen overflow-hidden`) locking the top navbar and left sidebar while isolating content scrolling to `<main>`.
- Sidebar smoothly toggles between expanded full width (`256px`) and compact icon rail (`72px`) with floating hover tooltips.
- Keyboard shortcut `Ctrl + B` (or `Cmd + B`) with `localStorage` state persistence.

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
├ ○ /dashboard/employee/profile          Employee Master Profile & Emergency Contacts
│
├ ○ /_not-found                          Custom 404 Error Experience
└ ○ /icon.png                            Application Favicon & PWA Icons
```

---

## 🎨 Design System & Layout Architecture

- **Color Palette**:
  - Primary Accent: Dayflow Deep Teal (`#0e7490`) & Electric Cyan (`#06b6d4`)
  - Surface Background: Warm Studio Light (`#f8fafc` / `#ffffff`)
  - Text Hierarchy: Slate 900 (`#0f172a`) headers, Slate 600 body, Slate 400 captions
  - Success/Warning/Danger: Emerald 500, Amber 500, Rose 500
- **Typography**: Inter / Outfit modern sans-serif typography.
- **Fixed-Viewport Layout**: Prevents unwanted double-scrollbars by locking root container height (`h-screen overflow-hidden`).

---

## 🛠️ Tech Stack

- **Core**: Next.js 16.3.1 (App Router & Turbopack), React 19.2.8, TypeScript 5.9
- **Styling**: Tailwind CSS v4, PostCSS, Lucide React Icons
- **Animation & 3D**: Three.js (WebGL 3D Particle Mesh), Framer Motion 13, Lenis Smooth Scroll
- **Data Visualization**: Recharts 3.10
- **Primitives**: Radix UI (Dialog, Dropdown, Tabs, Tooltip, Select, Popover, Switch)
- **PDF Engine**: jsPDF 4.2 (Client-side vector payslip rendering)
- **Delight**: canvas-confetti, Sonner toasts

---

## 📁 Directory Structure

```
frontend/
├── app/                               # Next.js 16 App Router Routes
│   ├── (auth)/login/                  # Login with demo persona bar
│   ├── contact/                       # Lead generation & pricing
│   ├── force-password-reset/          # First-login security handover
│   ├── platform-admin/                # Super admin company provisioning
│   ├── dashboard/
│   │   ├── admin/                     # Admin & HR Command Center
│   │   └── employee/                  # Employee Self-Service
│   ├── layout.tsx                     # Root HTML wrapper with fonts & providers
│   └── page.tsx                       # 3D WebGL Landing Page
│
├── components/
│   ├── dashboard/                     # Domain widgets (Kanban, Flowchart, Velocity)
│   ├── landing/                       # 3D particle hero, pricing matrix, FAQ
│   ├── shared/                        # Sidebar, TopNav, Header, RoleSwitcher
│   └── ui/                            # Atoms (Button, Badge, Card, Modal, Input)
│
├── lib/
│   ├── api.ts                         # Universal REST API client with mock fallback
│   ├── pdf-generator.ts               # Vector PDF payslip layout engine
│   └── utils.ts                       # Tailwind merge & currency formatters
│
├── pnpm-workspace.yaml                # pnpm 11 lifecycle script approvals
├── package.json                       # Dependencies & scripts
└── tsconfig.json                      # Strict TypeScript compiler options
```

---

## ⚙️ Environment Configuration

Create `.env.local` in the `frontend/` directory:

```env
# Set to "false" to connect to live FastAPI backend; "true" for offline mock mode
NEXT_PUBLIC_USE_MOCK=false

# Backend REST API Base URL
NEXT_PUBLIC_API_URL=https://dayflow-api-mnu8.onrender.com/api/v1
```

---

## 🚀 Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Start Next.js Turbopack development server
pnpm dev

# 3. Open browser at http://localhost:3000
```

---

## 🔄 Dual Data Engine (Live API vs Mock Mode)

Dayflow features a resilient dual data engine in [`lib/api.ts`](lib/api.ts):
- **Live API Mode (`NEXT_PUBLIC_USE_MOCK=false`)**: Dispatches authenticated HTTP requests to the FastAPI backend with Bearer JWT tokens.
- **Mock Mode (`NEXT_PUBLIC_USE_MOCK=true`)**: Provides an offline, persistent sandbox with initialized mock personas and `localStorage` storage for zero-connectivity demonstrations.

---

## 📄 Vector PDF Payslip Generator

The client-side PDF engine in [`lib/pdf-generator.ts`](lib/pdf-generator.ts) renders crisp, vector-based payslips with:
- Company Branding & Tax Identification
- Employee ID, Designation & Department
- Attendance Summary (Working Days vs Payable Days)
- Itemized Earnings (Basic, HRA, Standard Allowance, Performance Bonus, LTA)
- Itemized Statutory Deductions (PF 12%, PT ₹200)
- Net Pay in Figures & Words
- Authorized Digital Signatory Stamp

---

## ☁️ Vercel Deployment & pnpm 11 Configuration

To resolve `[ERR_PNPM_IGNORED_BUILDS]` under `pnpm 11` on Vercel:
- The root [`pnpm-workspace.yaml`](pnpm-workspace.yaml) explicitly defines build permissions:
  ```yaml
  allowBuilds:
    core-js: false
    unrs-resolver: true
  ```
- **Vercel Build Settings**:
  - Root Directory: `frontend`
  - Framework Preset: `Next.js`
  - Build Command: `pnpm build`

---

<div align="center">

**Dayflow HRMS Frontend** • Production Ready on Vercel

</div>
