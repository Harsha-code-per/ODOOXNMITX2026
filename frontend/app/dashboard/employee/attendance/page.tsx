"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { AttendanceRecord } from "@/lib/mock-data";
import { LiveTimerPulse } from "@/components/attendance/LiveTimerPulse";
import { formatDate, formatTime } from "@/lib/utils";
import { Clock, CalendarCheck, CheckCircle2, AlertCircle, Filter, Sparkles } from "lucide-react";

export default function EmployeeAttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const employeeId = user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";

  const fetchRecords = () => {
    DayflowApiClient.getAttendanceHistory(employeeId).then(setRecords);
  };

  useEffect(() => {
    fetchRecords();
  }, [employeeId]);

  const filtered = statusFilter === "ALL" ? records : records.filter((r) => r.status === statusFilter);

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const halfDayCount = records.filter((r) => r.status === "HALF_DAY").length;
  const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">My Attendance Log</h1>
          <p className="text-xs text-slate-400">Track your daily clock-ins, duration, and working hours.</p>
        </div>
      </div>

      {/* Grid: Live Stopwatch + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LiveTimerPulse onRecordUpdated={fetchRecords} />
        </div>

        {/* Metrics Row */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl glass-card border border-[var(--border)] flex flex-col justify-between">
            <span className="text-slate-400 font-semibold">Total Days</span>
            <span className="text-2xl font-extrabold font-mono text-slate-100">{records.length}</span>
            <span className="text-[10px] text-slate-500">August 2026</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-[var(--border)] flex flex-col justify-between">
            <span className="text-emerald-400 font-semibold">Present Days</span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400">{presentCount}</span>
            <span className="text-[10px] text-slate-500">Full shifts</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-[var(--border)] flex flex-col justify-between">
            <span className="text-amber-400 font-semibold">Half Days</span>
            <span className="text-2xl font-extrabold font-mono text-amber-400">{halfDayCount}</span>
            <span className="text-[10px] text-slate-500">&lt; 5 hours</span>
          </div>
          <div className="p-4 rounded-2xl glass-card border border-cyan-500/20 cyan-glow-subtle flex flex-col justify-between">
            <span className="text-cyan-400 font-semibold">Total Hours</span>
            <span className="text-2xl font-extrabold font-mono text-cyan-300">{totalHours.toFixed(1)}</span>
            <span className="text-[10px] text-slate-500">Avg 8.4h / day</span>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-[var(--border)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-bold text-[var(--foreground)]">Attendance Logbook</h3>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px] mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            {["ALL", "PRESENT", "HALF_DAY", "ON_LEAVE"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  statusFilter === st
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
                <th className="pb-2.5 font-semibold">Work Date</th>
                <th className="pb-2.5 font-semibold">Check-In</th>
                <th className="pb-2.5 font-semibold">Check-Out</th>
                <th className="pb-2.5 font-semibold">Logged Hours</th>
                <th className="pb-2.5 font-semibold">Status</th>
                <th className="pb-2.5 font-semibold">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 font-semibold text-slate-200">{formatDate(rec.workDate)}</td>
                  <td className="py-3.5 text-slate-300 font-mono">{formatTime(rec.checkIn)}</td>
                  <td className="py-3.5 text-slate-300 font-mono">
                    {rec.checkOut ? formatTime(rec.checkOut) : "Active / Live"}
                  </td>
                  <td className="py-3.5 font-mono font-bold text-cyan-400">
                    {rec.totalHours ? `${rec.totalHours} hrs` : "--"}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        rec.status === "PRESENT"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : rec.status === "HALF_DAY"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-400 italic">{rec.notes || "Standard shift"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
