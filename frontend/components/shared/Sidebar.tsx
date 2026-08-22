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
  ShieldAlert,
  Clock,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 glass-panel border-r border-[var(--border)] flex flex-col justify-between py-4 px-3 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Navigation Sections */}
        <div className="flex flex-col gap-6">
          {/* Header context */}
          <div className="px-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {role === "EMPLOYEE" ? "Employee Portal" : "HR Command Center"}
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {user?.employee.firstName} {user?.employee.lastName} ({user?.employee.department})
            </p>
          </div>

          {/* Links list */}
          <nav className="flex flex-col gap-1">
            {currentLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 scale-[1.02]"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-cyan-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? "bg-slate-950/20 text-slate-950"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher Card / Helper */}
        <div className="flex flex-col gap-2 pt-4 border-t border-[var(--border)]">
          {/* Quick Role Switch Indicator */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-[var(--border)]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <ArrowRightLeft className="w-3 h-3 text-cyan-400" /> Current View:
              </span>
              <span className="font-bold text-cyan-300 text-[11px]">{role}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Switch roles seamlessly using the Judge Persona Bar above.
            </p>
          </div>

          <div className="px-3 py-1 flex items-center justify-between text-[10px] text-slate-500">
            <span>Dayflow v2.6.0</span>
            <span className="text-cyan-400 font-medium">Odoo × NMIT</span>
          </div>
        </div>
      </aside>
    </>
  );
}
