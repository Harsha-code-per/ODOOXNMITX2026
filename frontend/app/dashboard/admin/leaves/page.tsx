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
import { AvatarBadge } from "@/components/shared/AvatarBadge";

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
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Leave Approvals & Scheduling</h1>
          <p className="text-xs text-slate-500">
            Review time-off applications, prevent department coverage conflicts, and enforce quotas.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs">
          <button
            onClick={() => setTab("PENDING")}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              tab === "PENDING"
                ? "bg-cyan-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Pending Queue ({pendingList.length})
          </button>
          <button
            onClick={() => setTab("PROCESSED")}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              tab === "PROCESSED"
                ? "bg-cyan-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            Reviewed History ({processedList.length})
          </button>
        </div>
      </div>

      {/* Team Overlap Conflict Warning Banner */}
      <div className="p-5 rounded-3xl bg-cyan-50/80 border border-cyan-200 shadow-xs flex items-start gap-3.5 text-xs">
        <Sparkles className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-900 block mb-0.5 text-sm">Automated Schedule Conflict Engine</span>
          <p className="text-slate-700 leading-relaxed">
            Chloe Dupont (Product) is currently on approved leave (Aug 21 - Aug 26). Engineering team has 100% capacity available. Approving Alex Rivera&apos;s request maintains healthy 75% department staffing.
          </p>
        </div>
      </div>

      {/* Main List */}
      {tab === "PENDING" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pendingList.length === 0 ? (
            <div className="col-span-2 p-14 text-center text-xs text-slate-400 glass-panel rounded-3xl flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              <p className="text-slate-800 font-bold text-base">All clear! No pending leave requests.</p>
              <span>Employee leave submissions will appear here for review.</span>
            </div>
          ) : (
            pendingList.map((req) => (
              <div
                key={req.id}
                className="glass-card rounded-3xl p-6 border border-cyan-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Top Applicant row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <AvatarBadge
                        name={req.employeeName}
                        department={req.department}
                        size="md"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{req.employeeName}</h4>
                        <span className="text-xs text-cyan-700 font-semibold">{req.department}</span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                      PENDING REVIEW
                    </span>
                  </div>

                  {/* Dates & duration */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-semibold">Leave Type</span>
                      <span className="font-bold text-slate-800">{req.leaveType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-semibold">Requested Period</span>
                      <span className="font-mono text-cyan-700 font-bold">
                        {formatDate(req.startDate)} ({req.totalDays}d)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed mb-6">&quot;{req.reason}&quot;</p>
                </div>

                <button
                  onClick={() => setActiveRequest(req)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all"
                >
                  Review & Approve / Reject
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Reviewed History Table */
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="pb-3 font-semibold">Employee</th>
                <th className="pb-3 font-semibold">Leave Type</th>
                <th className="pb-3 font-semibold">Dates</th>
                <th className="pb-3 font-semibold">Days</th>
                <th className="pb-3 font-semibold">Decision</th>
                <th className="pb-3 font-semibold">HR Comments</th>
                <th className="pb-3 font-semibold">Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedList.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900">{req.employeeName}</td>
                  <td className="py-3.5 font-semibold text-slate-700">{req.leaveType}</td>
                  <td className="py-3.5 font-mono text-slate-600">
                    {formatDate(req.startDate)} → {formatDate(req.endDate)}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-cyan-700">{req.totalDays}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600 italic max-w-xs truncate">{req.hrComments || "—"}</td>
                  <td className="py-3.5 text-slate-500">{req.reviewedBy || "Sarah Jenkins"}</td>
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
