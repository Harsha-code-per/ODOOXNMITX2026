"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import { UserCheck, ShieldCheck, Award, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function PersonaDemoBar() {
  const { user, switchPersona } = useAuth();
  const router = useRouter();

  const handleSwitch = (key: "alex" | "sarah" | "admin", targetRoute: string) => {
    switchPersona(key);
    router.push(targetRoute);
  };

  return (
    <div className="w-full bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-cyan-950/80 border-b border-cyan-500/20 px-3 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-300 z-50 backdrop-blur-md">
      <div className="flex items-center gap-2 font-medium">
        <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-cyan-400 font-semibold flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" /> Judge Demo Mode:
        </span>
        <span className="hidden sm:inline text-slate-400">1-Click instant persona switcher:</span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => handleSwitch("alex", "/dashboard/employee")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
            user?.employee.employeeId === "EMP-003"
              ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/50 scale-105"
              : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50"
          }`}
          title="Switch to Alex Rivera (Senior Software Engineer)"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Alex (Employee)</span>
        </button>

        <button
          onClick={() => handleSwitch("sarah", "/dashboard/admin")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
            user?.employee.employeeId === "EMP-002"
              ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/50 scale-105"
              : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50"
          }`}
          title="Switch to Sarah Jenkins (HR Director)"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sarah (HR Lead)</span>
        </button>

        <button
          onClick={() => handleSwitch("admin", "/dashboard/admin")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
            user?.employee.employeeId === "EMP-001"
              ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/50 scale-105"
              : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50"
          }`}
          title="Switch to Arthur Morgan (CEO / Super Admin)"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Admin (CEO)</span>
        </button>
      </div>
    </div>
  );
}
