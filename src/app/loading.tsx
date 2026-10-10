import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 w-full h-full min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          Loading EcoWaste...
        </p>
      </div>
    </div>
  );
}
