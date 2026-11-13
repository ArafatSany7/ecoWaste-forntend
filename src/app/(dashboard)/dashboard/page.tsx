"use client";

import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/auth.store";
import { RoleGuard } from "@/components/auth/role-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { wasteRequestApi } from "@/api/waste-request.api";
import { collectorApi } from "@/api/collector.api";
import { motion } from "framer-motion";
import { Reveal, TiltCard } from "@/components/motion/primitives";
import { PageHeader } from "@/components/dashboard/page-header";
import { Leaf, Truck, CheckCircle2, TrendingUp, Users, DollarSign } from "lucide-react";

const DashboardCharts = dynamic(() => import("@/components/dashboard/dashboard-charts"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-2xl" />,
});

interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  sub: string;
  icon: React.ReactNode;
  delay?: number;
}

function KpiCard({ title, value, sub, icon, delay = 0 }: KpiCardProps) {
  return (
    <Reveal delay={delay}>
      <TiltCard intensity={7} className="p-6">
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{title}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--site-line)] bg-[var(--site-accent-soft)] text-[var(--site-accent)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
            {icon}
          </span>
        </div>
        <div className="mt-8 text-4xl font-semibold tracking-tight">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
      </TiltCard>
    </Reveal>
  );
}

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
    queryFn: () =>
      role === "COLLECTOR" ? collectorApi.getMyJobs() : wasteRequestApi.getMyRequests(),
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
      <div className="space-y-8">
        <PageHeader
          title="Dashboard overview"
          description={<>Welcome back, <span className="font-medium text-[var(--site-accent)]">{user?.firstName || user?.name || "User"}</span>. Here is a summary of your eco-activity.</>}
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-3xl" />
            ))
          ) : (
            <>
              <KpiCard
                delay={0}
                title="Total Requests"
                value={totalRequests}
                sub="All time activity"
                icon={<Truck className="h-4 w-4" />}
              />
              <KpiCard
                delay={0.08}
                title="Completed Pickups"
                value={completedRequests}
                sub="Successfully resolved"
                icon={<CheckCircle2 className="h-4 w-4" />}
              />

              {role === "ADMIN" ? (
                <>
                  <KpiCard
                    delay={0.16}
                    title="Total Users"
                    value={adminStats?.users?.total || 0}
                    sub="Registered accounts"
                    icon={<Users className="h-4 w-4" />}
                  />
                  <KpiCard
                    delay={0.24}
                    title="Total Revenue"
                    value={`৳${adminStats?.financials?.totalRevenue || 0}`}
                    sub="From paid invoices"
                    icon={<DollarSign className="h-4 w-4" />}
                  />
                </>
              ) : (
                <>
                  <KpiCard
                    delay={0.16}
                    title="Eco Points"
                    value={completedRequests * 10}
                    sub="Keep recycling to earn more!"
                    icon={<Leaf className="h-4 w-4" />}
                  />
                  <KpiCard
                    delay={0.24}
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    sub="Of all your requests"
                    icon={<TrendingUp className="h-4 w-4" />}
                  />
                </>
              )}
            </>
          )}
        </div>

        {role === "ADMIN" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <DashboardCharts />
          </motion.div>
        )}
      </div>
    </RoleGuard>
  );
}
