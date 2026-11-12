"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";

export function DashboardShell({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "CITIZEN";

  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
      <SidebarInset>
        <header
          className="flex h-14 shrink-0 items-center gap-3 border-b px-4"
          style={{
            background: "var(--eco-forest)",
            borderColor: "oklch(1 0 0 / 0.08)",
          }}
        >
          <SidebarTrigger
            className="-ml-1 text-white/60 hover:text-white transition-colors"
          />
          <div className="h-4 w-px" style={{ background: "oklch(1 0 0 / 0.1)" }} />
          <span className="text-xs font-medium uppercase tracking-widest" style={{ color: "oklch(0.72 0.22 160)" }}>
            EcoWaste Command Centre
          </span>
        </header>

        <main
          className="flex-1 overflow-auto p-4 md:p-8"
          style={{ background: "var(--eco-void)" }}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
