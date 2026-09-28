"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { RoleGuard } from "@/components/auth/role-guard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => adminApi.getAllUsers(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => 
      adminApi.updateUserRole(id, role),
    onSuccess: () => {
      toast.success("User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to update user role");
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      adminApi.updateUserStatus(id, status),
    onSuccess: () => {
      toast.success("User status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to update user status");
    }
  });

  const users = data?.data?.data || [];

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground">View all registered users, assign roles, and manage account statuses.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 border rounded-xl bg-destructive/10 text-destructive">
            <p>Failed to load users. Please try again later.</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Users Found</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              There are currently no other users registered in the system.
            </p>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Manage Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: Record<string, unknown>) => (
                  <TableRow key={String(user.id || user._id)}>
                    <TableCell className="font-medium">
                      {String(user.firstName || "")} {String(user.lastName || "")}
                      {!user.firstName && !user.lastName && String(user.name || "Unknown")}
                    </TableCell>
                    <TableCell>{String(user.email)}</TableCell>
                    <TableCell>{user.phone ? String(user.phone) : "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'BLOCKED' ? 'destructive' : 'default'}>
                        {String(user.status || "ACTIVE")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={String(user.role || "CITIZEN")} 
                        onValueChange={(val) => updateRoleMutation.mutate({ id: String(user.id || user._id), role: val as string })}
                        disabled={updateRoleMutation.isPending}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CITIZEN">Citizen</SelectItem>
                          <SelectItem value="COLLECTOR">Collector</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select 
                        defaultValue={String(user.status || "ACTIVE")} 
                        onValueChange={(val) => updateStatusMutation.mutate({ id: String(user.id || user._id), status: val as string })}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[120px] ml-auto">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="BLOCKED">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
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
