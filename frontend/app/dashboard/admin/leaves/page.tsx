"use client";

import React, { useState, useEffect } from "react";
import { DayflowApiClient } from "@/lib/api";
import { LeaveRequest } from "@/lib/mock-data";
import { LeaveApprovalDrawer } from "@/components/leaves/LeaveApprovalDrawer";
import { formatDate } from "@/lib/utils";
import {
  Palmtree,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  AlertTriangle,
  Sparkles,
  Users,
} from "lucide-react";

export default function AdminLeavesPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [activeRequest, setActiveRequest] = useState<LeaveRequest | null>(null);
  const [tab, setTab] = useState<"PENDING" | "PROCESSED">("PENDING");

  const loadRequests = () => {
    DayflowApiClient.getLeaveRequests().then(setRequests);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingList = requests.filter((r) => r.status === "PENDING");
  const processedList = requests.filter((r) => r.status !== "PENDING");

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Leave Approvals & Scheduling</h1>
          <p className="text-xs text-slate-400">
            Review time-off applications, prevent department coverage conflicts, and enforce quotas.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-[var(--border)] text-xs">
          <button
            onClick={() => setTab("PENDING")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              tab === "PENDING"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pending Queue ({pendingList.length})
          </button>
          <button
            onClick={() => setTab("PROCESSED")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              tab === "PROCESSED"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Reviewed History ({processedList.length})
          </button>
        </div>
      </div>

      {/* Team Overlap Conflict Warning Banner */}
      <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 cyan-glow-subtle flex items-start gap-3 text-xs">
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-300 block mb-0.5">Automated Schedule Conflict Engine</span>
          <p className="text-slate-300 leading-relaxed">
            Chloe Dupont (Product) is currently on approved leave (Aug 21 - Aug 26). Engineering team has 100% capacity available. Approving Alex Rivera&apos;s request maintains healthy 75% department staffing.
          </p>
        </div>
      </div>

      {/* Main List */}
      {tab === "PENDING" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pendingList.length === 0 ? (
            <div className="col-span-2 p-12 text-center text-xs text-slate-500 glass-panel rounded-2xl flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              <p className="text-slate-300 font-semibold text-sm">All clear! No pending leave requests.</p>
              <span>Employee leave submissions will appear here for review.</span>
            </div>
          ) : (
            pendingList.map((req) => (
              <div
                key={req.id}
                className="glass-card rounded-2xl p-5 border border-cyan-500/30 cyan-glow-subtle flex flex-col justify-between"
              >
                <div>
                  {/* Top Applicant row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-800 flex items-center justify-center font-bold text-cyan-300 shadow-md">
                        {req.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={req.avatarUrl} alt={req.employeeName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{req.employeeName[0]}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm">{req.employeeName}</h4>
                        <span className="text-xs text-cyan-400 font-medium">{req.department}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                      PENDING REVIEW
                    </span>
                  </div>

                  {/* Dates & duration */}
                  <div className="p-3 rounded-xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Leave Type</span>
                      <span className="font-bold text-slate-200">{req.leaveType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Requested Period</span>
                      <span className="font-mono text-cyan-300 font-semibold">
                        {formatDate(req.startDate)} ({req.totalDays}d)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic leading-relaxed mb-4">&quot;{req.reason}&quot;</p>
                </div>

                <button
                  onClick={() => setActiveRequest(req)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all"
                >
                  Review & Approve / Reject
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Reviewed History Table */
        <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400">
                <th className="pb-3 font-semibold">Employee</th>
                <th className="pb-3 font-semibold">Leave Type</th>
                <th className="pb-3 font-semibold">Dates</th>
                <th className="pb-3 font-semibold">Days</th>
                <th className="pb-3 font-semibold">Decision</th>
                <th className="pb-3 font-semibold">HR Comments</th>
                <th className="pb-3 font-semibold">Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {processedList.map((req) => (
                <tr key={req.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 font-bold text-slate-200">{req.employeeName}</td>
                  <td className="py-3 font-semibold text-slate-300">{req.leaveType}</td>
                  <td className="py-3 font-mono text-slate-400">
                    {formatDate(req.startDate)} → {formatDate(req.endDate)}
                  </td>
                  <td className="py-3 font-mono font-bold text-cyan-400">{req.totalDays}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        req.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 italic max-w-xs truncate">{req.hrComments || "—"}</td>
                  <td className="py-3 text-slate-400">{req.reviewedBy || "Sarah Jenkins"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Leave Approval Drawer Modal */}
      <LeaveApprovalDrawer
        request={activeRequest}
        onClose={() => setActiveRequest(null)}
        onReviewed={loadRequests}
      />
    </div>
  );
}
