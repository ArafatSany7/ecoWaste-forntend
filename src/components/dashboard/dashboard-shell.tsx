import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";

export function DashboardShell({ children }: { children: ReactNode }) {
  const user = useAuthStore.getState().user;
  const role = user?.role || "CITIZEN";

  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 justify-end items-center px-4">

          </div>
        </header>
        <main className="flex-1 overflow-auto bg-muted/40 p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
