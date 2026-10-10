"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { RoleGuard } from "@/components/auth/role-guard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function AuditLogsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => adminApi.getAuditLogs(),
  });

  const logs = data?.data || [];

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">View system activity and audit trails.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 border rounded-xl bg-destructive/10 text-destructive">
            <p>Failed to load audit logs. Please try again later.</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed">
            <h2 className="text-xl font-semibold mb-2">No Logs Found</h2>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{log.userId}</TableCell>
                    <TableCell>{JSON.stringify(log.details)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
