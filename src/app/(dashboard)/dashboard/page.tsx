"use client";

import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/auth.store";
import { RoleGuard } from "@/components/auth/role-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Truck, CheckCircle2, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import charts to drastically reduce initial bundle size and avoid Recharts SSR hydration issues.
const DashboardCharts = dynamic(() => import("@/components/dashboard/dashboard-charts"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-xl" />
});

export default function DashboardOverviewPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <RoleGuard allowedRoles={["CITIZEN", "COLLECTOR", "ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || user?.name || "User"}! Here is a summary of your eco-activity.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft transition-transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">141</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft transition-transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Pickups</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">103</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft transition-transform hover:-translate-y-1 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eco Points</CardTitle>
              <Leaf className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">1,250</div>
              <p className="text-xs text-muted-foreground">Keep recycling to earn more!</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft transition-transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73%</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <DashboardCharts />
      </div>
    </RoleGuard>
  );
}
