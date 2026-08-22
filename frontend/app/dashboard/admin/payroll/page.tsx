"use client";

import React, { useState, useEffect } from "react";
import { DayflowApiClient } from "@/lib/api";
import { Employee } from "@/lib/mock-data";
import { SalaryStructureEditor } from "@/components/payroll/SalaryStructureEditor";
import { PayslipModal } from "@/components/payroll/PayslipModal";
import { calculateSalaryStructure, calculatePayablePayout, SalaryComponents, PayableSalaryResult } from "@/lib/salary-calculator";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Wallet,
  Calculator,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { AvatarBadge } from "@/components/shared/AvatarBadge";

export default function AdminPayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmpForEdit, setSelectedEmpForEdit] = useState<Employee | null>(null);
  const [selectedEmpForPayslip, setSelectedEmpForPayslip] = useState<{
    employee: Employee;
    structure: SalaryComponents;
    payableSummary: PayableSalaryResult;
  } | null>(null);

  const fetchEmployees = () => {
    DayflowApiClient.getEmployees().then(setEmployees);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalMonthlyWage = employees.reduce((sum, e) => sum + (e.wage || 0), 0);
  const totalNetPay = employees.reduce((sum, e) => {
    const s = calculateSalaryStructure(e.wage);
    return sum + s.netSalary;
  }, 0);
  const totalStatutoryDeductions = totalMonthlyWage - totalNetPay;

  const handleOpenPayslip = (emp: Employee) => {
    const s = calculateSalaryStructure(emp.wage);
    const p = calculatePayablePayout(s.netSalary, 22, 21, 1);
    setSelectedEmpForPayslip({ employee: emp, structure: s, payableSummary: p });
  };

  const handleBatchDisburse = () => {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    toast.success("August 2026 Batch Payroll Disbursed!", {
      description: `Disbursed ${formatCurrency(totalNetPay)} across ${employees.length} employees with automated bank transfers.`,
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-cyan-500/30 cyan-glow-subtle relative overflow-hidden">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            COMPENSATION & SALARY ENGINE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Company Payroll Matrix</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Governs dynamic salary rules, statutory formulas, and automated payslip generation.
          </p>
        </div>

        <button
          onClick={handleBatchDisburse}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
        >
          <Wallet className="w-4 h-4" />
          <span>Disburse Batch Payroll ({formatCurrency(totalNetPay)})</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-2xl glass-card border border-[var(--border)]">
          <span className="text-slate-400 block font-semibold">Total Monthly Gross CTC</span>
          <span className="text-2xl font-extrabold font-mono text-cyan-300">{formatCurrency(totalMonthlyWage)}</span>
          <span className="text-[10px] text-slate-500">Across {employees.length} staff records</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 cyan-glow-subtle">
          <span className="text-emerald-400 block font-semibold">Total Net Disbursable</span>
          <span className="text-2xl font-extrabold font-mono text-emerald-400">{formatCurrency(totalNetPay)}</span>
          <span className="text-[10px] text-slate-400">After PF & PT deductions</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-rose-500/30">
          <span className="text-rose-400 block font-semibold">Statutory Deductions (PF+PT)</span>
          <span className="text-2xl font-extrabold font-mono text-rose-400">
            {formatCurrency(totalStatutoryDeductions)}
          </span>
          <span className="text-[10px] text-slate-500">Auto-calculated</span>
        </div>
      </div>

      {/* Dynamic Payroll Matrix Table */}
      <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] overflow-x-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" /> Employee Salary Matrix & Breakdown
            </h3>
            <p className="text-xs text-slate-400">
              Edit any base Wage (CTC) to trigger instantaneous recalculation of all statutory components.
            </p>
          </div>
          <span className="text-[11px] text-cyan-400 font-mono font-semibold">August 2026</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] text-slate-400">
              <th className="pb-3 font-semibold">Employee</th>
              <th className="pb-3 font-semibold">Base Wage (CTC)</th>
              <th className="pb-3 font-semibold">Basic (50%)</th>
              <th className="pb-3 font-semibold">HRA (50% Basic)</th>
              <th className="pb-3 font-semibold">Standard</th>
              <th className="pb-3 font-semibold">Bonus+LTA</th>
              <th className="pb-3 font-semibold">Fixed</th>
              <th className="pb-3 font-semibold text-rose-400">PF+PT</th>
              <th className="pb-3 font-semibold text-emerald-400">Net Take-Home</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {employees.map((emp) => {
              const s = calculateSalaryStructure(emp.wage);
              return (
                <tr key={emp.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 flex items-center gap-2.5">
                    <AvatarBadge
                      name={`${emp.firstName} ${emp.lastName}`}
                      department={emp.department}
                      size="sm"
                    />
                    <div>
                      <span className="font-bold text-slate-200 block">
                        {emp.firstName} {emp.lastName}
                      </span>
                      <span className="text-[10px] text-slate-400">{emp.designation}</span>
                    </div>
                  </td>
                  <td className="py-3 font-mono font-bold text-cyan-300">{formatCurrency(s.wage)}</td>
                  <td className="py-3 font-mono text-slate-300">{formatCurrency(s.basic)}</td>
                  <td className="py-3 font-mono text-slate-300">{formatCurrency(s.hra)}</td>
                  <td className="py-3 font-mono text-slate-400">{formatCurrency(s.standardAllowance)}</td>
                  <td className="py-3 font-mono text-slate-400">{formatCurrency(s.performanceBonus + s.lta)}</td>
                  <td className="py-3 font-mono text-slate-400">{formatCurrency(s.fixedAllowance)}</td>
                  <td className="py-3 font-mono font-semibold text-rose-400">-{formatCurrency(s.totalDeductions)}</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">{formatCurrency(s.netSalary)}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedEmpForEdit(emp)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                        title="Adjust base wage"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Wage</span>
                      </button>
                      <button
                        onClick={() => handleOpenPayslip(emp)}
                        className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-semibold text-[11px] inline-flex items-center gap-1 border border-cyan-500/30 transition-colors"
                        title="View & Download PDF Payslip"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Payslip</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <SalaryStructureEditor
        employee={selectedEmpForEdit}
        isOpen={Boolean(selectedEmpForEdit)}
        onClose={() => setSelectedEmpForEdit(null)}
        onSaved={fetchEmployees}
      />

      {selectedEmpForPayslip && (
        <PayslipModal
          employee={selectedEmpForPayslip.employee}
          structure={selectedEmpForPayslip.structure}
          payableSummary={selectedEmpForPayslip.payableSummary}
          isOpen={Boolean(selectedEmpForPayslip)}
          onClose={() => setSelectedEmpForPayslip(null)}
        />
      )}
    </div>
  );
}
