"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { SalaryComponents, PayableSalaryResult } from "@/lib/salary-calculator";
import { generatePayslipPDF } from "@/lib/pdf-generator";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Wallet,
  Download,
  FileText,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

export default function EmployeePayrollPage() {
  const { user } = useAuth();
  const [payrollData, setPayrollData] = useState<{
    structure: SalaryComponents;
    payableSummary: PayableSalaryResult;
  } | null>(null);

  const employeeId = user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";

  useEffect(() => {
    DayflowApiClient.getEmployeePayroll(employeeId).then((res) => {
      setPayrollData({ structure: res.structure, payableSummary: res.payableSummary });
    });
  }, [employeeId]);

  const handleDownload = () => {
    if (!user || !payrollData) return;
    try {
      generatePayslipPDF(user.employee, payrollData.structure, payrollData.payableSummary, "August 2026");
      toast.success("Payslip PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate payslip PDF");
    }
  };

  if (!payrollData || !user) return null;

  const { structure, payableSummary } = payrollData;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-cyan-500/30 cyan-glow-subtle relative overflow-hidden">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">PAYROLL STATEMENT</span>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Compensation & Salary Slips</h1>
          <p className="text-xs text-slate-400 mt-0.5">Pay Period: August 2026 · Salary Disbursed via Direct Transfer</p>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Download Official PDF Payslip</span>
        </button>
      </div>

      {/* Payable Days Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl glass-card border border-[var(--border)]">
          <span className="text-slate-500 block">Total Working Days</span>
          <span className="text-2xl font-extrabold font-mono text-slate-100">{payableSummary.totalWorkingDays} Days</span>
          <span className="text-[10px] text-slate-500">Standard calendar cycle</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-cyan-500/30 cyan-glow-subtle">
          <span className="text-cyan-400 font-semibold block">Payable Days (Present + Leave)</span>
          <span className="text-2xl font-extrabold font-mono text-cyan-300">{payableSummary.payableDays} Days</span>
          <span className="text-[10px] text-slate-400">Eligible for 100% pay ratio</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-[var(--border)]">
          <span className="text-slate-500 block">Unpaid / Missing Days</span>
          <span className="text-2xl font-extrabold font-mono text-amber-400">{payableSummary.unpaidDays} Days</span>
          <span className="text-[10px] text-slate-500">No deduction applied</span>
        </div>
      </div>

      {/* Breakdown 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Earnings Card */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[var(--border)]">
          <h3 className="text-sm font-bold text-cyan-400 pb-2 border-b border-[var(--border)] mb-3 flex items-center justify-between">
            <span>EARNINGS BREAKDOWN</span>
            <span>AMOUNT</span>
          </h3>

          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between text-slate-300">
              <span>Basic Salary (50%)</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(structure.basic)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>House Rent Allowance (HRA - 50% Basic)</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(structure.hra)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Standard Statutory Allowance</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(structure.standardAllowance)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Performance Bonus (8.33%)</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(structure.performanceBonus)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Leave Travel Allowance (LTA - 8.33%)</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(structure.lta)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Fixed Balancing Allowance</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(structure.fixedAllowance)}</span>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-800 font-bold text-sm text-slate-100">
              <span>Gross Total Earnings</span>
              <span className="font-mono text-cyan-300">{formatCurrency(structure.grossSalary)}</span>
            </div>
          </div>
        </div>

        {/* Deductions & Net Pay Card */}
        <div className="flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[var(--border)]">
            <h3 className="text-sm font-bold text-rose-400 pb-2 border-b border-[var(--border)] mb-3 flex items-center justify-between">
              <span>STATUTORY DEDUCTIONS</span>
              <span>AMOUNT</span>
            </h3>

            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-slate-300">
                <span>Provident Fund (PF - 12% Basic)</span>
                <span className="font-mono font-semibold text-slate-100">{formatCurrency(structure.pf)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Professional Tax (Standard State PT)</span>
                <span className="font-mono font-semibold text-slate-100">{formatCurrency(structure.professionalTax)}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-800 font-bold text-sm text-rose-400">
                <span>Total Deductions</span>
                <span className="font-mono">{formatCurrency(structure.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Salary Payable Highlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-cyan-950/70 border border-cyan-500/40 cyan-glow-subtle flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                NET TAKE-HOME PAYABLE (AUGUST 2026)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300 mt-0.5">
                {formatCurrency(payableSummary.effectiveNetPayout)}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Calculated from dynamic wage formula & payable days.</p>
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
