"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  KeyRound,
  Terminal,
  ShieldCheck,
  Building,
} from "lucide-react";
import { toast } from "sonner";

export default function PlatformAdminLoginPage() {
  const router = useRouter();
  const { login, switchPersona } = useAuth();
  const [email, setEmail] = useState("owner@dayflow.io");
  const [password, setPassword] = useState("DayflowPlatform#2026");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const session = await login(email, password);
      if (session.role !== "SUPER_ADMIN") {
        toast.error("Access Denied: Super Admin credentials required.", {
          description: "This portal is restricted to Dayflow Platform Operations staff.",
        });
        return;
      }
      toast.success("Platform Super Admin authenticated successfully!");
      router.push("/platform-admin");
    } catch (err: any) {
      toast.error(err.message || "Invalid platform administrator credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoAccess = () => {
    switchPersona("superadmin");
    toast.success("Authenticated with Platform Owner staff credentials!");
    router.push("/platform-admin");
  };

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-cyan-500/20 selection:text-cyan-900">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between relative z-10 shadow-2xs">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Dayflow" className="h-7 w-7 object-contain" />
          <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900">
            Dayflow
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white shadow-2xs">
            Platform Owner Portal
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Return to Public Site
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 relative">
          {/* Logo & Badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center mb-3 shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">
              Platform Super Admin
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Restricted Dayflow internal operations & SaaS tenant control plane.
            </p>
          </div>

          {/* Quick Demo Staff Login Button */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-cyan-600" /> Staff Quick Access
              </span>
              <span className="text-[10px] font-mono text-slate-400">owner@dayflow.io</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>1-Click Authenticate as Platform Owner</span>
            </button>
          </div>

          {/* Super Admin Credential Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Super Admin Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@dayflow.io"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Platform Security Key / Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Super Admin accounts cannot be self-registered. They are provisioned via internal backend infrastructure scripts.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? "Authenticating Platform Key..." : "Unlock Platform Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-between">
            <Link href="/login" className="text-cyan-700 hover:underline font-bold">
              ← Client Company Login
            </Link>
            <span className="text-[11px] font-mono text-slate-400">ID: SEC-DAYFLOW-01</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 z-10 border-t border-slate-100">
        © 2026 Dayflow Technologies Inc. • Enterprise Infrastructure & Multi-Tenant Control Plane
      </footer>
    </div>
  );
}
