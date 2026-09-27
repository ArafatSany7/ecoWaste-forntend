"use client";

import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export function AccessDenied() {
  const router = useRouter();

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-6">
      <div className="rounded-full bg-destructive/10 p-6">
        <ShieldAlert className="h-12 w-12 text-destructive" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          You do not have the required permissions to view this page. If you believe this is an error, please contact support.
        </p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button onClick={() => router.push("/")}>
          Return Home
        </Button>
      </div>
    </div>
  );
}
