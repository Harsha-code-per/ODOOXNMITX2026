"use client";

import React, { useState } from "react";
import { Employee, EmployeeStatus } from "@/lib/mock-data";
import { DayflowApiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { X, Save, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { AvatarBadge } from "@/components/shared/AvatarBadge";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-cyan-300 shadow-2xl p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <AvatarBadge
            name={`${employee.firstName} ${employee.lastName}`}
            department={employee.department}
            size="md"
            status={employee.status}
            showStatus
          />
          <div>
            <h3 className="text-base font-bold text-slate-900">Edit Employee Profile</h3>
            <p className="text-xs text-slate-500">
              {employee.firstName} {employee.lastName} ({employee.employeeId})
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          {/* Admin / HR Only Fields */}
          {isAdminOrHR && (
            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200">
              <span className="font-bold text-cyan-900 block mb-2 text-[11px] uppercase tracking-wider">
                ADMIN / HR GOVERNANCE CONTROLS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-semibold"
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
                  <label className="block text-slate-700 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-semibold"
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
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-600" /> Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-600" /> Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                required
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-800 block mb-2">Emergency Contact Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-slate-500 mb-1 text-[11px]">Contact Name</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1 text-[11px]">Relationship</label>
                <input
                  type="text"
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1 text-[11px]">Emergency Phone</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-md shadow-cyan-500/25 transition-all disabled:opacity-50"
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
