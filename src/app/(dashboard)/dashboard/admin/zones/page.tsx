"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zoneApi } from "@/api/zone.api";
import { RoleGuard } from "@/components/auth/role-guard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

function AdminZonesContent() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const limit = 10;

  const [searchInput, setSearchInput] = useState(search);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", city: "" });

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-zones", page, search],
    queryFn: () => zoneApi.getAll({ page, limit, search }),
  });

  const createZoneMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => zoneApi.create(data),
    onSuccess: () => {
      toast.success("Zone created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-zones"] });
      setIsCreateOpen(false);
      setFormData({ name: "", city: "" });
    },
    onError: () => {
      toast.error("Failed to create zone");
    }
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createZoneMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this zone?")) {
      deleteZoneMutation.mutate(id);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) {
      params.set("search", searchInput);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const zones = (data as any)?.data || [];
  const total = (data as any)?.meta?.total || 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Zones</h1>
            <p className="text-muted-foreground">Manage city zones for waste collection assignment.</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger render={<Button />}>
              <Plus className="mr-2 h-4 w-4" />
              Add Zone
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Zone</DialogTitle>
                <DialogDescription>
                  Add a new operational zone for collections.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Zone Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Uttara Zone 1"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g. Dhaka"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createZoneMutation.isPending}>
                    {createZoneMutation.isPending ? "Creating..." : "Create Zone"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-sm">
          <Input
            placeholder="Search zones..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>

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
              {search ? "No zones match your search query." : "There are currently no zones defined in the system."}
            </p>
            {search ? (
              <Button variant="outline" onClick={() => { setSearchInput(''); router.push(pathname); }}>
                Clear Search
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsCreateOpen(true)}>
                Create First Zone
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
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
                  {zones.map((zone: Record<string, any>) => (
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total || 1)} of {total || zones.length} zones
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

export default function AdminZonesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminZonesContent />
    </Suspense>
  );
}
