"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/api/payment.api";
import { invoiceApi } from "@/api/invoice.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { CreditCard, Receipt, Loader2, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillingPage() {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-invoices"],
    queryFn: () => invoiceApi.getMyInvoices(),
  });

  const initiatePaymentMutation = useMutation({
    mutationFn: (invoiceId: string) => paymentApi.initiatePayment(invoiceId),
    onSuccess: (data) => {
      const url = data.data?.paymentUrl;
      if (url) {
        toast.success("Redirecting to payment gateway...");
        window.location.href = url;
      } else {
        toast.error("Invalid payment gateway URL received");
        setProcessingId(null);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate payment");
      setProcessingId(null);
    }
  });

  const handlePay = (invoiceId: string) => {
    setProcessingId(invoiceId);
    initiatePaymentMutation.mutate(invoiceId);
  };

  const invoices = (data as any)?.data || [];
  const pendingInvoices = invoices.filter((i: any) => i.status === "PENDING");
  const paidInvoices = invoices.filter((i: any) => i.status === "PAID");

  const renderInvoiceCard = (invoice: any) => (
    <Card key={invoice.id || invoice._id} className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="h-5 w-5 text-primary" />
              INV-{String(invoice.id || invoice._id).slice(0, 8).toUpperCase()}
            </CardTitle>
            <CardDescription className="mt-1">
              Due: {new Date(invoice.dueDate || invoice.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'}>
            {invoice.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-3xl font-bold">
          ৳{Number(invoice.amount).toFixed(2)}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Waste Collection Service Fee
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        {invoice.status === "PENDING" ? (
          <Button
            className="w-full"
            onClick={() => handlePay(String(invoice.id || invoice._id))}
            disabled={processingId === String(invoice.id || invoice._id)}
          >
            {processingId === String(invoice.id || invoice._id) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            Pay via SSLCommerz
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Paid
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <RoleGuard allowedRoles={["CITIZEN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">View your invoices and pay securely via SSLCommerz.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-xl p-5 space-y-4 bg-card">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-full mt-4" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 border rounded-xl bg-destructive/10 text-destructive">
            <p>Failed to load invoices. Please try again later.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Pending Invoices Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Pending Payments</h2>
              {pendingInvoices.length === 0 ? (
                <div className="text-center py-10 border rounded-xl bg-card border-dashed">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-3">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No Pending Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    You do not have any pending invoices at the moment.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pendingInvoices.map(renderInvoiceCard)}
                </div>
              )}
            </section>

            {/* Paid Invoices Section */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
              {paidInvoices.length === 0 ? (
                <p className="text-muted-foreground text-sm">No payment history available.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {paidInvoices.map(renderInvoiceCard)}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
