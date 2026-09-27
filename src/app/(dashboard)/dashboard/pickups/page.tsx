"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wasteRequestApi } from "@/api/waste-request.api";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/auth/role-guard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function PickupsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["waste-requests", "assigned"],
    queryFn: () => wasteRequestApi.getAll(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      wasteRequestApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success("Pickup status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["waste-requests", "assigned"] });
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
    <RoleGuard allowedRoles={["COLLECTOR", "ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assigned Pickups</h1>
          <p className="text-muted-foreground">Manage and update the status of your assigned waste collections.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-xl p-5 space-y-4 bg-card">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 border rounded-xl bg-destructive/10 text-destructive">
            <p>Failed to load assigned pickups. Please try again later.</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Assigned Pickups</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              You currently have no waste requests assigned to you. Enjoy your break!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req: Record<string, unknown>) => (
              <div key={String(req.id || req._id)} className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant={req.status === 'COMPLETED' ? 'default' : req.status === 'IN_PROGRESS' ? 'secondary' : 'outline'} className="mb-2">
                    {String(req.status || "PENDING")}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {String(req.wasteType)}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg line-clamp-1">{String(req.title)}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mt-2 flex-1">
                  {String(req.description)}
                </p>

                <div className="mt-4 pt-4 border-t space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="line-clamp-1">{String(req.address)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{req.createdAt ? new Date(String(req.createdAt)).toLocaleDateString() : 'N/A'}</span>
                  </div>


                  <div className="pt-4 mt-2 border-t">
                    <Select
                      defaultValue={String(req.status || "PENDING")}
                      onValueChange={(val) => handleStatusChange(String(req.id || req._id), val as string)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
