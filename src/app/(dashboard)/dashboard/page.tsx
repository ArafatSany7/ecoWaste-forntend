"use client";

import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/auth.store";
import { RoleGuard } from "@/components/auth/role-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Truck, CheckCircle2, TrendingUp, Users, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { wasteRequestApi } from "@/api/waste-request.api";
import { collectorApi } from "@/api/collector.api";


const DashboardCharts = dynamic(() => import("@/components/dashboard/dashboard-charts"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-xl" />
});

export default function DashboardOverviewPage() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "CITIZEN";


  const { data: adminData, isLoading: adminLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminApi.getDashboardAnalytics(),
    enabled: role === "ADMIN",
  });


  const { data: requestsData, isLoading: reqLoading } = useQuery({
    queryKey: ["dashboard-requests"],
    queryFn: () => role === "COLLECTOR" ? collectorApi.getMyJobs() : wasteRequestApi.getMyRequests(),
    enabled: role === "CITIZEN" || role === "COLLECTOR",
  });

  const isLoading = role === "ADMIN" ? adminLoading : reqLoading;


  let totalRequests = 0;
  let completedRequests = 0;

  if (role === "ADMIN" && (adminData as any)?.data) {
    totalRequests = (adminData as any).data.wasteRequests?.total || 0;
    completedRequests = (adminData as any).data.wasteRequests?.breakdown?.COMPLETED || 0;
  } else if ((requestsData as any)?.data) {
    const reqs = (requestsData as any).data;
    totalRequests = reqs.length;
    completedRequests = reqs.filter((r: any) => r.status === "COMPLETED").length;
  }

  const completionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;
  const adminStats = (adminData as any)?.data;

  return (
    <RoleGuard allowedRoles={["CITIZEN", "COLLECTOR", "ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || user?.name || "User"}! Here is a summary of your eco-activity.
          </p>
        </div>


        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-soft transition-transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : (
                <div className="text-2xl font-bold">{totalRequests}</div>
              )}
              <p className="text-xs text-muted-foreground">All time activity</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft transition-transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Pickups</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : (
                <div className="text-2xl font-bold">{completedRequests}</div>
              )}
              <p className="text-xs text-muted-foreground">Successfully resolved</p>
            </CardContent>
          </Card>

          {role === "ADMIN" ? (
            <>
              <Card className="shadow-soft transition-transform hover:-translate-y-1 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  {isLoading ? <Skeleton className="h-8 w-16" /> : (
                    <div className="text-2xl font-bold text-primary">{adminStats?.users?.total || 0}</div>
                  )}
                  <p className="text-xs text-muted-foreground">Registered accounts</p>
                </CardContent>
              </Card>

              <Card className="shadow-soft transition-transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? <Skeleton className="h-8 w-16" /> : (
                    <div className="text-2xl font-bold">${adminStats?.financials?.totalRevenue || 0}</div>
                  )}
                  <p className="text-xs text-muted-foreground">From paid invoices</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="shadow-soft transition-transform hover:-translate-y-1 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Eco Points</CardTitle>
                  <Leaf className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  {isLoading ? <Skeleton className="h-8 w-16" /> : (
                    <div className="text-2xl font-bold text-primary">{completedRequests * 10}</div>
                  )}
                  <p className="text-xs text-muted-foreground">Keep recycling to earn more!</p>
                </CardContent>
              </Card>

              <Card className="shadow-soft transition-transform hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? <Skeleton className="h-8 w-16" /> : (
                    <div className="text-2xl font-bold">{completionRate}%</div>
                  )}
                  <p className="text-xs text-muted-foreground">Of all your requests</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>


        {role === "ADMIN" && <DashboardCharts />}
      </div>
    </RoleGuard>
  );
}
