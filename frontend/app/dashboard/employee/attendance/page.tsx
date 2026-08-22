"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { AttendanceRecord } from "@/lib/mock-data";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarCheck, Clock, Filter, CheckCircle2, AlertCircle } from "lucide-react";

export default function EmployeeAttendancePage() {
  const { user } = useAuth();
  const employeeId = user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    DayflowApiClient.getAttendanceHistory(employeeId).then(setLogs);
  }, [employeeId]);

  const filteredLogs = filter === "ALL" ? logs : logs.filter((l) => l.status === filter);
  const totalHours = logs.reduce((sum, l) => sum + (l.totalHours || 0), 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">Attendance Logbook</h1>
          <p className="text-xs text-slate-500">
            Official shift logs, timestamps, and biometric presence records.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs">
          {["ALL", "PRESENT", "HALF_DAY"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === f
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
            Total Hours Logged (Aug)
          </span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            {totalHours.toFixed(1)} hrs
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Average: 8.5 hrs / work day
          </span>
        </div>
        <div className="p-5 rounded-2xl glass-card cyan-glow-subtle border-cyan-200">
          <span className="text-cyan-800 font-bold uppercase tracking-wider text-[10px] block">
            Present Work Days
          </span>
          <span className="text-3xl font-extrabold font-mono text-cyan-700 mt-1 block">
            {logs.filter((l) => l.status === "PRESENT").length} Days
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Out of 22 scheduled workdays</span>
        </div>
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
            Half-Days Logged
          </span>
          <span className="text-3xl font-extrabold font-mono text-amber-600 mt-1 block">
            {logs.filter((l) => l.status === "HALF_DAY").length} Day
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Aug 21 (Dentist visit)</span>
        </div>
      </div>

      {/* Log Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <Clock className="w-4 h-4 text-cyan-600" /> Shift History & Details
        </h3>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400">
              <th className="pb-3 font-semibold">Work Date</th>
              <th className="pb-3 font-semibold">Check-In</th>
              <th className="pb-3 font-semibold">Check-Out</th>
              <th className="pb-3 font-semibold">Logged Duration</th>
              <th className="pb-3 font-semibold">Notes / Shift</th>
              <th className="pb-3 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 font-bold text-slate-800">{formatDate(item.workDate)}</td>
                <td className="py-3.5 font-mono text-slate-600">{formatTime(item.checkIn)}</td>
                <td className="py-3.5 font-mono text-slate-600">
                  {item.checkOut ? formatTime(item.checkOut) : "Active / Live"}
                </td>
                <td className="py-3.5 font-mono font-bold text-cyan-700">{item.totalHours.toFixed(2)} hrs</td>
                <td className="py-3.5 text-slate-500 italic">{item.notes || "Standard shift"}</td>
                <td className="py-3.5 text-right">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === "PRESENT"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : item.status === "HALF_DAY"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-purple-50 text-purple-700 border border-purple-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
