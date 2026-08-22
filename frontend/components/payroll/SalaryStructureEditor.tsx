"use client";

import React, { useState } from "react";
import { Employee } from "@/lib/mock-data";
import { DayflowApiClient } from "@/lib/api";
import { calculateSalaryStructure, SalaryComponents } from "@/lib/salary-calculator";
import { formatCurrency } from "@/lib/utils";
import { X, Save, Calculator } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-cyan-300 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Dynamic Salary Structure Engine</h3>
            <p className="text-xs text-slate-500">
              Editing: <span className="text-cyan-800 font-bold">{employee.firstName} {employee.lastName}</span> ({employee.employeeId} · {employee.designation})
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          {/* Wage Input Bar */}
          <div className="p-5 rounded-2xl bg-cyan-50/80 border border-cyan-200">
            <label className="block text-xs font-bold text-cyan-900 mb-1.5 flex items-center justify-between">
              <span>MONTHLY BASE WAGE (TOTAL GROSS CTC)</span>
              <span className="text-[11px] text-slate-500 font-medium">Auto-recalculates all statutory components</span>
            </label>
            <div className="relative flex items-center mt-1">
              <span className="absolute left-3.5 text-slate-400 font-bold text-base">₹</span>
              <input
                type="number"
                step="500"
                value={wageInput}
                onChange={(e) => setWageInput(Number(e.target.value))}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-cyan-300 text-lg font-bold font-mono text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-xs"
                required
              />
            </div>
          </div>

          {/* Dynamic Breakdown Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Earnings Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <h4 className="font-bold text-cyan-800 text-xs mb-3 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                <span>EARNINGS COMPONENTS</span>
                <span className="text-[10px] text-slate-400">Formula Rule</span>
              </h4>

              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(breakdown.basic)} <span className="text-[10px] text-slate-400">(50%)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(breakdown.hra)} <span className="text-[10px] text-slate-400">(50% Basic)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Standard Allowance</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(breakdown.standardAllowance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Performance Bonus</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(breakdown.performanceBonus)} <span className="text-[10px] text-slate-400">(8.33%)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Leave Travel Allowance (LTA)</span>
                  <span className="font-mono font-bold text-slate-900">{formatCurrency(breakdown.lta)} <span className="text-[10px] text-slate-400">(8.33%)</span></span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                  <span className="text-cyan-800 font-bold">Fixed Balancing Allowance</span>
                  <span className="font-mono font-bold text-cyan-700">{formatCurrency(breakdown.fixedAllowance)}</span>
                </div>
              </div>
            </div>

            {/* Deductions & Net Pay */}
            <div className="flex flex-col gap-3">
              {/* Deductions Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h4 className="font-bold text-rose-700 text-xs mb-3 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span>DEDUCTIONS</span>
                  <span className="text-[10px] text-slate-400">Statutory</span>
                </h4>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Provident Fund (PF)</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(breakdown.pf)} <span className="text-[10px] text-slate-400">(12% Basic)</span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Professional Tax (PT)</span>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(breakdown.professionalTax)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 font-bold">
                    <span className="text-rose-700">Total Deductions</span>
                    <span className="font-mono text-rose-600">-{formatCurrency(breakdown.totalDeductions)}</span>
                  </div>
                </div>
              </div>

              {/* Net Payout Banner */}
              <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 shadow-xs">
                <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-800 block mb-0.5">ESTIMATED NET TAKE-HOME PAY</span>
                <div className="text-2xl font-extrabold font-mono text-cyan-800">
                  {formatCurrency(breakdown.netSalary)}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Gross: {formatCurrency(breakdown.grossSalary)} · Minus {formatCurrency(breakdown.totalDeductions)}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25 transition-all disabled:opacity-50"
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
