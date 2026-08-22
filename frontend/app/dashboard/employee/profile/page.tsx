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
      <div className="p-6 sm:p-7 rounded-3xl glass-panel border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
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
              <h1 className="text-2xl font-bold font-heading text-slate-900">
                {employee.firstName} {employee.lastName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                {employee.status}
              </span>
            </div>
            <p className="text-xs text-cyan-800 font-semibold mt-1">
              {employee.designation} • {employee.department}
            </p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {employee.employeeId}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs hover:border-cyan-400 transition-all hover:scale-105"
        >
          <Edit3 className="w-4 h-4 text-cyan-600" />
          <span>Edit Contact Records</span>
        </button>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal & Contact Information */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-cyan-600" /> Personal & Contact Details
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" /> Work Email:
                </span>
                <span className="font-semibold text-slate-800">{employee.email}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" /> Mobile Phone:
                </span>
                <span className="font-mono font-semibold text-slate-800">{employee.phone}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" /> Residential Address:
                </span>
                <span className="font-semibold text-slate-800 text-right max-w-xs">{employee.address}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" /> Date of Joining:
                </span>
                <span className="font-semibold text-slate-800">{formatDate(employee.joiningDate)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Identity verified via Dayflow Auth</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </span>
          </div>
        </div>

        {/* Emergency Contact & Job Information */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-cyan-600" /> Emergency Contact & Job Profile
            </h3>

            <div className="flex flex-col gap-3 text-xs mb-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="font-semibold text-slate-800">{employee.emergencyContact?.name || "Maria Rivera"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Relationship:</span>
                <span className="font-semibold text-slate-800">{employee.emergencyContact?.relationship || "Sister"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Emergency Phone:</span>
                <span className="font-mono font-semibold text-slate-800">{employee.emergencyContact?.phone || "+1 555-0302"}</span>
              </div>
            </div>

            {/* Compensation Overview Pill */}
            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-cyan-900">Current Base Wage (CTC)</span>
                <span className="font-mono font-extrabold text-cyan-800 text-sm">{formatCurrency(employee.wage)} / mo</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Net take-home: <strong className="text-emerald-700 font-mono">{formatCurrency(salary.netSalary)}</strong> after PF (12%) & Professional Tax.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Designated Department: {employee.department}
          </div>
        </div>
      </div>

      <EmployeeEditDrawer
        employee={employee}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSaved={() => {}}
      />
    </div>
  );
}
