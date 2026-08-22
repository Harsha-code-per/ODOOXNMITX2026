"use client";

import React, { useState } from "react";
import { LeaveRequest } from "@/lib/mock-data";
import { DayflowApiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { X, CheckCircle2, XCircle, Calendar, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import confetti from "canvas-confetti";

interface LeaveApprovalDrawerProps {
  request: LeaveRequest | null;
  onClose: () => void;
  onReviewed: () => void;
}

export function LeaveApprovalDrawer({ request, onClose, onReviewed }: LeaveApprovalDrawerProps) {
  const { user } = useAuth();
  const [hrComments, setHrComments] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!request) return null;

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    setIsProcessing(true);
    try {
      const reviewer = `${user?.employee.firstName || "Sarah"} ${user?.employee.lastName || "Jenkins"}`;
      await DayflowApiClient.reviewLeave(
        request.id,
        status,
        hrComments || (status === "APPROVED" ? "Approved by HR." : "Rejected due to operational requirements."),
        reviewer
      );

      if (status === "APPROVED") {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
        toast.success(`Leave request from ${request.employeeName} approved!`, {
          description: "Attendance records and leave quotas updated.",
        });
      } else {
        toast.info(`Leave request rejected`);
      }

      onReviewed();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to process leave action");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl p-5 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border)]">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/40 bg-slate-800 flex items-center justify-center text-sm font-bold text-cyan-300">
            {request.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={request.avatarUrl} alt={request.employeeName} className="w-full h-full object-cover" />
            ) : (
              <span>{request.employeeName[0]}</span>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">{request.employeeName}</h3>
            <p className="text-xs text-cyan-400">{request.department} · {request.totalDays} Day(s) {request.leaveType} Leave</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)]">
            <span className="text-slate-400 block mb-0.5">Start Date</span>
            <span className="font-semibold text-slate-100">{formatDate(request.startDate)}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)]">
            <span className="text-slate-400 block mb-0.5">End Date</span>
            <span className="font-semibold text-slate-100">{formatDate(request.endDate)}</span>
          </div>
        </div>

        {/* Reason Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-[var(--border)] mb-4 text-xs">
          <span className="text-slate-400 block font-semibold mb-1">Employee Remarks / Reason:</span>
          <p className="text-slate-200 leading-relaxed italic">&quot;{request.reason}&quot;</p>
        </div>

        {/* HR Comment Input */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> HR Comments / Decision Note:
          </label>
          <input
            type="text"
            value={hrComments}
            onChange={(e) => setHrComments(e.target.value)}
            placeholder="e.g. Approved. Get well soon! Or provide reason for rejection..."
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-[var(--border)] text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction("REJECTED")}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Request</span>
          </button>

          <button
            onClick={() => handleAction("APPROVED")}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
}
