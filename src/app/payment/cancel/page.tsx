import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            Your payment was cancelled or failed. No charges were made to your account.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button render={<Link href="/dashboard/billing" />} className="w-full sm:w-auto">
            Try Again
          </Button>
          <Button render={<Link href="/dashboard" />} variant="outline" className="w-full sm:w-auto">
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
