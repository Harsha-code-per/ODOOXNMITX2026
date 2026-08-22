"use client";

import React, { useState } from "react";
import { Employee, EmployeeStatus } from "@/lib/mock-data";
import { DayflowApiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { X, Save, User, Phone, MapPin, Briefcase, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface EmployeeEditDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function EmployeeEditDrawer({ employee, isOpen, onClose, onSaved }: EmployeeEditDrawerProps) {
  const { user, updateCurrentUserEmployee } = useAuth();
  const isAdminOrHR = user?.role === "ADMIN" || user?.role === "HR";

  const [phone, setPhone] = useState(employee?.phone || "");
  const [address, setAddress] = useState(employee?.address || "");
  const [department, setDepartment] = useState(employee?.department || "Engineering");
  const [designation, setDesignation] = useState(employee?.designation || "");
  const [status, setStatus] = useState<EmployeeStatus>(employee?.status || "ACTIVE");
  const [emergencyName, setEmergencyName] = useState(employee?.emergencyContact?.name || "");
  const [emergencyPhone, setEmergencyPhone] = useState(employee?.emergencyContact?.phone || "");
  const [emergencyRel, setEmergencyRel] = useState(employee?.emergencyContact?.relationship || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updates: Partial<Employee> = {
        phone,
        address,
        emergencyContact: {
          name: emergencyName,
          phone: emergencyPhone,
          relationship: emergencyRel,
        },
      };

      if (isAdminOrHR) {
        updates.department = department;
        updates.designation = designation;
        updates.status = status;
      }

      await DayflowApiClient.updateEmployee(employee.employeeId, updates);

      if (user?.employee.employeeId === employee.employeeId) {
        updateCurrentUserEmployee(updates);
      }

      confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
      toast.success("Profile records updated successfully!");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[var(--border)]">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/40 bg-slate-800 flex items-center justify-center font-bold text-cyan-300">
            {employee.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={employee.avatarUrl} alt={employee.firstName} className="w-full h-full object-cover" />
            ) : (
              <span>{employee.firstName[0]}</span>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">Edit Employee Profile</h3>
            <p className="text-xs text-slate-400">
              {employee.firstName} {employee.lastName} ({employee.employeeId})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Admin / HR Only Fields */}
          {isAdminOrHR && (
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
              <span className="font-bold text-cyan-400 block mb-2 text-[11px] uppercase tracking-wider">
                ADMIN / HR GOVERNANCE CONTROLS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Employment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ON_LEAVE">ON_LEAVE</option>
                    <option value="TERMINATED">TERMINATED</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Contact Details (Editable by both Employee & Admin) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                required
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-[var(--border)]">
            <span className="font-semibold text-slate-300 block mb-2">Emergency Contact Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-slate-400 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Relationship</label>
                <input
                  type="text"
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Emergency Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-[var(--border)] text-slate-100 focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving changes..." : "Save Profile Details"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
