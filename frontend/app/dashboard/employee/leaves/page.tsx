"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { LeaveBalance, LeaveRequest } from "@/lib/mock-data";
import { ApplyLeaveModal } from "@/components/leaves/ApplyLeaveModal";
import { formatDate } from "@/lib/utils";
import { Palmtree, Plus, Clock, CheckCircle2, XCircle, Calendar, Sparkles } from "lucide-react";

export default function EmployeeLeavesPage() {
  const { user } = useAuth();
  const employeeId = user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";

  const [balances, setBalances] = useState<Record<string, LeaveBalance>>({});
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refresh = () => {
    DayflowApiClient.getLeaveBalances(employeeId).then(setBalances);
    DayflowApiClient.getLeaveRequests(employeeId).then(setRequests);
  };

  useEffect(() => {
    refresh();
  }, [employeeId]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Leave Quota & Requests</h1>
          <p className="text-xs text-slate-500">
            Track annual leave allowances, submit time-off applications, and monitor approvals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Time Off</span>
        </button>
      </div>

      {/* Quota Balance Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Paid Annual Leave */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Paid Leave</span>
            <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
              Annual
            </span>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-700">
              {balances.PAID?.remaining ?? 14}
            </span>
            <span className="text-slate-500 ml-1 text-xs">/ {balances.PAID?.allocated ?? 18} Days</span>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-slate-200">
              <div
                className="bg-cyan-600 h-full rounded-full transition-all"
                style={{
                  width: `${((balances.PAID?.remaining ?? 14) / (balances.PAID?.allocated ?? 18)) * 100}%`,
                }}
              />
            </div>
          </div>
          <span className="text-[10px] text-slate-400">4 days used this year</span>
        </div>

        {/* Sick Leave */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Sick Leave</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Medical
            </span>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-600">
              {balances.SICK?.remaining ?? 10}
            </span>
            <span className="text-slate-500 ml-1 text-xs">/ {balances.SICK?.allocated ?? 12} Days</span>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{
                  width: `${((balances.SICK?.remaining ?? 10) / (balances.SICK?.allocated ?? 12)) * 100}%`,
                }}
              />
            </div>
          </div>
          <span className="text-[10px] text-slate-400">2 days requested</span>
        </div>

        {/* Casual Leave */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Casual Leave</span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Personal
            </span>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600">
              {balances.CASUAL?.remaining ?? 5}
            </span>
            <span className="text-slate-500 ml-1 text-xs">/ {balances.CASUAL?.allocated ?? 6} Days</span>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-slate-200">
              <div
                className="bg-amber-500 h-full rounded-full transition-all"
                style={{
                  width: `${((balances.CASUAL?.remaining ?? 5) / (balances.CASUAL?.allocated ?? 6)) * 100}%`,
                }}
              />
            </div>
          </div>
          <span className="text-[10px] text-slate-400">1 day used this year</span>
        </div>

        {/* Unpaid Leave */}
        <div className="p-5 rounded-2xl glass-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Unpaid Leave</span>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              Loss of Pay
            </span>
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold font-mono text-slate-800">
              {balances.UNPAID?.used ?? 0}
            </span>
            <span className="text-slate-500 ml-1 text-xs">Days Used</span>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-slate-200">
              <div className="bg-slate-400 h-full rounded-full" style={{ width: "0%" }} />
            </div>
          </div>
          <span className="text-[10px] text-slate-400">No salary deduction applied</span>
        </div>
      </div>

      {/* Leave Application History */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Calendar className="w-4 h-4 text-cyan-600" /> Leave Application Requests & Status
        </h3>

        {requests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No leave requests submitted yet.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="pb-3 font-semibold">Leave Type</th>
                <th className="pb-3 font-semibold">Start Date</th>
                <th className="pb-3 font-semibold">End Date</th>
                <th className="pb-3 font-semibold">Total Days</th>
                <th className="pb-3 font-semibold">Reason</th>
                <th className="pb-3 font-semibold">HR Comments</th>
                <th className="pb-3 font-semibold text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 font-bold text-slate-800">{req.leaveType} LEAVE</td>
                  <td className="py-3.5 font-mono text-slate-600">{formatDate(req.startDate)}</td>
                  <td className="py-3.5 font-mono text-slate-600">{formatDate(req.endDate)}</td>
                  <td className="py-3.5 font-mono font-bold text-cyan-700">{req.totalDays} Days</td>
                  <td className="py-3.5 text-slate-600 italic max-w-xs truncate">{req.reason}</td>
                  <td className="py-3.5 text-slate-500">{req.hrComments || "—"}</td>
                  <td className="py-3.5 text-right">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : req.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ApplyLeaveModal
        employeeId={employeeId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApplied={refresh}
      />
    </div>
  );
}
