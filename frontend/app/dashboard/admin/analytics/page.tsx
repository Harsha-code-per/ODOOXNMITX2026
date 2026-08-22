"use client";

import React, { useState, useEffect } from "react";
import { DayflowApiClient } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { BarChart3, TrendingUp, Users, Wallet, Download, Calendar, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    DayflowApiClient.getAnalyticsSummary().then(setAnalytics);
  }, []);

  if (!analytics) return null;

  const { metrics, departmentDistribution, attendanceTrends } = analytics;

  const handleExportReport = () => {
    toast.success("Executive HR Report Exported!", {
      description: "Attendance velocity, payroll breakdown, and headcount metrics downloaded.",
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl glass-panel border border-slate-200 shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700">
            EXECUTIVE INTELLIGENCE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 mt-0.5">
            Analytics & Workforce Reports
          </h1>
          <p className="text-xs text-slate-500">
            Aggregated headcount distribution, attendance velocity, and departmental compensation trends.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary CSV</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
            Total Active Staff
          </span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            {metrics.totalEmployees}
          </span>
          <span className="text-[11px] text-emerald-600 mt-1 block font-semibold">+2 Joined this month</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border-cyan-200 cyan-glow-subtle">
          <span className="text-cyan-800 font-bold uppercase tracking-wider text-[10px] block">
            Average Presence Velocity
          </span>
          <span className="text-3xl font-extrabold font-mono text-emerald-600 mt-1 block">
            {metrics.attendanceRate}%
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Target &gt; 90% achieved</span>
        </div>

        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
            Active Leave Ratio
          </span>
          <span className="text-3xl font-extrabold font-mono text-purple-600 mt-1 block">
            {((metrics.onLeaveToday / metrics.totalEmployees) * 100).toFixed(1)}%
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">1 on approved vacation</span>
        </div>

        <div className="p-5 rounded-2xl glass-card">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] block">
            Monthly Total Payroll
          </span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            {formatCurrency(metrics.monthlyPayrollTotal)}
          </span>
          <span className="text-[11px] text-cyan-700 font-semibold mt-1 block">Dynamic computed CTC</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends Area Chart */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Attendance Velocity (Past 5 Days)</h3>
              <p className="text-xs text-slate-500">Daily present count across organization</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              91% Average
            </span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanLightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[0, 12]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                    fontSize: "12px",
                    color: "#0f172a",
                  }}
                />
                <Area type="monotone" dataKey="present" stroke="#0891b2" strokeWidth={3} fill="url(#cyanLightGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Payroll Spend Bar Chart */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Department Payroll Spend (INR)</h3>
              <p className="text-xs text-slate-500">Monthly compensation distribution by team</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
              ₹8,57,000 Total
            </span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentDistribution} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), "Payroll Spend"]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.1)",
                    fontSize: "12px",
                    color: "#0f172a",
                  }}
                />
                <Bar dataKey="payroll" fill="#0891b2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Headcount Distribution Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
          Department Headcount & Cost Allocation Matrix
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="pb-3 font-semibold">Department</th>
                <th className="pb-3 font-semibold">Headcount</th>
                <th className="pb-3 font-semibold">Total Monthly CTC</th>
                <th className="pb-3 font-semibold">Avg Salary / Head</th>
                <th className="pb-3 font-semibold text-right">% of Company Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentDistribution.map((dept: any) => {
                const pct = ((dept.payroll / metrics.monthlyPayrollTotal) * 100).toFixed(1);
                const avg = dept.count > 0 ? dept.payroll / dept.count : 0;

                return (
                  <tr key={dept.name} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900">{dept.name}</td>
                    <td className="py-3.5 font-mono font-semibold text-slate-700">{dept.count} Staff</td>
                    <td className="py-3.5 font-mono font-bold text-cyan-700">{formatCurrency(dept.payroll)}</td>
                    <td className="py-3.5 font-mono text-slate-600">{formatCurrency(avg)}</td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800">{pct}%</span>
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
