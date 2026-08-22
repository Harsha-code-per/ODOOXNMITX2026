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
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Company Attendance Matrix</h1>
          <p className="text-xs text-slate-400">
            Monitor real-time company attendance, shift durations, and status overrides.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-[var(--border)] text-xs text-slate-100 focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Summary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl glass-card border border-[var(--border)]">
          <span className="text-slate-400 block font-semibold">Total Staff</span>
          <span className="text-2xl font-extrabold font-mono text-slate-100">{employees.length}</span>
          <span className="text-[10px] text-slate-500">Active roster</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 cyan-glow-subtle">
          <span className="text-emerald-400 block font-semibold">Present / On Duty</span>
          <span className="text-2xl font-extrabold font-mono text-emerald-400">{presentCount}</span>
          <span className="text-[10px] text-slate-400">{Math.round((presentCount / employees.length) * 100)}% attendance rate</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-purple-500/30">
          <span className="text-purple-400 block font-semibold">On Approved Leave</span>
          <span className="text-2xl font-extrabold font-mono text-purple-400">{onLeaveCount}</span>
          <span className="text-[10px] text-slate-500">Excused absence</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-amber-500/30">
          <span className="text-amber-400 block font-semibold">Half-Days</span>
          <span className="text-2xl font-extrabold font-mono text-amber-400">{halfDayCount}</span>
          <span className="text-[10px] text-slate-500">Partial hours</span>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="glass-panel rounded-2xl p-5 border border-[var(--border)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" /> Daily Attendance Log for {formatDate(selectedDate)}
          </h3>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">Filter:</span>
            {["ALL", "PRESENT", "HALF_DAY", "ON_LEAVE"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedStatus === st
                    ? "bg-cyan-500 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400">
                <th className="pb-3 font-semibold">Employee</th>
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Check-In</th>
                <th className="pb-3 font-semibold">Check-Out</th>
                <th className="pb-3 font-semibold">Hours Logged</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Admin Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredMatrix.map((item) => (
                <tr key={item.employee.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3 flex items-center gap-2.5">
                    <AvatarBadge
                      name={`${item.employee.firstName} ${item.employee.lastName}`}
                      department={item.employee.department}
                      size="sm"
                      status={item.status}
                      showStatus
                    />
                    <div>
                      <span className="font-bold text-slate-200 block">
                        {item.employee.firstName} {item.employee.lastName}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.employee.employeeId}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300 font-semibold">{item.employee.department}</td>
                  <td className="py-3 font-mono text-slate-400">{formatTime(item.checkIn)}</td>
                  <td className="py-3 font-mono text-slate-400">
                    {item.checkOut ? formatTime(item.checkOut) : "Active / Live"}
                  </td>
                  <td className="py-3 font-mono font-bold text-cyan-300">{item.totalHours.toFixed(1)} hrs</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === "PRESENT"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : item.status === "ON_LEAVE"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : item.status === "HALF_DAY"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() =>
                        setEditingRecord({
                          recordId: item.recordId,
                          employeeName: `${item.employee.firstName} ${item.employee.lastName}`,
                          status: item.status,
                          hours: item.totalHours,
                        })
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 inline-flex items-center gap-1 transition-colors"
                      title="Override Attendance Record"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Adjust</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Override Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm glass-panel rounded-2xl border border-cyan-500/40 shadow-2xl p-5 relative text-xs">
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">Override Attendance Status</h3>
            <p className="text-slate-400 mb-4">{editingRecord.employeeName}</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Status</label>
                <select
                  value={editingRecord.status}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, status: e.target.value as AttendanceStatus })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="HALF_DAY">HALF_DAY</option>
                  <option value="ON_LEAVE">ON_LEAVE</option>
                  <option value="ABSENT">ABSENT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingRecord.hours}
                  onChange={(e) => setEditingRecord({ ...editingRecord, hours: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-[var(--border)] text-slate-100 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setEditingRecord(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOverride}
                  className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
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
