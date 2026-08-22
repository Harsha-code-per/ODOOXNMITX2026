"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Lock, Check, ShieldAlert, ArrowRight, Eye, EyeOff, Building2 } from "lucide-react";
import { toast } from "sonner";

export default function ForcePasswordResetPage() {
  const router = useRouter();
  const { user, resetPermanentPassword } = useAuth();
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isValid = hasMinLength && hasUpper && hasNumber && hasSpecial && isMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Please meet all security requirements before proceeding.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPermanentPassword(newPassword);
      toast.success("Account activated successfully!", {
        description: "Redirecting to your company workspace...",
      });

      // Redirect to role-appropriate dashboard
      if (user?.role === "ADMIN" || user?.role === "HR") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/employee");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Dayflow" className="h-7 w-7 object-contain" />
          <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900">
            Dayflow
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Mandatory Security Setup</span>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 relative">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-slate-900">
              Set Permanent Password
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your account was provisioned with temporary credentials. Set a secure permanent password to activate your workspace.
            </p>
          </div>

          {/* User & Company Identity Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mb-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                <Building2 className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">
                  {user?.companyName || "Acme Corporation"}
                </span>
                <span className="text-[11px] text-slate-500">{user?.email || "admin@company.io"}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 text-[10px] font-extrabold border border-cyan-200">
              {user?.role || "ADMIN"}
            </span>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Temporary Password *
              </label>
              <input
                type="password"
                required
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Enter temporary password from email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">New Permanent Password *</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-cyan-700 hover:underline flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Confirm Permanent Password *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-mono"
              />
            </div>

            {/* Live Requirements Checklist */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
              <span className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                <Check className="w-3.5 h-3.5" /> 8+ characters
              </span>
              <span className={`flex items-center gap-1.5 ${hasUpper ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                <Check className="w-3.5 h-3.5" /> Uppercase letter
              </span>
              <span className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                <Check className="w-3.5 h-3.5" /> Number (0-9)
              </span>
              <span className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600 font-semibold" : "text-slate-400"}`}>
                <Check className="w-3.5 h-3.5" /> Special symbol
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 mt-2 ${
                isValid
                  ? "bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.01] active:scale-[0.99]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <span>{isLoading ? "Activating Account..." : "Update Password & Enter Workspace"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-xs text-slate-400">
        © 2026 Dayflow Technologies Inc. • Enterprise Workforce Security Gate
      </footer>
    </div>
  );
}
