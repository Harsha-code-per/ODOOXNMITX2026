"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PersonaDemoBar } from "@/components/shared/PersonaDemoBar";
import { User, Mail, Lock, Building2, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [empId, setEmpId] = useState("EMP-012");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [role, setRole] = useState("EMPLOYEE");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Account created successfully!", {
        description: "Email verification link sent. You can now sign in with your credentials.",
      });
      router.push("/login");
    } catch {
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col justify-between relative overflow-hidden">
      <PersonaDemoBar />

      <main className="flex-1 flex items-center justify-center p-4 z-10 my-6">
        <div className="w-full max-w-lg glass-panel rounded-3xl border border-cyan-500/30 shadow-2xl p-6 sm:p-8 relative">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl p-1.5 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-xl shadow-cyan-500/25 mb-2 overflow-hidden">
              <img src="/logo.png" alt="Dayflow Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold font-heading">Register New Employee</h1>
            <p className="text-xs text-slate-400">Join your team on Dayflow HRMS</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Marcus"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Brody"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Employee ID</label>
                <input
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 font-mono focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marcus.brody@dayflow.io"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 font-mono focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
              >
                <option value="EMPLOYEE">Employee (Standard Access)</option>
                <option value="HR">HR Officer (Approvals & Payroll Control)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              <span>{isLoading ? "Registering..." : "Create Dayflow Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-3 text-center text-xs text-slate-500">Dayflow HRMS · Registration</footer>
    </div>
  );
}
