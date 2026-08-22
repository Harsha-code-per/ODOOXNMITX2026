"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { PersonaDemoBar } from "@/components/shared/PersonaDemoBar";
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck, Award, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchPersona } = useAuth();
  const [email, setEmail] = useState("alex.rivera@dayflow.io");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      if (email.includes("hr") || email.includes("admin")) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/employee");
      }
    } catch (e: any) {
      toast.error(e.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (persona: "alex" | "sarah" | "admin") => {
    switchPersona(persona);
    if (persona === "sarah" || persona === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/employee");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between relative overflow-hidden">
      <PersonaDemoBar />

      {/* Ambient background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md glass-panel rounded-3xl border border-cyan-500/30 shadow-2xl p-6 sm:p-8 relative">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl p-1.5 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-xl shadow-cyan-500/25 mb-3 overflow-hidden">
              <img src="/logo.png" alt="Dayflow Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold font-heading">Welcome to Dayflow</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in to your Enterprise HRMS Workspace</p>
          </div>

          {/* 1-Click Persona Demo Auto-Fill Buttons */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-2 text-center">
              ⚡ 1-CLICK JUDGE DEMO LOGIN
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemo("alex")}
                className="px-2 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-semibold transition-all text-center flex flex-col items-center gap-1"
              >
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Alex (Emp)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("sarah")}
                className="px-2 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-semibold transition-all text-center flex flex-col items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Sarah (HR)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="px-2 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-semibold transition-all text-center flex flex-col items-center gap-1"
              >
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@dayflow.io"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-xs font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don&apos;t have an employee account?{" "}
            <Link href="/signup" className="text-cyan-400 font-bold hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500">
        Dayflow HRMS · Enterprise Security & RBAC Enabled
      </footer>
    </div>
  );
}
