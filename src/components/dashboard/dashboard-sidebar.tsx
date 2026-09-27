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
import { Leaf, LayoutDashboard, Truck, Settings, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const sidebarRoutes = {
  CITIZEN: [
    {
      title: "Main Menu",
      items: [
        { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
        { title: "My Requests", url: "/dashboard/requests", icon: <Truck className="h-4 w-4" /> },
        { title: "Billing & Payments", url: "/dashboard/billing", icon: <CreditCard className="h-4 w-4" /> },
        { title: "Settings", url: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
      ],
    }
  ],
  COLLECTOR: [
    {
      title: "Main Menu",
      items: [
        { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
        { title: "Assigned Pickups", url: "/dashboard/pickups", icon: <Truck className="h-4 w-4" /> },
        { title: "Settings", url: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
      ]
    }
  ],
  ADMIN: [
    {
      title: "Admin Panel",
      items: [
        { title: "Overview", url: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
        { title: "Manage Requests", url: "/dashboard/admin/requests", icon: <Truck className="h-4 w-4" /> },
        { title: "Settings", url: "/dashboard/settings", icon: <Settings className="h-4 w-4" /> },
      ]
    }
  ]
};

export function DashboardSidebar({ role }: { role: "CITIZEN" | "COLLECTOR" | "ADMIN" }) {
  const pathname = usePathname();
  const routes = sidebarRoutes[role] || sidebarRoutes["CITIZEN"];

  return (
    <Sidebar>
      <SidebarHeader className="border-b h-16 flex items-center justify-center px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 w-full">
          <div className="bg-primary p-1.5 rounded-lg">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">
            EcoWaste
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathname === item.url || pathname.startsWith(item.url + "/")}
                    >
                      <Link href={item.url} className="flex items-center gap-2 w-full">
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
