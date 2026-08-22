"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ParticleScene } from "@/components/landing/ParticleScene";
import { InteractiveWageDemo } from "@/components/landing/InteractiveWageDemo";
import {
  Clock,
  Calculator,
  Palmtree,
  ArrowRight,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
  Lock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Lenis from "lenis";

export default function LandingPage() {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900 relative overflow-hidden flex flex-col font-sans">
      {/* 3D WebGL Kinetic Wave Mesh Background */}
      <ParticleScene scrollProgress={scrollProgress} />

      {/* Clean Public Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Clean Brand: Logo with NO borders + Brand Title */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Dayflow"
              className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
              Dayflow
            </span>
          </Link>

          {/* Right Navigation: Only Sign In & Get Started */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-16 pb-20">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            {/* Minimal Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              <span>Enterprise Workforce Operating System</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-slate-900 tracking-tight leading-[1.08]">
              Every workday, <br />
              <span className="text-cyan-700">perfectly aligned.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mt-6 leading-relaxed">
              The next-generation Human Resource Management System engineered for real-time attendance velocity, conflict-free leave governance, and dynamic statutory payroll.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
              <Link
                href="/signup"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02]"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 shadow-xs transition-all hover:scale-[1.02]"
              >
                <span>Sign In to Workspace</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 1: Enterprise Metrics */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
                Enterprise Reliability
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">
                Governing modern organizations with precision
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white/90 border border-slate-200 shadow-xs">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 block">
                  &lt;10ms
                </span>
                <span className="text-xs font-semibold text-slate-700 mt-1 block">
                  Wage Recalculation
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Instant dynamic engine</span>
              </div>

              <div className="p-6 rounded-3xl bg-white/90 border border-slate-200 shadow-xs">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-700 block">
                  100%
                </span>
                <span className="text-xs font-semibold text-slate-700 mt-1 block">
                  Statutory Compliance
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">PF (12%) & PT formulas</span>
              </div>

              <div className="p-6 rounded-3xl bg-white/90 border border-slate-200 shadow-xs">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 block">
                  0
                </span>
                <span className="text-xs font-semibold text-slate-700 mt-1 block">
                  Scheduling Conflicts
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Capacity guard engine</span>
              </div>

              <div className="p-6 rounded-3xl bg-white/90 border border-slate-200 shadow-xs">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 block">
                  99.9%
                </span>
                <span className="text-xs font-semibold text-slate-700 mt-1 block">
                  Attendance Accuracy
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Biometric sync logging</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Live Statutory Compensation Simulator */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <InteractiveWageDemo />
          </div>
        </section>

        {/* Section 3: Core Pillars */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
                Architectural Foundation
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-1">
                Built for speed, accuracy, and autonomy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <div className="p-7 rounded-3xl bg-white/90 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-cyan-400 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5 border border-cyan-200">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Live Attendance Pulse
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Second-by-second session stopwatch with check-in timestamping, break tracking, and daily presence metrics with biometric synchronization.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>08:34:12 Active</span>
                  <span className="text-emerald-600 font-bold">Live Session</span>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-7 rounded-3xl bg-white/90 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-cyan-400 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5 border border-cyan-200">
                    <Palmtree className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Conflict-Free Leaves
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automated schedule overlap detection prevents department understaffing with instant 1-click approvals and balance quota tracking.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Capacity Health</span>
                  <span className="text-cyan-800 font-bold">75% Available</span>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-7 rounded-3xl bg-white/90 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-cyan-400 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-5 border border-cyan-200">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    Dynamic Salary Engine
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Adjust base wage and all components dynamically recompute in real-time. Export high-resolution branded PDF payslips in one click.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>PDF Generator</span>
                  <span className="text-cyan-800 font-bold">Vector High-Res</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Enterprise Security */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl bg-white/90 border border-slate-200 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto mb-4 border border-slate-200">
              <ShieldCheck className="w-6 h-6 text-cyan-700" />
            </div>

            <h2 className="text-2xl font-bold font-heading text-slate-900">
              Enterprise Grade Governance & Security
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
              Every data transfer is protected with AES-256 encryption, role-based access control (RBAC), and immutable audit trails.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Granular Permissions
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Statutory Tax Audit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Biometric Sync
              </span>
            </div>
          </div>
        </section>

        {/* Section 5: Bottom CTA */}
        <section className="py-20 px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">
              Ready to elevate your HR operations?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 max-w-md mx-auto">
              Join leading organizations managing attendance, time off, and dynamic payroll seamlessly with Dayflow.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
              <Link
                href="/signup"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02]"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 shadow-xs transition-all hover:scale-[1.02]"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Corporate Footer */}
      <footer className="w-full bg-white border-t border-slate-200 px-6 sm:px-12 py-8 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Dayflow Logo" className="h-6 w-6 object-contain" />
            <span className="font-heading font-bold text-slate-900 text-sm">Dayflow</span>
            <span className="text-slate-400 ml-2">© 2026 Dayflow Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-slate-900 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
