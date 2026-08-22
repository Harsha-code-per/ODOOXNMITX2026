import { calculateSalaryStructure, calculatePayablePayout, SalaryComponents, PayableSalaryResult } from "./salary-calculator";

export type Role = "SUPER_ADMIN" | "ADMIN" | "HR" | "EMPLOYEE";
export type EmployeeStatus = "ACTIVE" | "ON_LEAVE" | "TERMINATED";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY" | "ON_LEAVE";
export type LeaveType = "PAID" | "SICK" | "CASUAL" | "UNPAID";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Employee {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: EmployeeStatus;
  avatarUrl: string;
  address: string;
  emergencyContact: EmergencyContact;
  wage: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  workDate: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number;
  status: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatarUrl: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  hrComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface LeaveBalance {
  allocated: number;
  used: number;
  remaining: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CompanyTenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  plan: "Starter" | "Growth" | "Enterprise";
  adminName: string;
  adminEmail: string;
  employeeCount: number;
  status: "ACTIVE" | "PENDING_SETUP" | "SUSPENDED";
  createdAt: string;
}

export interface CompanyInquiry {
  id: string;
  companyName: string;
  contactName: string;
  workEmail: string;
  phone: string;
  teamSize: string;
  planInterest: "Starter" | "Growth" | "Enterprise";
  message: string;
  status: "NEW" | "PROVISIONED" | "CONTACTED";
  createdAt: string;
}

export interface UserSession {
  id: string;
  email: string;
  role: Role;
  employee: Employee;
  token: string;
  mustChangePassword?: boolean;
  companyId?: string;
  companyName?: string;
}

// ------------------------------------------------------------------------------
// INITIAL CLIENT COMPANIES (Multi-Tenant SaaS)
// ------------------------------------------------------------------------------

export const INITIAL_COMPANIES: CompanyTenant[] = [
  {
    id: "comp-acme-001",
    name: "Acme Corporation",
    slug: "acme",
    domain: "acmecorp.io",
    plan: "Enterprise",
    adminName: "Arthur Morgan",
    adminEmail: "admin@acmecorp.io",
    employeeCount: 11,
    status: "ACTIVE",
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "comp-nexus-002",
    name: "Nexus Technologies",
    slug: "nexus",
    domain: "nexuscorp.io",
    plan: "Growth",
    adminName: "Elena Rostova",
    adminEmail: "elena@nexuscorp.io",
    employeeCount: 42,
    status: "ACTIVE",
    createdAt: "2026-03-01T10:30:00Z",
  },
  {
    id: "comp-starlight-003",
    name: "Starlight Media Labs",
    slug: "starlight",
    domain: "starlight.design",
    plan: "Starter",
    adminName: "Marcus Thorne",
    adminEmail: "marcus@starlight.design",
    employeeCount: 18,
    status: "PENDING_SETUP",
    createdAt: "2026-08-20T14:15:00Z",
  },
];

// ------------------------------------------------------------------------------
// INITIAL INBOUND SAAS INQUIRIES
// ------------------------------------------------------------------------------

export const INITIAL_INQUIRIES: CompanyInquiry[] = [
  {
    id: "inq-101",
    companyName: "HyperScale Quantum",
    contactName: "Vikram Malhotra",
    workEmail: "vikram@hyperscale.ai",
    phone: "+1 415-555-8921",
    teamSize: "50-200",
    planInterest: "Growth",
    message: "Looking to replace multiple disjoint spreadsheets with Dayflow dynamic payroll and live attendance.",
    status: "NEW",
    createdAt: "2026-08-22T08:45:00Z",
  },
  {
    id: "inq-102",
    companyName: "Zenith FinTech",
    contactName: "Claire Dupont",
    workEmail: "claire@zenithfin.com",
    phone: "+44 20 7946 0912",
    teamSize: "200+",
    planInterest: "Enterprise",
    message: "Need Indian statutory tax compliance (PF 12%, PT) and role-based access for multi-entity teams.",
    status: "NEW",
    createdAt: "2026-08-21T16:20:00Z",
  },
];

// ------------------------------------------------------------------------------
// INITIAL EMPLOYEES DATA (11 Comprehensive Profiles)
// ------------------------------------------------------------------------------

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
    employeeId: "EMP-001",
    firstName: "Arthur",
    lastName: "Morgan",
    email: "admin@acmecorp.io",
    phone: "+1 555-0101",
    department: "Management",
    designation: "Chief Executive Officer",
    joiningDate: "2022-01-10",
    status: "ACTIVE",
    avatarUrl: "",
    address: "100 Market St, San Francisco, CA",
    emergencyContact: { name: "Mary Linton", relationship: "Spouse", phone: "+1 555-0102" },
    wage: 150000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    employeeId: "EMP-002",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.hr@acmecorp.io",
    phone: "+1 555-0201",
    department: "Human Resources",
    designation: "HR Director",
    joiningDate: "2022-03-01",
    status: "ACTIVE",
    avatarUrl: "",
    address: "245 Pine St, San Francisco, CA",
    emergencyContact: { name: "Tom Jenkins", relationship: "Spouse", phone: "+1 555-0202" },
    wage: 95000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
    employeeId: "EMP-003",
    firstName: "Alex",
    lastName: "Rivera",
    email: "alex.rivera@acmecorp.io",
    phone: "+1 555-0301",
    department: "Engineering",
    designation: "Senior Staff Engineer",
    joiningDate: "2022-06-15",
    status: "ACTIVE",
    avatarUrl: "",
    address: "580 Howard St, San Francisco, CA",
    emergencyContact: { name: "Elena Rivera", relationship: "Sister", phone: "+1 555-0302" },
    wage: 110000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
    employeeId: "EMP-004",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@acmecorp.io",
    phone: "+1 555-0401",
    department: "Engineering",
    designation: "Fullstack Architect",
    joiningDate: "2022-08-01",
    status: "ACTIVE",
    avatarUrl: "",
    address: "740 Mission St, San Francisco, CA",
    emergencyContact: { name: "Raj Sharma", relationship: "Father", phone: "+1 555-0402" },
    wage: 105000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
    employeeId: "EMP-005",
    firstName: "David",
    lastName: "Chen",
    email: "david.chen@acmecorp.io",
    phone: "+1 555-0501",
    department: "Engineering",
    designation: "DevOps & Cloud Lead",
    joiningDate: "2023-01-15",
    status: "ACTIVE",
    avatarUrl: "",
    address: "310 Folsom St, San Francisco, CA",
    emergencyContact: { name: "Linda Chen", relationship: "Mother", phone: "+1 555-0502" },
    wage: 98000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6",
    employeeId: "EMP-006",
    firstName: "Maya",
    lastName: "Lin",
    email: "maya.lin@acmecorp.io",
    phone: "+1 555-0601",
    department: "Product",
    designation: "Principal Product Designer",
    joiningDate: "2023-03-20",
    status: "ACTIVE",
    avatarUrl: "",
    address: "420 Fremont St, San Francisco, CA",
    emergencyContact: { name: "Kevin Lin", relationship: "Brother", phone: "+1 555-0602" },
    wage: 92000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7",
    employeeId: "EMP-007",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@acmecorp.io",
    phone: "+1 555-0701",
    department: "Human Resources",
    designation: "HR Operations Associate",
    joiningDate: "2023-05-10",
    status: "ACTIVE",
    avatarUrl: "",
    address: "120 Battery St, San Francisco, CA",
    emergencyContact: { name: "Susan Wilson", relationship: "Mother", phone: "+1 555-0702" },
    wage: 65000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8",
    employeeId: "EMP-008",
    firstName: "Chloe",
    lastName: "Dupont",
    email: "chloe.dupont@acmecorp.io",
    phone: "+1 555-0801",
    department: "Product",
    designation: "Senior Product Manager",
    joiningDate: "2023-07-01",
    status: "ACTIVE",
    avatarUrl: "",
    address: "880 Harrison St, San Francisco, CA",
    emergencyContact: { name: "Julien Dupont", relationship: "Spouse", phone: "+1 555-0802" },
    wage: 96000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9",
    employeeId: "EMP-009",
    firstName: "Rahul",
    lastName: "Verma",
    email: "rahul.verma@acmecorp.io",
    phone: "+1 555-0901",
    department: "Sales",
    designation: "Enterprise Account Executive",
    joiningDate: "2023-09-15",
    status: "ACTIVE",
    avatarUrl: "",
    address: "950 Montgomery St, San Francisco, CA",
    emergencyContact: { name: "Ananya Verma", relationship: "Spouse", phone: "+1 555-0902" },
    wage: 88000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10",
    employeeId: "EMP-010",
    firstName: "Aisha",
    lastName: "Khan",
    email: "aisha.khan@acmecorp.io",
    phone: "+1 555-1001",
    department: "Marketing",
    designation: "Growth & Brand Specialist",
    joiningDate: "2023-11-01",
    status: "ACTIVE",
    avatarUrl: "",
    address: "1400 Post St, San Francisco, CA",
    emergencyContact: { name: "Farhan Khan", relationship: "Brother", phone: "+1 555-1002" },
    wage: 50000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb11",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa11",
    employeeId: "EMP-011",
    firstName: "Liam",
    lastName: "Nelson",
    email: "liam.nelson@acmecorp.io",
    phone: "+1 555-1101",
    department: "Finance",
    designation: "Financial Controller",
    joiningDate: "2022-05-15",
    status: "ACTIVE",
    avatarUrl: "",
    address: "320 Bush St, San Francisco, CA",
    emergencyContact: { name: "Anna Nelson", relationship: "Spouse", phone: "+1 555-1102" },
    wage: 82000,
  },
];

