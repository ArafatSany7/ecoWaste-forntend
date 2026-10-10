"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wasteCategoryApi } from "@/api/waste-category.api";
import { RoleGuard } from "@/components/auth/role-guard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tags, Plus, Trash2, Edit } from "lucide-react";

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => wasteCategoryApi.getAll(),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => wasteCategoryApi.delete(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: () => {
      toast.error("Failed to delete category");
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const categories = (data as any)?.data || [];

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Waste Categories</h1>
            <p className="text-muted-foreground">Manage types of waste and their collection pricing.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
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
            <p>Failed to load categories. Please try again later.</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Tags className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Categories Found</h2>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              There are currently no waste categories defined in the system.
            </p>
            <Button variant="outline">
              Create First Category
            </Button>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category: Record<string, unknown>) => (
                  <TableRow key={String(category.id || category._id)}>
                    <TableCell className="font-medium">{String(category.name)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{String(category.description || "N/A")}</TableCell>
                    <TableCell>
                      {category.basePrice ? `৳${Number(category.basePrice).toFixed(2)}` : "Free"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(String(category.id || category._id))}
                        disabled={deleteCategoryMutation.isPending}
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
