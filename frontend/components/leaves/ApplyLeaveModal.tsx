"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { LeaveType } from "@/lib/mock-data";
import { X, Calendar, Send, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function ApplyLeaveModal({ isOpen, onClose, onSubmitted }: ApplyLeaveModalProps) {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState<LeaveType>("SICK");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate days difference
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for your leave application");
      return;
    }
    if (end < start) {
      toast.error("End date cannot be before start date");
      return;
    }

    setIsSubmitting(true);
    try {
      await DayflowApiClient.applyLeave({
        employeeId: user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
        employeeName: `${user?.employee.firstName} ${user?.employee.lastName}`,
        department: user?.employee.department || "Engineering",
        avatarUrl: user?.employee.avatarUrl || "",
        leaveType,
        startDate,
        endDate,
        totalDays: calculatedDays,
        reason,
      });

      toast.success("Leave application submitted!", {
        description: `Your ${calculatedDays}-day ${leaveType} leave request has been sent for HR review.`,
      });
      onSubmitted?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit leave application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl p-5 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">Apply for Time Off</h3>
            <p className="text-xs text-slate-400">Submit your leave request for HR approval.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Leave Type Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-[var(--border)] text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            >
              <option value="PAID">Paid Vacation Leave (Annual Quota: 18)</option>
              <option value="SICK">Medical / Sick Leave (Quota: 10)</option>
              <option value="CASUAL">Casual / Personal Leave (Quota: 6)</option>
              <option value="UNPAID">Unpaid Leave (Affects Payable Days)</option>
            </select>
          </div>

          {/* Date Range Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-[var(--border)] text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-[var(--border)] text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>

          {/* Calculated Duration Banner */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between text-xs">
            <span className="text-slate-300">Total Requested Duration:</span>
            <span className="font-bold text-cyan-400 font-mono text-sm">{calculatedDays} Day(s)</span>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Remarks</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Doctor consultation, recovery from seasonal flu, or personal travel..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-[var(--border)] text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Submitting..." : "Submit Leave Application"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
