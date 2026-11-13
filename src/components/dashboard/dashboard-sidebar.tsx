"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Truck, Settings, CreditCard, MapPin, Tags, List, MessageSquare, Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const icon = "h-4 w-4";

const sidebarRoutes = {
  CITIZEN: [
    {
      title: "Main menu",
      items: [
        { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className={icon} /> },
        { title: "My Requests", url: "/dashboard/requests", icon: <Truck className={icon} /> },
        { title: "Billing & Payments", url: "/dashboard/billing", icon: <CreditCard className={icon} /> },
        { title: "Settings", url: "/dashboard/settings", icon: <Settings className={icon} /> },
      ],
    },
  ],
  COLLECTOR: [
    {
      title: "Main menu",
      items: [
        { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className={icon} /> },
        { title: "Assigned Pickups", url: "/dashboard/pickups", icon: <Truck className={icon} /> },
        { title: "Settings", url: "/dashboard/settings", icon: <Settings className={icon} /> },
      ],
    },
  ],
  ADMIN: [
    {
      title: "Admin panel",
      items: [
        { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className={icon} /> },
        { title: "Manage Requests", url: "/dashboard/admin/requests", icon: <Truck className={icon} /> },
        { title: "Manage Zones", url: "/dashboard/admin/zones", icon: <MapPin className={icon} /> },
        { title: "Manage Categories", url: "/dashboard/admin/categories", icon: <Tags className={icon} /> },
        { title: "Audit Logs", url: "/dashboard/admin/audit-logs", icon: <List className={icon} /> },
        { title: "Feedbacks", url: "/dashboard/admin/feedbacks", icon: <MessageSquare className={icon} /> },
      ],
    },
  ],
};

export function DashboardSidebar({ role }: { role: "CITIZEN" | "COLLECTOR" | "ADMIN" }) {
  const pathname = usePathname();
  const routes = sidebarRoutes[role] || sidebarRoutes["CITIZEN"];

  return (
    <Sidebar className="border-r border-[var(--site-line)] backdrop-blur-xl">
      <SidebarHeader className="flex h-16 items-center justify-center border-b border-[var(--site-line)] px-4">
        <Link href="/" className="group flex w-full items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--site-accent)] text-white">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">EcoWaste</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="mb-1 px-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/dashboard" ? pathname === item.url : pathname === item.url || pathname.startsWith(item.url + "/");
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className="relative mx-1 my-0.5 h-10 overflow-hidden rounded-full transition-colors duration-300 hover:bg-[var(--site-accent-soft)]"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="sidebar-active"
                            className="absolute inset-0 rounded-full bg-[var(--site-accent)]"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <Link
                          href={item.url}
                          className={`relative z-10 flex w-full items-center gap-2.5 pl-2 transition-colors duration-300 ${
                            isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {item.icon}
                          <span className="text-sm font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
