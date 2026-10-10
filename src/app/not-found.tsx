import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-background">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button size="lg">
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
}
