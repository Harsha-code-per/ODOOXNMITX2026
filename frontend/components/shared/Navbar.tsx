"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import {
  Sun,
  Moon,
  Bell,
  Sparkles,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  Clock,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { DayflowApiClient } from "@/lib/api";
import { NotificationItem } from "@/lib/mock-data";
import { AvatarBadge } from "./AvatarBadge";

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenFlowAI?: () => void;
}

export function Navbar({ onToggleSidebar, onOpenFlowAI }: NavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [timeStr, setTimeStr] = useState<string>("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    DayflowApiClient.getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    for (const n of notifications) {
      await DayflowApiClient.markNotificationRead(n.id);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--border)] px-4 sm:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl p-1 bg-cyan-500/10 border border-cyan-500/30 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.png" alt="Dayflow Logo" className="w-full h-full object-contain" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                Dayflow
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  HRMS
                </span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline -mt-0.5 font-medium">
                Every workday, perfectly aligned.
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Live Clock & FlowAI Search bar */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
          <button
            onClick={onOpenFlowAI}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/60 border border-[var(--border)] text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>Ask FlowAI (e.g. &quot;Who is on leave next week?&quot;)</span>
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Actions: Time, Theme, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Clock Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/40 border border-[var(--border)] text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-cyan-300 font-medium">{timeStr}</span>
          </div>

          {/* FlowAI Action button (Mobile) */}
          <button
            onClick={onOpenFlowAI}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800/40 text-cyan-400"
            title="FlowAI Assistant"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-colors"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-600" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl glass-panel border border-[var(--border)] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                  <span className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" /> Notifications
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px]">
                        {unreadCount} new
                      </span>
                    )}
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-[var(--border)] py-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg text-xs transition-colors ${
                        n.isRead ? "opacity-75 hover:bg-slate-800/20" : "bg-cyan-500/5 hover:bg-cyan-500/10"
                      }`}
                    >
                      <div className="font-semibold text-slate-200 flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-normal">Just now</span>
                      </div>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/40 transition-colors group"
              >
                <AvatarBadge
                  name={`${user.employee.firstName} ${user.employee.lastName}`}
                  department={user.employee.department}
                  size="sm"
                  status={user.employee.status}
                  showStatus
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[var(--foreground)] leading-none flex items-center gap-1">
                    {user.employee.firstName} {user.employee.lastName}
                  </span>
                  <span className="text-[10px] text-cyan-400 leading-none mt-0.5 font-medium">
                    {user.role === "ADMIN" ? "Super Admin" : user.role === "HR" ? "HR Director" : "Employee"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel border border-[var(--border)] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                    <p className="text-xs font-bold text-[var(--foreground)]">
                      {user.employee.firstName} {user.employee.lastName}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold border border-cyan-500/20">
                      <Shield className="w-3 h-3" /> {user.employee.designation}
                    </div>
                  </div>

                  <Link
                    href={user.role === "EMPLOYEE" ? "/dashboard/employee/profile" : "/dashboard/admin/employees"}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800/50 transition-colors"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" /> My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
