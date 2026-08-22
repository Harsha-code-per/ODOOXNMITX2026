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

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Helper to get active authentication token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("dayflow_active_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.token || parsed.access_token || null;
    }
  } catch {}
  return null;
}

function getAuthHeaders(extraHeaders: Record<string, string> = {}): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

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

// Data Mappers: Backend (snake_case) <-> Frontend (camelCase)
function mapEmployeeFromBackend(e: any): Employee {
  return {
    id: e.id,
    userId: e.user_id || e.userId || e.id,
    employeeId: e.employee_id || e.employeeId || "",
    firstName: e.first_name || e.firstName || "",
    lastName: e.last_name || e.lastName || "",
    email: e.email || "",
    phone: e.phone || "",
    department: e.department || "",
    designation: e.designation || "",
    joiningDate: e.joining_date || e.joiningDate || "2026-01-01",
    status: e.status || "ACTIVE",
    avatarUrl: e.avatar_url || e.avatarUrl || "",
    address: e.address || "",
    emergencyContact: e.emergency_contact || e.emergencyContact || { name: "", relationship: "", phone: "" },
    wage: e.wage || 0,
  };
}

function mapAttendanceFromBackend(a: any): AttendanceRecord {
  return {
    id: a.id,
    employeeId: a.employee_id || a.employeeId || "",
    workDate: a.work_date || a.workDate || new Date().toISOString().split("T")[0],
    checkIn: a.check_in || a.checkIn || null,
    checkOut: a.check_out || a.checkOut || null,
    totalHours: typeof a.total_hours === "number" ? a.total_hours : (a.totalHours || 0),
    status: a.status || "PRESENT",
    notes: a.notes || undefined,
  };
}

