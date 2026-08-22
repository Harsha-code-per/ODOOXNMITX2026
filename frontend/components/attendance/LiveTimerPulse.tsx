"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { AttendanceRecord } from "@/lib/mock-data";
import { Play, Square, Coffee, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { formatTime } from "@/lib/utils";

export function LiveTimerPulse({ onRecordUpdated }: { onRecordUpdated?: () => void }) {
  const { user } = useAuth();
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [onBreak, setOnBreak] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const employeeId = user?.employee.id || "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";

  // Fetch today's record
  useEffect(() => {
    DayflowApiClient.getAttendanceHistory(employeeId).then((records) => {
      const todayStr = new Date().toISOString().split("T")[0];
      const found = records.find((r) => r.workDate === todayStr);
      if (found) {
        setTodayRecord(found);
        if (found.checkIn && !found.checkOut) {
          const checkInTime = new Date(found.checkIn).getTime();
          const now = Date.now();
          setElapsedSeconds(Math.max(0, Math.floor((now - checkInTime) / 1000)));
        } else if (found.checkOut && found.totalHours) {
          setElapsedSeconds(Math.floor(found.totalHours * 3600));
        }
      }
    });
  }, [employeeId]);

  // Live timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (todayRecord?.checkIn && !todayRecord?.checkOut && !onBreak) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [todayRecord, onBreak]);

  const formatElapsedTime = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleCheckIn = async () => {
    setIsLoading(true);
    try {
      const record = await DayflowApiClient.checkIn(employeeId, "Checked in for work session");
      setTodayRecord(record);
      setElapsedSeconds(0);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
      toast.success("Checked in successfully!", {
        description: `Work session started at ${formatTime(record.checkIn)}`,
      });
      onRecordUpdated?.();
    } catch (e: any) {
      toast.error(e.message || "Failed to check in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setIsLoading(true);
    try {
      const record = await DayflowApiClient.checkOut(employeeId);
      setTodayRecord(record);
      toast.success("Checked out successfully!", {
        description: `Total work session: ${record.totalHours} hours logged`,
      });
      onRecordUpdated?.();
    } catch (e: any) {
      toast.error(e.message || "Failed to check out");
    } finally {
      setIsLoading(false);
    }
  };

  const isCheckedIn = Boolean(todayRecord?.checkIn && !todayRecord?.checkOut);
  const isCheckedOut = Boolean(todayRecord?.checkOut);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-cyan-500/30 cyan-glow-subtle flex flex-col justify-between relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Real-time Attendance Pulse
          </span>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isCheckedIn
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : isCheckedOut
                ? "bg-slate-800 text-slate-300 border border-slate-700"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isCheckedIn ? "bg-emerald-400 animate-ping" : isCheckedOut ? "bg-slate-400" : "bg-amber-400"
              }`}
            />
            <span>{isCheckedIn ? "ON DUTY (PRESENT)" : isCheckedOut ? "SESSION COMPLETED" : "NOT CHECKED IN"}</span>
          </div>
        </div>

        {/* Stopwatch Display */}
        <div className="flex flex-col items-center justify-center my-4 py-2">
          <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            {formatElapsedTime(elapsedSeconds)}
          </div>
          <span className="text-xs text-slate-400 mt-1 font-medium">
            {isCheckedIn
              ? `Check-in recorded at ${formatTime(todayRecord?.checkIn)}`
              : isCheckedOut
              ? `Completed session: ${todayRecord?.totalHours} hrs`
              : "Ready to start your workday"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 pt-2">
        {!isCheckedIn && !isCheckedOut && (
          <button
            onClick={handleCheckIn}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Clock In Now</span>
          </button>
        )}

        {isCheckedIn && (
          <>
            <button
              onClick={() => {
                setOnBreak(!onBreak);
                toast.info(onBreak ? "Resumed work session" : "Taking a short break");
              }}
              className={`px-3.5 py-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                onBreak
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80"
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>{onBreak ? "Resume" : "Break"}</span>
            </button>

            <button
              onClick={handleCheckOut}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Clock Out</span>
            </button>
          </>
        )}

        {isCheckedOut && (
          <div className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-[var(--border)] text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>You have completed attendance for today. Have a great evening!</span>
          </div>
        )}
      </div>
    </div>
  );
}
