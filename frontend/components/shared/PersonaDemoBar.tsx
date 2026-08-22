"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { UserCheck, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function PersonaDemoBar() {
  const { user, switchPersona } = useAuth();
  const router = useRouter();

  const handleSwitch = (key: "alex" | "sarah" | "admin", targetRoute: string) => {
    switchPersona(key);
    router.push(targetRoute);
  };

  return (
    <div className="w-full bg-white/95 border-b border-cyan-200/80 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-700 z-50 backdrop-blur-md shadow-xs">
      <div className="flex items-center gap-2 font-medium">
        <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
        <span className="text-cyan-800 font-bold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-600 fill-cyan-600" /> Judge Demo Mode:
        </span>
        <span className="hidden sm:inline text-slate-500 text-[11px]">
          1-Click instant persona switcher:
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => handleSwitch("alex", "/dashboard/employee")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs transition-all ${
            user?.employee.employeeId === "EMP-003"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20 scale-105"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium"
          }`}
          title="Switch to Alex Rivera (Senior Full Stack Engineer)"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Alex (Employee)</span>
        </button>

        <button
          onClick={() => handleSwitch("sarah", "/dashboard/admin")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs transition-all ${
            user?.employee.employeeId === "EMP-002"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20 scale-105"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium"
          }`}
          title="Switch to Sarah Jenkins (HR Director)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sarah (HR Lead)</span>
        </button>

        <button
          onClick={() => handleSwitch("admin", "/dashboard/admin")}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs transition-all ${
            user?.employee.employeeId === "EMP-001"
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20 scale-105"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium"
          }`}
          title="Switch to Arthur Morgan (Super Admin / CEO)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Arthur (Admin)</span>
        </button>
      </div>
    </div>
  );
}
