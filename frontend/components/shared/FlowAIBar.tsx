"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Bot, ArrowRight, UserCheck, Calendar, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

interface FlowAIBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FlowAIBar({ isOpen, onClose }: FlowAIBarProps) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleAsk = (text?: string) => {
    const q = text || query;
    if (!q.trim()) return;

    setIsThinking(true);
    setResponse(null);

    setTimeout(() => {
      setIsThinking(false);
      const lower = q.toLowerCase();

      if (lower.includes("leave") || lower.includes("vacation") || lower.includes("off")) {
        setResponse({
          type: "leave",
          title: "Leave Status Insights",
          text: "Currently, Chloe Dupont (Lead UI/UX Designer) is on approved Paid Leave until Aug 26. Alex Rivera has a pending 2-day Sick Leave application (Aug 24 - Aug 25) awaiting HR review.",
          actionText: "Open Leave Approval Queue",
          actionRoute: "/dashboard/admin/leaves",
        });
      } else if (lower.includes("attendance") || lower.includes("present") || lower.includes("rate")) {
        setResponse({
          type: "attendance",
          title: "Real-time Attendance Metric",
          text: "Today's presence rate is 91% (10 out of 11 active employees clocked in). Average work hours logged this week: 8.4 hrs/day.",
          actionText: "View Company Attendance Grid",
          actionRoute: "/dashboard/admin/attendance",
        });
      } else if (lower.includes("payroll") || lower.includes("salary") || lower.includes("wage") || lower.includes("cost")) {
        setResponse({
          type: "payroll",
          title: "Payroll Summary & Dynamic Recalculation",
          text: "Total monthly company payroll is ₹8,57,000 across 11 staff members. Highest departmental spend: Engineering (₹2,85,000). All salary structures automatically recalculate on wage edit.",
          actionText: "Open Salary & Payroll Matrix",
          actionRoute: "/dashboard/admin/payroll",
        });
      } else {
        setResponse({
          type: "general",
          title: "Dayflow AI Copilot",
          text: `Found relevant records for "${q}". Dayflow provides complete HR operations including live attendance tracking, dynamic wage recalculation, leave approvals, and 1-click PDF payslips.`,
          actionText: "Go to Executive Dashboard",
          actionRoute: "/dashboard/admin",
        });
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-cyan-300 shadow-2xl p-6 sm:p-7 overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              FlowAI Copilot <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold border border-cyan-200">Fast Insights</span>
            </h3>
            <p className="text-xs text-slate-500">Ask any question about employees, attendance, leaves, or payroll.</p>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="relative flex items-center mb-4"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Who is on leave next week? Or check payroll spend..."
            className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            autoFocus
          />
          <button
            type="submit"
            disabled={!query.trim() || isThinking}
            className="absolute right-2.5 p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleAsk("Who is on leave next week?")}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-[11px] text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors font-medium"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-600" /> Who is on leave?
          </button>
          <button
            onClick={() => handleAsk("Check today's attendance rate")}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-[11px] text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors font-medium"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Today&apos;s Attendance
          </button>
          <button
            onClick={() => handleAsk("Total monthly payroll spend")}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-[11px] text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors font-medium"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Total Payroll Cost
          </button>
        </div>

        {/* Thinking State */}
        {isThinking && (
          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center gap-3 animate-pulse">
            <Bot className="w-5 h-5 text-cyan-600 animate-spin" />
            <span className="text-xs text-cyan-900 font-medium">Analyzing HR records and computing live metrics...</span>
          </div>
        )}

        {/* Response Box */}
        {response && (
          <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-xs animate-in fade-in">
            <h4 className="font-bold text-cyan-900 text-sm mb-1">{response.title}</h4>
            <p className="text-slate-700 leading-relaxed mb-3">{response.text}</p>
            {response.actionRoute && (
              <button
                onClick={() => {
                  onClose();
                  router.push(response.actionRoute);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <span>{response.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
