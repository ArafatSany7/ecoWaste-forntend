"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center bg-background rounded-xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        We encountered an unexpected error while trying to process your request. 
        Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
        <Button onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
