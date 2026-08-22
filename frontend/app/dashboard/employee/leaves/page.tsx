"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { LeaveRequest, LeaveBalance } from "@/lib/mock-data";
import { ApplyLeaveModal } from "@/components/leaves/ApplyLeaveModal";
import { formatDate } from "@/lib/utils";
import { Palmtree, Plus, CheckCircle2, Clock, XCircle, Calendar, Sparkles } from "lucide-react";

export default function EmployeeLeavesPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<Record<string, LeaveBalance> | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const employeeId = user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";

  const refreshData = () => {
    DayflowApiClient.getLeaveRequests(employeeId).then(setRequests);
    DayflowApiClient.getLeaveBalances(employeeId).then(setBalances);
  };

  useEffect(() => {
    refreshData();
  }, [employeeId]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Leave & Time-Off Management</h1>
          <p className="text-xs text-slate-400">View your annual leave balances and submit time-off requests.</p>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Quota Balances 4-Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Paid Leave */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-purple-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-purple-400">PAID LEAVE</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">Annual</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-mono text-purple-300">
              {balances?.PAID?.remaining ?? 14}
            </div>
            <span className="text-[11px] text-slate-400">
              Remaining out of {balances?.PAID?.allocated ?? 18} days
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{
                width: `${((balances?.PAID?.used ?? 4) / (balances?.PAID?.allocated ?? 18)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Sick Leave */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-cyan-500/30 cyan-glow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-cyan-400">SICK / MEDICAL</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300">Medical</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-mono text-cyan-300">
              {balances?.SICK?.remaining ?? 8}
            </div>
            <span className="text-[11px] text-slate-400">
              Remaining out of {balances?.SICK?.allocated ?? 10} days
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-cyan-500 h-full rounded-full"
              style={{
                width: `${((balances?.SICK?.used ?? 2) / (balances?.SICK?.allocated ?? 10)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Casual Leave */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-emerald-400">CASUAL TIME OFF</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300">Short</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-mono text-emerald-300">
              {balances?.CASUAL?.remaining ?? 5}
            </div>
            <span className="text-[11px] text-slate-400">
              Remaining out of {balances?.CASUAL?.allocated ?? 6} days
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{
                width: `${((balances?.CASUAL?.used ?? 1) / (balances?.CASUAL?.allocated ?? 6)) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Unpaid Leave */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-400">UNPAID LEAVE</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Statutory</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-mono text-slate-300">
              {balances?.UNPAID?.used ?? 0}
            </div>
            <span className="text-[11px] text-slate-400">Days taken this year</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Directly impacts monthly payable days.</span>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-[var(--border)]">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-4 pb-2 border-b border-[var(--border)] flex items-center justify-between">
          <span>My Leave Applications</span>
          <span className="text-xs text-slate-400 font-normal">{requests.length} total request(s)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400">
                <th className="pb-2.5 font-semibold">Leave Type</th>
                <th className="pb-2.5 font-semibold">Duration</th>
                <th className="pb-2.5 font-semibold">Total Days</th>
                <th className="pb-2.5 font-semibold">Reason</th>
                <th className="pb-2.5 font-semibold">Status</th>
                <th className="pb-2.5 font-semibold">HR Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5">
                    <span className="font-bold text-slate-200 block">{req.leaveType}</span>
                    <span className="text-[10px] text-slate-500">Applied {formatDate(req.createdAt)}</span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-mono">
                    {formatDate(req.startDate)} → {formatDate(req.endDate)}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-cyan-400">{req.totalDays} Day(s)</td>
                  <td className="py-3.5 text-slate-300 max-w-xs leading-relaxed">{req.reason}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        req.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : req.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {req.status === "APPROVED" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : req.status === "PENDING" ? (
                        <Clock className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>{req.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-400 italic text-[11px]">
                    {req.hrComments ? (
                      <span>&quot;{req.hrComments}&quot;</span>
                    ) : req.status === "PENDING" ? (
                      <span className="text-amber-400/80">Pending HR Review</span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitted={refreshData}
      />
    </div>
  );
}