// ------------------------------------------------------------------------------
// PRE-SET DEMO PERSONAS
// ------------------------------------------------------------------------------

export const DEMO_PERSONAS: Record<string, UserSession> = {
  superadmin: {
    id: "dayflow-platform-staff-001",
    email: "owner@dayflow.io",
    role: "SUPER_ADMIN",
    companyId: "dayflow-hq",
    companyName: "Dayflow Platform HQ",
    mustChangePassword: false,
    employee: {
      id: "platform-emp-001",
      userId: "dayflow-platform-staff-001",
      employeeId: "DAYFLOW-001",
      firstName: "Dayflow",
      lastName: "Platform Owner",
      email: "owner@dayflow.io",
      phone: "+1 800-555-DAYFLOW",
      department: "Platform Operations",
      designation: "Platform Administrator",
      joiningDate: "2026-01-01",
      status: "ACTIVE",
      avatarUrl: "",
      address: "Dayflow HQ, San Francisco, CA",
      emergencyContact: { name: "Security Desk", relationship: "HQ", phone: "+1 800-555-0000" },
      wage: 200000,
    },
    token: "mock-jwt-dayflow-platform-superadmin",
  },
  admin: {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
    email: "admin@acmecorp.io",
    role: "ADMIN",
    companyId: "comp-acme-001",
    companyName: "Acme Corporation",
    mustChangePassword: false,
    employee: INITIAL_EMPLOYEES[0], // Arthur Morgan
    token: "mock-jwt-arthur-morgan-admin",
  },
  admin_temp: {
    id: "temp-admin-nexus-001",
    email: "ceo@nexuscorp.io",
    role: "ADMIN",
    companyId: "comp-nexus-002",
    companyName: "Nexus Technologies",
    mustChangePassword: true,
    employee: {
      id: "temp-emp-001",
      userId: "temp-admin-nexus-001",
      employeeId: "NEX-001",
      firstName: "Elena",
      lastName: "Rostova",
      email: "ceo@nexuscorp.io",
      phone: "+1 555-8822",
      department: "Executive",
      designation: "Founder & CEO",
      joiningDate: "2026-08-01",
      status: "ACTIVE",
      avatarUrl: "",
      address: "101 Nexus Blvd, San Jose, CA",
      emergencyContact: { name: "Nexus Desk", relationship: "HQ", phone: "+1 555-8800" },
      wage: 160000,
    },
    token: "mock-jwt-elena-nexus-temp",
  },
  sarah: {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    email: "sarah.hr@acmecorp.io",
    role: "HR",
    companyId: "comp-acme-001",
    companyName: "Acme Corporation",
    mustChangePassword: false,
    employee: INITIAL_EMPLOYEES[1], // Sarah Jenkins
    token: "mock-jwt-sarah-jenkins-hr",
  },
  alex: {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
    email: "alex.rivera@acmecorp.io",
    role: "EMPLOYEE",
    companyId: "comp-acme-001",
    companyName: "Acme Corporation",
    mustChangePassword: false,
    employee: INITIAL_EMPLOYEES[2], // Alex Rivera
    token: "mock-jwt-alex-rivera-employee",
  },
};

