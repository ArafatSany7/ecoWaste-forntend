"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zoneApi } from "@/api/zone.api";
import { RoleGuard } from "@/components/auth/role-guard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, Plus, Trash2 } from "lucide-react";

export default function AdminZonesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-zones"],
    queryFn: () => zoneApi.getAll(),
  });

  const deleteZoneMutation = useMutation({
    mutationFn: (id: string) => zoneApi.delete(id),
    onSuccess: () => {
      toast.success("Zone deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-zones"] });
    },
    onError: () => {
      toast.error("Failed to delete zone");
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this zone?")) {
      deleteZoneMutation.mutate(id);
    }
  };

  const zones = data?.data?.data || [];

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Zones</h1>
            <p className="text-muted-foreground">Manage city zones for waste collection assignment.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Zone
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 border rounded-xl bg-destructive/10 text-destructive">
            <p>Failed to load zones. Please try again later.</p>
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Zones Found</h2>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              There are currently no zones defined in the system.
            </p>
            <Button variant="outline">
              Create First Zone
            </Button>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zone Name</TableHead>
                  <TableHead>City/Area</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map((zone: Record<string, unknown>) => (
                  <TableRow key={String(zone.id || zone._id)}>
                    <TableCell className="font-medium">{String(zone.name)}</TableCell>
                    <TableCell>{String(zone.city || zone.area || "N/A")}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(String(zone.id || zone._id))}
                        disabled={deleteZoneMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
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
