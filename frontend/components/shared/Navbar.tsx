"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  Bell,
  Sparkles,
  LogOut,
  User,
  Shield,
  Menu,
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
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 py-2.5 transition-all shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl p-1 bg-white border border-cyan-300 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Dayflow Logo" className="w-full h-full object-contain" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-1.5 text-slate-900">
                Dayflow
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-cyan-100 text-cyan-800 border border-cyan-200">
                  HRMS
                </span>
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline -mt-0.5 font-medium">
                Every workday, perfectly aligned.
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Live Clock & FlowAI Search bar */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
          <button
            onClick={onOpenFlowAI}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 transition-all shadow-inner group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 group-hover:rotate-12 transition-transform" />
              <span>Ask FlowAI (e.g. &quot;Who is on leave next week?&quot;)</span>
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-500">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions: Clock, Notifications, Profile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live IST / UTC Clock Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
            <span>{timeStr || "09:00:00 AM"}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-600 text-[9px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2 px-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-cyan-600" /> Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-cyan-700 hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No notifications at the moment.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs transition-colors border ${
                          n.isRead
                            ? "bg-slate-50 border-slate-100 text-slate-500"
                            : "bg-cyan-50/70 border-cyan-200 text-slate-800 font-medium"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-slate-900">{n.title}</span>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors group border border-transparent hover:border-slate-200"
              >
                <AvatarBadge
                  name={`${user.employee.firstName} ${user.employee.lastName}`}
                  department={user.employee.department}
                  size="sm"
                  status={user.employee.status}
                  showStatus
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-none flex items-center gap-1">
                    {user.employee.firstName} {user.employee.lastName}
                  </span>
                  <span className="text-[10px] text-cyan-700 leading-none mt-1 font-semibold">
                    {user.role === "ADMIN" ? "Super Admin" : user.role === "HR" ? "HR Director" : "Employee"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">
                      {user.employee.firstName} {user.employee.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-800 text-[10px] font-bold border border-cyan-200">
                      <Shield className="w-3 h-3" /> {user.employee.designation}
                    </div>
                  </div>

                  <Link
                    href={user.role === "EMPLOYEE" ? "/dashboard/employee/profile" : "/dashboard/admin/employees"}
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-cyan-700 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-600" /> My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
