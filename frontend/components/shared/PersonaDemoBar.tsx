"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { UserCheck, ShieldCheck, Zap, Sparkles, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

export function PersonaDemoBar() {
  const { user, switchPersona } = useAuth();
  const router = useRouter();

  const handleSwitch = (
    key: "superadmin" | "admin" | "admin_temp" | "sarah" | "alex",
    targetRoute: string
  ) => {
    switchPersona(key);
    router.push(targetRoute);
  };

  return (
    <div className="w-full bg-white/95 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-700 z-50 backdrop-blur-md shadow-2xs">
      <div className="flex items-center gap-2 font-medium">
        <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
        <span className="text-cyan-900 font-bold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-600 fill-cyan-600" /> Interactive Demo Roles:
        </span>
        <span className="hidden sm:inline text-slate-500 text-[11px]">
          1-Click SaaS hierarchy walkthrough:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Super Admin */}
        <button
          onClick={() => handleSwitch("superadmin", "/platform-admin")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs transition-all ${
            user?.role === "SUPER_ADMIN"
              ? "bg-slate-900 text-white font-bold shadow-xs scale-105"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          }`}
          title="Dayflow Platform Owner (Provisions Companies)"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Platform Owner</span>
        </button>

        {/* First-Login Demo */}
        <button
          onClick={() => handleSwitch("admin_temp", "/force-password-reset")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs transition-all ${
            user?.mustChangePassword
              ? "bg-amber-500 text-white font-bold shadow-xs scale-105"
              : "bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium border border-amber-200"
          }`}
          title="Test 1st Login Forced Password Reset Workflow"
        >
          <KeyRound className="w-3 h-3" />
          <span>1st Login Reset</span>
        </button>

        {/* Company Admin */}
        <button
          onClick={() => handleSwitch("admin", "/dashboard/admin")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs transition-all ${
            user?.role === "ADMIN" && !user?.mustChangePassword
              ? "bg-cyan-600 text-white font-bold shadow-xs scale-105"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          }`}
          title="Company Founder / CEO (Acme Corp)"
        >
          <ShieldCheck className="w-3 h-3" />
          <span>Company Admin</span>
        </button>

        {/* Company HR */}
        <button
          onClick={() => handleSwitch("sarah", "/dashboard/admin")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs transition-all ${
            user?.role === "HR"
              ? "bg-cyan-600 text-white font-bold shadow-xs scale-105"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          }`}
          title="HR Director (Acme Corp)"
        >
          <ShieldCheck className="w-3 h-3" />
          <span>Company HR</span>
        </button>

        {/* Employee */}
        <button
          onClick={() => handleSwitch("alex", "/dashboard/employee")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs transition-all ${
            user?.role === "EMPLOYEE"
              ? "bg-cyan-600 text-white font-bold shadow-xs scale-105"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
          }`}
          title="Staff Engineer (Acme Corp)"
        >
          <UserCheck className="w-3 h-3" />
          <span>Employee</span>
        </button>
      </div>
    </div>
  );
}
