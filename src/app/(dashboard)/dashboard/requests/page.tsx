"use client";

import { useQuery } from "@tanstack/react-query";
import { wasteRequestApi } from "@/api/waste-request.api";
import { Button } from "@/components/ui/button";
import { Plus, Clock, MapPin, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateRequestForm } from "@/components/form/create-request-form";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function RequestsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["waste-requests"],
    queryFn: () => wasteRequestApi.getAll(),
  });

  const requests = data?.data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground">Manage and track your waste disposal requests.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Waste Request</DialogTitle>
              <DialogDescription>
                Fill in the details below to schedule a new waste pickup.
              </DialogDescription>
            </DialogHeader>
            <CreateRequestForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-xl p-5 space-y-4 bg-card">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 border rounded-xl bg-destructive/10 text-destructive">
          <p>Failed to load requests. Please try again later.</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card border-dashed">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Requests Found</h2>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            You haven&apos;t made any waste disposal requests yet. Create your first request to get started!
          </p>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            Create First Request
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((req: Record<string, unknown>) => (
            <div key={String(req.id || req._id)} className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <Badge variant={req.status === 'PENDING' ? 'outline' : 'default'} className="mb-2">
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
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">{String(req.address)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{req.createdAt ? new Date(String(req.createdAt)).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
