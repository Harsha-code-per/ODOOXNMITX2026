import {
  Employee,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  LeaveBalance,
  NotificationItem,
  UserSession,
  CompanyTenant,
  CompanyInquiry,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPANIES,
  INITIAL_INQUIRIES,
  DEMO_PERSONAS,
} from "./mock-data";
import { calculateSalaryStructure, calculatePayablePayout, SalaryComponents, PayableSalaryResult } from "./salary-calculator";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Helper to get / set state in localStorage for persistent mock demoing
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const val = localStorage.getItem(`dayflow_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`dayflow_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

export class DayflowApiClient {
  // ----------------------------------------------------------------------------
  // AUTH & SESSION
  // ----------------------------------------------------------------------------
  static async login(email: string, password: string): Promise<UserSession> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Authentication failed");
      }
      return await res.json();
    }

    // Mock Login
    await new Promise((r) => setTimeout(r, 400));

    // 1. Super Admin Platform Owner
    if (email.toLowerCase().includes("owner") || email.toLowerCase().includes("founder") || email.toLowerCase().includes("superadmin")) {
      return DEMO_PERSONAS.superadmin;
    }

    // 2. Newly provisioned temp admin or nexus temp admin
    if (email.toLowerCase().includes("nexus") || email.toLowerCase().includes("temp")) {
      return DEMO_PERSONAS.admin_temp;
    }

    const employees = getLocal<Employee[]>("employees", INITIAL_EMPLOYEES);
    const emp = employees.find((e) => e.email.toLowerCase() === email.toLowerCase());

    if (!emp) {
      // Check demo personas
      if (email.includes("admin")) return DEMO_PERSONAS.admin;
      if (email.includes("sarah") || email.includes("hr")) return DEMO_PERSONAS.sarah;
      return DEMO_PERSONAS.alex;
    }

    let role: "SUPER_ADMIN" | "ADMIN" | "HR" | "EMPLOYEE" = "EMPLOYEE";
    if (emp.department === "Management" || emp.employeeId === "EMP-001") role = "ADMIN";
    else if (emp.department === "Human Resources" || emp.employeeId === "EMP-002") role = "HR";

    return {
      id: emp.userId,
      email: emp.email,
      role,
      companyId: "comp-acme-001",
      companyName: "Acme Corporation",
      mustChangePassword: false,
      employee: emp,
      token: `mock-token-${emp.employeeId}`,
    };
  }

  static async resetPassword(email: string, newPassword: string): Promise<boolean> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      if (!res.ok) throw new Error("Password reset failed");
      return true;
    }

    await new Promise((r) => setTimeout(r, 500));
    return true;
  }

  // ----------------------------------------------------------------------------
  // SAAS CLIENT COMPANIES & PLATFORM SUPER ADMIN
  // ----------------------------------------------------------------------------
  static async getCompanies(): Promise<CompanyTenant[]> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/companies`);
      return await res.json();
    }
    return getLocal<CompanyTenant[]>("companies", INITIAL_COMPANIES);
  }

  static async provisionCompany(data: {
    name: string;
    domain: string;
    adminName: string;
    adminEmail: string;
    plan: "Starter" | "Growth" | "Enterprise";
  }): Promise<{ company: CompanyTenant; temporaryPassword: string }> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/companies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    }

    await new Promise((r) => setTimeout(r, 600));
    const companies = getLocal<CompanyTenant[]>("companies", INITIAL_COMPANIES);
    const newCompany: CompanyTenant = {
      id: `comp-${data.domain.split(".")[0]}-${Date.now().toString().slice(-3)}`,
      name: data.name,
      slug: data.domain.split(".")[0],
      domain: data.domain,
      plan: data.plan,
      adminName: data.adminName,
      adminEmail: data.adminEmail,
      employeeCount: 1,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    const updated = [newCompany, ...companies];
    setLocal("companies", updated);

    return {
      company: newCompany,
      temporaryPassword: `Dayflow@${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }

  static async getInquiries(): Promise<CompanyInquiry[]> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/inquiries`);
      return await res.json();
    }
    return getLocal<CompanyInquiry[]>("inquiries", INITIAL_INQUIRIES);
  }

  static async submitInquiry(
    inquiry: Omit<CompanyInquiry, "id" | "status" | "createdAt">
  ): Promise<CompanyInquiry> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiry),
      });
      return await res.json();
    }

    await new Promise((r) => setTimeout(r, 500));
    const list = getLocal<CompanyInquiry[]>("inquiries", INITIAL_INQUIRIES);
    const newInquiry: CompanyInquiry = {
      ...inquiry,
      id: `inq-${Date.now().toString().slice(-4)}`,
      status: "NEW",
      createdAt: new Date().toISOString(),
    };

    setLocal("inquiries", [newInquiry, ...list]);
    return newInquiry;
  }

  static async updateInquiryStatus(id: string, status: CompanyInquiry["status"]): Promise<void> {
    const list = getLocal<CompanyInquiry[]>("inquiries", INITIAL_INQUIRIES);
    const updated = list.map((i) => (i.id === id ? { ...i, status } : i));
    setLocal("inquiries", updated);
  }

  // ----------------------------------------------------------------------------
  // EMPLOYEES
  // ----------------------------------------------------------------------------
  static async getEmployees(): Promise<Employee[]> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/employees`);
      return await res.json();
    }
    return getLocal<Employee[]>("employees", INITIAL_EMPLOYEES);
  }

  static async getEmployeeById(idOrEmpId: string): Promise<Employee | null> {
    const list = await this.getEmployees();
    return list.find((e) => e.id === idOrEmpId || e.employeeId === idOrEmpId) || null;
  }

  static async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<Employee> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      return await res.json();
    }

    const list = getLocal<Employee[]>("employees", INITIAL_EMPLOYEES);
    const idx = list.findIndex((e) => e.id === employeeId || e.employeeId === employeeId);
    if (idx === -1) throw new Error("Employee not found");

    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    setLocal("employees", list);
    return updated;
  }

  static async createEmployee(
    emp: Omit<Employee, "id" | "userId" | "avatarUrl">
  ): Promise<{ employee: Employee; temporaryPassword: string }> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emp),
      });
      return await res.json();
    }

    const list = getLocal<Employee[]>("employees", INITIAL_EMPLOYEES);
    const newId = `bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb${list.length + 1}`;
    const newEmp: Employee = {
      ...emp,
      id: newId,
      userId: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa${list.length + 1}`,
      avatarUrl: "",
    };

    list.push(newEmp);
    setLocal("employees", list);

    return {
      employee: newEmp,
      temporaryPassword: `EmpPass@${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }

  // ----------------------------------------------------------------------------
  // ATTENDANCE
  // ----------------------------------------------------------------------------
  static async getAttendanceHistory(employeeId?: string): Promise<AttendanceRecord[]> {
    if (!USE_MOCK) {
      const url = employeeId
        ? `${API_BASE_URL}/attendance?employee_id=${employeeId}`
        : `${API_BASE_URL}/attendance`;
      const res = await fetch(url);
      return await res.json();
    }

    const list = getLocal<AttendanceRecord[]>("attendance", INITIAL_ATTENDANCE);
    if (employeeId) {
      return list.filter((a) => a.employeeId === employeeId);
    }
    return list;
  }

  static async checkIn(employeeId: string, notes?: string): Promise<AttendanceRecord> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/attendance/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId, notes }),
      });
      return await res.json();
    }

    const list = getLocal<AttendanceRecord[]>("attendance", INITIAL_ATTENDANCE);
    const todayStr = new Date().toISOString().split("T")[0];
    const nowIso = new Date().toISOString();

    const existingIdx = list.findIndex(
      (a) => a.employeeId === employeeId && a.workDate === todayStr
    );

    if (existingIdx !== -1) {
      list[existingIdx].checkIn = nowIso;
      list[existingIdx].status = "PRESENT";
      if (notes) list[existingIdx].notes = notes;
      setLocal("attendance", list);
      return list[existingIdx];
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      workDate: todayStr,
      checkIn: nowIso,
      checkOut: null,
      totalHours: 0,
      status: "PRESENT",
      notes,
    };

    list.unshift(newRecord);
    setLocal("attendance", list);
    return newRecord;
  }

  static async checkOut(employeeId: string): Promise<AttendanceRecord> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/attendance/check-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_id: employeeId }),
      });
      return await res.json();
    }

    const list = getLocal<AttendanceRecord[]>("attendance", INITIAL_ATTENDANCE);
    const todayStr = new Date().toISOString().split("T")[0];
    const now = new Date();

    const idx = list.findIndex(
      (a) => a.employeeId === employeeId && a.workDate === todayStr
    );

    if (idx === -1 || !list[idx].checkIn) {
      throw new Error("Cannot check out without active check-in today");
    }

    const checkInTime = new Date(list[idx].checkIn!);
    const diffHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    list[idx].checkOut = now.toISOString();
    list[idx].totalHours = Math.max(0.1, Number(diffHours.toFixed(2)));
    list[idx].status = diffHours < 4.5 ? "HALF_DAY" : "PRESENT";

    setLocal("attendance", list);
    return list[idx];
  }

  static async updateAttendanceStatus(
    id: string,
    status: AttendanceStatus,
    hours?: number,
    notes?: string
  ): Promise<AttendanceRecord> {
    const list = getLocal<AttendanceRecord[]>("attendance", INITIAL_ATTENDANCE);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("Attendance record not found");

    list[idx].status = status;
    if (hours !== undefined) list[idx].totalHours = hours;
    if (notes !== undefined) list[idx].notes = notes;
    setLocal("attendance", list);
    return list[idx];
  }

  // ----------------------------------------------------------------------------
  // LEAVES
  // ----------------------------------------------------------------------------
  static async getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
    if (!USE_MOCK) {
      const url = employeeId
        ? `${API_BASE_URL}/leaves?employee_id=${employeeId}`
        : `${API_BASE_URL}/leaves`;
      const res = await fetch(url);
      return await res.json();
    }

    const list = getLocal<LeaveRequest[]>("leaves", INITIAL_LEAVE_REQUESTS);
    if (employeeId) {
      return list.filter((l) => l.employeeId === employeeId);
    }
    return list;
  }

  static async createLeaveRequest(
    req: Omit<LeaveRequest, "id" | "status" | "createdAt">
  ): Promise<LeaveRequest> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      return await res.json();
    }

    const list = getLocal<LeaveRequest[]>("leaves", INITIAL_LEAVE_REQUESTS);
    const newReq: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    list.unshift(newReq);
    setLocal("leaves", list);
    return newReq;
  }

  static async applyLeave(
    req: Omit<LeaveRequest, "id" | "status" | "createdAt">
  ): Promise<LeaveRequest> {
    return this.createLeaveRequest(req);
  }

  static async reviewLeaveRequest(
    leaveId: string,
    status: "APPROVED" | "REJECTED",
    hrComments?: string,
    reviewedBy?: string
  ): Promise<LeaveRequest> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/leaves/${leaveId}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, hr_comments: hrComments, reviewed_by: reviewedBy }),
      });
      return await res.json();
    }

    const list = getLocal<LeaveRequest[]>("leaves", INITIAL_LEAVE_REQUESTS);
    const idx = list.findIndex((l) => l.id === leaveId);
    if (idx === -1) throw new Error("Leave request not found");

    list[idx].status = status;
    list[idx].hrComments = hrComments;
    list[idx].reviewedBy = reviewedBy || "HR Officer";
    list[idx].reviewedAt = new Date().toISOString();

    setLocal("leaves", list);
    return list[idx];
  }

  static async reviewLeave(
    leaveId: string,
    status: "APPROVED" | "REJECTED",
    hrComments?: string,
    reviewedBy?: string
  ): Promise<LeaveRequest> {
    return this.reviewLeaveRequest(leaveId, status, hrComments, reviewedBy);
  }

  static async getLeaveBalance(employeeId: string): Promise<Record<string, LeaveBalance>> {
    const requests = await this.getLeaveRequests(employeeId);
    const approved = requests.filter((r) => r.status === "APPROVED");

    const usedPaid = approved.filter((r) => r.leaveType === "PAID").reduce((s, r) => s + r.totalDays, 0);
    const usedSick = approved.filter((r) => r.leaveType === "SICK").reduce((s, r) => s + r.totalDays, 0);
    const usedCasual = approved.filter((r) => r.leaveType === "CASUAL").reduce((s, r) => s + r.totalDays, 0);

    return {
      PAID: { allocated: 15, used: usedPaid, remaining: Math.max(0, 15 - usedPaid) },
      SICK: { allocated: 10, used: usedSick, remaining: Math.max(0, 10 - usedSick) },
      CASUAL: { allocated: 7, used: usedCasual, remaining: Math.max(0, 7 - usedCasual) },
    };
  }

  static async getLeaveBalances(employeeId: string): Promise<Record<string, LeaveBalance>> {
    return this.getLeaveBalance(employeeId);
  }

  // ----------------------------------------------------------------------------
  // PAYROLL & WAGE DYNAMICS
  // ----------------------------------------------------------------------------
  static calculateSalary(monthlyWage: number): SalaryComponents {
    return calculateSalaryStructure(monthlyWage);
  }

  static async getEmployeeMonthlyPayout(employeeId: string, month = 8, year = 2026): Promise<PayableSalaryResult> {
    const emp = await this.getEmployeeById(employeeId);
    if (!emp) throw new Error("Employee not found");

    const attendance = await this.getAttendanceHistory(employeeId);
    const leaves = await this.getLeaveRequests(employeeId);

    const presentDays = attendance.filter((a) => a.status === "PRESENT").length || 20;
    const halfDays = attendance.filter((a) => a.status === "HALF_DAY").length || 1;
    const effectivePresent = presentDays + halfDays * 0.5;

    const approvedPaidLeaves = leaves
      .filter((l) => l.status === "APPROVED" && l.leaveType !== "UNPAID")
      .reduce((sum, l) => sum + l.totalDays, 0);

    const salaryStructure = calculateSalaryStructure(emp.wage);

    return calculatePayablePayout(
      salaryStructure.netSalary,
      22,
      effectivePresent,
      approvedPaidLeaves
    );
  }

  static async getEmployeePayroll(
    employeeId: string,
    month = 8,
    year = 2026
  ): Promise<{ structure: SalaryComponents; payableSummary: PayableSalaryResult }> {
    const emp = await this.getEmployeeById(employeeId);
    if (!emp) throw new Error("Employee not found");

    const attendance = await this.getAttendanceHistory(employeeId);
    const leaves = await this.getLeaveRequests(employeeId);

    const presentDays = attendance.filter((a) => a.status === "PRESENT").length || 20;
    const halfDays = attendance.filter((a) => a.status === "HALF_DAY").length || 1;
    const effectivePresent = presentDays + halfDays * 0.5;

    const approvedPaidLeaves = leaves
      .filter((l) => l.status === "APPROVED" && l.leaveType !== "UNPAID")
      .reduce((sum, l) => sum + l.totalDays, 0);

    const structure = calculateSalaryStructure(emp.wage);
    const payableSummary = calculatePayablePayout(
      structure.netSalary,
      22,
      effectivePresent,
      approvedPaidLeaves
    );

    return { structure, payableSummary };
  }

  static async updateEmployeeWage(employeeId: string, newWage: number): Promise<Employee> {
    return this.updateEmployee(employeeId, { wage: newWage });
  }

  // ----------------------------------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------------------------------
  static async getNotifications(): Promise<NotificationItem[]> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/notifications`);
      return await res.json();
    }
    return getLocal<NotificationItem[]>("notifications", INITIAL_NOTIFICATIONS);
  }

  static async markNotificationRead(id: string): Promise<void> {
    if (!USE_MOCK) {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: "PUT" });
      return;
    }
    const list = getLocal<NotificationItem[]>("notifications", INITIAL_NOTIFICATIONS);
    const idx = list.findIndex((n) => n.id === id);
    if (idx !== -1) {
      list[idx].isRead = true;
      setLocal("notifications", list);
    }
  }

  // ----------------------------------------------------------------------------
  // ANALYTICS
  // ----------------------------------------------------------------------------
  static async getAnalyticsSummary() {
    const employees = await this.getEmployees();
    const attendance = await this.getAttendanceHistory();
    const leaves = await this.getLeaveRequests();

    const todayStr = new Date().toISOString().split("T")[0];
    const todayRecords = attendance.filter((a) => a.workDate === todayStr);

    const presentCount = todayRecords.filter((a) => a.status === "PRESENT").length;
    const onLeaveCount = employees.filter((e) => e.status === "ON_LEAVE").length;
    const absentCount = Math.max(0, employees.length - presentCount - onLeaveCount);
    const pendingLeaves = leaves.filter((l) => l.status === "PENDING").length;

    const totalMonthlyPayroll = employees.reduce((sum, e) => sum + e.wage, 0);

    // Group by department
    const deptMap: Record<string, { count: number; payroll: number }> = {};
    employees.forEach((e) => {
      if (!deptMap[e.department]) {
        deptMap[e.department] = { count: 0, payroll: 0 };
      }
      deptMap[e.department].count += 1;
      deptMap[e.department].payroll += e.wage;
    });

    const departmentDistribution = Object.entries(deptMap).map(([name, val]) => ({
      name,
      count: val.count,
      payroll: val.payroll,
    }));

    return {
      metrics: {
        totalEmployees: employees.length,
        presentToday: presentCount || 10,
        absentToday: absentCount || 1,
        onLeaveToday: onLeaveCount || 1,
        pendingLeaves,
        attendanceRate: Math.round(((presentCount || 10) / employees.length) * 100),
        monthlyPayrollTotal: totalMonthlyPayroll,
      },
      departmentDistribution,
      attendanceTrends: [
        { date: "Mon", present: 11, absent: 0, leave: 0 },
        { date: "Tue", present: 10, absent: 1, leave: 0 },
        { date: "Wed", present: 11, absent: 0, leave: 0 },
        { date: "Thu", present: 10, absent: 0, leave: 1 },
        { date: "Fri", present: 9, absent: 1, leave: 1 },
      ],
    };
  }
}
