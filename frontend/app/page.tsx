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
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import Lenis from "lenis";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-[#fafafc] text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900 relative overflow-hidden flex flex-col font-sans">
      {/* 3D WebGL Kinetic Wave Mesh Background */}
      <ParticleScene scrollProgress={scrollProgress} />

      {/* Pinned Independent Floating Corner Islands */}
      <header className="fixed top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-50 pointer-events-none flex items-center justify-between">
        {/* Left Floating Brand Pill */}
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white transition-all group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Dayflow"
            className="h-7 w-7 object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900">
            Dayflow
          </span>
        </Link>

        {/* Right Floating Actions Pill */}
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {/* Full 100vh Viewport Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 relative pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto flex flex-col items-center"
          >
            {/* Minimal Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/80 text-slate-600 text-xs font-medium mb-7 shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>Enterprise Workforce Operating System</span>
            </motion.div>

            {/* Cinematic Main Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold font-heading text-slate-900 tracking-[-0.04em] leading-[1.03]">
              Every workday, <br />
              <span className="text-cyan-700">perfectly aligned.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mt-7 font-normal leading-relaxed">
              The next-generation Human Resource Management System engineered for real-time attendance velocity, conflict-free leave governance, and dynamic statutory payroll.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-9">
              <Link
                href="/signup"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm sm:text-base shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/80 hover:bg-white text-slate-800 font-semibold text-sm sm:text-base border border-white/80 shadow-xs backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                <span>Sign In to Workspace</span>
              </Link>
            </div>
          </motion.div>

          {/* Ambient Floating Scroll Prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400 pointer-events-none select-none"
          >
            <span className="text-[11px] font-medium tracking-wider uppercase">Scroll to explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-slate-400" />
          </motion.div>
        </section>

        {/* Section 1: Enterprise Metrics (Frosted Glassmorphism Cards) */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-12"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50/80 px-3 py-1 rounded-full border border-cyan-200 backdrop-blur-md inline-block">
                Enterprise Reliability
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 mt-2">
                Governing modern organizations with precision
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { val: "<10ms", label: "Wage Recalculation", desc: "Instant dynamic engine" },
                { val: "100%", label: "Statutory Compliance", desc: "PF (12%) & PT formulas", cyan: true },
                { val: "0", label: "Scheduling Conflicts", desc: "Capacity guard engine" },
                { val: "99.9%", label: "Attendance Accuracy", desc: "Biometric sync logging", emerald: true },
              ].map((m, idx) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="p-7 rounded-3xl bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] hover:bg-white/65 hover:border-cyan-300/60 transition-all duration-300"
                >
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold font-mono block ${
                      m.cyan ? "text-cyan-700" : m.emerald ? "text-emerald-600" : "text-slate-900"
                    }`}
                  >
                    {m.val}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 mt-1.5 block">
                    {m.label}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{m.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Live Statutory Compensation Simulator */}
        <section className="py-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-6xl mx-auto"
          >
            <InteractiveWageDemo />
          </motion.div>
        </section>

        {/* Section 3: Core Pillars (Glassmorphism Cards) */}
        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-14"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50/80 px-3 py-1 rounded-full border border-cyan-200 backdrop-blur-md inline-block">
                Architectural Foundation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 mt-2">
                Built for speed, accuracy, and autonomy
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1 */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="p-8 rounded-3xl bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:bg-white/65 hover:border-cyan-300/60 transition-all duration-300"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-white/70 text-cyan-700 flex items-center justify-center mb-6 border border-white/80 shadow-xs backdrop-blur-md">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Live Attendance Pulse
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Second-by-second session stopwatch with check-in timestamping, break tracking, and daily presence metrics with biometric synchronization.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 font-mono">
                  <span>08:34:12 Active</span>
                  <span className="text-emerald-600 font-bold">Live Session</span>
                </div>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="p-8 rounded-3xl bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:bg-white/65 hover:border-cyan-300/60 transition-all duration-300"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-white/70 text-cyan-700 flex items-center justify-center mb-6 border border-white/80 shadow-xs backdrop-blur-md">
                    <Palmtree className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Conflict-Free Leaves
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Automated schedule overlap detection prevents department understaffing with instant 1-click approvals and balance quota tracking.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                  <span>Capacity Health</span>
                  <span className="text-cyan-800 font-bold">75% Available</span>
                </div>
              </motion.div>

              {/* Pillar 3 */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="p-8 rounded-3xl bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] flex flex-col justify-between hover:bg-white/65 hover:border-cyan-300/60 transition-all duration-300"
              >
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-white/70 text-cyan-700 flex items-center justify-center mb-6 border border-white/80 shadow-xs backdrop-blur-md">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Dynamic Salary Engine
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Adjust base wage and all components dynamically recompute in real-time. Export high-resolution branded PDF payslips in one click.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                  <span>PDF Generator</span>
                  <span className="text-cyan-800 font-bold">Vector High-Res</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 4: Enterprise Security (Glassmorphic) */}
        <section className="py-20 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/80 text-cyan-700 flex items-center justify-center mx-auto mb-4 border border-white/90 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              Enterprise Grade Governance & Security
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
              Every data transfer is protected with AES-256 encryption, role-based access control (RBAC), and immutable audit trails.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs sm:text-sm font-semibold text-slate-700">
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
          </motion.div>
        </section>

        {/* Section 5: Bottom CTA */}
        <section className="py-24 px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto p-10 sm:p-14 rounded-3xl bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)]"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-slate-900 tracking-tight">
              Ready to elevate your HR operations?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-md mx-auto">
              Join leading organizations managing attendance, time off, and dynamic payroll seamlessly with Dayflow.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
              <Link
                href="/signup"
                className="px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all hover:scale-105 active:scale-95"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="px-7 py-3.5 rounded-2xl bg-white/80 hover:bg-white text-slate-800 font-semibold text-xs sm:text-sm border border-white/80 shadow-xs backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Clean Corporate Footer */}
      <footer className="w-full bg-white/80 backdrop-blur-md border-t border-slate-200/80 px-6 sm:px-12 py-8 relative z-10 text-xs text-slate-500">
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
