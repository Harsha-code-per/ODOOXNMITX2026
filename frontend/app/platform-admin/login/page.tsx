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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full border-b border-slate-800/80 px-6 py-4 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Dayflow" className="h-7 w-7 object-contain" />
          <span className="font-heading font-extrabold text-lg tracking-tight text-white">
            Dayflow
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800">
            Internal Ops
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          ← Return to Public Site
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 relative">
          {/* Security Badge */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-white">
              Platform Super Admin
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Restricted Dayflow internal operations & SaaS tenant provision plane.
            </p>
          </div>

          {/* Quick Demo Staff Login Button */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Terminal className="w-3 h-3" /> Judge / Staff Quick Access
              </span>
              <span className="text-[10px] font-mono text-slate-500">owner@dayflow.io</span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="w-full py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>1-Click Authenticate as Platform Owner</span>
            </button>
          </div>

          {/* Super Admin Credential Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Super Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@dayflow.io"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                Platform Security Key / Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                Super Admin accounts cannot be self-registered. They are provisioned via internal backend infrastructure scripts.
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? "Authenticating Platform Key..." : "Unlock Platform Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500 flex items-center justify-between">
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
              Client Company Login →
            </Link>
            <span className="text-[11px] font-mono text-slate-600">ID: SEC-DAYFLOW-01</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-600 z-10 border-t border-slate-900">
        © 2026 Dayflow Technologies Inc. • Enterprise Infrastructure & Multi-Tenant Control Plane
      </footer>
    </div>
  );
}
