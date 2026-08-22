"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  KeyRound,
  UserCheck,
  Users,
  Clock,
  Wallet,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Info,
} from "lucide-react";

interface FlowNode {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  role: string;
  status: "ACTIVE" | "COMPLIANT" | "AUTO";
  metric: string;
  metricLabel: string;
  href: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const FLOW_NODES: FlowNode[] = [
  {
    id: "provision",
    step: 1,
    title: "SaaS Tenant Provisioning",
    subtitle: "Platform Super Admin generates company workspace & dispatch initial admin key",
    role: "Platform Owner",
    status: "COMPLIANT",
    metric: "3",
    metricLabel: "Active SaaS Tenants",
    href: "/platform-admin",
    icon: ShieldCheck,
    color: "from-cyan-500 to-blue-600",
    description:
      "Platform operations provisions isolated client organizations (e.g. Acme Corp, Nexus Corp) and dispatches secure welcome emails with temporary keys.",
  },
  {
    id: "founder-reset",
    step: 2,
    title: "Founder 1st Login Reset",
    subtitle: "Forced security reset ensures zero-trust credential handover on first sign-in",
    role: "Company Admin",
    status: "COMPLIANT",
    metric: "100%",
    metricLabel: "Password Enforced",
    href: "/force-password-reset",
    icon: KeyRound,
    color: "from-amber-500 to-orange-600",
    description:
      "Interception gate that blocks temporary credential use until a permanent strong password meeting complexity criteria is securely configured.",
  },
  {
    id: "hr-onboard",
    step: 3,
    title: "HR Director Role Setup",
    subtitle: "Company admin designates HR Director to orchestrate recruitment & team operations",
    role: "Management",
    status: "ACTIVE",
    metric: "Sarah J.",
    metricLabel: "HR Director Assigned",
    href: "/dashboard/admin",
    icon: UserCheck,
    color: "from-purple-500 to-indigo-600",
    description:
      "HR Director receives elevated permissions to manage approvals, oversee attendance tracking, and execute monthly compensation batches.",
  },
  {
    id: "directory",
    step: 4,
    title: "Staff Directory Pipeline",
    subtitle: "Multi-department employee onboarding across Engineering, Product, Design & Sales",
    role: "HR & Employees",
    status: "ACTIVE",
    metric: "11 Staff",
    metricLabel: "Active Team Members",
    href: "/dashboard/admin/employees",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    description:
      "Complete organizational hierarchy, contact information, emergency details, and designation tiers recorded with instant badge generation.",
  },
  {
    id: "attendance",
    step: 5,
    title: "Biometrics & Attendance Sync",
    subtitle: "Real-time daily presence velocity, check-in stopwatches & anomaly tracking",
    role: "All Staff",
    status: "ACTIVE",
    metric: "91%",
    metricLabel: "Presence Velocity",
    href: "/dashboard/admin/attendance",
    icon: Clock,
    color: "from-sky-500 to-cyan-600",
    description:
      "Live attendance capture with daily/weekly matrix visualization, overtime calculations, and instant leave correlation.",
  },
  {
    id: "payroll",
    step: 6,
    title: "Automated Payroll Engine",
    subtitle: "End-of-month CTC recomputation, tax deductions, vector PDF payslip generation",
    role: "Admin & Finance",
    status: "AUTO",
    metric: "₹10.31L",
    metricLabel: "Monthly Payroll Batch",
    href: "/dashboard/admin/payroll",
    icon: Wallet,
    color: "from-blue-600 to-indigo-700",
    description:
      "Automated compensation engine calculating Basic, HRA, Provident Fund, and Professional Tax with secure instant payslip downloads.",
  },
];

export function WorkforceFlowchart() {
  const [selectedNode, setSelectedNode] = useState<FlowNode>(FLOW_NODES[0]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Context */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">
              Interactive Workforce Architecture & Governance Flowchart
            </h4>
            <p className="text-slate-600 text-[11px]">
              Click on any stage in the pipeline below to inspect its operational metrics, data flow, and live status.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-white text-cyan-900 border border-cyan-300 font-mono font-bold text-[10px]">
          Live Pipeline: 6/6 Healthy
        </span>
      </div>

      {/* Interactive Horizontal / Responsive Pipeline Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 relative">
        {FLOW_NODES.map((node, index) => {
          const Icon = node.icon;
          const isSelected = selectedNode.id === node.id;

          return (
            <div key={node.id} className="relative flex flex-col">
              <button
                type="button"
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 relative group flex flex-col justify-between h-full ${
                  isSelected
                    ? "bg-white border-cyan-500 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/20 scale-[1.02]"
                    : "bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                }`}
              >
                {/* Top Step & Status Indicator */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isSelected
                          ? "bg-cyan-600 text-white"
                          : "bg-slate-100 text-slate-600 group-hover:bg-cyan-50 group-hover:text-cyan-700"
                      }`}
                    >
                      {node.step}
                    </span>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        node.status === "COMPLIANT"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : node.status === "ACTIVE"
                          ? "bg-cyan-50 text-cyan-800 border border-cyan-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${node.color} mb-3 shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs leading-snug group-hover:text-cyan-700 transition-colors">
                    {node.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {node.subtitle}
                  </p>
                </div>

                {/* Bottom Metric Preview */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {node.metricLabel}
                    </span>
                    <span className="text-xs font-extrabold font-mono text-slate-900">
                      {node.metric}
                    </span>
                  </div>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${
                      isSelected ? "text-cyan-600" : "text-slate-300"
                    }`}
                  />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Node Inspection Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md animate-in fade-in zoom-in-95">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${selectedNode.color} shadow-sm`}
            >
              <selectedNode.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-700">
                  STAGE 0{selectedNode.step} INSPECTION
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700">
                  Role: {selectedNode.role}
                </span>
              </div>
              <h3 className="text-lg font-bold font-heading text-slate-900 mt-0.5">
                {selectedNode.title}
              </h3>
            </div>
          </div>

          <Link
            href={selectedNode.href}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs hover:scale-105"
          >
            <span>Open {selectedNode.title} Module</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 text-xs">
          <div className="md:col-span-2">
            <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-600" /> Architectural Overview
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {selectedNode.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px]">
                Status: <strong className="text-emerald-700 font-bold">Operational</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px]">
                Protocol: <strong className="text-slate-900 font-bold">ISO 27001 / SOC-2</strong>
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono text-[11px]">
                Audit State: <strong className="text-cyan-800 font-bold">Zero-Trust Verified</strong>
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Live Subsystem Metric
              </span>
              <div className="text-2xl font-extrabold font-mono text-slate-900">
                {selectedNode.metric}
              </div>
              <span className="text-xs font-semibold text-slate-600 block mt-0.5">
                {selectedNode.metricLabel}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Auto-Refreshed:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Real-time
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
