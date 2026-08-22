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
  Briefcase,
} from "lucide-react";
import { AvatarBadge } from "@/components/shared/AvatarBadge";
import Link from "next/link";
import { ShiftProgressRing } from "@/components/dashboard/ShiftProgressRing";

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const employeeId = user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";

  const [leaveBalances, setLeaveBalances] = useState<Record<string, LeaveBalance>>({});
  const [payrollData, setPayrollData] = useState<{
    structure: SalaryComponents;
    payableSummary: PayableSalaryResult;
  } | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);

  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);

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
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
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
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
                Good day, {user?.employee.firstName || "Alex"}!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.employee.designation} • {user?.employee.department} • {user?.employee.employeeId}
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsApplyLeaveOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:border-cyan-300 transition-all hover:scale-105"
          >
            <Palmtree className="w-4 h-4 text-cyan-600" />
            <span>Apply for Leave</span>
          </button>

          <button
            onClick={() => setIsPayslipOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
          >
            <FileText className="w-4 h-4" />
            <span>Download Payslip PDF</span>
          </button>
        </div>
      </div>

      {/* 4-Card Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Card 1: Today's Logged Hours */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Today&apos;s Hours</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">8.55 hrs</div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Shift target met
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Regular shift (09:00 - 17:35)</span>
        </div>

        {/* Card 2: Paid Leave Quota Balance */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Leave Balance</span>
            <Palmtree className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-700">
              {leaveBalances.PAID?.remaining ?? 14} <span className="text-sm font-normal text-slate-500">Days</span>
            </div>
            <span className="text-[11px] text-slate-600 font-medium mt-0.5 block">
              18 Allocated · 4 Used
            </span>
          </div>
          <Link href="/dashboard/employee/leaves" className="text-[10px] text-cyan-700 hover:underline font-bold">
            View All Quotas →
          </Link>
        </div>

        {/* Card 3: Estimated Monthly Net Pay */}
        <div className="p-5 rounded-2xl bg-cyan-50/60 border border-cyan-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Monthly Net Pay</span>
            <Wallet className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              {payrollData ? formatCurrency(payrollData.payableSummary.payableAmount) : "₹70,300"}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              Dynamic CTC Engine Synced
            </span>
          </div>
          <Link href="/dashboard/employee/payroll" className="text-[10px] text-cyan-700 hover:underline font-bold">
            View Statement & PDF →
          </Link>
        </div>

        {/* Card 4: Attendance Velocity Rate */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Monthly Presence</span>
            <TrendingUp className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">95.4%</div>
            <span className="text-[11px] text-slate-600 font-medium mt-0.5 block">21 Present / 22 Workdays</span>
          </div>
          <span className="text-[10px] text-slate-400">1 Half-Day Logged</span>
        </div>
      </div>

      {/* Interactive Shift Gauge & Productivity Center */}
      <ShiftProgressRing onApplyLeaveClick={() => setIsApplyLeaveOpen(true)} />

      {/* Recent Attendance History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-600" /> Recent Attendance Log
              </h3>
              <p className="text-xs text-slate-500">Your latest work session timestamps and logged hours</p>
            </div>
            <Link
              href="/dashboard/employee/attendance"
              className="text-xs text-cyan-700 hover:underline flex items-center gap-1 font-bold"
            >
              <span>Full Logbook</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-2.5 font-semibold">Date</th>
                  <th className="pb-2.5 font-semibold">Check-In</th>
                  <th className="pb-2.5 font-semibold">Check-Out</th>
                  <th className="pb-2.5 font-semibold">Duration</th>
                  <th className="pb-2.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-800">{formatDate(rec.workDate)}</td>
                    <td className="py-3 font-mono text-slate-600">
                      {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                    <td className="py-3 font-mono text-slate-600">
                      {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Active"}
                    </td>
                    <td className="py-3 font-mono font-bold text-cyan-700">
                      {rec.totalHours > 0 ? `${rec.totalHours.toFixed(2)}h` : "In Progress"}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : rec.status === "HALF_DAY"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Biometric synchronization active</span>
          <span className="text-cyan-700 font-semibold">Dayflow Core 2.6</span>
        </div>
      </div>

      {/* Modals */}
      <ApplyLeaveModal
        employeeId={employeeId}
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        onApplied={refreshData}
      />

      {payrollData && (
        <PayslipModal
          employee={user?.employee || ({} as any)}
          structure={payrollData.structure}
          payableSummary={payrollData.payableSummary}
          isOpen={isPayslipOpen}
          onClose={() => setIsPayslipOpen(false)}
        />
      )}
    </div>
  );
}
