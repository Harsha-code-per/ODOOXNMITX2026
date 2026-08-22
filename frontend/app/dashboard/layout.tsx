"use client";

import React, { useState, useEffect } from "react";
import { PersonaDemoBar } from "@/components/shared/PersonaDemoBar";
import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";
import { FlowAIBar } from "@/components/shared/FlowAIBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [flowAIOpen, setFlowAIOpen] = useState(false);

  // Restore collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dayflow_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("dayflow_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleToggleCollapse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#fafafc] text-slate-900 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-900">
      {/* Top 1-Click Judge Persona Switcher Bar (pinned at top) */}
      <header className="shrink-0 z-50">
        <PersonaDemoBar />
        <Navbar
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenFlowAI={() => setFlowAIOpen(true)}
        />
      </header>

      {/* Main Workspace with Sidebar & Content (fills 100% of remaining viewport) */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Pinned Full-Height Sidebar */}
        <Sidebar
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* ONLY Dynamic Page Content Scrolls */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-300">
          <div className="fluid-container">{children}</div>
        </main>
      </div>

      {/* FlowAI Modal */}
      <FlowAIBar isOpen={flowAIOpen} onClose={() => setFlowAIOpen(false)} />
    </div>
  );
}
