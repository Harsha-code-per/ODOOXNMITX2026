"use client";

import React, { useState, useEffect } from "react";
import { DayflowApiClient } from "@/lib/api";
import { Employee, AttendanceRecord, AttendanceStatus } from "@/lib/mock-data";
import { formatDate, formatTime } from "@/lib/utils";
import {
  CalendarCheck,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Calendar,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AvatarBadge } from "@/components/shared/AvatarBadge";

export default function AdminAttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const [editingRecord, setEditingRecord] = useState<{
    recordId: string;
    employeeName: string;
    status: AttendanceStatus;
    hours: number;
  } | null>(null);

  const fetchData = () => {
    DayflowApiClient.getEmployees().then(setEmployees);
    DayflowApiClient.getAttendanceHistory().then(setAttendanceLogs);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveOverride = async () => {
    if (!editingRecord) return;
    try {
      await DayflowApiClient.updateAttendanceStatus(
        editingRecord.recordId,
        editingRecord.status,
        editingRecord.hours
      );
      toast.success(`Attendance updated for ${editingRecord.employeeName}`);
      fetchData();
      setEditingRecord(null);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Build daily matrix for each employee
  const dailyMatrix = employees.map((emp) => {
    const record = attendanceLogs.find((a) => a.employeeId === emp.id && a.workDate === selectedDate);
    const status: AttendanceStatus = record ? record.status : emp.status === "ON_LEAVE" ? "ON_LEAVE" : "PRESENT";
    return {
      employee: emp,
      recordId: record?.id || `virtual-${emp.id}`,
      checkIn: record?.checkIn || (status === "PRESENT" ? "2026-08-22T09:00:00Z" : null),
      checkOut: record?.checkOut || null,
      totalHours: record?.totalHours || (status === "PRESENT" ? 8.5 : status === "HALF_DAY" ? 4.5 : 0.0),
      status,
      notes: record?.notes || "Standard shift",
    };
  });

  const filteredMatrix =
    selectedStatus === "ALL" ? dailyMatrix : dailyMatrix.filter((item) => item.status === selectedStatus);

  const presentCount = dailyMatrix.filter((i) => i.status === "PRESENT").length;
  const onLeaveCount = dailyMatrix.filter((i) => i.status === "ON_LEAVE").length;
  const halfDayCount = dailyMatrix.filter((i) => i.status === "HALF_DAY").length;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Company Attendance Matrix</h1>
          <p className="text-xs text-slate-500">
            Monitor real-time company attendance, shift durations, and manual status overrides.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Calendar className="w-4 h-4 text-cyan-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Total Staff</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">{employees.length}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Active roster</span>
        </div>
        <div className="p-5 rounded-2xl glass-card border-cyan-200 cyan-glow-subtle">
          <span className="text-cyan-800 font-bold uppercase tracking-wider text-[10px] block">Present / On Duty</span>
          <span className="text-3xl font-extrabold font-mono text-emerald-600 mt-1 block">{presentCount}</span>
          <span className="text-[11px] text-slate-600 font-medium mt-1 block">
            {Math.round((presentCount / (employees.length || 1)) * 100)}% attendance velocity
          </span>
        </div>
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">On Approved Leave</span>
          <span className="text-3xl font-extrabold font-mono text-purple-600 mt-1 block">{onLeaveCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Excused absence</span>
        </div>
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">Half-Days</span>
          <span className="text-3xl font-extrabold font-mono text-amber-600 mt-1 block">{halfDayCount}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Partial hours</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600" /> Daily Attendance Log for {formatDate(selectedDate)}
          </h3>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Filter:</span>
            {["ALL", "PRESENT", "HALF_DAY", "ON_LEAVE"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  selectedStatus === st
                    ? "bg-cyan-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400">
              <th className="pb-3 font-semibold">Employee</th>
              <th className="pb-3 font-semibold">Department</th>
              <th className="pb-3 font-semibold">Check-In</th>
              <th className="pb-3 font-semibold">Check-Out</th>
              <th className="pb-3 font-semibold">Hours Logged</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Admin Override</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMatrix.map((item) => (
              <tr key={item.employee.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 flex items-center gap-2.5">
                  <AvatarBadge
                    name={`${item.employee.firstName} ${item.employee.lastName}`}
                    department={item.employee.department}
                    size="sm"
                    status={item.status}
                    showStatus
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {item.employee.firstName} {item.employee.lastName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.employee.employeeId}</span>
                  </div>
                </td>
                <td className="py-3.5 text-slate-700 font-semibold">{item.employee.department}</td>
                <td className="py-3.5 font-mono text-slate-600">{formatTime(item.checkIn)}</td>
                <td className="py-3.5 font-mono text-slate-600">
                  {item.checkOut ? formatTime(item.checkOut) : "Active / Live"}
                </td>
                <td className="py-3.5 font-mono font-bold text-cyan-700">{item.totalHours.toFixed(1)} hrs</td>
                <td className="py-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === "PRESENT"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : item.status === "ON_LEAVE"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : item.status === "HALF_DAY"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() =>
                      setEditingRecord({
                        recordId: item.recordId,
                        employeeName: `${item.employee.firstName} ${item.employee.lastName}`,
                        status: item.status,
                        hours: item.totalHours,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold inline-flex items-center gap-1.5 transition-colors text-[11px]"
                    title="Override Attendance Record"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Adjust</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Override Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-panel rounded-3xl border border-cyan-300 shadow-2xl p-6 relative text-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Override Attendance Status</h3>
            <p className="text-slate-500 mb-4">{editingRecord.employeeName}</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Status</label>
                <select
                  value={editingRecord.status}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, status: e.target.value as AttendanceStatus })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="HALF_DAY">HALF_DAY</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                  <option value="ABSENT">ABSENT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Total Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingRecord.hours}
                  onChange={(e) => setEditingRecord({ ...editingRecord, hours: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setEditingRecord(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOverride}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-sm"
                >
                  Save Override
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
