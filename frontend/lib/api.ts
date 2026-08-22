import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  NotificationItem,
  UserSession,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_NOTIFICATIONS,
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
  // AUTH
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
    const employees = getLocal<Employee[]>("employees", INITIAL_EMPLOYEES);
    const emp = employees.find((e) => e.email.toLowerCase() === email.toLowerCase());

    if (!emp) {
      // Check demo personas
      if (email.includes("admin")) return DEMO_PERSONAS.admin;
      if (email.includes("sarah") || email.includes("hr")) return DEMO_PERSONAS.sarah;
      return DEMO_PERSONAS.alex;
    }

    let role: "ADMIN" | "HR" | "EMPLOYEE" = "EMPLOYEE";
    if (emp.department === "Management" || emp.employeeId === "EMP-001") role = "ADMIN";
    else if (emp.department === "Human Resources" || emp.employeeId === "EMP-002") role = "HR";

    return {
      id: emp.userId,
      email: emp.email,
      role,
      employee: emp,
      token: `mock-token-${emp.employeeId}`,
    };
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
    const index = list.findIndex((e) => e.employeeId === employeeId || e.id === employeeId);
    if (index === -1) throw new Error("Employee not found");

    list[index] = { ...list[index], ...updates };
    setLocal("employees", list);
    return list[index];
  }

  // ----------------------------------------------------------------------------
  // ATTENDANCE
  // ----------------------------------------------------------------------------
  static async checkIn(employeeId: string, notes?: string): Promise<AttendanceRecord> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/attendance/check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      return await res.json();
    }

    const records = getLocal<AttendanceRecord[]>("attendance", INITIAL_ATTENDANCE);
    const todayStr = new Date().toISOString().split("T")[0];
    const existing = records.find((r) => r.employeeId === employeeId && r.workDate === todayStr);

    if (existing && existing.checkIn) {
      return existing; // Already checked in
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      workDate: todayStr,
      checkIn: new Date().toISOString(),
      checkOut: null,
      totalHours: 0,
      status: "PRESENT",
      notes: notes || "Checked in via Dayflow Portal",
    };

    const updated = [newRecord, ...records.filter((r) => !(r.employeeId === employeeId && r.workDate === todayStr))];
    setLocal("attendance", updated);
    return newRecord;
  }

  static async checkOut(employeeId: string): Promise<AttendanceRecord> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/attendance/check-out`, { method: "POST" });
      return await res.json();
    }

    const records = getLocal<AttendanceRecord[]>("attendance", INITIAL_ATTENDANCE);
    const todayStr = new Date().toISOString().split("T")[0];
    const index = records.findIndex((r) => r.employeeId === employeeId && r.workDate === todayStr);

    if (index === -1) throw new Error("No check-in record found for today");

    const record = records[index];
    const checkOutTime = new Date().toISOString();
    const checkInDate = record.checkIn ? new Date(record.checkIn) : new Date();
    const durationHours = Math.max(0.1, (new Date(checkOutTime).getTime() - checkInDate.getTime()) / (1000 * 60 * 60));

    records[index] = {
      ...record,
      checkOut: checkOutTime,
      totalHours: Math.round(durationHours * 100) / 100,
    };

    setLocal("attendance", records);
    return records[index];
  }

  static async getAttendanceHistory(employeeId?: string): Promise<AttendanceRecord[]> {
    const records = getLocal<AttendanceRecord[]>("attendance", INITIAL_ATTENDANCE);
    if (!employeeId) return records;
    return records.filter((r) => r.employeeId === employeeId);
  }

  static async updateAttendanceStatus(recordId: string, status: AttendanceRecord["status"], totalHours?: number): Promise<AttendanceRecord> {
    const records = getLocal<AttendanceRecord[]>("attendance", INITIAL_ATTENDANCE);
    const index = records.findIndex((r) => r.id === recordId);
    if (index === -1) throw new Error("Record not found");

    records[index] = {
      ...records[index],
      status,
      totalHours: totalHours !== undefined ? totalHours : records[index].totalHours,
    };

    setLocal("attendance", records);
    return records[index];
  }

  // ----------------------------------------------------------------------------
  // LEAVES
  // ----------------------------------------------------------------------------
  static async getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
    const requests = getLocal<LeaveRequest[]>("leave_requests", INITIAL_LEAVE_REQUESTS);
    if (!employeeId) return requests;
    return requests.filter((r) => r.employeeId === employeeId);
  }

  static async applyLeave(request: Omit<LeaveRequest, "id" | "status" | "createdAt">): Promise<LeaveRequest> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/leaves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      return await res.json();
    }

    const requests = getLocal<LeaveRequest[]>("leave_requests", INITIAL_LEAVE_REQUESTS);
    const newReq: LeaveRequest = {
      ...request,
      id: `leave-${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };

    const updated = [newReq, ...requests];
    setLocal("leave_requests", updated);

    // Also dispatch notification to HR
    const notifs = getLocal<NotificationItem[]>("notifications", INITIAL_NOTIFICATIONS);
    notifs.unshift({
      id: `notif-${Date.now()}`,
      userId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
      type: "LEAVE_SUBMITTED",
      title: `New Leave Request from ${request.employeeName}`,
      message: `${request.totalDays} day(s) ${request.leaveType} leave request for review.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
    setLocal("notifications", notifs);

    return newReq;
  }

  static async reviewLeave(leaveId: string, status: "APPROVED" | "REJECTED", hrComments: string, reviewerName: string): Promise<LeaveRequest> {
    if (!USE_MOCK) {
      const action = status.toLowerCase();
      const res = await fetch(`${API_BASE_URL}/leaves/${leaveId}/${action}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hr_comments: hrComments }),
      });
      return await res.json();
    }

    const requests = getLocal<LeaveRequest[]>("leave_requests", INITIAL_LEAVE_REQUESTS);
    const index = requests.findIndex((r) => r.id === leaveId);
    if (index === -1) throw new Error("Leave request not found");

    requests[index] = {
      ...requests[index],
      status,
      hrComments,
      reviewedBy: reviewerName,
      reviewedAt: new Date().toISOString(),
    };
    setLocal("leave_requests", requests);

    // If approved, also flag employee status & add attendance placeholders
    if (status === "APPROVED") {
      const employees = getLocal<Employee[]>("employees", INITIAL_EMPLOYEES);
      const empIndex = employees.findIndex((e) => e.id === requests[index].employeeId);
      if (empIndex !== -1) {
        employees[empIndex].status = "ON_LEAVE";
        setLocal("employees", employees);
      }
    }

    return requests[index];
  }

  static async getLeaveBalances(employeeId: string): Promise<Record<string, LeaveBalance>> {
    const requests = await this.getLeaveRequests(employeeId);
    const approved = requests.filter((r) => r.status === "APPROVED");

    const usedPaid = approved.filter((r) => r.leaveType === "PAID").reduce((sum, r) => sum + r.totalDays, 0);
    const usedSick = approved.filter((r) => r.leaveType === "SICK").reduce((sum, r) => sum + r.totalDays, 0);
    const usedCasual = approved.filter((r) => r.leaveType === "CASUAL").reduce((sum, r) => sum + r.totalDays, 0);
    const usedUnpaid = approved.filter((r) => r.leaveType === "UNPAID").reduce((sum, r) => sum + r.totalDays, 0);

    return {
      PAID: { allocated: 18, used: usedPaid, remaining: Math.max(0, 18 - usedPaid) },
      SICK: { allocated: 10, used: usedSick, remaining: Math.max(0, 10 - usedSick) },
      CASUAL: { allocated: 6, used: usedCasual, remaining: Math.max(0, 6 - usedCasual) },
      UNPAID: { allocated: 0, used: usedUnpaid, remaining: 0 },
    };
  }

  // ----------------------------------------------------------------------------
  // PAYROLL & SALARY ENGINE
  // ----------------------------------------------------------------------------
  static async getEmployeePayroll(employeeId: string): Promise<{
    employee: Employee;
    structure: SalaryComponents;
    payableSummary: PayableSalaryResult;
  }> {
    const employee = await this.getEmployeeById(employeeId);
    if (!employee) throw new Error("Employee not found");

    const structure = calculateSalaryStructure(employee.wage);
    const payableSummary = calculatePayablePayout(structure.netSalary, 22, 20, 2);

    return { employee, structure, payableSummary };
  }

  static async updateEmployeeWage(employeeId: string, newWage: number): Promise<SalaryComponents> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/admin/payroll/${employeeId}/salary`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wage: newWage }),
      });
      return await res.json();
    }

    const employees = getLocal<Employee[]>("employees", INITIAL_EMPLOYEES);
    const index = employees.findIndex((e) => e.employeeId === employeeId || e.id === employeeId);
    if (index === -1) throw new Error("Employee not found");

    employees[index].wage = newWage;
    setLocal("employees", employees);

    return calculateSalaryStructure(newWage);
  }

  // ----------------------------------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------------------------------
  static async getNotifications(): Promise<NotificationItem[]> {
    return getLocal<NotificationItem[]>("notifications", INITIAL_NOTIFICATIONS);
  }

  static async markNotificationRead(id: string): Promise<void> {
    const notifs = getLocal<NotificationItem[]>("notifications", INITIAL_NOTIFICATIONS);
    const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setLocal("notifications", updated);
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
