"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { EmployeeEditDrawer } from "@/components/employees/EmployeeEditDrawer";
import { formatCurrency, formatDate } from "@/lib/utils";
import { calculateSalaryStructure } from "@/lib/salary-calculator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  ShieldCheck,
  Edit3,
  FileText,
  Download,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { AvatarBadge } from "@/components/shared/AvatarBadge";

export default function EmployeeProfilePage() {
  const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const employee = user?.employee;
  if (!employee) return null;

  const salary = calculateSalaryStructure(employee.wage);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header Profile Card */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 cyan-glow-subtle flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5">
          <AvatarBadge
            name={`${employee.firstName} ${employee.lastName}`}
            department={employee.department}
            size="xl"
            status={employee.status}
            showStatus
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold font-heading">
                {employee.firstName} {employee.lastName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                {employee.status}
              </span>
            </div>
            <p className="text-xs text-cyan-400 font-semibold mt-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> {employee.designation} · {employee.department}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Employee ID: {employee.employeeId}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Contact Info</span>
        </button>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Personal & Contact Info */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[var(--border)] flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] pb-2 border-b border-[var(--border)] flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" /> Personal & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500 block mb-0.5">Email Address</span>
              <span className="font-semibold text-slate-200">{employee.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Phone Number</span>
              <span className="font-semibold text-slate-200">{employee.phone}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-500 block mb-0.5">Residential Address</span>
              <span className="font-semibold text-slate-200 leading-relaxed">{employee.address}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider block mb-2">
              Emergency Contact
            </span>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)] grid grid-cols-3 gap-2">
              <div>
                <span className="text-slate-500 block text-[10px]">Name</span>
                <span className="font-semibold text-slate-200">{employee.emergencyContact.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Relationship</span>
                <span className="font-semibold text-slate-200">{employee.emergencyContact.relationship}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Phone</span>
                <span className="font-semibold text-slate-200">{employee.emergencyContact.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[var(--border)] flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[var(--foreground)] pb-2 border-b border-[var(--border)] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" /> Employment & Career
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-500 block mb-0.5">Department</span>
              <span className="font-semibold text-slate-200">{employee.department}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Designation</span>
              <span className="font-semibold text-slate-200">{employee.designation}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Joining Date</span>
              <span className="font-semibold text-slate-200">{formatDate(employee.joiningDate)}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5">Employment Type</span>
              <span className="font-semibold text-cyan-400">Full-time Regular</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Profile verified by HR Director Sarah Jenkins. All statutory compliances are up to date.</span>
          </div>
        </div>
      </div>

      {/* Salary Overview & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        {/* Salary Structure View */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[var(--border)]">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-3">
            <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
              <Wallet className="w-4 h-4 text-cyan-400" /> Salary Structure (Read-Only)
            </h3>
            <span className="text-[10px] text-slate-400">Monthly CTC</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-slate-300">
              <span>Basic Salary (50%)</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(salary.basic)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>House Rent Allowance (HRA)</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(salary.hra)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Standard Statutory Allowance</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(salary.standardAllowance)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Performance Bonus + LTA</span>
              <span className="font-mono font-semibold text-slate-100">
                {formatCurrency(salary.performanceBonus + salary.lta)}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Fixed Balancing Component</span>
              <span className="font-mono font-semibold text-slate-100">{formatCurrency(salary.fixedAllowance)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-cyan-400 text-sm">
              <span>Monthly Base CTC</span>
              <span className="font-mono">{formatCurrency(salary.grossSalary)}</span>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[var(--border)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--foreground)] pb-2 border-b border-[var(--border)] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> Official Documents & Certifications
            </h3>

            <div className="flex flex-col gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Employment Offer Letter</span>
                    <span className="text-[10px] text-slate-500">PDF · Verified · Signed</span>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400">
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Tax Declaration & Form 16</span>
                    <span className="text-[10px] text-slate-500">PDF · FY 2025-26</span>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 mt-4 text-center">
            To upload additional certifications, contact your HR Officer.
          </p>
        </div>
      </div>

      {/* Edit Drawer */}
      <EmployeeEditDrawer
        employee={employee}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaved={() => {}}
      />
    </div>
  );
}
