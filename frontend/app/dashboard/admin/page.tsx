"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { Employee, LeaveRequest } from "@/lib/mock-data";
import { LeaveApprovalDrawer } from "@/components/leaves/LeaveApprovalDrawer";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Clock,
  Palmtree,
  Wallet,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  BarChart3,
  Kanban,
  GitGraph,
  Layers,
  Search,
  Grid,
  List,
} from "lucide-react";
import { AvatarBadge } from "@/components/shared/AvatarBadge";
import Link from "next/link";
import { WorkforceFlowchart } from "@/components/dashboard/WorkforceFlowchart";
import { LeaveKanbanBoard } from "@/components/dashboard/LeaveKanbanBoard";
import { AttendanceVelocityChart } from "@/components/dashboard/AttendanceVelocityChart";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [activeReviewRequest, setActiveReviewRequest] = useState<LeaveRequest | null>(null);
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "KANBAN" | "FLOWCHART" | "DIRECTORY">("OVERVIEW");
  const [directoryViewMode, setDirectoryViewMode] = useState<"GRID" | "TABLE">("GRID");
  const [directorySearch, setDirectorySearch] = useState<string>("");

  const loadData = () => {
    DayflowApiClient.getEmployees().then(setEmployees);
    DayflowApiClient.getLeaveRequests().then(setLeaveRequests);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateRequestStatus = async (requestId: string, newStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    if (newStatus === "APPROVED" || newStatus === "REJECTED") {
      await DayflowApiClient.reviewLeaveRequest(requestId, newStatus);
    }
    // Update local state
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
    );
  };

  const totalEmployees = employees.length;
  const onDutyCount = 10; // 91% presence
  const totalPayroll = employees.reduce((sum, e) => sum + (e.wage || 0), 0);
  const pendingLeaves = leaveRequests.filter((r) => r.status === "PENDING");

  const filteredEmployees = employees.filter((emp) => {
    const q = directorySearch.toLowerCase();
    return (
      emp.firstName.toLowerCase().includes(q) ||
      emp.lastName.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700">
              EXECUTIVE COMMAND CENTER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Welcome, {user?.employee.firstName || "Arthur"} (HR Director)
          </h1>
          <p className="text-xs text-slate-500">
            Company-wide workforce operations, automated leave governance, and real-time compensation metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/admin/attendance"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:border-cyan-300 transition-all hover:scale-105"
          >
            <Clock className="w-4 h-4 text-cyan-600" />
            <span>Attendance Matrix</span>
          </Link>

          <Link
            href="/dashboard/admin/payroll"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
          >
            <Wallet className="w-4 h-4" />
            <span>Payroll Engine</span>
          </Link>
        </div>
      </div>

      {/* 4-KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* KPI 1: Active Staff */}
        <div
          onClick={() => setActiveTab("DIRECTORY")}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-cyan-400 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Staff</span>
            <Users className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">{totalEmployees}</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">100% Onboarded</span>
          </div>
          <span className="text-[10px] text-cyan-700 font-bold flex items-center gap-1">
            <span>Manage Directory</span> →
          </span>
        </div>

        {/* KPI 2: On-Duty Presence */}
        <div
          onClick={() => setActiveTab("OVERVIEW")}
          className="p-5 rounded-2xl bg-cyan-50/60 border border-cyan-200 shadow-2xs hover:border-cyan-400 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Present Today</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">
              {onDutyCount} <span className="text-sm font-normal text-slate-500">/ {totalEmployees}</span>
            </div>
            <span className="text-[11px] text-cyan-700 font-semibold mt-0.5 block">91% Presence Velocity</span>
          </div>
          <span className="text-[10px] text-cyan-700 font-bold flex items-center gap-1">
            <span>View Velocity Chart</span> →
          </span>
        </div>

        {/* KPI 3: Pending Leave Review Queue */}
        <div
          onClick={() => setActiveTab("KANBAN")}
          className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-2xs hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Pending Leaves</span>
            <Palmtree className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600">{pendingLeaves.length}</div>
            <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">Action required</span>
          </div>
          <span className="text-[10px] text-amber-800 font-bold flex items-center gap-1">
            <span>Open Leave Kanban</span> →
          </span>
        </div>

        {/* KPI 4: Monthly Payroll Burn */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Monthly Payroll</span>
            <Wallet className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">{formatCurrency(totalPayroll)}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Auto-recomputed CTC</span>
          </div>
          <Link href="/dashboard/admin/payroll" className="text-[10px] text-cyan-700 hover:underline font-bold">
            Payroll Ledger →
          </Link>
        </div>
      </div>

      {/* Interactive Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200 max-w-fit overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("OVERVIEW")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "OVERVIEW"
              ? "bg-white text-slate-900 shadow-xs scale-[1.02]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-cyan-600" />
          <span>Executive Overview & Pulse</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("KANBAN")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "KANBAN"
              ? "bg-white text-slate-900 shadow-xs scale-[1.02]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Kanban className="w-3.5 h-3.5 text-cyan-600" />
          <span>Leave Governance Kanban</span>
          {pendingLeaves.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
              {pendingLeaves.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("FLOWCHART")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "FLOWCHART"
              ? "bg-white text-slate-900 shadow-xs scale-[1.02]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <GitGraph className="w-3.5 h-3.5 text-cyan-600" />
          <span>Workforce Architecture Flowchart</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DIRECTORY")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "DIRECTORY"
              ? "bg-white text-slate-900 shadow-xs scale-[1.02]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-cyan-600" />
          <span>Staff Directory Snapshot</span>
        </button>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "OVERVIEW" && (
        <div className="flex flex-col gap-6 animate-in fade-in">
          {/* Attendance Recharts Visualizer */}
          <AttendanceVelocityChart />

          {/* Pending Leave Requests Action Queue */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Palmtree className="w-4 h-4 text-cyan-600" /> Urgent Leave Review Queue
                </h3>
                <p className="text-xs text-slate-500">Pending employee time-off requests awaiting decision</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("KANBAN")}
                className="text-xs text-cyan-700 hover:underline font-bold flex items-center gap-1"
              >
                <span>Open Kanban Board ({pendingLeaves.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <p className="text-slate-700 font-semibold">All leave applications reviewed! No pending requests in queue.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingLeaves.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-cyan-50/50 border border-cyan-200 flex flex-col justify-between text-xs"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <AvatarBadge
                        name={req.employeeName}
                        department={req.department}
                        size="md"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900">{req.employeeName}</h4>
                        <span className="text-[11px] text-cyan-800 font-semibold">
                          {req.department} · {req.totalDays} Day(s) {req.leaveType}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 italic mb-4 leading-relaxed">&quot;{req.reason}&quot;</p>

                    <div className="flex items-center justify-between pt-3 border-t border-cyan-200">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatDate(req.startDate)} → {formatDate(req.endDate)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateRequestStatus(req.id, "APPROVED")}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-xs"
                        >
                          Quick Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveReviewRequest(req)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LEAVE GOVERNANCE KANBAN */}
      {activeTab === "KANBAN" && (
        <div className="animate-in fade-in">
          <LeaveKanbanBoard
            requests={leaveRequests}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onOpenReviewDrawer={(req) => setActiveReviewRequest(req)}
          />
        </div>
      )}

      {/* TAB 3: WORKFORCE ARCHITECTURE FLOWCHART */}
      {activeTab === "FLOWCHART" && (
        <div className="animate-in fade-in">
          <WorkforceFlowchart />
        </div>
      )}

      {/* TAB 4: STAFF DIRECTORY SNAPSHOT */}
      {activeTab === "DIRECTORY" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-5 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Staff Directory Snapshot</h3>
              <p className="text-xs text-slate-500">Live active workforce records and organizational roles</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  placeholder="Filter staff by name or dept..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              {/* Grid / Table Toggle */}
              <div className="p-1 rounded-xl bg-slate-100 flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDirectoryViewMode("GRID")}
                  className={`p-1.5 rounded-lg transition-all ${
                    directoryViewMode === "GRID" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDirectoryViewMode("TABLE")}
                  className={`p-1.5 rounded-lg transition-all ${
                    directoryViewMode === "TABLE" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  }`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <Link
                href="/dashboard/admin/employees"
                className="text-xs text-cyan-700 hover:underline flex items-center gap-1 font-bold"
              >
                <span>Full Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {directoryViewMode === "GRID" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between hover:border-cyan-400 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <AvatarBadge
                      name={`${emp.firstName} ${emp.lastName}`}
                      department={emp.department}
                      size="sm"
                      status={emp.status}
                      showStatus
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {emp.firstName} {emp.lastName}
                      </h4>
                      <span className="text-[10px] text-slate-500 block">{emp.designation}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
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
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-4">Employee</th>
                    <th className="py-2.5 px-4">Department</th>
                    <th className="py-2.5 px-4">Designation</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Wage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 flex items-center gap-2.5 font-bold text-slate-900">
                        <AvatarBadge name={`${emp.firstName} ${emp.lastName}`} department={emp.department} size="sm" />
                        <span>{emp.firstName} {emp.lastName}</span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{emp.department}</td>
                      <td className="py-2.5 px-4 text-slate-600">{emp.designation}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            emp.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(emp.wage)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Leave Approval / Inspection Drawer */}
      <LeaveApprovalDrawer
        request={activeReviewRequest}
        onClose={() => setActiveReviewRequest(null)}
        onReviewed={loadData}
      />
    </div>
  );
}
