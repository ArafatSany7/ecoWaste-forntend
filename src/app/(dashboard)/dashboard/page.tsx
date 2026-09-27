"use client";

import { useAuthStore } from "@/store/auth.store";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <RoleGuard allowedRoles={["CITIZEN", "COLLECTOR", "ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || user?.name || "User"} ({user?.role})
          </p>
        </div>
        
        <div className="p-6 border rounded-xl bg-card">
          <p className="mb-4">This is a protected route. If you are seeing this, you are authenticated.</p>
          <Button onClick={handleLogout} variant="destructive">Logout</Button>
        </div>
      </div>
    </RoleGuard>
  );
}
