"use client";

import React, { useState } from "react";
import { LeaveRequest } from "@/lib/mock-data";
import { DayflowApiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { X, CheckCircle2, XCircle, Calendar, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import confetti from "canvas-confetti";
import { AvatarBadge } from "@/components/shared/AvatarBadge";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-cyan-300 shadow-2xl p-6 sm:p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <AvatarBadge
            name={request.employeeName}
            department={request.department}
            size="md"
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">{request.employeeName}</h3>
            <p className="text-xs text-cyan-800 font-semibold">{request.department} · {request.totalDays} Day(s) {request.leaveType} Leave</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[10px] block mb-0.5 font-semibold">Start Date</span>
            <span className="font-bold text-slate-800">{formatDate(request.startDate)}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[10px] block mb-0.5 font-semibold">End Date</span>
            <span className="font-bold text-slate-800">{formatDate(request.endDate)}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 text-xs">
          <span className="text-slate-400 text-[10px] block mb-1 font-semibold">Applicant Statement</span>
          <p className="text-slate-700 italic leading-relaxed">&quot;{request.reason}&quot;</p>
        </div>

        {/* HR Comments */}
        <div className="mb-5 text-xs">
          <label className="block text-slate-700 font-semibold mb-1.5 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
            <span>HR Decision Notes (Optional)</span>
          </label>
          <textarea
            value={hrComments}
            onChange={(e) => setHrComments(e.target.value)}
            placeholder="Add comments or instructions for the applicant..."
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleAction("REJECTED")}
            className="py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1.5 transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Request</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleAction("APPROVED")}
            className="py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Update Quota</span>
          </button>
        </div>
      </div>
    </div>
  );
}
