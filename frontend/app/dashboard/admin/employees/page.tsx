"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { Employee } from "@/lib/mock-data";
import { EmployeeEditDrawer } from "@/components/employees/EmployeeEditDrawer";
import { SalaryStructureEditor } from "@/components/payroll/SalaryStructureEditor";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit3,
  DollarSign,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Briefcase,
  Sparkles,
  Plus,
  Copy,
  KeyRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AvatarBadge } from "@/components/shared/AvatarBadge";

export default function AdminEmployeesPage() {
  const router = useRouter();
  const { user, switchPersona } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<Employee | null>(null);
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState<Employee | null>(null);

  // Onboard Employee Modal State
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("+1 555-0199");
  const [newDept, setNewDept] = useState("Engineering");
  const [newDesignation, setNewDesignation] = useState("Software Engineer");
  const [newWage, setNewWage] = useState(85000);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Invitation Credentials Modal State
  const [createdCredentials, setCreatedCredentials] = useState<{
    employee: Employee;
    tempPass: string;
  } | null>(null);

  const fetchEmployees = () => {
    DayflowApiClient.getEmployees().then(setEmployees);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = ["ALL", "Engineering", "Product", "Human Resources", "Sales", "Marketing", "Finance"];

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleInspectAs = (emp: Employee) => {
    if (emp.employeeId === "EMP-003") {
      switchPersona("alex");
      router.push("/dashboard/employee");
    } else {
      toast.info(`Switched context to ${emp.firstName} ${emp.lastName}`);
      router.push("/dashboard/employee");
    }
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOnboarding(true);
    try {
      const nextEmpNum = `EMP-0${employees.length + 1}`;
      const res = await DayflowApiClient.createEmployee({
        employeeId: nextEmpNum,
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        phone: newPhone,
        department: newDept,
        designation: newDesignation,
        joiningDate: new Date().toISOString().split("T")[0],
        status: "ACTIVE",
        address: "San Francisco, CA",
        emergencyContact: { name: "Family Contact", relationship: "Next of Kin", phone: "+1 555-0999" },
        wage: Number(newWage),
      });

      fetchEmployees();
      setShowOnboardModal(false);
      setCreatedCredentials({
        employee: res.employee,
        tempPass: res.temporaryPassword,
      });

      toast.success(`Onboarded ${res.employee.firstName} ${res.employee.lastName}!`, {
        description: `Credentials generated with temporary password.`,
      });

      setNewFirstName("");
      setNewLastName("");
      setNewEmail("");
    } catch {
      toast.error("Failed to onboard employee");
    } finally {
      setIsOnboarding(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Employee Directory</h1>
          <p className="text-xs text-slate-500">
            Browse staff roster, onboard team members, and manage dynamic compensation profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOnboardModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>

          {/* View mode toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "grid" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl transition-all ${
                viewMode === "table" ? "bg-cyan-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Department Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl glass-panel border border-slate-200 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, title, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedDept === dept
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* View Modes */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              className="p-5 rounded-3xl glass-panel border border-slate-200/90 shadow-sm hover:border-cyan-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Avatar, Name & Status */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <AvatarBadge
                      name={`${emp.firstName} ${emp.lastName}`}
                      department={emp.department}
                      size="md"
                      status={emp.status}
                      showStatus
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                        {emp.firstName} {emp.lastName}
                      </h3>
                      <p className="text-xs text-cyan-700 font-medium">{emp.designation}</p>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{emp.employeeId}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : emp.status === "ON_LEAVE"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>

                {/* Contact & Meta */}
                <div className="flex flex-col gap-1.5 text-xs text-slate-500 mb-4 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{emp.department}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="text-slate-400">Monthly Wage:</span>
                    <span className="font-mono font-bold text-cyan-700">{formatCurrency(emp.wage)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedEmployeeForEdit(emp)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setSelectedEmployeeForSalary(emp)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs border border-cyan-200 transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Salary</span>
                </button>

                <button
                  onClick={() => handleInspectAs(emp)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-600 transition-colors"
                  title="Inspect Employee View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl glass-panel border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5">ID</th>
                <th className="py-3.5">Department</th>
                <th className="py-3.5">Designation</th>
                <th className="py-3.5">Monthly Wage</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {emp.firstName} {emp.lastName}
                      </span>
                      <span className="text-[10px] text-slate-400">{emp.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-slate-500">{emp.employeeId}</td>
                  <td className="py-3.5 text-slate-700 font-semibold">{emp.department}</td>
                  <td className="py-3.5 text-slate-600">{emp.designation}</td>
                  <td className="py-3.5 font-mono font-bold text-cyan-700">{formatCurrency(emp.wage)}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : emp.status === "ON_LEAVE"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right pr-4">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleInspectAs(emp)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => setSelectedEmployeeForSalary(emp)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-[11px] border border-cyan-200"
                      >
                        Wage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: Onboard Employee */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Onboard Team Member
                </h3>
                <p className="text-xs text-slate-500">
                  Adds staff to company roster and creates initial login credentials.
                </p>
              </div>
              <button
                onClick={() => setShowOnboardModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="flex flex-col gap-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. Jordan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="e.g. Blake"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="jordan.blake@acmecorp.io"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-semibold"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources (HR)</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    placeholder="Senior QA Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Monthly Base CTC Wage (INR ₹) *
                </label>
                <input
                  type="number"
                  required
                  min="20000"
                  step="5000"
                  value={newWage}
                  onChange={(e) => setNewWage(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="flex gap-2.5 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOnboarding}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs"
                >
                  {isOnboarding ? "Onboarding..." : "Complete Onboarding"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Generated Credentials */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-slate-900">
                  Staff Onboarding Complete
                </h3>
                <p className="text-xs text-slate-500">
                  Credentials generated for {createdCredentials.employee.firstName} {createdCredentials.employee.lastName}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 font-mono mb-6">
              <div>Email: <strong className="text-slate-900">{createdCredentials.employee.email}</strong></div>
              <div>Employee ID: <strong className="text-slate-900">{createdCredentials.employee.employeeId}</strong></div>
              <div>Temporary Password: <strong className="text-rose-600">{createdCredentials.tempPass}</strong></div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Email: ${createdCredentials.employee.email}\nTemporary Password: ${createdCredentials.tempPass}\nLogin: ${window.location.origin}/login`
                  );
                  toast.success("Copied credentials to clipboard!");
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Details</span>
              </button>
              <button
                onClick={() => setCreatedCredentials(null)}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <EmployeeEditDrawer
        employee={selectedEmployeeForEdit}
        isOpen={Boolean(selectedEmployeeForEdit)}
        onClose={() => setSelectedEmployeeForEdit(null)}
        onSaved={fetchEmployees}
      />

      <SalaryStructureEditor
        employee={selectedEmployeeForSalary}
        isOpen={Boolean(selectedEmployeeForSalary)}
        onClose={() => setSelectedEmployeeForSalary(null)}
        onSaved={fetchEmployees}
      />
    </div>
  );
}