// ------------------------------------------------------------------------------
// INITIAL ATTENDANCE LOGS
// ------------------------------------------------------------------------------

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att-1",
    employeeId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3", // Alex Rivera
    workDate: "2026-08-18",
    checkIn: "2026-08-18T09:02:00Z",
    checkOut: "2026-08-18T17:35:00Z",
    totalHours: 8.55,
    status: "PRESENT",
    notes: "Sprint planning",
  },
  {
    id: "att-2",
    employeeId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
    workDate: "2026-08-19",
    checkIn: "2026-08-19T09:15:00Z",
    checkOut: "2026-08-19T18:00:00Z",
    totalHours: 8.75,
    status: "PRESENT",
    notes: "Backend integration",
  },
  {
    id: "att-3",
    employeeId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
    workDate: "2026-08-20",
    checkIn: "2026-08-20T08:55:00Z",
    checkOut: "2026-08-20T17:30:00Z",
    totalHours: 8.58,
    status: "PRESENT",
    notes: "Code review",
  },
  {
    id: "att-4",
    employeeId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
    workDate: "2026-08-21",
    checkIn: "2026-08-21T09:00:00Z",
    checkOut: "2026-08-21T13:15:00Z",
    totalHours: 4.25,
    status: "HALF_DAY",
    notes: "Dentist appointment",
  },
  {
    id: "att-5",
    employeeId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
    workDate: "2026-08-22",
    checkIn: "2026-08-22T09:00:00Z",
    checkOut: null,
    totalHours: 0.0,
    status: "PRESENT",
    notes: "Checked in for work session",
  },
];

