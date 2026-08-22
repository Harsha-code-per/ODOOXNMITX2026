"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { LiveTimerPulse } from "@/components/attendance/LiveTimerPulse";
import { ApplyLeaveModal } from "@/components/leaves/ApplyLeaveModal";
import { PayslipModal } from "@/components/payroll/PayslipModal";
import { DayflowApiClient } from "@/lib/api";
import { LeaveBalance, AttendanceRecord } from "@/lib/mock-data";
import { SalaryComponents, PayableSalaryResult } from "@/lib/salary-calculator";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Clock,
  Palmtree,
  Wallet,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { AvatarBadge } from "@/components/shared/AvatarBadge";
import Link from "next/link";

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const [leaveBalances, setLeaveBalances] = useState<Record<string, LeaveBalance> | null>(null);
  const [payrollData, setPayrollData] = useState<{
    structure: SalaryComponents;
    payableSummary: PayableSalaryResult;
  } | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  const employeeId = user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";

  const refreshData = () => {
    DayflowApiClient.getLeaveBalances(employeeId).then(setLeaveBalances);
    DayflowApiClient.getEmployeePayroll(employeeId).then((res) => {
      setPayrollData({ structure: res.structure, payableSummary: res.payableSummary });
    });
    DayflowApiClient.getAttendanceHistory(employeeId).then((records) => {
      setRecentAttendance(records.slice(0, 4));
    });
  };

  useEffect(() => {
    refreshData();
  }, [employeeId]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Welcome Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-[var(--border)] relative overflow-hidden">
        <div className="flex items-center gap-4">
          <AvatarBadge
            name={`${user?.employee.firstName || "Alex"} ${user?.employee.lastName || "Rivera"}`}
            department={user?.employee.department}
            size="xl"
            status={user?.employee.status}
            showStatus
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-heading">
                Good day, {user?.employee.firstName || "Alex"}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
                {user?.employee.department}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{user?.employee.designation}</span> · <span>ID: {user?.employee.employeeId}</span>
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-all hover:scale-105"
          >
            <Palmtree className="w-4 h-4 text-purple-400" />
            <span>Apply Leave</span>
          </button>
          <button
            onClick={() => setIsPayslipModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <FileText className="w-4 h-4" />
            <span>View Payslip</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Live Stopwatch Pulse + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Realtime Attendance Stopwatch Widget */}
        <div className="lg:col-span-1">
          <LiveTimerPulse onRecordUpdated={refreshData} />
        </div>

        {/* 2x2 Quick Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Leave Quota Balance */}
          <div className="glass-card rounded-2xl p-5 border border-[var(--border)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Palmtree className="w-3.5 h-3.5 text-purple-400" /> Leave Balance
              </span>
              <Link href="/dashboard/employee/leaves" className="text-[11px] text-cyan-400 hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center my-1">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border)]">
                <span className="text-xs text-slate-400 block">Paid</span>
                <span className="text-lg font-bold text-purple-400">{leaveBalances?.PAID?.remaining ?? 14}</span>
                <span className="text-[10px] text-slate-500 block">/ 18 days</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border)]">
                <span className="text-xs text-slate-400 block">Sick</span>
                <span className="text-lg font-bold text-cyan-400">{leaveBalances?.SICK?.remaining ?? 8}</span>
                <span className="text-[10px] text-slate-500 block">/ 10 days</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-[var(--border)]">
                <span className="text-xs text-slate-400 block">Casual</span>
                <span className="text-lg font-bold text-emerald-400">{leaveBalances?.CASUAL?.remaining ?? 5}</span>
                <span className="text-[10px] text-slate-500 block">/ 6 days</span>
              </div>
            </div>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="mt-3 w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-[11px] font-semibold text-slate-200 transition-colors"
            >
              + Request New Time Off
            </button>
          </div>

          {/* Card 2: Monthly Salary Preview */}
          <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 cyan-glow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-cyan-400" /> August Compensation
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Active Structure
              </span>
            </div>
            <div className="my-1">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Estimated Net Payout</span>
              <div className="text-2xl font-extrabold font-mono text-cyan-300">
                {payrollData ? formatCurrency(payrollData.payableSummary.effectiveNetPayout) : "₹70,300.00"}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Base Wage: {payrollData ? formatCurrency(payrollData.structure.wage) : "₹75,000.00"} · Payable Days:{" "}
                {payrollData?.payableSummary.payableDays ?? 21.5} / 22
              </p>
            </div>
            <button
              onClick={() => setIsPayslipModalOpen(true)}
              className="mt-3 w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[11px] font-bold text-cyan-400 transition-colors flex items-center justify-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" /> Download Payslip PDF
            </button>
          </div>
        </div>
      </div>

      {/* Recent Attendance History Table */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">Recent Attendance Log</h3>
            <p className="text-xs text-slate-400">Past sessions and daily hours logged</p>
          </div>
          <Link
            href="/dashboard/employee/attendance"
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400">
                <th className="pb-2.5 font-semibold">Date</th>
                <th className="pb-2.5 font-semibold">Clock In</th>
                <th className="pb-2.5 font-semibold">Clock Out</th>
                <th className="pb-2.5 font-semibold">Total Hours</th>
                <th className="pb-2.5 font-semibold">Status</th>
                <th className="pb-2.5 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{formatDate(rec.workDate)}</td>
                  <td className="py-3 text-slate-400 font-mono">
                    {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}
                  </td>
                  <td className="py-3 text-slate-400 font-mono">
                    {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "In Progress"}
                  </td>
                  <td className="py-3 font-mono font-semibold text-cyan-400">
                    {rec.totalHours ? `${rec.totalHours} hrs` : "--"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        rec.status === "PRESENT"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : rec.status === "HALF_DAY"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 italic max-w-xs truncate">{rec.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmitted={refreshData}
      />

      {user && payrollData && (
        <PayslipModal
          employee={user.employee}
          structure={payrollData.structure}
          payableSummary={payrollData.payableSummary}
          isOpen={isPayslipModalOpen}
          onClose={() => setIsPayslipModalOpen(false)}
        />
      )}
    </div>
  );
}
