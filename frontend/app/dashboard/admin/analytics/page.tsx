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
  PieChart,
  Pie,
  Cell,
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

  const COLORS = ["#06B6D4", "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#6366F1"];

  const handleExportReport = () => {
    toast.success("Executive HR Report exported!", {
      description: "Attendance, payroll, and department metrics downloaded in CSV format.",
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-[var(--border)]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            EXECUTIVE INTELLIGENCE
          </span>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Analytics & Workforce Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated headcount distribution, attendance velocity, and compensation trends.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 transition-all hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl glass-card border border-[var(--border)]">
          <span className="text-slate-400 font-semibold block">Total Active Staff</span>
          <span className="text-2xl font-extrabold font-mono text-slate-100">{metrics.totalEmployees}</span>
          <span className="text-[10px] text-emerald-400 mt-0.5 block font-semibold">+2 Joined this month</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 cyan-glow-subtle">
          <span className="text-emerald-400 font-semibold block">Average Presence Rate</span>
          <span className="text-2xl font-extrabold font-mono text-emerald-400">{metrics.attendanceRate}%</span>
          <span className="text-[10px] text-slate-400">Target &gt; 90% achieved</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-purple-500/30">
          <span className="text-purple-400 font-semibold block">Active Leave Ratio</span>
          <span className="text-2xl font-extrabold font-mono text-purple-400">
            {((metrics.onLeaveToday / metrics.totalEmployees) * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-slate-500">1 on approved vacation</span>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-cyan-500/30 cyan-glow-subtle">
          <span className="text-cyan-400 font-semibold block">Monthly Total Payroll</span>
          <span className="text-2xl font-extrabold font-mono text-cyan-300">
            {formatCurrency(metrics.monthlyPayrollTotal)}
          </span>
          <span className="text-[10px] text-slate-500">Dynamic computed CTC</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trends Area Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border)]">
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">Attendance Velocity (Past 5 Days)</h3>
              <p className="text-xs text-slate-400">Daily present count across organization</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">91% Average</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 12]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "rgba(6,182,212,0.4)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="present" stroke="#06B6D4" strokeWidth={2.5} fill="url(#cyanGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Payroll Spend Bar Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-[var(--border)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--border)]">
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">Department Payroll Spend (INR)</h3>
              <p className="text-xs text-slate-400">Monthly compensation distribution by team</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300">₹8,57,000 Total</span>
          </div>

          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentDistribution} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), "Payroll Spend"]}
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderColor: "rgba(6,182,212,0.4)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="payroll" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Headcount Distribution Table */}
      <div className="glass-panel rounded-2xl p-5 border border-[var(--border)]">
        <h3 className="text-sm font-bold text-[var(--foreground)] mb-3 pb-2 border-b border-[var(--border)]">
          Department Headcount & Cost Allocation Matrix
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)] text-slate-400">
                <th className="pb-2.5 font-semibold">Department</th>
                <th className="pb-2.5 font-semibold">Headcount</th>
                <th className="pb-2.5 font-semibold">Total Monthly CTC</th>
                <th className="pb-2.5 font-semibold">Avg Salary / Head</th>
                <th className="pb-2.5 font-semibold text-right">% of Company Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {departmentDistribution.map((dept: any) => {
                const pct = ((dept.payroll / metrics.monthlyPayrollTotal) * 100).toFixed(1);
                const avg = dept.count > 0 ? dept.payroll / dept.count : 0;

                return (
                  <tr key={dept.name} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 font-bold text-slate-200">{dept.name}</td>
                    <td className="py-3 font-mono font-semibold text-slate-300">{dept.count} Staff</td>
                    <td className="py-3 font-mono font-bold text-cyan-300">{formatCurrency(dept.payroll)}</td>
                    <td className="py-3 font-mono text-slate-400">{formatCurrency(avg)}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-200">{pct}%</span>
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${pct}%` }} />
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
