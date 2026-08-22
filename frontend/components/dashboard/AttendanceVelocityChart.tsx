"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Clock, TrendingUp, Filter, Calendar, BarChart2 } from "lucide-react";

interface AttendanceVelocityChartProps {
  data?: any[];
}

const WEEKLY_DATA = [
  { day: "Mon", presenceRate: 91, onDuty: 10, total: 11, late: 0 },
  { day: "Tue", presenceRate: 100, onDuty: 11, total: 11, late: 1 },
  { day: "Wed", presenceRate: 91, onDuty: 10, total: 11, late: 0 },
  { day: "Thu", presenceRate: 91, onDuty: 10, total: 11, late: 2 },
  { day: "Fri", presenceRate: 82, onDuty: 9, total: 11, late: 1 },
  { day: "Sat", presenceRate: 0, onDuty: 0, total: 11, late: 0 },
  { day: "Sun", presenceRate: 0, onDuty: 0, total: 11, late: 0 },
];

const MONTHLY_DATA = [
  { day: "W1", presenceRate: 93, onDuty: 10.2, total: 11, late: 3 },
  { day: "W2", presenceRate: 95, onDuty: 10.5, total: 11, late: 2 },
  { day: "W3", presenceRate: 88, onDuty: 9.7, total: 11, late: 4 },
  { day: "W4", presenceRate: 91, onDuty: 10.0, total: 11, late: 1 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-xl text-xs border border-slate-700">
        <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
          {label} Attendance Velocity
        </span>
        <div className="flex items-center gap-2 my-1">
          <span className="text-xl font-extrabold font-mono text-white">
            {data.presenceRate}%
          </span>
          <span className="text-[10px] text-slate-300">Presence</span>
        </div>
        <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between gap-4 text-[11px] text-slate-300">
          <span>Active On-Duty: <strong className="text-white">{data.onDuty} / {data.total}</strong></span>
          <span>Late: <strong className="text-amber-400">{data.late}</strong></span>
        </div>
      </div>
    );
  }
  return null;
};

export function AttendanceVelocityChart({ data }: AttendanceVelocityChartProps) {
  const [period, setPeriod] = useState<"WEEK" | "MONTH">("WEEK");
  const [chartType, setChartType] = useState<"AREA" | "BAR">("AREA");

  const chartData = period === "WEEK" ? WEEKLY_DATA : MONTHLY_DATA;

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header with Period & Chart Type Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 block">
            LIVE TELEMETRY
          </span>
          <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-2 mt-0.5">
            <Clock className="w-4 h-4 text-cyan-600" /> Attendance Velocity & Presence Trend
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="p-1 rounded-xl bg-slate-100 flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setChartType("AREA")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                chartType === "AREA"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Area Trend
            </button>
            <button
              type="button"
              onClick={() => setChartType("BAR")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                chartType === "BAR"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Bar Grid
            </button>
          </div>

          {/* Period Toggle */}
          <div className="p-1 rounded-xl bg-slate-100 flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setPeriod("WEEK")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                period === "WEEK"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setPeriod("MONTH")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                period === "MONTH"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "AREA" ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="presenceRate"
                stroke="#0891b2"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#velocityGradient)"
                dot={{ r: 4, fill: "#0891b2", strokeWidth: 2, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#0e7490", strokeWidth: 2, stroke: "#ffffff" }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="presenceRate"
                fill="#0891b2"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
            Peak Presence: <strong className="text-slate-900">100%</strong>
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Average Velocity: <strong className="text-emerald-700">91.4%</strong>
          </span>
        </div>
        <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
          Target: &gt; 90% SLA Met
        </span>
      </div>
    </div>
  );
}
