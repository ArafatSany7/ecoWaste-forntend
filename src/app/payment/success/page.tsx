import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button render={<Link href="/dashboard" />} className="w-full sm:w-auto">
            Return to Dashboard
          </Button>
          <Button render={<Link href="/dashboard/billing" />} variant="outline" className="w-full sm:w-auto">
            View Billing History
          </Button>
        </div>
      </div>
    </div>
  );
}