function mapLeaveFromBackend(l: any): LeaveRequest {
  return {
    id: l.id,
    employeeId: l.employee_id || l.employeeId || "",
    employeeName: l.employee_name || l.employeeName || "Employee",
    department: l.department || "",
    avatarUrl: l.avatar_url || l.avatarUrl || "",
    leaveType: l.leave_type || l.leaveType || "PAID",
    startDate: l.start_date || l.startDate || "",
    endDate: l.end_date || l.endDate || "",
    totalDays: l.total_days || l.totalDays || 1,
    reason: l.reason || "",
    status: l.status || "PENDING",
    hrComments: l.hr_comments || l.hrComments || undefined,
    reviewedBy: l.reviewed_by || l.reviewedBy || undefined,
    reviewedAt: l.reviewed_at || l.reviewedAt || undefined,
    createdAt: l.created_at || l.createdAt || new Date().toISOString(),
  };
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
        const err = await res.json().catch(() => ({ detail: "Authentication failed" }));
        throw new Error(err.detail || "Authentication failed");
      }
      const data = await res.json();
      const u = data.user;
      const empData = u.employee;
      const emp: Employee = empData ? {
        id: empData.id,
        userId: u.id,
        employeeId: empData.employee_id || "EMP-001",
        firstName: empData.first_name || u.email.split("@")[0],
        lastName: empData.last_name || "",
        email: u.email,
        phone: empData.phone || "",
        department: empData.department || "Management",
        designation: empData.designation || u.role,
        joiningDate: empData.joining_date || "2026-01-01",
        status: empData.status || "ACTIVE",
        avatarUrl: empData.avatar_url || "",
        address: empData.address || "",
        emergencyContact: empData.emergency_contact || { name: "", relationship: "", phone: "" },
        wage: empData.wage || 60000,
      } : {
        id: u.id,
        userId: u.id,
        employeeId: "EMP-001",
        firstName: u.email.split("@")[0],
        lastName: "",
        email: u.email,
        phone: "",
        department: "Management",
        designation: u.role,
        joiningDate: "2026-01-01",
        status: "ACTIVE",
        avatarUrl: "",
        address: "",
        emergencyContact: { name: "", relationship: "", phone: "" },
        wage: 60000,
      };

      const session: UserSession = {
        id: u.id,
        email: u.email,
        role: u.role,
        companyId: u.company_id,
        companyName: u.company_name || "Dayflow Technologies Inc.",
        mustChangePassword: data.must_reset_password ?? u.must_reset_password ?? false,
        employee: emp,
        token: data.access_token || data.token,
      };
      return session;
    }

    // Mock Login
    await new Promise((r) => setTimeout(r, 400));

    if (email.toLowerCase().includes("owner") || email.toLowerCase().includes("founder") || email.toLowerCase().includes("superadmin")) {
      return DEMO_PERSONAS.superadmin;
    }
    if (email.toLowerCase().includes("nexus") || email.toLowerCase().includes("temp")) {
      return DEMO_PERSONAS.admin_temp;
    }

    const employees = getLocal<Employee[]>("employees", INITIAL_EMPLOYEES);
    const emp = employees.find((e) => e.email.toLowerCase() === email.toLowerCase());

    if (!emp) {
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

  static async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Password change failed" }));
        throw new Error(err.detail || "Password change failed");
      }
      return true;
    }

    await new Promise((r) => setTimeout(r, 400));
    return true;
  }

  static async resetPassword(email: string, newPassword: string): Promise<boolean> {
    return this.changePassword("password123", newPassword);
  }

  // ----------------------------------------------------------------------------
  // SAAS CLIENT COMPANIES & PLATFORM SUPER ADMIN
  // ----------------------------------------------------------------------------
  static async getCompanies(): Promise<CompanyTenant[]> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/super-admin/companies`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to fetch companies" }));
        throw new Error(err.detail || "Failed to fetch companies");
      }
      const data = await res.json();
      return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        domain: c.domain || `${c.slug}.com`,
        plan: c.plan || "Growth",
        adminName: c.adminName || c.admin_name || "Admin",
        adminEmail: c.adminEmail || c.admin_email || "",
        employeeCount: c.employeeCount !== undefined ? c.employeeCount : (c.employee_count || 1),
        status: c.status || "ACTIVE",
        createdAt: c.createdAt || c.created_at || new Date().toISOString(),
      }));
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
      const res = await fetch(`${API_BASE_URL}/super-admin/companies`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: data.name,
          domain: data.domain,
          adminName: data.adminName,
          adminEmail: data.adminEmail,
          plan: data.plan,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to provision company" }));
        throw new Error(err.detail || "Failed to provision company");
      }
      const result = await res.json();
      const c = result.company;
      const mappedCompany: CompanyTenant = {
        id: c.id,
        name: c.name,
        slug: c.slug,
        domain: c.domain || `${c.slug}.com`,
        plan: c.plan || data.plan,
        adminName: c.adminName || c.admin_name || data.adminName,
        adminEmail: c.adminEmail || c.admin_email || data.adminEmail,
        employeeCount: c.employeeCount !== undefined ? c.employeeCount : 1,
        status: c.status || "ACTIVE",
        createdAt: c.createdAt || c.created_at || new Date().toISOString(),
      };
      return {
        company: mappedCompany,
        temporaryPassword: result.temporaryPassword || result.temporary_password,
      };
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
      const res = await fetch(`${API_BASE_URL}/super-admin/inquiries`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to fetch inquiries" }));
        throw new Error(err.detail || "Failed to fetch inquiries");
      }
      const data = await res.json();
      return data.map((i: any) => ({
        id: i.id,
        companyName: i.companyName || i.company_name,
        contactName: i.contactName || i.contact_name,
        workEmail: i.workEmail || i.work_email,
        phone: i.phone || "",
        teamSize: i.teamSize || i.team_size || "25-50",
        planInterest: i.planInterest || i.plan_interest || "Growth",
        message: i.message || "",
        status: i.status || "NEW",
        createdAt: i.createdAt || i.created_at || new Date().toISOString(),
      }));
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
        body: JSON.stringify({
          companyName: inquiry.companyName,
          contactName: inquiry.contactName,
          workEmail: inquiry.workEmail,
          phone: inquiry.phone,
          teamSize: inquiry.teamSize,
          planInterest: inquiry.planInterest,
          message: inquiry.message,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to submit inquiry" }));
        throw new Error(err.detail || "Failed to submit inquiry");
      }
      const data = await res.json();
      return {
        id: data.id,
        companyName: data.companyName || data.company_name,
        contactName: data.contactName || data.contact_name,
        workEmail: data.workEmail || data.work_email,
        phone: data.phone || "",
        teamSize: data.teamSize || data.team_size,
        planInterest: data.planInterest || data.plan_interest,
        message: data.message || "",
        status: data.status || "NEW",
        createdAt: data.createdAt || data.created_at || new Date().toISOString(),
      };
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
    if (!USE_MOCK) {
      await fetch(`${API_BASE_URL}/super-admin/inquiries/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return;
    }
    const list = getLocal<CompanyInquiry[]>("inquiries", INITIAL_INQUIRIES);
    const updated = list.map((i) => (i.id === id ? { ...i, status } : i));
    setLocal("inquiries", updated);
  }

  // ----------------------------------------------------------------------------
  // EMPLOYEES
  // ----------------------------------------------------------------------------
  static async getEmployees(department?: string, status?: string): Promise<Employee[]> {
    if (!USE_MOCK) {
      let url = `${API_BASE_URL}/employees`;
      const params = new URLSearchParams();
      if (department && department !== "all") params.append("department", department);
      if (status && status !== "all") params.append("status", status);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to fetch employees" }));
        throw new Error(err.detail || "Failed to fetch employees");
      }
      const data = await res.json();
      return data.map(mapEmployeeFromBackend);
    }
    return getLocal<Employee[]>("employees", INITIAL_EMPLOYEES);
  }

  static async getEmployeeById(idOrEmpId: string): Promise<Employee | null> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/employees/${idOrEmpId}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch employee");
      }
      const data = await res.json();
      return mapEmployeeFromBackend(data);
    }
    const list = await this.getEmployees();
    return list.find((e) => e.id === idOrEmpId || e.employeeId === idOrEmpId) || null;
  }

  static async updateEmployee(employeeId: string, updates: Partial<Employee>): Promise<Employee> {
    if (!USE_MOCK) {
      const payload: Record<string, any> = {};
      if (updates.firstName !== undefined) payload.first_name = updates.firstName;
      if (updates.lastName !== undefined) payload.last_name = updates.lastName;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.department !== undefined) payload.department = updates.department;
      if (updates.designation !== undefined) payload.designation = updates.designation;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
      if (updates.address !== undefined) payload.address = updates.address;
      if (updates.emergencyContact !== undefined) payload.emergency_contact = updates.emergencyContact;
      if (updates.wage !== undefined) payload.wage = updates.wage;

      const res = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Update failed" }));
        throw new Error(err.detail || "Update failed");
      }
      const data = await res.json();
      return mapEmployeeFromBackend(data);
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
    const tempPassword = `EmpPass@${Math.floor(1000 + Math.random() * 9000)}`;

    if (!USE_MOCK) {
      const payload = {
        email: emp.email.toLowerCase(),
        password: tempPassword,
        role: emp.department === "Human Resources" ? "HR" : "EMPLOYEE",
        first_name: emp.firstName,
        last_name: emp.lastName,
        employee_id: emp.employeeId,
        department: emp.department,
        designation: emp.designation,
        phone: emp.phone || "",
        wage: emp.wage || 60000,
      };

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Registration failed" }));
        throw new Error(err.detail || "Failed to onboard employee");
      }

      const regData = await res.json();
      const createdEmp: Employee = {
        ...emp,
        id: regData.user_id || `emp-${Date.now()}`,
        userId: regData.user_id || "",
        avatarUrl: "",
      };

      return {
        employee: createdEmp,
        temporaryPassword: tempPassword,
      };
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
      temporaryPassword: tempPassword,
    };
  }

  // ----------------------------------------------------------------------------
  // ATTENDANCE
  // ----------------------------------------------------------------------------
  static async getAttendanceHistory(employeeId?: string): Promise<AttendanceRecord[]> {
    if (!USE_MOCK) {
      let url = `${API_BASE_URL}/attendance`;
      if (employeeId) {
        url = `${API_BASE_URL}/attendance/${employeeId}`;
      }

      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to fetch attendance" }));
        throw new Error(err.detail || "Failed to fetch attendance");
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(mapAttendanceFromBackend);
      } else if (data && Array.isArray(data.history)) {
        return data.history.map(mapAttendanceFromBackend);
      }
      return [];
    }

    const list = getLocal<AttendanceRecord[]>("attendance", INITIAL_ATTENDANCE);
    if (employeeId) {
      return list.filter((a) => a.employeeId === employeeId);
    }
    return list;
  }

  static async checkIn(employeeId?: string, notes?: string): Promise<AttendanceRecord> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/attendance/check-in`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes: notes || "" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Check-in failed" }));
        throw new Error(err.detail || "Check-in failed");
      }
      const data = await res.json();
      return mapAttendanceFromBackend(data);
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
      employeeId: employeeId || "EMP-001",
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

  static async checkOut(employeeId?: string): Promise<AttendanceRecord> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/attendance/check-out`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ notes: "" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Check-out failed" }));
        throw new Error(err.detail || "Check-out failed");
      }
      const data = await res.json();
      return mapAttendanceFromBackend(data);
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
      let url = `${API_BASE_URL}/leaves`;
      if (employeeId) url += `?employee_id=${employeeId}`;

      const res = await fetch(url, { headers: getAuthHeaders() });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to fetch leaves" }));
        throw new Error(err.detail || "Failed to fetch leaves");
      }
      const data = await res.json();
      return data.map(mapLeaveFromBackend);
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
      const payload = {
        leave_type: req.leaveType,
        start_date: req.startDate,
        end_date: req.endDate,
        total_days: req.totalDays,
        reason: req.reason,
        attachment_url: (req as any).attachmentUrl || null,
      };

      const res = await fetch(`${API_BASE_URL}/leaves`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Leave application failed" }));
        throw new Error(err.detail || "Leave application failed");
      }
      const data = await res.json();
      return mapLeaveFromBackend(data);
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
      const action = status === "APPROVED" ? "approve" : "reject";
      const res = await fetch(`${API_BASE_URL}/leaves/${leaveId}/${action}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ hr_comments: hrComments || (status === "APPROVED" ? "Approved" : "Rejected") }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Leave review failed" }));
        throw new Error(err.detail || "Leave review failed");
      }
      const data = await res.json();
      return mapLeaveFromBackend(data);
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
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/leaves/me`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.balances) {
          const out: Record<string, LeaveBalance> = {};
          for (const [key, val] of Object.entries<any>(data.balances)) {
            out[key] = {
              allocated: val.allocated || 10,
              used: val.used || 0,
              remaining: val.remaining !== undefined ? val.remaining : (val.allocated - (val.used || 0)),
            };
          }
          return out;
        }
      }
    }

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
    const payroll = await this.getEmployeePayroll(employeeId, month, year);
    return payroll.payableSummary;
  }

  static async getEmployeePayroll(
    employeeId: string,
    month = 8,
    year = 2026
  ): Promise<{ structure: SalaryComponents; payableSummary: PayableSalaryResult }> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/admin/payroll/${employeeId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const earn = data.earnings || {};
        const ded = data.deductions || {};
        const att = data.attendance_summary || {};

        const structure: SalaryComponents = {
          wage: data.wage || 60000,
          basic: earn.basic || (data.wage ? data.wage * 0.5 : 30000),
          hra: earn.hra || (data.wage ? data.wage * 0.25 : 15000),
          standardAllowance: earn.standard_allowance || 4167,
          performanceBonus: earn.performance_bonus || 2499,
          lta: earn.lta || 2499,
          fixedAllowance: earn.fixed_allowance || 5835,
          grossSalary: data.gross_salary || data.wage || 60000,
          pf: ded.pf || (data.wage ? data.wage * 0.06 : 3600),
          professionalTax: ded.professional_tax || 200,
          totalDeductions: data.total_deductions || 3800,
          netSalary: data.net_salary || 56200,
        };

        const payableSummary: PayableSalaryResult = {
          totalWorkingDays: att.total_working_days || 22,
          totalWorkDays: att.total_working_days || 22,
          payableDays: att.payable_days !== undefined ? att.payable_days : 22,
          presentDays: att.present_days !== undefined ? att.present_days : 21,
          approvedLeaves: att.approved_paid_leaves !== undefined ? att.approved_paid_leaves : 1,
          unpaidDays: att.unpaid_days || 0,
          effectiveNetPayout: att.effective_net_payout !== undefined ? att.effective_net_payout : structure.netSalary,
          payableAmount: att.effective_net_payout !== undefined ? att.effective_net_payout : structure.netSalary,
        };

        return { structure, payableSummary };
      }
    }

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
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/admin/payroll/${employeeId}/salary`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ wage: newWage }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Wage update failed" }));
        throw new Error(err.detail || "Wage update failed");
      }
    }
    return this.updateEmployee(employeeId, { wage: newWage });
  }

  // ----------------------------------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------------------------------
  static async getNotifications(): Promise<NotificationItem[]> {
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/notifications`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.map((n: any) => ({
          id: n.id,
          userId: n.user_id || n.userId,
          type: n.type || "GENERAL",
          title: n.title,
          message: n.message,
          isRead: n.is_read !== undefined ? n.is_read : (n.isRead || false),
          createdAt: n.created_at || n.createdAt || new Date().toISOString(),
        }));
      }
    }
    return getLocal<NotificationItem[]>("notifications", INITIAL_NOTIFICATIONS);
  }

  static async markNotificationRead(id: string): Promise<void> {
    if (!USE_MOCK) {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
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
    if (!USE_MOCK) {
      const res = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const m = data.metrics || {};
        return {
          metrics: {
            totalEmployees: m.total_employees ?? 11,
            presentToday: m.present_today ?? 2,
            absentToday: m.absent_today ?? 8,
            onLeaveToday: m.on_leave_today ?? 1,
            pendingLeaves: m.pending_leaves ?? 1,
            attendanceRate: m.attendance_rate ?? 18,
            monthlyPayrollTotal: m.monthly_payroll_total ?? 932000,
          },
          departmentDistribution: (data.department_distribution || []).map((d: any) => ({
            name: d.name,
            count: d.count,
            payroll: d.payroll,
          })),
          attendanceTrends: (data.attendance_trends || []).map((t: any) => ({
            date: t.date,
            present: t.present,
            absent: t.absent,
            leave: t.leave,
          })),
        };
      }
    }

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
