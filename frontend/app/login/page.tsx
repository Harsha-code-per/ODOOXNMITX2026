"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { PersonaDemoBar } from "@/components/shared/PersonaDemoBar";
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans">
      <PersonaDemoBar />

      <main className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 relative">
          {/* Clean Logo & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Dayflow Logo" className="h-12 w-12 object-contain mb-3" />
            <h1 className="text-2xl font-bold font-heading text-slate-900">Welcome to Dayflow</h1>
            <p className="text-xs text-slate-500 mt-1">Sign in to your Enterprise HRMS Workspace</p>
          </div>

          {/* Quick Persona Demo Switcher */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2 text-center">
              DEMO PERSONA QUICK ACCESS
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemo("alex")}
                className="px-2 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-200 shadow-2xs transition-all text-center flex flex-col items-center gap-1"
              >
                <UserCheck className="w-4 h-4 text-cyan-600" />
                <span>Alex (Emp)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("sarah")}
                className="px-2 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-200 shadow-2xs transition-all text-center flex flex-col items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Sarah (HR)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="px-2 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-200 shadow-2xs transition-all text-center flex flex-col items-center gap-1"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Arthur (Admin)</span>
              </button>
            </div>
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@dayflow.io"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-1.5"
            >
              <span>{isLoading ? "Signing in..." : "Sign In to Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-cyan-700 hover:underline font-bold">
              Register Employee
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-4 text-xs text-slate-400 z-10">
        © 2026 Dayflow Technologies Inc. • Enterprise Workforce Operating System
      </footer>
    </div>
  );
}
