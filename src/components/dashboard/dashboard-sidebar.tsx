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
import {
  LayoutDashboard,
  Truck,
  Settings,
  CreditCard,
  MapPin,
  Tags,
  List,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const sidebarRoutes = {
  CITIZEN: [
    {
      title: "Main Menu",
      items: [
        { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, color: "oklch(0.72 0.22 160)" },
        { title: "My Requests", url: "/dashboard/requests", icon: <Truck className="h-4 w-4" />, color: "oklch(0.78 0.18 195)" },
        { title: "Billing & Payments", url: "/dashboard/billing", icon: <CreditCard className="h-4 w-4" />, color: "oklch(0.82 0.18 85)" },
        { title: "Settings", url: "/dashboard/settings", icon: <Settings className="h-4 w-4" />, color: "oklch(0.65 0.05 160)" },
      ],
    }
  ],
  COLLECTOR: [
    {
      title: "Main Menu",
      items: [
        { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, color: "oklch(0.72 0.22 160)" },
        { title: "Assigned Pickups", url: "/dashboard/pickups", icon: <Truck className="h-4 w-4" />, color: "oklch(0.78 0.18 195)" },
        { title: "Settings", url: "/dashboard/settings", icon: <Settings className="h-4 w-4" />, color: "oklch(0.65 0.05 160)" },
      ]
    }
  ],
  ADMIN: [
    {
      title: "Admin Panel",
      items: [
        { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, color: "oklch(0.72 0.22 160)" },
        { title: "Manage Requests", url: "/dashboard/admin/requests", icon: <Truck className="h-4 w-4" />, color: "oklch(0.78 0.18 195)" },
        { title: "Manage Zones", url: "/dashboard/admin/zones", icon: <MapPin className="h-4 w-4" />, color: "oklch(0.68 0.28 320)" },
        { title: "Manage Categories", url: "/dashboard/admin/categories", icon: <Tags className="h-4 w-4" />, color: "oklch(0.72 0.22 160)" },
        { title: "Audit Logs", url: "/dashboard/admin/audit-logs", icon: <List className="h-4 w-4" />, color: "oklch(0.65 0.05 160)" },
        { title: "Feedbacks", url: "/dashboard/admin/feedbacks", icon: <MessageSquare className="h-4 w-4" />, color: "oklch(0.82 0.18 85)" },
      ]
    }
  ]
};

export function DashboardSidebar({ role }: { role: "CITIZEN" | "COLLECTOR" | "ADMIN" }) {
  const pathname = usePathname();
  const routes = sidebarRoutes[role] || sidebarRoutes["CITIZEN"];

  return (
    <Sidebar
      style={{
        background: "var(--eco-forest)",
        borderRight: "1px solid oklch(1 0 0 / 0.07)",
      }}
    >
      <SidebarHeader
        className="h-14 flex items-center justify-center px-4 border-b"
        style={{ borderColor: "oklch(1 0 0 / 0.08)" }}
      >
        <Link href="/" className="flex items-center gap-2.5 w-full transition-opacity hover:opacity-80">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, oklch(0.72 0.22 160), oklch(0.78 0.18 195))",
              boxShadow: "var(--glow-emerald)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2.2} className="w-4 h-4">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <span className="font-bold text-base tracking-tight text-white hidden sm:inline-block">
            EcoWaste
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel
              className="text-xs font-semibold uppercase tracking-widest px-3 mb-1"
              style={{ color: "oklch(0.45 0.04 160)" }}
            >
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className="relative rounded-xl mx-1 my-0.5 transition-all duration-200"
                        style={{
                          background: isActive ? `${item.color}18` : "transparent",
                          color: isActive ? item.color : "oklch(0.65 0.04 160)",
                        }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                            style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                          />
                        )}
                        <Link href={item.url} className="flex items-center gap-2.5 w-full pl-2">
                          <span style={{ color: isActive ? item.color : "oklch(0.5 0.04 160)" }}>
                            {item.icon}
                          </span>
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
