"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { SalaryComponents, PayableSalaryResult } from "@/lib/salary-calculator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generatePayslipPDF } from "@/lib/pdf-generator";
import {
  Wallet,
  Download,
  FileText,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function EmployeePayrollPage() {
  const { user } = useAuth();
  const employeeId = user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";

  const [payrollData, setPayrollData] = useState<{
    structure: SalaryComponents;
    payableSummary: PayableSalaryResult;
  } | null>(null);

  useEffect(() => {
    DayflowApiClient.getEmployeePayroll(employeeId).then((res) => {
      setPayrollData({ structure: res.structure, payableSummary: res.payableSummary });
    });
  }, [employeeId]);

  if (!payrollData || !user) return null;

  const { structure, payableSummary } = payrollData;

  const handleDownloadPDF = () => {
    generatePayslipPDF(user.employee, structure, payableSummary, "August 2026");
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    toast.success("Payslip PDF Downloaded!", {
      description: `Official salary statement saved for ${user.employee.firstName} ${user.employee.lastName}.`,
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl glass-panel border border-slate-200 shadow-sm relative overflow-hidden">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700">
            COMPENSATION & SALARY ENGINE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-0.5">
            Salary Statement & Payslips
          </h1>
          <p className="text-xs text-slate-500">
            Transparent breakdown of base wage, statutory allowances, and attendance-linked net pay.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Download August 2026 PDF Payslip</span>
        </button>
      </div>

      {/* 3-Card Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
            Base Monthly CTC (Gross)
          </span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            {formatCurrency(structure.wage)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Total Annual: {formatCurrency(structure.wage * 12)}</span>
        </div>

        <div className="p-5 rounded-2xl glass-card cyan-glow-subtle border-cyan-200">
          <span className="text-cyan-800 font-bold uppercase tracking-wider text-[10px] block">
            Net Disbursable Take-Home
          </span>
          <span className="text-3xl font-extrabold font-mono text-cyan-700 mt-1 block">
            {formatCurrency(payableSummary.payableAmount)}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            100% Full Attendance Payout
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
            Statutory Deductions (PF+PT)
          </span>
          <span className="text-3xl font-extrabold font-mono text-rose-600 mt-1 block">
            -{formatCurrency(structure.totalDeductions)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            PF (12%): {formatCurrency(structure.pf)} • PT: ₹200
          </span>
        </div>
      </div>

      {/* Earnings vs Deductions Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Monthly Earnings & Allowances
            </h3>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Basic Salary (50% of Wage)</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.basic)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">House Rent Allowance (HRA - 50% Basic)</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.hra)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Standard Allowance (Fixed Statutory)</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.standardAllowance)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Performance Bonus (8.33% Basic)</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.performanceBonus)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Leave Travel Allowance (LTA - 8.33% Basic)</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.lta)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Fixed Allowance (Balancing Component)</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.fixedAllowance)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
            <span>Gross Monthly Earnings:</span>
            <span className="font-mono text-base text-cyan-700">{formatCurrency(structure.grossSalary)}</span>
          </div>
        </div>

        {/* Deductions & Net Payout Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-rose-600" /> Deductions & Attendance Pipeline
            </h3>

            <div className="flex flex-col gap-2.5 text-xs mb-4">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-700 block">Provident Fund (PF - 12% Basic)</span>
                  <span className="text-[10px] text-slate-400">Employee Contribution</span>
                </div>
                <span className="font-mono font-bold text-rose-600">-{formatCurrency(structure.pf)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-700 block">Professional Tax (PT - Fixed)</span>
                  <span className="text-[10px] text-slate-400">State Statutory Tax</span>
                </div>
                <span className="font-mono font-bold text-rose-600">-{formatCurrency(structure.professionalTax)}</span>
              </div>
            </div>

            {/* Attendance Pipeline Box */}
            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-xs">
              <span className="font-bold text-cyan-900 block mb-1">Attendance-to-Payroll Integration</span>
              <p className="text-slate-600 leading-relaxed mb-2">
                Payable Days = {payableSummary.presentDays} Present + {payableSummary.approvedLeaves} Approved Leave = {payableSummary.payableDays} / {payableSummary.totalWorkDays} Working Days.
              </p>
              <div className="flex items-center justify-between font-mono text-cyan-900 font-bold">
                <span>Prorated Payout Ratio:</span>
                <span>100.0%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900">
            <span>Net Disbursed Amount:</span>
            <span className="font-mono text-xl text-emerald-600">{formatCurrency(payableSummary.payableAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
