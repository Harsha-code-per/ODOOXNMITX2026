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
import { AvatarBadge } from "@/components/shared/AvatarBadge";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [activeReviewRequest, setActiveReviewRequest] = useState<LeaveRequest | null>(null);

  const loadData = () => {
    DayflowApiClient.getEmployees().then(setEmployees);
    DayflowApiClient.getLeaveRequests().then((reqs) => {
      setPendingLeaves(reqs.filter((r) => r.status === "PENDING"));
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalEmployees = employees.length;
  const onDutyCount = 10; // 91% presence
  const totalPayroll = employees.reduce((sum, e) => sum + (e.wage || 0), 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl glass-panel border border-slate-200 shadow-sm relative overflow-hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700">
              EXECUTIVE COMMAND CENTER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Welcome, {user?.employee.firstName || "Sarah"} (HR Director)
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
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
          >
            <Wallet className="w-4 h-4" />
            <span>Payroll Engine</span>
          </Link>
        </div>
      </div>

      {/* 4-KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* KPI 1: Active Staff */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Staff</span>
            <Users className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">{totalEmployees}</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">100% Onboarded</span>
          </div>
          <Link href="/dashboard/admin/employees" className="text-[10px] text-cyan-700 hover:underline font-bold">
            Manage Directory →
          </Link>
        </div>

        {/* KPI 2: On-Duty Presence */}
        <div className="p-5 rounded-2xl glass-card cyan-glow-subtle border-cyan-200 flex flex-col justify-between">
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
          <Link href="/dashboard/admin/attendance" className="text-[10px] text-cyan-700 hover:underline font-bold">
            View Live Grid →
          </Link>
        </div>

        {/* KPI 3: Pending Leave Review Queue */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Pending Leaves</span>
            <Palmtree className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600">{pendingLeaves.length}</div>
            <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">Action required</span>
          </div>
          <Link href="/dashboard/admin/leaves" className="text-[10px] text-cyan-700 hover:underline font-bold">
            Review requests →
          </Link>
        </div>

        {/* KPI 4: Monthly Payroll Burn */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Monthly Payroll</span>
            <Wallet className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">{formatCurrency(totalPayroll)}</div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Auto-recomputed CTC</span>
          </div>
          <span className="text-[10px] text-slate-400">August 2026 Batch</span>
        </div>
      </div>

      {/* Pending Leave Requests Action Queue */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Palmtree className="w-4 h-4 text-cyan-600" /> Urgent Leave Review Queue
            </h3>
            <p className="text-xs text-slate-500">Pending employee time-off requests awaiting decision</p>
          </div>
          <Link href="/dashboard/admin/leaves" className="text-xs text-cyan-700 hover:underline font-bold">
            View All ({pendingLeaves.length})
          </Link>
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
                  <button
                    onClick={() => setActiveReviewRequest(req)}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-xs"
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
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Staff Directory Snapshot</h3>
            <p className="text-xs text-slate-500">Recent active employees and live status</p>
          </div>
          <Link
            href="/dashboard/admin/employees"
            className="text-xs text-cyan-700 hover:underline flex items-center gap-1 font-bold"
          >
            <span>Complete Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {employees.slice(0, 6).map((emp) => (
            <div
              key={emp.id}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between hover:border-cyan-400 transition-colors shadow-xs"
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
      </div>

      <LeaveApprovalDrawer
        request={activeReviewRequest}
        onClose={() => setActiveReviewRequest(null)}
        onReviewed={loadData}
      />
    </div>
  );
}
