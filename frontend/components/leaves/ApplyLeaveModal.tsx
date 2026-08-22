"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { LeaveType } from "@/lib/mock-data";
import { X, Calendar, Send } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface ApplyLeaveModalProps {
  employeeId?: string;
  isOpen: boolean;
  onClose: () => void;
  onApplied?: () => void;
}

export function ApplyLeaveModal({ employeeId, isOpen, onClose, onApplied }: ApplyLeaveModalProps) {
  const { user } = useAuth();
  const [leaveType, setLeaveType] = useState<LeaveType>("SICK");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
        employeeId: employeeId || user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
        employeeName: `${user?.employee.firstName || "Alex"} ${user?.employee.lastName || "Rivera"}`,
        department: user?.employee.department || "Engineering",
        avatarUrl: "",
        leaveType,
        startDate,
        endDate,
        totalDays: calculatedDays,
        reason,
      });

      confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
      toast.success("Leave application submitted!", {
        description: `Your ${calculatedDays}-day ${leaveType} leave request has been sent for HR review.`,
      });
      onApplied?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit leave application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-cyan-300 shadow-2xl p-6 sm:p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Apply for Time Off</h3>
            <p className="text-xs text-slate-500">Submit your leave request for HR approval.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Leave Type Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-cyan-500"
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
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Calculated Duration Banner */}
          <div className="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Total Requested Duration:</span>
            <span className="font-bold text-cyan-800 font-mono text-sm">{calculatedDays} Day(s)</span>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reason / Remarks</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Doctor consultation, recovery from seasonal flu, or personal travel..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? "Submitting..." : "Submit Leave Application"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
