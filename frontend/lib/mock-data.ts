import { calculateSalaryStructure, calculatePayablePayout, SalaryComponents, PayableSalaryResult } from "./salary-calculator";

export type Role = "ADMIN" | "HR" | "EMPLOYEE";
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

export interface UserSession {
  id: string;
  email: string;
  role: Role;
  employee: Employee;
  token: string;
}

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
    email: "admin@dayflow.io",
    phone: "+1 555-0101",
    department: "Management",
    designation: "Chief Executive Officer",
    joiningDate: "2022-01-15",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    address: "100 Silicon Ave, San Francisco, CA",
    emergencyContact: { name: "Mary Morgan", relationship: "Spouse", phone: "+1 555-0102" },
    wage: 120000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    employeeId: "EMP-002",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.hr@dayflow.io",
    phone: "+1 555-0201",
    department: "Human Resources",
    designation: "HR Director",
    joiningDate: "2022-03-01",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    address: "250 Market St, San Francisco, CA",
    emergencyContact: { name: "Tom Jenkins", relationship: "Spouse", phone: "+1 555-0202" },
    wage: 90000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
    employeeId: "EMP-003",
    firstName: "Alex",
    lastName: "Rivera",
    email: "alex.rivera@dayflow.io",
    phone: "+1 555-0301",
    department: "Engineering",
    designation: "Senior Full Stack Engineer",
    joiningDate: "2023-02-10",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    address: "450 Pine Street, Berkeley, CA",
    emergencyContact: { name: "Maria Rivera", relationship: "Sister", phone: "+1 555-0302" },
    wage: 75000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4",
    employeeId: "EMP-004",
    firstName: "Elena",
    lastName: "Rostova",
    email: "elena.rostova@dayflow.io",
    phone: "+1 555-0401",
    department: "Engineering",
    designation: "Staff Frontend Architect",
    joiningDate: "2023-04-15",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    address: "88 Valencia St, San Francisco, CA",
    emergencyContact: { name: "Dmitri Rostov", relationship: "Brother", phone: "+1 555-0402" },
    wage: 85000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5",
    employeeId: "EMP-005",
    firstName: "David",
    lastName: "Chen",
    email: "david.chen@dayflow.io",
    phone: "+1 555-0501",
    department: "Engineering",
    designation: "DevOps & Cloud Lead",
    joiningDate: "2023-06-01",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    address: "12 Folsom St, San Francisco, CA",
    emergencyContact: { name: "Grace Chen", relationship: "Mother", phone: "+1 555-0502" },
    wage: 70000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6",
    employeeId: "EMP-006",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@dayflow.io",
    phone: "+1 555-0601",
    department: "Engineering",
    designation: "Backend Engineer",
    joiningDate: "2023-09-01",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1534751516642-a171edd29974?w=150",
    address: "310 Bryant St, Palo Alto, CA",
    emergencyContact: { name: "Raj Sharma", relationship: "Father", phone: "+1 555-0602" },
    wage: 55000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb7",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa7",
    employeeId: "EMP-007",
    firstName: "Marcus",
    lastName: "Vance",
    email: "marcus.vance@dayflow.io",
    phone: "+1 555-0701",
    department: "Product",
    designation: "Principal Product Manager",
    joiningDate: "2022-11-15",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    address: "520 Howard St, San Francisco, CA",
    emergencyContact: { name: "Lisa Vance", relationship: "Spouse", phone: "+1 555-0702" },
    wage: 80000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb8",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa8",
    employeeId: "EMP-008",
    firstName: "Chloe",
    lastName: "Dupont",
    email: "chloe.dupont@dayflow.io",
    phone: "+1 555-0801",
    department: "Product",
    designation: "Lead UI/UX Designer",
    joiningDate: "2023-01-10",
    status: "ON_LEAVE",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    address: "710 Mission St, San Francisco, CA",
    emergencyContact: { name: "Jean Dupont", relationship: "Brother", phone: "+1 555-0802" },
    wage: 65000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb9",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa9",
    employeeId: "EMP-009",
    firstName: "Jordan",
    lastName: "Bell",
    email: "jordan.bell@dayflow.io",
    phone: "+1 555-0901",
    department: "Sales",
    designation: "VP of Enterprise Sales",
    joiningDate: "2022-08-01",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    address: "900 Sutter St, San Francisco, CA",
    emergencyContact: { name: "Karen Bell", relationship: "Spouse", phone: "+1 555-0902" },
    wage: 95000,
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb10",
    userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa10",
    employeeId: "EMP-010",
    firstName: "Aisha",
    lastName: "Khan",
    email: "aisha.khan@dayflow.io",
    phone: "+1 555-1001",
    department: "Marketing",
    designation: "Growth & Brand Specialist",
    joiningDate: "2023-11-01",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
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
    email: "liam.nelson@dayflow.io",
    phone: "+1 555-1101",
    department: "Finance",
    designation: "Financial Controller",
    joiningDate: "2022-05-15",
    status: "ACTIVE",
    avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
    address: "320 Bush St, San Francisco, CA",
    emergencyContact: { name: "Anna Nelson", relationship: "Spouse", phone: "+1 555-1102" },
    wage: 82000,
  },
];

// ------------------------------------------------------------------------------
// PRE-SET JUDGE DEMO PERSONAS
// ------------------------------------------------------------------------------

export const DEMO_PERSONAS: Record<string, UserSession> = {
  alex: {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
    email: "alex.rivera@dayflow.io",
    role: "EMPLOYEE",
    employee: INITIAL_EMPLOYEES[2], // Alex Rivera
    token: "mock-jwt-alex-rivera-employee",
  },
  sarah: {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    email: "sarah.hr@dayflow.io",
    role: "HR",
    employee: INITIAL_EMPLOYEES[1], // Sarah Jenkins
    token: "mock-jwt-sarah-jenkins-hr",
  },
  admin: {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
    email: "admin@dayflow.io",
    role: "ADMIN",
    employee: INITIAL_EMPLOYEES[0], // Arthur Morgan
    token: "mock-jwt-arthur-morgan-admin",
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
    notes: "Checked in for hackathon demo",
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
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
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
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
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
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
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
