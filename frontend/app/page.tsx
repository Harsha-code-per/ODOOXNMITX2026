"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { PersonaDemoBar } from "@/components/shared/PersonaDemoBar";
import { FlowAIBar } from "@/components/shared/FlowAIBar";
import { ParticleScene } from "@/components/landing/ParticleScene";
import { InteractiveWageDemo } from "@/components/landing/InteractiveWageDemo";
import {
  Sparkles,
  Zap,
  Play,
  ShieldCheck,
  Clock,
  Calculator,
  Palmtree,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  Users,
  Activity,
  Award,
} from "lucide-react";
import Lenis from "lenis";

export default function LandingPage() {
  const router = useRouter();
  const { switchPersona } = useAuth();
  const [isFlowAIOpen, setIsFlowAIOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Initialize Lenis Smooth Scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? window.scrollY / totalScroll : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      lenis.destroy();
    };
  }, []);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-800 relative overflow-hidden flex flex-col font-sans">
      {/* 3D WebGL Particle Canvas Background (Mesh3D Style) */}
      <ParticleScene scrollProgress={scrollProgress} />

      {/* Top Demo Persona Bar */}
      <PersonaDemoBar />

      {/* Main Studio Navbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl p-1 bg-white border border-cyan-300 shadow-sm flex items-center justify-center overflow-hidden hover:scale-105 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Dayflow Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight flex items-center gap-1.5 text-slate-900">
                Dayflow
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                  HRMS
                </span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline -mt-0.5">
                Every workday, perfectly aligned.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFlowAIOpen(true)}
              className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-cyan-700 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Ask FlowAI</span>
            </button>

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 shadow-sm transition-all"
            >
              Sign In
            </Link>

            <button
              onClick={() => handleLaunch("hr")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              Launch HR Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container with Mesh3D Scrollytelling Sections */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* SECTION 1: HERO SECTION                                                   */}
        {/* ========================================================================= */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center pt-8 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-cyan-200/80 text-cyan-800 text-xs font-bold mb-6 shadow-sm backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-cyan-600 fill-cyan-600" />
            <span>Odoo × NMIT Hackathon 2026 Submission</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tight max-w-5xl leading-[1.08] text-slate-900 mb-6">
            Every workday, <br />
            <span className="text-gradient-cyan">perfectly aligned.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-10">
            The next-generation Human Resource Management System engineered for speed, fluid intelligence, and real-time dynamic compensation recalculation.
          </p>

          {/* 1-Click Judge Persona Launch CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={() => handleLaunch("employee")}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Try as Employee (Alex Rivera)</span>
            </button>

            <button
              onClick={() => handleLaunch("hr")}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm sm:text-base shadow-lg hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all"
            >
              <ShieldCheck className="w-5 h-5 text-cyan-600" />
              <span>Try as HR Director (Sarah)</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Scroll Down Indicator */}
          <div className="flex flex-col items-center gap-2 text-xs font-semibold text-slate-400 animate-bounce">
            <span>SCROLL TO EXPLORE 3D WORKFLOWS</span>
            <div className="w-5 h-8 rounded-full border-2 border-slate-300 flex items-start justify-center p-1">
              <div className="w-1.5 h-2 bg-cyan-500 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: WORKFORCE AT SCALE (BIG DATA METRICS)                          */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-slate-200/80">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 block mb-2">
              REAL-TIME ENTERPRISE VELOCITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 tracking-tight">
              Governing modern organizations with sub-second precision.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="glass-card rounded-3xl p-6 sm:p-8 text-center">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-mono text-slate-900 block mb-2">
                15+
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-600 block">Active Staff Profiles</span>
              <span className="text-[11px] text-cyan-600 font-medium">5 Departments Synced</span>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 text-center cyan-glow-subtle border-cyan-200">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-mono text-cyan-600 block mb-2">
                91%
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-600 block">Daily Presence Velocity</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Real-Time Stopwatch</span>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 text-center">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-mono text-slate-900 block mb-2">
                100%
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-600 block">Statutory Compliance</span>
              <span className="text-[11px] text-cyan-600 font-medium">PF (12%) + PT (₹200)</span>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-8 text-center">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-mono text-slate-900 block mb-2">
                &lt;10ms
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-600 block">Wage Recalculation</span>
              <span className="text-[11px] text-cyan-600 font-medium">Instant Dynamic Engine</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: INTERACTIVE WAGE DEMO (LIVE ENGINE ON LANDING)                 */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 block mb-2">
              PROPRIETARY PAYROLL FORMULA
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
              Test the Dynamic Wage Engine Live
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every allowance, statutory deduction, and net take-home pay is mathematically linked to the Base Wage (CTC).
            </p>
          </div>

          <InteractiveWageDemo />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: 3-PILLAR FEATURE SHOWCASE (AWWWARDS CARDS)                     */}
        {/* ========================================================================= */}
        <section className="py-20 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 block mb-2">
              ARCHITECTED FOR EXCELLENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
              Built to win the Odoo × NMIT Hackathon
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Attendance Pulse */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:border-cyan-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                  Live Attendance Pulse
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Second-by-second ticking session stopwatch with check-in timestamping, break tracking, and daily presence metrics.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-mono text-cyan-700 font-bold text-xs">08:34:12 ACTIVE</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>

            {/* Card 2: Conflict Prevention */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:border-cyan-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Palmtree className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                  Conflict-Free Leaves
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Automated schedule overlap detection prevents department understaffing with instant 1-click approvals.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Capacity Health</span>
                <span className="font-mono font-bold text-cyan-700">75% Available</span>
              </div>
            </div>

            {/* Card 3: 1-Click PDF Payslips */}
            <div className="glass-card rounded-3xl p-8 flex flex-col justify-between group hover:border-cyan-300 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                  Branded PDF Payslips
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Instant client-side salary statement generation using jsPDF with statutory breakdown and company seal.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Download Ready</span>
                <span className="font-mono font-bold text-emerald-600">A4 High-Res PDF</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: FINAL LAUNCH PORTAL CTA                                        */}
        {/* ========================================================================= */}
        <section className="py-24 border-t border-slate-200/80">
          <div className="rounded-3xl glass-panel border border-cyan-300/80 p-8 sm:p-14 text-center relative overflow-hidden cyan-glow">
            <div className="max-w-3xl mx-auto relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 block mb-3">
                READY FOR EVALUATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-slate-900 tracking-tight mb-4">
                Experience Dayflow HRMS Right Now
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
                Switch personas instantly with the top demo bar, test dynamic recalculations, and explore the future of HR.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => handleLaunch("employee")}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all"
                >
                  Enter Employee Portal (Alex)
                </button>
                <button
                  onClick={() => handleLaunch("hr")}
                  className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-sm shadow-md hover:scale-105 transition-all"
                >
                  Enter HR Command Center (Sarah)
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg p-0.5 bg-cyan-50 border border-cyan-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Dayflow Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-slate-800">Dayflow HRMS</span>
            <span>— Odoo × NMIT Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard/employee" className="hover:text-cyan-700 transition-colors">
              Employee Portal
            </Link>
            <Link href="/dashboard/admin" className="hover:text-cyan-700 transition-colors">
              Admin Command Center
            </Link>
            <Link href="/login" className="hover:text-cyan-700 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>

      {/* FlowAI Assistant Modal */}
      <FlowAIBar isOpen={isFlowAIOpen} onClose={() => setIsFlowAIOpen(false)} />
    </div>
  );
}