// ------------------------------------------------------------------------------
// INITIAL LEAVE REQUESTS
// ------------------------------------------------------------------------------

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "leave-1",
    employeeId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3", // Alex Rivera
    employeeName: "Alex Rivera",
    department: "Engineering",
    avatarUrl: "",
    leaveType: "SICK",
    startDate: "2026-08-24",
    endDate: "2026-08-25",
    totalDays: 2,
    reason: "Doctor consultation and recovery from mild viral fever",
    status: "PENDING",
    createdAt: "2026-08-22T08:30:00Z",
  },
  {
    id: "leave-2",
    employeeId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8", // Chloe Dupont
    employeeName: "Chloe Dupont",
    department: "Product",
    avatarUrl: "",
    leaveType: "PAID",
    startDate: "2026-08-21",
    endDate: "2026-08-26",
    totalDays: 5,
    reason: "Annual family vacation",
    status: "APPROVED",
    hrComments: "Approved. Enjoy your vacation!",
    reviewedBy: "Sarah Jenkins",
    reviewedAt: "2026-08-20T11:00:00Z",
    createdAt: "2026-08-19T09:00:00Z",
  },
  {
    id: "leave-3",
    employeeId: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5", // David Chen
    employeeName: "David Chen",
    department: "Engineering",
    avatarUrl: "",
    leaveType: "CASUAL",
    startDate: "2026-08-12",
    endDate: "2026-08-13",
    totalDays: 2,
    reason: "Personal travel during Kubernetes upgrade",
    status: "REJECTED",
    hrComments: "Cannot approve leave during the cloud migration sprint. Please reschedule.",
    reviewedBy: "Sarah Jenkins",
    reviewedAt: "2026-08-10T14:30:00Z",
    createdAt: "2026-08-09T10:15:00Z",
  },
];

// ------------------------------------------------------------------------------
// INITIAL NOTIFICATIONS
// ------------------------------------------------------------------------------

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2", // Sarah HR
    type: "LEAVE_SUBMITTED",
    title: "New Leave Application",
    message: "Alex Rivera has requested 2 days of Sick Leave (Aug 24 - Aug 25).",
    isRead: false,
    createdAt: "2026-08-22T08:30:00Z",
  },
  {
    id: "notif-2",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3", // Alex
    type: "PAYROLL_UPDATED",
    title: "Payslip Generated",
    message: "Your monthly salary breakdown for August 2026 is ready for download.",
    isRead: true,
    createdAt: "2026-08-22T07:00:00Z",
  },
  {
    id: "notif-3",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2", // Sarah HR
    type: "ATTENDANCE_ALERT",
    title: "High Attendance Today",
    message: "10 out of 11 team members have checked in today (91% Presence).",
    isRead: false,
    createdAt: "2026-08-22T09:15:00Z",
  },
];
