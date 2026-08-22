"use client";

import React, { useState, useEffect } from "react";
import { DayflowApiClient } from "@/lib/api";
import { Play, Square, Coffee, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface LiveTimerPulseProps {
  employeeId: string;
  onStatusChange?: () => void;
}

export function LiveTimerPulse({ employeeId, onStatusChange }: LiveTimerPulseProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [seconds, setSeconds] = useState(30852); // ~08:34:12 on duty
  const [breakSeconds, setBreakSeconds] = useState(0);

  // Live Stopwatch Pulse
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn && !isOnBreak) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (isOnBreak) {
      interval = setInterval(() => {
        setBreakSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn, isOnBreak]);

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCheckIn = async () => {
    try {
      await DayflowApiClient.checkIn(employeeId);
      setIsCheckedIn(true);
      setIsOnBreak(false);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      toast.success("Clocked In Successfully!", {
        description: "Your live attendance session has started.",
      });
      onStatusChange?.();
    } catch {
      toast.error("Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await DayflowApiClient.checkOut(employeeId);
      setIsCheckedIn(false);
      setIsOnBreak(false);
      toast.info("Clocked Out for the Day", {
        description: `Total duration logged: ${formatTimer(seconds)}`,
      });
      onStatusChange?.();
    } catch {
      toast.error("Check-out failed");
    }
  };

  const toggleBreak = () => {
    if (isOnBreak) {
      setIsOnBreak(false);
      toast.success("Resumed Work Session");
    } else {
      setIsOnBreak(true);
      toast.info("On Break — Timer paused");
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md relative overflow-hidden flex flex-col justify-between">
      {/* Top Session Status */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              isCheckedIn && !isOnBreak
                ? "bg-emerald-500 animate-ping"
                : isOnBreak
                ? "bg-amber-500 animate-pulse"
                : "bg-slate-400"
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {isCheckedIn && !isOnBreak
              ? "ON DUTY (LIVE)"
              : isOnBreak
              ? "ON BREAK"
              : "SHIFT CONCLUDED"}
          </span>
        </div>

        <span className="text-[11px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
          Target: 8.0 hrs
        </span>
      </div>

      {/* Center Stopwatch Dial */}
      <div className="flex flex-col items-center justify-center my-4 py-3">
        <div className="text-4xl sm:text-5xl font-extrabold font-mono text-slate-900 tracking-tight mb-2 select-none">
          {formatTimer(seconds)}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-cyan-600" />
          <span>Clocked in at 09:00 AM • Shift: Regular</span>
        </div>

        {isOnBreak && (
          <div className="mt-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200">
            Break Duration: {formatTimer(breakSeconds)}
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100">
        {isCheckedIn ? (
          <>
            <button
              onClick={toggleBreak}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isOnBreak
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{isOnBreak ? "Resume Work" : "Take Break"}</span>
            </button>

            <button
              onClick={handleCheckOut}
              className="py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all hover:scale-[1.02]"
            >
              <Square className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>Clock Out</span>
            </button>
          </>
        ) : (
          <button
            onClick={handleCheckIn}
            className="col-span-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/25 transition-all hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Clock In for Work</span>
          </button>
        )}
      </div>
    </div>
  );
}
