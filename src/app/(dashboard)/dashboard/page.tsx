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
import { Leaf, Truck, CheckCircle2, TrendingUp, Users, DollarSign } from "lucide-react";

const DashboardCharts = dynamic(() => import("@/components/dashboard/dashboard-charts"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-2xl" />,
});

/* ─── Glassmorphic KPI Card ──────────────────────────────────────────── */
interface KpiCardProps {
  title: string;
  value: React.ReactNode;
  sub: string;
  icon: React.ReactNode;
  glowColor: string;
  delay?: number;
}

function KpiCard({ title, value, sub, icon, glowColor, delay = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden cursor-default"
      style={{
        background: `${glowColor}0d`,
        border: `1px solid ${glowColor}30`,
        boxShadow: `0 0 24px ${glowColor}18`,
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Background glow blob */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: glowColor, transform: "translate(30%, -30%)" }}
      />

      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.65 0.04 160)" }}>
          {title}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${glowColor}22`, color: glowColor }}
        >
          {icon}
        </div>
      </div>

      <div className="text-3xl font-black text-white">{value}</div>
      <div className="text-xs" style={{ color: "oklch(0.55 0.04 160)" }}>{sub}</div>
    </motion.div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-black text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.60 0.04 160)" }}>
            Welcome back,{" "}
            <span style={{ color: "oklch(0.72 0.22 160)" }}>
              {user?.firstName || user?.name || "User"}
            </span>
            ! Here is a summary of your eco-activity.
          </p>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" style={{ background: "oklch(0.18 0.03 160)" }} />
            ))
          ) : (
            <>
              <KpiCard
                delay={0}
                title="Total Requests"
                value={totalRequests}
                sub="All time activity"
                icon={<Truck className="h-4 w-4" />}
                glowColor="oklch(0.78 0.18 195)"
              />
              <KpiCard
                delay={0.08}
                title="Completed Pickups"
                value={completedRequests}
                sub="Successfully resolved"
                icon={<CheckCircle2 className="h-4 w-4" />}
                glowColor="oklch(0.72 0.22 160)"
              />

              {role === "ADMIN" ? (
                <>
                  <KpiCard
                    delay={0.16}
                    title="Total Users"
                    value={adminStats?.users?.total || 0}
                    sub="Registered accounts"
                    icon={<Users className="h-4 w-4" />}
                    glowColor="oklch(0.68 0.28 320)"
                  />
                  <KpiCard
                    delay={0.24}
                    title="Total Revenue"
                    value={`৳${adminStats?.financials?.totalRevenue || 0}`}
                    sub="From paid invoices"
                    icon={<DollarSign className="h-4 w-4" />}
                    glowColor="oklch(0.82 0.18 85)"
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
                    glowColor="oklch(0.72 0.22 160)"
                  />
                  <KpiCard
                    delay={0.24}
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    sub="Of all your requests"
                    icon={<TrendingUp className="h-4 w-4" />}
                    glowColor="oklch(0.82 0.18 85)"
                  />
                </>
              )}
            </>
          )}
        </div>

        {/* Charts — admin only */}
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
