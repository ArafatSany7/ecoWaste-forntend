"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wasteRequestApi } from "@/api/waste-request.api";
import { RoleGuard } from "@/components/auth/role-guard";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FileWarning } from "lucide-react";

export default function AdminRequestsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["waste-requests", "all"],
    queryFn: () => wasteRequestApi.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      wasteRequestApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["waste-requests", "all"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const requests = data?.data?.data || [];

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Requests</h1>
          <p className="text-muted-foreground">Monitor and manage all system-wide waste disposal requests.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 border rounded-xl bg-destructive/10 text-destructive">
            <p>Failed to load requests. Please try again later.</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <FileWarning className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Requests Found</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              There are currently no waste requests in the system.
            </p>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req: Record<string, unknown>) => (
                  <TableRow key={String(req.id || req._id)}>
                    <TableCell className="font-medium max-w-[120px] truncate">
                      {String(req.id || req._id).slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{String(req.wasteType)}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {String(req.address)}
                    </TableCell>
                    <TableCell>
                      {req.createdAt ? new Date(String(req.createdAt)).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === 'COMPLETED' ? 'default' :
                            req.status === 'CANCELLED' ? 'destructive' :
                              req.status === 'IN_PROGRESS' ? 'secondary' : 'outline'
                        }
                      >
                        {String(req.status || "PENDING")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        defaultValue={String(req.status || "PENDING")}
                        onValueChange={(val) => handleStatusChange(String(req.id || req._id), val as string)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <SelectTrigger className="w-[130px] ml-auto">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
