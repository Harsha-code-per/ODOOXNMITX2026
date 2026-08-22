"use client";

import React, { useState } from "react";
import { calculateSalaryStructure } from "@/lib/salary-calculator";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, ShieldCheck, Calculator } from "lucide-react";
import Link from "next/link";

export function InteractiveWageDemo() {
  const [wage, setWage] = useState<number>(75000);
  const salary = calculateSalaryStructure(wage);

  const presets = [40000, 60000, 75000, 100000, 150000, 200000];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white/45 backdrop-blur-2xl border border-white/70 p-6 sm:p-9 shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200/60">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50/80 px-3 py-1 rounded-full border border-cyan-200 inline-block mb-2 backdrop-blur-md">
            Live Calculation Engine
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 tracking-tight">
            Real-Time Statutory Breakdown
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Adjust the base monthly compensation to inspect automatic mathematical distribution across statutory lines.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 text-right min-w-[200px] shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Net Take-Home Payout
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-700 block mt-0.5">
            {formatCurrency(salary.netSalary)}
          </span>
          <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
            Deductions: -{formatCurrency(salary.totalDeductions)} (PF+PT)
          </span>
        </div>
      </div>

      {/* Slider & Presets */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700">
            Monthly Base Wage (Gross CTC)
          </label>
          <span className="text-sm font-mono font-bold text-slate-900 bg-white/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/80 shadow-xs">
            {formatCurrency(wage)} / mo
          </span>
        </div>

        <input
          type="range"
          min="30000"
          max="250000"
          step="5000"
          value={wage}
          onChange={(e) => setWage(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-cyan-600 hover:accent-cyan-700 transition-all"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-slate-500">
          <span>₹30,000</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 mr-1 font-medium">Quick Select:</span>
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setWage(p)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  wage === p
                    ? "bg-cyan-600 text-white font-bold shadow-xs"
                    : "bg-white/60 hover:bg-white text-slate-700 border border-white/80"
                }`}
              >
                ₹{p / 1000}k
              </button>
            ))}
          </div>
          <span>₹2,50,000</span>
        </div>
      </div>

      {/* Calculated Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
        <div className="p-3.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 shadow-xs">
          <span className="text-slate-500 font-semibold block text-[11px]">Basic Salary (50%)</span>
          <span className="text-base font-mono font-bold text-slate-900 mt-1 block">
            {formatCurrency(salary.basic)}
          </span>
          <span className="text-[10px] text-slate-400">Statutory base</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 shadow-xs">
          <span className="text-slate-500 font-semibold block text-[11px]">HRA (50% Basic)</span>
          <span className="text-base font-mono font-bold text-slate-900 mt-1 block">
            {formatCurrency(salary.hra)}
          </span>
          <span className="text-[10px] text-slate-400">Housing exemption</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 shadow-xs">
          <span className="text-slate-500 font-semibold block text-[11px]">Standard + Bonus</span>
          <span className="text-base font-mono font-bold text-slate-900 mt-1 block">
            {formatCurrency(salary.standardAllowance + salary.performanceBonus)}
          </span>
          <span className="text-[10px] text-slate-400">₹4,167 + 8.33% Basic</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 shadow-xs">
          <span className="text-slate-500 font-semibold block text-[11px]">Fixed Balancing</span>
          <span className="text-base font-mono font-bold text-slate-900 mt-1 block">
            {formatCurrency(salary.fixedAllowance)}
          </span>
          <span className="text-[10px] text-slate-400">Residual balance</span>
        </div>
      </div>

      {/* Bottom Deductions & CTA footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-4 text-slate-600">
          <span>
            Provident Fund (12%): <strong className="text-rose-600 font-mono">-{formatCurrency(salary.pf)}</strong>
          </span>
          <span>
            Professional Tax: <strong className="text-rose-600 font-mono">-{formatCurrency(salary.professionalTax)}</strong>
          </span>
        </div>

        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <span>Create Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
