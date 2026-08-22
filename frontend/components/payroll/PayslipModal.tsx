"use client";

import React from "react";
import { Employee } from "@/lib/mock-data";
import { SalaryComponents, PayableSalaryResult } from "@/lib/salary-calculator";
import { generatePayslipPDF } from "@/lib/pdf-generator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { X, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

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
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
      toast.success("Payslip PDF downloaded!", {
        description: `Dayflow_Payslip_${employee.employeeId}_August_2026.pdf has been generated.`,
      });
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-cyan-300 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700">DAYFLOW HRMS</span>
            <h3 className="text-lg font-bold text-slate-900">Official Salary Statement</h3>
            <p className="text-xs text-slate-500">Pay Period: August 2026</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download Branded PDF</span>
          </button>
        </div>

        {/* Employee Details Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
          <div>
            <span className="text-slate-400 text-[10px] block">Employee Name</span>
            <span className="font-bold text-slate-900">{employee.firstName} {employee.lastName}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Employee ID / Role</span>
            <span className="font-mono font-semibold text-slate-800">{employee.employeeId}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Department</span>
            <span className="font-semibold text-slate-800">{employee.department}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Designation</span>
            <span className="font-semibold text-slate-800">{employee.designation}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Payable Days</span>
            <span className="font-mono font-bold text-cyan-800">{payableSummary.payableDays} / {payableSummary.totalWorkDays} Days</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Disbursement Date</span>
            <span className="font-semibold text-slate-800">{formatDate(new Date())}</span>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-4">
          {/* Earnings */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h4 className="font-bold text-cyan-800 text-xs mb-2 pb-1 border-b border-slate-100">EARNINGS</h4>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Basic Salary</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.basic)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">House Rent Allowance</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.hra)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Standard Allowance</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.standardAllowance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Performance Bonus</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.performanceBonus)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Leave Travel Allowance</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.lta)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Fixed Allowance</span>
                <span className="font-mono font-bold text-slate-900">{formatCurrency(structure.fixedAllowance)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-100 font-bold">
                <span className="text-slate-900">Gross Earnings</span>
                <span className="font-mono text-cyan-800">{formatCurrency(structure.grossSalary)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h4 className="font-bold text-rose-700 text-xs mb-2 pb-1 border-b border-slate-100">DEDUCTIONS</h4>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Provident Fund (12%)</span>
                <span className="font-mono font-bold text-rose-600">-{formatCurrency(structure.pf)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Professional Tax</span>
                <span className="font-mono font-bold text-rose-600">-{formatCurrency(structure.professionalTax)}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-100 font-bold">
                <span className="text-slate-900">Total Deductions</span>
                <span className="font-mono text-rose-600">-{formatCurrency(structure.totalDeductions)}</span>
              </div>
            </div>

            {/* Net Pay Callout */}
            <div className="mt-6 p-3.5 rounded-xl bg-cyan-50 border border-cyan-200">
              <span className="text-[10px] uppercase font-bold text-cyan-800 block">NET TAKE-HOME DISBURSED</span>
              <span className="text-2xl font-extrabold font-mono text-cyan-900">{formatCurrency(payableSummary.payableAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            Close Statement
          </button>
        </div>
      </div>
    </div>
  );
}
