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
import { AvatarBadge } from "@/components/shared/AvatarBadge";

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

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Employee Directory</h1>
          <p className="text-xs text-slate-500">
            Browse staff roster, inspect employee portals, and manage compensation profiles.
          </p>
        </div>

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

      {/* Search & Department Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl glass-panel border border-slate-200 shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, designation, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs"
          />
        </div>

        {/* Department Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                selectedDept === dept
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
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
              className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-cyan-400 transition-all group"
            >
              <div>
                {/* Avatar & Badges */}
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
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {emp.firstName} {emp.lastName}
                      </h3>
                      <span className="text-[11px] text-cyan-800 font-semibold">{emp.designation}</span>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.employeeId}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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

                {/* Details */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-800">{emp.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Base Wage (CTC):</span>
                    <span className="font-mono font-bold text-cyan-700">{formatCurrency(emp.wage)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Joined:</span>
                    <span className="text-slate-700">{formatDate(emp.joiningDate)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-[11px]">
                <button
                  onClick={() => handleInspectAs(emp)}
                  className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  title="View Portal as this employee"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Inspect</span>
                </button>
                <button
                  onClick={() => setSelectedEmployeeForEdit(emp)}
                  className="flex items-center justify-center gap-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                  title="Edit employee records"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setSelectedEmployeeForSalary(emp)}
                  className="flex items-center justify-center gap-1 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold border border-cyan-200 transition-colors"
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
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="pb-3 font-semibold">Employee</th>
                <th className="pb-3 font-semibold">ID</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Designation</th>
                <th className="pb-3 font-semibold">Monthly Wage</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 flex items-center gap-2.5">
                    <AvatarBadge
                      name={`${emp.firstName} ${emp.lastName}`}
                      department={emp.department}
                      size="sm"
                      status={emp.status}
                      showStatus
                    />
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
                  <td className="py-3.5 text-right">
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
