"use client";

import React, { useState } from "react";
import { Employee } from "@/lib/mock-data";
import { DayflowApiClient } from "@/lib/api";
import { calculateSalaryStructure, SalaryComponents } from "@/lib/salary-calculator";
import { formatCurrency } from "@/lib/utils";
import { X, DollarSign, Save, RefreshCw, Calculator, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface SalaryStructureEditorProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function SalaryStructureEditor({ employee, isOpen, onClose, onSaved }: SalaryStructureEditorProps) {
  const [wageInput, setWageInput] = useState<number>(employee?.wage || 60000);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !employee) return null;

  const currentWage = Number(wageInput) || 0;
  const breakdown: SalaryComponents = calculateSalaryStructure(currentWage);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await DayflowApiClient.updateEmployeeWage(employee.employeeId, currentWage);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      toast.success(`Wage updated for ${employee.firstName} ${employee.lastName}!`, {
        description: `New monthly base wage: ${formatCurrency(currentWage)}. All dependent components recalculated.`,
      });
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to update salary");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border)]">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">Dynamic Salary Structure Engine</h3>
            <p className="text-xs text-slate-400">
              Editing: <span className="text-cyan-400 font-semibold">{employee.firstName} {employee.lastName}</span> ({employee.employeeId} · {employee.designation})
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Wage Input Bar */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
            <label className="block text-xs font-bold text-cyan-300 mb-1 flex items-center justify-between">
              <span>MONTHLY BASE WAGE (TOTAL CTC)</span>
              <span className="text-[11px] text-slate-400 font-normal">Auto-recalculates all statutory components</span>
            </label>
            <div className="relative flex items-center mt-1.5">
              <span className="absolute left-3 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                step="500"
                value={wageInput}
                onChange={(e) => setWageInput(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/50 text-base font-bold font-mono text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>
          </div>

          {/* Dynamic Breakdown Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Earnings Box */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-[var(--border)]">
              <h4 className="font-bold text-cyan-400 text-xs mb-2.5 pb-1 border-b border-[var(--border)] flex items-center justify-between">
                <span>EARNINGS COMPONENTS</span>
                <span className="text-[10px] text-slate-400">Formula Rule</span>
              </h4>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Basic Salary</span>
                  <span className="font-mono font-semibold text-slate-100">{formatCurrency(breakdown.basic)} <span className="text-[10px] text-slate-500">(50%)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-semibold text-slate-100">{formatCurrency(breakdown.hra)} <span className="text-[10px] text-slate-500">(50% Basic)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Standard Allowance</span>
                  <span className="font-mono font-semibold text-slate-100">{formatCurrency(breakdown.standardAllowance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Performance Bonus</span>
                  <span className="font-mono font-semibold text-slate-100">{formatCurrency(breakdown.performanceBonus)} <span className="text-[10px] text-slate-500">(8.33%)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Leave Travel Allowance (LTA)</span>
                  <span className="font-mono font-semibold text-slate-100">{formatCurrency(breakdown.lta)} <span className="text-[10px] text-slate-500">(8.33%)</span></span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                  <span className="text-cyan-300 font-medium">Fixed Balancing Allowance</span>
                  <span className="font-mono font-semibold text-cyan-300">{formatCurrency(breakdown.fixedAllowance)}</span>
                </div>
              </div>
            </div>

            {/* Deductions & Net Pay */}
            <div className="flex flex-col gap-3">
              {/* Deductions Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-[var(--border)]">
                <h4 className="font-bold text-rose-400 text-xs mb-2.5 pb-1 border-b border-[var(--border)] flex items-center justify-between">
                  <span>DEDUCTIONS</span>
                  <span className="text-[10px] text-slate-400">Statutory</span>
                </h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Provident Fund (PF)</span>
                    <span className="font-mono font-semibold text-slate-100">{formatCurrency(breakdown.pf)} <span className="text-[10px] text-slate-500">(12% Basic)</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Professional Tax (PT)</span>
                    <span className="font-mono font-semibold text-slate-100">{formatCurrency(breakdown.professionalTax)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 font-bold">
                    <span className="text-rose-300">Total Deductions</span>
                    <span className="font-mono text-rose-400">{formatCurrency(breakdown.totalDeductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/40">
                <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-300 block mb-0.5">ESTIMATED NET TAKE-HOME PAY</span>
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-300">
                  {formatCurrency(breakdown.netSalary)}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Gross Salary: {formatCurrency(breakdown.grossSalary)} · Minus {formatCurrency(breakdown.totalDeductions)} deductions
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save & Apply Salary Structure"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
