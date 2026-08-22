"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  CalendarCheck,
  Palmtree,
  Wallet,
  Users,
  BarChart3,
  UserCircle2,
  Clock,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role || "EMPLOYEE";

  const employeeLinks = [
    { label: "My Day", href: "/dashboard/employee", icon: Clock },
    { label: "My Profile", href: "/dashboard/employee/profile", icon: UserCircle2 },
    { label: "Attendance Log", href: "/dashboard/employee/attendance", icon: CalendarCheck },
    { label: "Leave Requests", href: "/dashboard/employee/leaves", icon: Palmtree, badge: "Quota" },
    { label: "Salary & Payslips", href: "/dashboard/employee/payroll", icon: Wallet, badge: "PDF" },
  ];

  const adminLinks = [
    { label: "HR Command Center", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Employee Directory", href: "/dashboard/admin/employees", icon: Users, badge: "11" },
    { label: "Attendance Matrix", href: "/dashboard/admin/attendance", icon: CalendarCheck },
    { label: "Leave Approvals", href: "/dashboard/admin/leaves", icon: Palmtree, badge: "1 Pending" },
    { label: "Salary & Payroll", href: "/dashboard/admin/payroll", icon: Wallet, badge: "Auto-Calc" },
    { label: "Executive Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  ];

  const currentLinks = role === "EMPLOYEE" ? employeeLinks : adminLinks;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden animate-in fade-in"
        />
      )}

      {/* Main Full-Height Pinned Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full bg-white border-r border-slate-200/90 flex flex-col justify-between py-4 z-40 transition-all duration-300 ease-in-out shrink-0 select-none overflow-y-auto ${
          isCollapsed ? "lg:w-[72px] px-2" : "lg:w-64 px-3.5"
        } ${
          isMobileOpen
            ? "translate-x-0 w-64 px-3.5 z-50 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Section: Header & Navigation Links */}
        <div className="flex flex-col gap-4">
          {/* Header Row: Title Context & Collapse Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 min-h-[42px] px-1">
            {!isCollapsed ? (
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {role === "EMPLOYEE" ? "Employee Portal" : "Command Center"}
                  </span>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {user?.employee.firstName} {user?.employee.lastName}
                </p>
              </div>
            ) : (
              <div className="mx-auto">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" title="Active Workspace" />
              </div>
            )}

            {/* Desktop Collapse Toggle Button (Inside Sidebar Only) */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center w-7 h-7 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-slate-600 border border-slate-200 transition-all shrink-0 shadow-2xs"
                title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
                aria-label="Toggle Sidebar Collapse"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-cyan-700" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Links List */}
          <nav className="flex flex-col gap-1">
            {currentLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center rounded-2xl text-xs font-semibold transition-all relative ${
                      isCollapsed
                        ? "justify-center py-3 px-2"
                        : "justify-between px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/20 font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`shrink-0 transition-transform group-hover:scale-110 ${
                          isCollapsed ? "w-5 h-5" : "w-4 h-4"
                        } ${isActive ? "text-white" : "text-cyan-700"}`}
                      />
                      {!isCollapsed && (
                        <span className="truncate whitespace-nowrap">{item.label}</span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-cyan-50 text-cyan-800 border border-cyan-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Dot indicator when collapsed */}
                    {isCollapsed && item.badge && !isActive && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-500" />
                    )}
                  </Link>

                  {/* Floating Tooltip in Collapsed Rail Mode */}
                  {isCollapsed && (
                    <div className="hidden lg:group-hover:flex absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl animate-in fade-in zoom-in-95 pointer-events-none">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                          {item.badge}
                        </span>
                      )}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User View Role & Workspace Info */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
          {!isCollapsed ? (
            <>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-600" /> Current View:
                  </span>
                  <span className="font-bold text-cyan-900 text-[11px] bg-cyan-100/80 px-2 py-0.5 rounded-md border border-cyan-200">
                    {role}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Switch roles seamlessly using the top Judge Demo Bar.
                </p>
              </div>

              <div className="px-1 py-0.5 flex items-center justify-between text-[10px] text-slate-400 font-sans">
                <span>Dayflow v2.6.0</span>
                <span className="text-cyan-800 font-bold">Enterprise SaaS</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <span
                className="px-2 py-1 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-[10px] font-bold text-center"
                title={`Current Role: ${role}`}
              >
                {role.substring(0, 3)}
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
