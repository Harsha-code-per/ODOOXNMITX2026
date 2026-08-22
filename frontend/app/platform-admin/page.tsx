"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { DayflowApiClient } from "@/lib/api";
import { CompanyTenant, CompanyInquiry } from "@/lib/mock-data";
import {
  Building2,
  Users,
  Plus,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Copy,
  ExternalLink,
  DollarSign,
  Search,
  KeyRound,
  FileCheck2,
  Lock,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

export default function PlatformAdminPage() {
  const router = useRouter();
  const { user, isLoading, logout, switchPersona } = useAuth();
  const [companies, setCompanies] = useState<CompanyTenant[]>([]);
  const [inquiries, setInquiries] = useState<CompanyInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<"companies" | "inquiries">("companies");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Provisioning
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [provisionName, setProvisionName] = useState("");
  const [provisionDomain, setProvisionDomain] = useState("");
  const [provisionAdminName, setProvisionAdminName] = useState("");
  const [provisionAdminEmail, setProvisionAdminEmail] = useState("");
  const [provisionPlan, setProvisionPlan] = useState<"Starter" | "Growth" | "Enterprise">("Growth");
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Modal State for Dispatched Activation Email
  const [dispatchedEmail, setDispatchedEmail] = useState<{
    company: CompanyTenant;
    tempPass: string;
  } | null>(null);

  // Auth Guard: Enforce SUPER_ADMIN role
  useEffect(() => {
    if (!isLoading && user?.role !== "SUPER_ADMIN") {
      toast.error("Restricted Access: Super Admin session required.");
      router.push("/platform-admin/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [comps, inqs] = await Promise.all([
        DayflowApiClient.getCompanies(),
        DayflowApiClient.getInquiries(),
      ]);
      setCompanies(comps);
      setInquiries(inqs);
    } catch (e: any) {
      console.error("Failed to load platform data:", e);
      toast.error(e.message || "Failed to load platform data");
    }
  };

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProvisioning(true);
    try {
      const res = await DayflowApiClient.provisionCompany({
        name: provisionName,
        domain: provisionDomain,
        adminName: provisionAdminName,
        adminEmail: provisionAdminEmail,
        plan: provisionPlan,
      });

      setCompanies((prev) => [res.company, ...prev]);
      setShowProvisionModal(false);
      setDispatchedEmail({
        company: res.company,
        tempPass: res.temporaryPassword,
      });

      toast.success(`Provisioned ${res.company.name}!`, {
        description: `Activation email dispatched to ${res.company.adminEmail}`,
      });

      // Reset fields
      setProvisionName("");
      setProvisionDomain("");
      setProvisionAdminName("");
      setProvisionAdminEmail("");
    } catch {
      toast.error("Failed to provision company");
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleApproveInquiry = (inq: CompanyInquiry) => {
    setProvisionName(inq.companyName);
    setProvisionDomain(`${inq.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`);
    setProvisionAdminName(inq.contactName);
    setProvisionAdminEmail(inq.workEmail);
    setProvisionPlan(inq.planInterest);
    setShowProvisionModal(true);
  };

  const handleCopyCredentials = (email: string, pass: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nTemporary Password: ${pass}\nLogin URL: ${window.location.origin}/login`);
    toast.success("Copied credentials to clipboard!");
  };

  const handleLockConsole = () => {
    logout();
    toast.info("Super Admin session locked.");
    router.push("/platform-admin/login");
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSeats = companies.reduce((s, c) => s + c.employeeCount, 0);
  const totalMRR = companies.reduce((s, c) => {
    if (c.plan === "Starter") return s + 49;
    if (c.plan === "Growth") return s + 149;
    return s + 499;
  }, 0);

  if (isLoading || user?.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mb-3 animate-pulse">
          <Lock className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-slate-300">Verifying Super Admin Authorization...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-900 flex flex-col font-sans">
      {/* Platform Super Admin Header */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Dayflow" className="h-7 w-7 object-contain" />
              <span className="font-heading font-extrabold text-lg tracking-tight text-slate-900">
                Dayflow
              </span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white shadow-2xs">
              Platform Owner Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-slate-900">{user?.email}</span>
            </div>

            <button
              onClick={handleLockConsole}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Top Header & Provision CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900">
              SaaS Multi-Tenant Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Provision client organizations, dispatch company admin credentials, and monitor SaaS telemetry.
            </p>
          </div>

          <button
            onClick={() => setShowProvisionModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New Company</span>
          </button>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Active Client Tenants</span>
              <Building2 className="w-4 h-4 text-cyan-600" />
            </div>
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {companies.length}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              100% Health Score
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Total Active Seats</span>
              <Users className="w-4 h-4 text-cyan-600" />
            </div>
            <span className="text-3xl font-extrabold font-mono text-cyan-700">
              {totalSeats}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Across all client companies
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Inbound Inquiries</span>
              <Mail className="w-4 h-4 text-cyan-600" />
            </div>
            <span className="text-3xl font-extrabold font-mono text-amber-600">
              {inquiries.filter((i) => i.status === "NEW").length}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Pending admin review
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Monthly SaaS MRR</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-3xl font-extrabold font-mono text-emerald-600">
              ${totalMRR.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Recurring subscription run rate
            </span>
          </div>
        </div>

        {/* Tab Switcher & Search Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("companies")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "companies"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Provisioned Companies ({companies.length})
            </button>
            <button
              onClick={() => setActiveTab("inquiries")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "inquiries"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>Inbound Inquiries</span>
              {inquiries.filter((i) => i.status === "NEW").length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-amber-500 text-white">
                  {inquiries.filter((i) => i.status === "NEW").length}
                </span>
              )}
            </button>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, domains, admins..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Tab 1: Companies Directory */}
        {activeTab === "companies" && (
          <div className="rounded-3xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Client Company</th>
                    <th className="px-6 py-4">SaaS Tier</th>
                    <th className="px-6 py-4">Assigned Admin</th>
                    <th className="px-6 py-4">Seats</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompanies.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold flex items-center justify-center text-xs">
                            {comp.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{comp.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{comp.domain}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            comp.plan === "Enterprise"
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : comp.plan === "Growth"
                              ? "bg-cyan-50 text-cyan-800 border-cyan-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {comp.plan}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <span className="font-semibold text-slate-800 block">{comp.adminName}</span>
                          <span className="text-[11px] text-slate-500">{comp.adminEmail}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {comp.employeeCount}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            comp.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {comp.status === "ACTIVE" ? "Active Tenant" : "Setup Pending"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            switchPersona("admin");
                            router.push("/dashboard/admin");
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                        >
                          <span>Log in as Admin</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Inquiries Queue */}
        {activeTab === "inquiries" && (
          <div className="grid grid-cols-1 gap-4">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4"
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="font-bold text-base text-slate-900">{inq.companyName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                      {inq.planInterest} Tier
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Team: {inq.teamSize}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    &quot;{inq.message}&quot;
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>
                      Contact: <strong>{inq.contactName}</strong> ({inq.workEmail})
                    </span>
                    {inq.phone && <span>Phone: {inq.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApproveInquiry(inq)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Approve & Provision Workspace</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL 1: Provision Client Company */}
      {showProvisionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold font-heading text-slate-900">
                  Provision Client Company & Admin
                </h3>
                <p className="text-xs text-slate-500">
                  Creates client tenant and generates welcome email with temporary password.
                </p>
              </div>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProvisionSubmit} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={provisionName}
                    onChange={(e) => setProvisionName(e.target.value)}
                    placeholder="e.g. Zenith Tech"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Domain Slug *</label>
                  <input
                    type="text"
                    required
                    value={provisionDomain}
                    onChange={(e) => setProvisionDomain(e.target.value)}
                    placeholder="zenith.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Admin Full Name *</label>
                  <input
                    type="text"
                    required
                    value={provisionAdminName}
                    onChange={(e) => setProvisionAdminName(e.target.value)}
                    placeholder="Claire Dupont"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Plan Tier</label>
                  <select
                    value={provisionPlan}
                    onChange={(e) => setProvisionPlan(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs font-semibold"
                  >
                    <option value="Starter">Starter ($49/mo)</option>
                    <option value="Growth">Growth ($149/mo)</option>
                    <option value="Enterprise">Enterprise (Custom)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Admin Work Email *</label>
                <input
                  type="email"
                  required
                  value={provisionAdminEmail}
                  onChange={(e) => setProvisionAdminEmail(e.target.value)}
                  placeholder="admin@zenith.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-[11px] text-cyan-950">
                <p className="font-semibold flex items-center gap-1.5 text-cyan-900 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-600" /> Automated Activation Sequence:
                </p>
                <p className="text-slate-600">
                  Submitting generates a temporary password and sends an invitation email. When the admin logs in, they will be prompted to reset their password.
                </p>
              </div>

              <div className="flex gap-2.5 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProvisioning}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <span>{isProvisioning ? "Provisioning..." : "Provision & Dispatch Email"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Dispatched Activation Email Preview */}
      {dispatchedEmail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-heading text-slate-900">
                  Welcome Invitation Email Dispatched
                </h3>
                <p className="text-xs text-slate-500">
                  Simulated SMTP Delivery to <strong>{dispatchedEmail.company.adminEmail}</strong>
                </p>
              </div>
            </div>

            {/* Email Body Preview Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 font-sans mb-6">
              <div className="pb-2 border-b border-slate-200 text-slate-500 flex justify-between">
                <span>From: <strong>onboarding@dayflow.io</strong></span>
                <span>To: <strong>{dispatchedEmail.company.adminEmail}</strong></span>
              </div>
              <p className="font-bold text-slate-900">
                Subject: Welcome to Dayflow HRMS — Activate your {dispatchedEmail.company.name} Workspace
              </p>
              <p>
                Hello {dispatchedEmail.company.adminName},
              </p>
              <p>
                Your enterprise HRMS workspace for <strong>{dispatchedEmail.company.name}</strong> is now live on Dayflow ({dispatchedEmail.company.plan} Tier).
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1 font-mono text-[11px]">
                <div>Login URL: <span className="text-cyan-700">{typeof window !== "undefined" ? window.location.origin : ""}/login</span></div>
                <div>Admin Email: <span className="text-slate-900 font-bold">{dispatchedEmail.company.adminEmail}</span></div>
                <div>Temporary Password: <span className="text-rose-600 font-bold">{dispatchedEmail.tempPass}</span></div>
              </div>
              <p className="text-[11px] text-slate-500">
                Note: You will be required to set a permanent password upon your first sign in.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-between">
              <button
                onClick={() => handleCopyCredentials(dispatchedEmail.company.adminEmail, dispatchedEmail.tempPass)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Credentials</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setDispatchedEmail(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    switchPersona("admin_temp");
                    router.push("/login");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-xs"
                >
                  <span>Test First Login & Reset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
