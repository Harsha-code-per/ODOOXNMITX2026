"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { PersonaDemoBar } from "@/components/shared/PersonaDemoBar";
import { FlowAIBar } from "@/components/shared/FlowAIBar";
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  Wallet,
  Palmtree,
  Play,
  FileDown,
  ChevronRight,
  Activity,
  Layers,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { switchPersona } = useAuth();
  const [isFlowAIOpen, setIsFlowAIOpen] = useState(false);

  const handleLaunch = (role: "employee" | "hr") => {
    if (role === "employee") {
      switchPersona("alex");
      router.push("/dashboard/employee");
    } else {
      switchPersona("sarah");
      router.push("/dashboard/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-cyan-500/20 selection:text-cyan-300 relative overflow-hidden flex flex-col">
      {/* Top Demo Bar */}
      <PersonaDemoBar />

      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[450px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Navbar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-cyan-500/30">
            D
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight">
            Dayflow <span className="text-cyan-400 font-semibold text-sm">HRMS</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFlowAIOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-[var(--border)] text-xs text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ask FlowAI</span>
          </button>

          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-bold text-slate-200 transition-all"
          >
            Sign In
          </Link>

          <button
            onClick={() => handleLaunch("hr")}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
          >
            Launch Command Center
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-20 flex flex-col items-center text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6 animate-pulse">
          <Zap className="w-3.5 h-3.5" />
          <span>Odoo × NMIT Hackathon 2026 Submission</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tight max-w-4xl leading-[1.1] mb-6">
          Every workday, <br />
          <span className="text-gradient-cyan">perfectly aligned.</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed mb-8">
          The next-generation Human Resource Management System engineered for speed, fluid intelligence, and dynamic compensation recalculation.
        </p>

        {/* 1-Click Persona CTA Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={() => handleLaunch("employee")}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Try as Employee (Alex Rivera)</span>
          </button>

          <button
            onClick={() => handleLaunch("hr")}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl glass-panel border border-cyan-500/40 hover:border-cyan-400 text-slate-100 font-bold text-sm shadow-xl shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Try as HR Director (Sarah)</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Bento Grid Feature Showcase */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-16">
          {/* Card 1: Attendance Pulse */}
          <div className="glass-card rounded-2xl p-6 border border-[var(--border)] flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[var(--foreground)] mb-1">Live Attendance Pulse</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Real-time ticking stopwatch with check-in timestamping, break tracking, and daily presence metrics.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 font-mono text-cyan-300 text-xs flex items-center justify-between">
              <span>08:34:12 ON DUTY</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>

          {/* Card 2: Dynamic Salary Recalculation Engine */}
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 cyan-glow-subtle flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[var(--foreground)] mb-1">Dynamic Wage Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Adjust base Wage (CTC) and watch Basic, HRA, PF, PT, and Net Pay automatically recalculate with 1-click PDF payslips.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-blue-500/20 font-mono text-xs flex items-center justify-between">
              <span className="text-slate-400">₹60,000 → ₹75,000</span>
              <span className="text-emerald-400 font-bold">Auto-Recalculated</span>
            </div>
          </div>

          {/* Card 3: Leave Quotas & Overlap Calendar */}
          <div className="glass-card rounded-2xl p-6 border border-[var(--border)] flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Palmtree className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[var(--foreground)] mb-1">Leave & Time-Off Hub</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Multi-tier leave quotas (Paid, Sick, Casual, Unpaid) with 1-click HR approval drawers and attendance auto-sync.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/20 text-xs flex items-center justify-between">
              <span className="text-slate-300">18 Paid / 10 Sick Quota</span>
              <span className="text-purple-400 font-bold">Instant Sync</span>
            </div>
          </div>
        </div>

        {/* 10-Step Winning Demo Flow Banner */}
        <div className="w-full glass-panel rounded-2xl border border-cyan-500/30 p-6 sm:p-8 text-left">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">JUDGE EVALUATION STORYLINE</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">The 10-Step Winning Workflow</h2>
            </div>
            <button
              onClick={() => handleLaunch("employee")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <span>Begin Live Walkthrough</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)]">
              <span className="text-cyan-400 font-bold block mb-1">01. 1-Click Login</span>
              <span className="text-slate-400">Instant test login as Alex (Lead Engineer).</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)]">
              <span className="text-cyan-400 font-bold block mb-1">02. Clock In</span>
              <span className="text-slate-400">Stopwatch starts ticking + status PRESENT.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)]">
              <span className="text-cyan-400 font-bold block mb-1">03. Apply Leave</span>
              <span className="text-slate-400">Submit 2-day Sick leave with auto day count.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)]">
              <span className="text-cyan-400 font-bold block mb-1">04. HR Approval</span>
              <span className="text-slate-400">Switch to Sarah & approve request with note.</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)]">
              <span className="text-cyan-400 font-bold block mb-1">05. Wage Recalc</span>
              <span className="text-slate-400">Adjust CTC to ₹75k, auto-recalc & download PDF.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border)] py-6 px-4 text-center text-xs text-slate-500 z-10">
        <p>Dayflow HRMS · Built for Odoo × NMIT Hackathon 2026 · Powered by Next.js, FastAPI, & Supabase</p>
      </footer>

      {/* FlowAI Copilot Modal */}
      <FlowAIBar isOpen={isFlowAIOpen} onClose={() => setIsFlowAIOpen(false)} />
    </div>
  );
}
