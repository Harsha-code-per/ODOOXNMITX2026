"use client";

import React, { useState, useEffect } from "react";
import { Clock, Play, Square, Sparkles, CheckCircle2, Palmtree, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface ShiftProgressRingProps {
  initialCheckedIn?: boolean;
  onApplyLeaveClick?: () => void;
}

export function ShiftProgressRing({
  initialCheckedIn = true,
  onApplyLeaveClick,
}: ShiftProgressRingProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(initialCheckedIn);
  const [seconds, setSeconds] = useState(5 * 3600 + 42 * 60 + 15); // 5h 42m 15s

  useEffect(() => {
    let interval: any = null;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const timeFormatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const targetSeconds = 8 * 3600; // 8 hours standard
  const percentage = Math.min(Math.round((seconds / targetSeconds) * 100), 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleTogglePunch = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      toast.success("Checked in successfully!", {
        description: `Punch registered at ${new Date().toLocaleTimeString()}`,
      });
    } else {
      setIsCheckedIn(false);
      toast.info("Checked out for the day.", {
        description: `Total logged time: ${hours}h ${minutes}m`,
      });
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 block">
            SHIFT VELOCITY
          </span>
          <h3 className="text-sm font-bold font-heading text-slate-900 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-4 h-4 text-cyan-600" /> Today&apos;s Workday Progress
          </h3>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isCheckedIn
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5"
              : "bg-slate-100 text-slate-600 border border-slate-200"
          }`}
        >
          {isCheckedIn && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
          {isCheckedIn ? "Checked In (Active)" : "Checked Out"}
        </span>
      </div>

      {/* Center Circular Progress Ring & Stopwatch */}
      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-2">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track Ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#f1f5f9"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#0891b2"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Text inside Ring */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold font-mono text-slate-900 leading-none">
              {percentage}%
            </span>
            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">
              Shift Done
            </span>
          </div>
        </div>

        {/* Live Timer & Punch Button */}
        <div className="flex flex-col items-center sm:items-start gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Elapsed Active Work Time
            </span>
            <div className="text-3xl font-extrabold font-mono text-cyan-900 tracking-tight">
              {timeFormatted}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Target: 08:00:00 Standard Workday
            </span>
          </div>

          <button
            type="button"
            onClick={handleTogglePunch}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-xs hover:scale-105 ${
              isCheckedIn
                ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
            }`}
          >
            {isCheckedIn ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Punch Out / Pause Shift</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Punch In / Start Workday</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Leave Quota Mini Bar Section */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Paid Vacation</span>
            <span className="font-bold text-slate-900 text-xs">12 / 18 Left</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Sick Time</span>
            <span className="font-bold text-slate-900 text-xs">5 / 10 Left</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Casual Leave</span>
            <span className="font-bold text-slate-900 text-xs">4 / 6 Left</span>
          </div>
        </div>

        {onApplyLeaveClick && (
          <button
            type="button"
            onClick={onApplyLeaveClick}
            className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 hover:underline"
          >
            <Palmtree className="w-3.5 h-3.5" />
            <span>Apply for Time-Off</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
