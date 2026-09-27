"use client";

import { useAuthStore } from "@/store/auth.store";
import { ReactNode, useEffect, useState } from "react";
import { AccessDenied } from "./access-denied";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<"CITIZEN" | "COLLECTOR" | "ADMIN">;
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const user = useAuthStore((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {

    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
