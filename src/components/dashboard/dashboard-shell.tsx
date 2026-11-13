"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { useAuthStore } from "@/store/auth.store";
import { EASE_OUT, ScrollProgress } from "@/components/motion/primitives";

function crumb(pathname: string) {
  const parts = pathname.split("/").filter(Boolean).slice(1);
  if (parts.length === 0) return "Overview";
  return parts[parts.length - 1].replace(/-/g, " ");
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "CITIZEN";
  const pathname = usePathname();
  const reduce = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("site");
    return () => root.classList.remove("site");
  }, []);

  const initials = (user?.firstName || user?.name || "U").slice(0, 1).toUpperCase();

  return (
    <SidebarProvider>
      <ScrollProgress />
      <DashboardSidebar role={role} />
      <SidebarInset className="!bg-transparent">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-[var(--site-line)] bg-white/70 px-4 backdrop-blur-xl md:px-8">
          <SidebarTrigger className="-ml-1 h-9 w-9 rounded-full text-muted-foreground transition-colors hover:bg-[var(--site-accent-soft)] hover:text-[var(--site-accent)]" />
          <div className="h-4 w-px bg-[var(--site-line)]" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Dashboard</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="font-medium capitalize">{crumb(pathname)}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-1 rounded-full border border-[var(--site-line)] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-[var(--site-accent)] hover:text-[var(--site-accent)] sm:flex"
            >
              Visit site <ArrowUpRight className="h-3 w-3" />
            </Link>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--site-accent)] text-sm font-semibold text-white">
              {initials}
            </span>
          </div>
        </header>

        <main className="relative flex-1 overflow-x-hidden p-4 md:p-8">
          <div className="pointer-events-none absolute inset-0 site-grid opacity-50" />
          <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-[var(--site-lime)] opacity-30 blur-[100px]" />
          <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[oklch(0.85_0.12_175)] opacity-30 blur-[110px]" />
          <motion.div
            key={pathname}
            initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
