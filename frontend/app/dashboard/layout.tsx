"use client";

import React, { useState } from "react";
import { PersonaDemoBar } from "@/components/shared/PersonaDemoBar";
import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";
import { FlowAIBar } from "@/components/shared/FlowAIBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flowAIOpen, setFlowAIOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top 1-Click Judge Persona Switcher Bar */}
      <PersonaDemoBar />

      {/* Global Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenFlowAI={() => setFlowAIOpen(true)}
      />

      {/* Main Workspace with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="fluid-container">{children}</div>
        </main>
      </div>

      {/* FlowAI Modal */}
      <FlowAIBar isOpen={flowAIOpen} onClose={() => setFlowAIOpen(false)} />
    </div>
  );
}
