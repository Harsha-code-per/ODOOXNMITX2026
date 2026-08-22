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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminEmployeesPage() {
  const router = useRouter();
  const { switchPersona } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<Employee | null>(null);
  const [selectedEmployeeForSalary, setSelectedEmployeeForSalary] = useState<Employee | null>(null);

  const fetchEmployees = () => {
    DayflowApiClient.getEmployees().then(setEmployees);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = ["ALL", "Engineering", "Product", "Human Resources", "Sales", "Marketing", "Finance"];

  const filtered = employees.filter((emp) => {
    const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  const handleInspectAs = (emp: Employee) => {
    if (emp.employeeId === "EMP-003") {
      switchPersona("alex");
    } else if (emp.employeeId === "EMP-002") {
      switchPersona("sarah");
    } else if (emp.employeeId === "EMP-001") {
      switchPersona("admin");
    } else {
      toast.info(`Viewing as ${emp.firstName} ${emp.lastName}`);
    }
    router.push("/dashboard/employee");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Employee Directory</h1>
          <p className="text-xs text-slate-400">
            Manage organization records, inspect profiles, and govern compensation.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-[var(--border)]">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === "grid" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === "table" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, designation, or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-[var(--border)] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
          />
        </div>

        {/* Department Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedDept === dept
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              className="glass-card rounded-2xl p-5 border border-[var(--border)] flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
            >
              <div>
                {/* Avatar & Badges */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-slate-800 flex items-center justify-center font-bold text-cyan-300 shadow-md">
                      {emp.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={emp.avatarUrl} alt={emp.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{emp.firstName[0]}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[var(--foreground)] leading-tight">
                        {emp.firstName} {emp.lastName}
                      </h3>
                      <span className="text-[11px] text-cyan-400 font-medium">{emp.designation}</span>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{emp.employeeId}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      emp.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : emp.status === "ON_LEAVE"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)] flex flex-col gap-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-semibold text-slate-200">{emp.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Base Wage (CTC):</span>
                    <span className="font-mono font-bold text-cyan-300">{formatCurrency(emp.wage)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Joined:</span>
                    <span className="text-slate-300">{formatDate(emp.joiningDate)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[var(--border)] text-[11px]">
                <button
                  onClick={() => handleInspectAs(emp)}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                  title="View Portal as this employee"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect</span>
                </button>
                <button
                  onClick={() => setSelectedEmployeeForEdit(emp)}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                  title="Edit employee records"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedEmployeeForSalary(emp)}
                  className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 transition-colors"
                  title="Adjust wage & recalculate"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Wage</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400">
                <th className="pb-3 font-semibold">Employee</th>
                <th className="pb-3 font-semibold">ID</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Designation</th>
                <th className="pb-3 font-semibold">Monthly Wage</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center font-bold text-cyan-300">
                      {emp.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={emp.avatarUrl} alt={emp.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{emp.firstName[0]}</span>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block">
                        {emp.firstName} {emp.lastName}
                      </span>
                      <span className="text-[10px] text-slate-500">{emp.email}</span>
                    </div>
                  </td>
                  <td className="py-3 font-mono text-slate-400">{emp.employeeId}</td>
                  <td className="py-3 text-slate-300 font-semibold">{emp.department}</td>
                  <td className="py-3 text-slate-400">{emp.designation}</td>
                  <td className="py-3 font-mono font-bold text-cyan-300">{formatCurrency(emp.wage)}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        emp.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : emp.status === "ON_LEAVE"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleInspectAs(emp)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Inspect as Employee"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => setSelectedEmployeeForEdit(emp)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Edit Profile"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                      <button
                        onClick={() => setSelectedEmployeeForSalary(emp)}
                        className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400"
                        title="Adjust Wage"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
