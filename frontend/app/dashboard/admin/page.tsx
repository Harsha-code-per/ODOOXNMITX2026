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
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeReviewRequest, setActiveReviewRequest] = useState<LeaveRequest | null>(null);

  const loadData = () => {
    DayflowApiClient.getEmployees().then(setEmployees);
    DayflowApiClient.getLeaveRequests().then((reqs) => {
      setPendingLeaves(reqs.filter((r) => r.status === "PENDING"));
    });
    DayflowApiClient.getAnalyticsSummary().then(setAnalytics);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalPayroll = employees.reduce((sum, e) => sum + (e.wage || 0), 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-[var(--border)] relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
              EXECUTIVE HR COMMAND CENTER
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading mt-1">
            Welcome, {user?.employee.firstName || "Sarah"}!
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time workforce intelligence, attendance tracking, and dynamic payroll governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/admin/employees"
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all hover:scale-105"
          >
            Employee Directory ({employees.length})
          </Link>
          <Link
            href="/dashboard/admin/payroll"
            className="px-3.5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all hover:scale-105"
          >
            Open Payroll Engine
          </Link>
        </div>
      </div>

      {/* 4-KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* KPI 1: Total Headcount */}
        <div className="glass-card rounded-2xl p-5 border border-[var(--border)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Headcount</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-mono text-slate-100">{employees.length}</div>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" /> 100% Active Staff
            </span>
          </div>
          <span className="text-[10px] text-slate-500">5 Departments active</span>
        </div>

        {/* KPI 2: On-Duty Today */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 cyan-glow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">On-Duty Today</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-mono text-emerald-400">
              {analytics?.metrics?.presentToday ?? 10} / {employees.length}
            </div>
            <span className="text-[11px] text-slate-300 font-semibold mt-0.5 block">
              {analytics?.metrics?.attendanceRate ?? 91}% Presence Rate
            </span>
          </div>
          <span className="text-[10px] text-slate-500">1 on approved leave</span>
        </div>

        {/* KPI 3: Pending Approvals */}
        <div className="glass-card rounded-2xl p-5 border border-purple-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Pending Leaves</span>
            <Palmtree className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-mono text-purple-400">{pendingLeaves.length}</div>
            <span className="text-[11px] text-amber-400 font-semibold mt-0.5 block">Action required</span>
          </div>
          <Link href="/dashboard/admin/leaves" className="text-[10px] text-cyan-400 hover:underline">
            Review requests →
          </Link>
        </div>

        {/* KPI 4: Monthly Payroll Burn */}
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 cyan-glow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Monthly Payroll</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-extrabold font-mono text-cyan-300">{formatCurrency(totalPayroll)}</div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Auto-recomputed CTC</span>
          </div>
          <span className="text-[10px] text-slate-500">August 2026 Batch</span>
        </div>
      </div>

      {/* Pending Leave Requests Action Queue */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <Palmtree className="w-4 h-4 text-cyan-400" /> Urgent Leave Review Queue
            </h3>
            <p className="text-xs text-slate-400">Pending employee time-off requests awaiting decision</p>
          </div>
          <Link href="/dashboard/admin/leaves" className="text-xs text-cyan-400 hover:underline font-semibold">
            View All ({pendingLeaves.length})
          </Link>
        </div>

        {pendingLeaves.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400/80" />
            <p>All leave applications have been reviewed! No pending requests in queue.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLeaves.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col justify-between text-xs"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/40 bg-slate-800 flex items-center justify-center font-bold text-cyan-300">
                    {req.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={req.avatarUrl} alt={req.employeeName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{req.employeeName[0]}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100">{req.employeeName}</h4>
                    <span className="text-[11px] text-cyan-400">
                      {req.department} · {req.totalDays} Day(s) {req.leaveType}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 italic mb-4 leading-relaxed">&quot;{req.reason}&quot;</p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 font-mono">
                    {formatDate(req.startDate)} → {formatDate(req.endDate)}
                  </span>
                  <button
                    onClick={() => setActiveReviewRequest(req)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-cyan-500/20"
                  >
                    Review Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Staff Roster Preview */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">Staff Directory Snapshot</h3>
            <p className="text-xs text-slate-400">Recent active employees and live status</p>
          </div>
          <Link
            href="/dashboard/admin/employees"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Complete Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {employees.slice(0, 6).map((emp) => (
            <div
              key={emp.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-[var(--border)] flex items-center justify-between hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center font-bold text-cyan-300">
                  {emp.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={emp.avatarUrl} alt={emp.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{emp.firstName[0]}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">
                    {emp.firstName} {emp.lastName}
                  </h4>
                  <span className="text-[10px] text-slate-400 block">{emp.designation}</span>
                </div>
              </div>

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
            </div>
          ))}
        </div>
      </div>

      {/* Review Drawer Modal */}
      <LeaveApprovalDrawer
        request={activeReviewRequest}
        onClose={() => setActiveReviewRequest(null)}
        onReviewed={loadData}
      />
    </div>
  );
}
