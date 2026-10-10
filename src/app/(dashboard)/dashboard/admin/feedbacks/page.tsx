"use client";

import { useQuery } from "@tanstack/react-query";
import { feedbackApi } from "@/api/feedback.api";
import { RoleGuard } from "@/components/auth/role-guard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Star } from "lucide-react";

export default function FeedbacksPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: () => feedbackApi.getAll(),
  });

  const feedbacks = data?.data || [];

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Feedback</h1>
          <p className="text-muted-foreground">View feedback provided by citizens and collectors.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 border rounded-xl bg-destructive/10 text-destructive">
            <p>Failed to load feedback. Please try again later.</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card border-dashed">
            <h2 className="text-xl font-semibold mb-2">No Feedback Found</h2>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((f: any) => (
                  <TableRow key={f.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(f.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">{f.userId}</TableCell>
                    <TableCell>
                      <div className="flex text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < f.rating ? 'fill-current' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[400px] truncate">{f.comment || "N/A"}</TableCell>
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
