"use client";

import React from "react";
import { Employee } from "@/lib/mock-data";
import { SalaryComponents, PayableSalaryResult } from "@/lib/salary-calculator";
import { generatePayslipPDF } from "@/lib/pdf-generator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { X, Download, FileText, CheckCircle2, ShieldCheck, Printer } from "lucide-react";
import { toast } from "sonner";

interface PayslipModalProps {
  employee: Employee | null;
  structure: SalaryComponents | null;
  payableSummary: PayableSalaryResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PayslipModal({ employee, structure, payableSummary, isOpen, onClose }: PayslipModalProps) {
  if (!isOpen || !employee || !structure || !payableSummary) return null;

  const handleDownloadPDF = () => {
    try {
      generatePayslipPDF(employee, structure, payableSummary, "August 2026");
      toast.success("Payslip PDF downloaded!", {
        description: `Dayflow_Payslip_${employee.employeeId}_August_2026.pdf has been generated.`,
      });
    } catch (e: any) {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[var(--border)] mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">DAYFLOW HRMS</span>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Official Salary Statement</h3>
            <p className="text-xs text-slate-400">Pay Period: August 2026</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download Branded PDF</span>
          </button>
        </div>

        {/* Employee Details Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-[var(--border)] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
          <div>
            <span className="text-slate-500 block">Employee Name</span>
            <span className="font-semibold text-slate-200">{employee.firstName} {employee.lastName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Employee ID</span>
            <span className="font-semibold text-slate-200">{employee.employeeId}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Department</span>
            <span className="font-semibold text-slate-200">{employee.department}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Designation</span>
            <span className="font-semibold text-slate-200">{employee.designation}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Working / Payable Days</span>
            <span className="font-semibold text-cyan-400">{payableSummary.payableDays} / {payableSummary.totalWorkingDays} Days</span>
          </div>
          <div>
            <span className="text-slate-500 block">Payment Mode</span>
            <span className="font-semibold text-slate-200">Direct Bank Transfer</span>
          </div>
        </div>

        {/* Earnings & Deductions Tables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-5">
          {/* Earnings */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-[var(--border)]">
            <h4 className="font-bold text-cyan-400 text-xs mb-2 pb-1 border-b border-[var(--border)] flex justify-between">
              <span>EARNINGS</span>
              <span>AMOUNT</span>
            </h4>
            <div className="flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Basic Pay</span>
                <span className="font-mono text-slate-100">{formatCurrency(structure.basic)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>HRA</span>
                <span className="font-mono text-slate-100">{formatCurrency(structure.hra)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Standard Allowance</span>
                <span className="font-mono text-slate-100">{formatCurrency(structure.standardAllowance)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Performance Bonus</span>
                <span className="font-mono text-slate-100">{formatCurrency(structure.performanceBonus)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>LTA</span>
                <span className="font-mono text-slate-100">{formatCurrency(structure.lta)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Fixed Allowance</span>
                <span className="font-mono text-slate-100">{formatCurrency(structure.fixedAllowance)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-800 font-bold text-xs text-slate-100">
                <span>Gross Earnings</span>
                <span className="font-mono text-cyan-300">{formatCurrency(structure.grossSalary)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-[var(--border)]">
            <h4 className="font-bold text-rose-400 text-xs mb-2 pb-1 border-b border-[var(--border)] flex justify-between">
              <span>DEDUCTIONS</span>
              <span>AMOUNT</span>
            </h4>
            <div className="flex flex-col gap-1.5 text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Provident Fund (PF)</span>
                <span className="font-mono text-slate-100">{formatCurrency(structure.pf)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Professional Tax (PT)</span>
                <span className="font-mono text-slate-100">{formatCurrency(structure.professionalTax)}</span>
              </div>
              <div className="flex justify-between pt-8 border-t border-slate-800 font-bold text-xs text-slate-100">
                <span>Total Deductions</span>
                <span className="font-mono text-rose-400">{formatCurrency(structure.totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Payout Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-cyan-950/60 border border-cyan-500/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">NET SALARY PAYABLE</span>
            <div className="text-2xl font-extrabold font-mono text-cyan-300">
              {formatCurrency(payableSummary.effectiveNetPayout)}
            </div>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
