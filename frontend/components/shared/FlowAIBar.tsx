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
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl p-4 sm:p-6 overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)] flex items-center gap-1.5">
              FlowAI Copilot <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Fast Insights</span>
            </h3>
            <p className="text-xs text-slate-400">Ask any question about employees, attendance, leaves, or payroll.</p>
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
            className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            autoFocus
          />
          <button
            type="submit"
            disabled={!query.trim() || isThinking}
            className="absolute right-2 p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => handleAsk("Who is on leave next week?")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-[11px] text-cyan-300 border border-slate-700/50 flex items-center gap-1 transition-colors"
          >
            <Calendar className="w-3 h-3 text-cyan-400" /> Who is on leave?
          </button>
          <button
            onClick={() => handleAsk("Check today's attendance rate")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-[11px] text-cyan-300 border border-slate-700/50 flex items-center gap-1 transition-colors"
          >
            <UserCheck className="w-3 h-3 text-emerald-400" /> Today&apos;s Attendance
          </button>
          <button
            onClick={() => handleAsk("Total monthly payroll spend")}
            className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-[11px] text-cyan-300 border border-slate-700/50 flex items-center gap-1 transition-colors"
          >
            <DollarSign className="w-3 h-3 text-amber-400" /> Total Payroll Cost
          </button>
        </div>

        {/* Thinking State */}
        {isThinking && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-[var(--border)] flex items-center gap-3 animate-pulse">
            <Bot className="w-5 h-5 text-cyan-400 animate-spin" />
            <span className="text-xs text-slate-300">Analyzing HR records and computing metrics...</span>
          </div>
        )}

        {/* Response Box */}
        {response && (
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs animate-in fade-in">
            <h4 className="font-bold text-cyan-400 text-sm mb-1">{response.title}</h4>
            <p className="text-slate-200 leading-relaxed mb-3">{response.text}</p>
            {response.actionRoute && (
              <button
                onClick={() => {
                  onClose();
                  router.push(response.actionRoute);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
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
