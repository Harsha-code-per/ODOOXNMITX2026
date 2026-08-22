"use client";

import React, { useState } from "react";
import { calculateSalaryStructure } from "@/lib/salary-calculator";
import { formatCurrency } from "@/lib/utils";
import { Calculator, Sparkles, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function InteractiveWageDemo() {
  const [wage, setWage] = useState<number>(75000);
  const salary = calculateSalaryStructure(wage);

  const presets = [40000, 60000, 75000, 90000, 120000, 150000];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-400/15 via-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal-400/15 via-cyan-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Interactive Live Engine Demo</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            Dynamic Wage Recalculation
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Slide the monthly CTC below. All dependent statutory allowances and deductions calculate instantly.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-cyan-200 shadow-sm text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Net Take-Home Pay
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-extrabold text-cyan-600">
            {formatCurrency(salary.netSalary)}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
            After ₹{salary.totalDeductions.toLocaleString()} PF + PT
          </span>
        </div>
      </div>

      {/* Slider & Presets */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Monthly Base Wage (Gross CTC)
          </label>
          <span className="text-lg font-mono font-extrabold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-200">
            {formatCurrency(wage)} / mo
          </span>
        </div>

        <input
          type="range"
          min="30000"
          max="200000"
          step="5000"
          value={wage}
          onChange={(e) => setWage(Number(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-600 transition-all"
        />

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-slate-500">
          <span>₹30,000</span>
          <div className="hidden sm:flex items-center gap-1.5">
            {presets.map((val) => (
              <button
                key={val}
                onClick={() => setWage(val)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  wage === val
                    ? "bg-cyan-500 text-white font-bold shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                ₹{val / 1000}k
              </button>
            ))}
          </div>
          <span>₹2,00,000</span>
        </div>
      </div>

      {/* Live Calculated Components Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-8 relative z-10">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 block">Basic (50%)</span>
          <span className="text-base font-mono font-bold text-slate-900">{formatCurrency(salary.basic)}</span>
          <span className="text-[10px] text-slate-400">Statutory base</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 block">HRA (50% Basic)</span>
          <span className="text-base font-mono font-bold text-slate-900">{formatCurrency(salary.hra)}</span>
          <span className="text-[10px] text-slate-400">Housing exemption</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 block">Standard + Bonus</span>
          <span className="text-base font-mono font-bold text-slate-900">
            {formatCurrency(salary.standardAllowance + salary.performanceBonus)}
          </span>
          <span className="text-[10px] text-slate-400">Fixed + 8.33%</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-500 block">Fixed Balancing</span>
          <span className="text-base font-mono font-bold text-slate-900">{formatCurrency(salary.fixedAllowance)}</span>
          <span className="text-[10px] text-slate-400">Residual balance</span>
        </div>
      </div>

      {/* Bottom Deduction Breakdown */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs relative z-10">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-500 text-[10px] block">Provident Fund (12% Basic)</span>
            <span className="font-mono font-bold text-rose-600">-{formatCurrency(salary.pf)}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">Professional Tax (Fixed)</span>
            <span className="font-mono font-bold text-rose-600">-{formatCurrency(salary.professionalTax)}</span>
          </div>
        </div>

        <Link
          href="/dashboard/admin/payroll"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <span>Open Full Payroll Matrix</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
