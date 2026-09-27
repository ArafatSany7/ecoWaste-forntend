"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { paymentApi } from "@/api/payment.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { CreditCard, Receipt, ExternalLink, Loader2 } from "lucide-react";

// Mock data 
const mockInvoices = [
  { id: "INV-2023-001", amount: 150.00, status: "PENDING", date: "2023-10-25" },
  { id: "INV-2023-002", amount: 300.00, status: "PAID", date: "2023-10-10" },
];

export default function BillingPage() {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const initiatePaymentMutation = useMutation({
    mutationFn: (invoiceId: string) => paymentApi.initiatePayment(invoiceId),
    onSuccess: (data) => {
      const url = data.data?.paymentUrl || data.data?.bkashURL;
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

  return (
    <RoleGuard allowedRoles={["CITIZEN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
          <p className="text-muted-foreground">View your invoices and pay securely via bKash.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockInvoices.map((invoice) => (
            <Card key={invoice.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Receipt className="h-5 w-5 text-primary" />
                      {invoice.id}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Due: {new Date(invoice.date).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={invoice.status === 'PAID' ? 'default' : 'secondary'}>
                    {invoice.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold">
                  ৳{invoice.amount.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Waste Collection Service Fee
                </p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                {invoice.status === "PENDING" ? (
                  <Button
                    className="w-full bg-[#E2136E] hover:bg-[#b00f55] text-white"
                    onClick={() => handlePay(invoice.id)}
                    disabled={processingId === invoice.id}
                  >
                    {processingId === invoice.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Pay with bKash
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Paid
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </RoleGuard>
  );
}
