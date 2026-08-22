"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DayflowApiClient } from "@/lib/api";
import {
  Check,
  Building2,
  Mail,
  User,
  Phone,
  Users,
  Send,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Clock,
  FileCheck2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactPricingPage() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [teamSize, setTeamSize] = useState("25-50");
  const [planInterest, setPlanInterest] = useState<"Starter" | "Growth" | "Enterprise">("Growth");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await DayflowApiClient.submitInquiry({
        companyName,
        contactName,
        workEmail,
        phone,
        teamSize,
        planInterest,
        message: message || `Inquiry for ${planInterest} plan for ${companyName} (${teamSize} employees).`,
      });

      setIsSubmitted(true);
      toast.success("Onboarding inquiry submitted successfully!", {
        description: "Our platform team will review your organization and dispatch your admin credentials.",
      });
    } catch {
      toast.error("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900 relative overflow-hidden flex flex-col font-sans">
      {/* Pinned Corner Islands Navigation */}
      <header className="fixed top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-50 pointer-events-none flex items-center justify-between">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white transition-all group"
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

        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Link
            href="/platform-admin/login"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-cyan-800 bg-cyan-50 hover:bg-cyan-100 transition-colors border border-cyan-200"
          >
            Platform Admin
          </Link>
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 z-10 pt-28 pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-extrabold font-heading text-slate-900 tracking-tight"
          >
            Transparent Plans for <br />
            <span className="text-cyan-700">Modern Workforces.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed"
          >
            Choose the right tier for your organization. Submit your company details, and our platform team will provision your dedicated HRMS workspace within minutes.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {/* Tier 1: Starter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Starter</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  Small Teams
                </span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-extrabold font-heading text-slate-900">$49</span>
                <span className="text-xs text-slate-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Essential workforce presence tracking and self-service leaves for growing teams.
              </p>

              <ul className="flex flex-col gap-3 text-xs text-slate-700 mb-8 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Up to 25 active employees</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Live session stopwatch & attendance</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Conflict-free leave approvals</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Standard email support</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPlanInterest("Starter");
                document.getElementById("onboarding-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs"
            >
              Select Starter Plan
            </button>
          </motion.div>

          {/* Tier 2: Growth (Highlighted) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="p-8 rounded-3xl bg-white/90 backdrop-blur-2xl border-2 border-cyan-600 shadow-xl flex flex-col justify-between relative"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              Most Popular Choice
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800">Growth</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                  Scaling Companies
                </span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-extrabold font-heading text-slate-900">$149</span>
                <span className="text-xs text-slate-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Complete dynamic statutory compensation, capacity guard, and FlowAI copilot.
              </p>

              <ul className="flex flex-col gap-3 text-xs text-slate-700 mb-8 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2.5 font-semibold text-slate-900">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Up to 100 active employees</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Dynamic Salary Engine (PF 12% + PT)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>High-resolution vector PDF payslips</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Department Capacity Guard & analytics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>FlowAI natural language query engine</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPlanInterest("Growth");
                document.getElementById("onboarding-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02]"
            >
              Get Started with Growth
            </button>
          </motion.div>

          {/* Tier 3: Enterprise */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enterprise</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  Custom Scale
                </span>
              </div>
              <div className="mb-4">
                <span className="text-4xl font-extrabold font-heading text-slate-900">Custom</span>
                <span className="text-xs text-slate-500 ml-1">pricing</span>
              </div>
              <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                Dedicated infrastructure, biometric synchronization API, multi-entity isolation, and SLA.
              </p>

              <ul className="flex flex-col gap-3 text-xs text-slate-700 mb-8 border-t border-slate-100 pt-6">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Unlimited employees & multi-entity</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Biometric device sync API integration</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Custom RBAC & enterprise audit trails</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Dedicated Account Manager & 99.99% SLA</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPlanInterest("Enterprise");
                document.getElementById("onboarding-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs"
            >
              Contact Enterprise Sales
            </button>
          </motion.div>
        </div>

        {/* Onboarding Inquiry Form Section */}
        <div id="onboarding-form" className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-12 rounded-3xl bg-white/80 backdrop-blur-2xl border border-slate-200 shadow-xl"
          >
            {isSubmitted ? (
              <div className="text-center py-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading text-slate-900">
                  Inquiry Received!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mt-2 leading-relaxed">
                  Thank you, <strong>{contactName}</strong>. Your inquiry for <strong>{companyName}</strong> has been logged into the Dayflow Platform queue.
                </p>
                <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-left text-xs text-cyan-950 mt-6 max-w-md">
                  <p className="font-bold flex items-center gap-1.5 text-cyan-900 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> What Happens Next:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                    <li>Our platform administrator will review your organization details.</li>
                    <li>We will provision your company tenant and Company Admin account.</li>
                    <li>You will receive an activation email with your temporary password.</li>
                  </ol>
                </div>

                <div className="flex gap-3 mt-8">
                  <Link
                    href="/platform-admin"
                    className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs"
                  >
                    View in Platform Admin Console
                  </Link>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-8 pb-6 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 inline-block mb-2">
                    Company Onboarding
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
                    Request Workspace Activation
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Fill in your organization details to get provisioned with your company admin credentials.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Company / Organization Name *
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Acme Corporation"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Admin Contact Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Arthur Morgan"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Admin Work Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          placeholder="admin@acmecorp.io"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Contact Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 555-0100"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Estimated Workforce Size
                      </label>
                      <select
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-semibold"
                      >
                        <option value="1-25">1 - 25 Employees</option>
                        <option value="25-50">25 - 50 Employees</option>
                        <option value="50-200">50 - 200 Employees</option>
                        <option value="200+">200+ Employees (Enterprise)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1.5">
                        Target Plan Tier
                      </label>
                      <select
                        value={planInterest}
                        onChange={(e) => setPlanInterest(e.target.value as any)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-semibold"
                      >
                        <option value="Starter">Starter ($49/mo)</option>
                        <option value="Growth">Growth ($149/mo - Recommended)</option>
                        <option value="Enterprise">Enterprise (Custom SLA)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1.5">
                      Specific Requirements or Integrations (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Looking to integrate biometric scanners and automate monthly PF/PT tax distributions..."
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-2"
                  >
                    <span>{isSubmitting ? "Submitting Inquiry..." : "Submit Workspace Request"}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/80 backdrop-blur-xl border-t border-slate-200/80 px-6 sm:px-12 py-8 relative z-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Dayflow Logo" className="h-6 w-6 object-contain" />
            <span className="font-heading font-bold text-slate-900 text-sm">Dayflow</span>
            <span className="text-slate-400 ml-2">© 2026 Dayflow Technologies Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link href="/platform-admin/login" className="hover:text-cyan-700 font-semibold transition-colors">
              Platform Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
