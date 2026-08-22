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
} from "lucide-react";
import { DayflowApiClient } from "@/lib/api";
import { NotificationItem } from "@/lib/mock-data";
import { AvatarBadge } from "./AvatarBadge";

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenFlowAI?: () => void;
}

export function Navbar({
  onToggleSidebar,
  onOpenFlowAI,
}: NavbarProps) {
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
        {/* Left: Mobile Toggle & Clean Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Drawer Trigger (only on small screens) */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Dayflow"
              className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900">
              Dayflow
            </span>
          </Link>
        </div>

        {/* Center: FlowAI Search bar */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
          <button
            onClick={onOpenFlowAI}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 transition-all group shadow-2xs"
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

        {/* Right: Clock, Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Session Stopwatch Clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-medium">
            <Clock className="w-3.5 h-3.5 text-cyan-600" />
            <span>{timeStr || "09:00:00 AM"}</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowUserDropdown(false);
              }}
              className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-600 text-[9px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popup */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold font-heading text-slate-900">
                    Notifications ({unreadCount} new)
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-cyan-600 hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="mt-3 flex flex-col gap-2.5 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No notifications yet</p>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          item.isRead
                            ? "bg-slate-50/50 border-slate-100 text-slate-600"
                            : "bg-cyan-50/60 border-cyan-100 text-slate-900 font-medium"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900">{item.title}</span>
                          <span className="text-[10px] text-slate-400">Just now</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifDropdown(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <AvatarBadge
                name={`${user?.employee?.firstName || "Alex"} ${user?.employee?.lastName || "Rivera"}`}
                department={user?.employee?.department || "Engineering"}
                size="sm"
              />

              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.employee?.firstName} {user?.employee?.lastName}
                </span>
                <span className="text-[10px] text-cyan-600 font-semibold leading-tight capitalize">
                  {user?.role === "ADMIN" ? "Company Admin" : user?.role === "SUPER_ADMIN" ? "Super Admin" : user?.role === "HR" ? "HR Lead" : "Staff"}
                </span>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Profile Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">
                    {user?.employee?.firstName} {user?.employee?.lastName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 uppercase tracking-wider">
                    {user?.role} Access
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    href="/dashboard/employee/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-600" />
                    <span>My Profile</span>
                  </Link>

                  {(user?.role === "ADMIN" || user?.role === "HR") && (
                    <Link
                      href="/dashboard/admin"
                      onClick={() => setShowUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Admin Hub</span>
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
