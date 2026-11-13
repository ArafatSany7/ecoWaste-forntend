"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/api/payment.api";
import { invoiceApi } from "@/api/invoice.api";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { Receipt, Loader2, Info, CheckCircle2, CreditCard } from "lucide-react";

function InvoiceCard({ invoice, onPay, isProcessing }: {
  invoice: any;
  onPay: (id: string) => void;
  isProcessing: boolean;
}) {
  const isPaid    = invoice.status === "PAID";
  const invoiceId = String(invoice.id || invoice._id);
  const shortId   = invoiceId.slice(0, 8).toUpperCase();
  const amount    = Number(invoice.amount).toFixed(2);
  const dueDate   = new Date(invoice.dueDate || invoice.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="site-glass relative flex flex-col gap-6 overflow-hidden rounded-3xl p-6"
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl opacity-40 ${isPaid ? "bg-[var(--site-lime)]" : "bg-amber-300"}`} />

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-[var(--site-accent)]" />
            <span className="font-mono text-sm font-semibold">INV-{shortId}</span>
          </div>
          <span className="text-xs text-muted-foreground">Due: {dueDate}</span>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isPaid ? "bg-[var(--site-accent-soft)] text-[var(--site-accent)]" : "bg-amber-100 text-amber-800"}`}>
          {isPaid && <CheckCircle2 className="h-3 w-3" />}
          {isPaid ? "Paid" : "Pending"}
        </div>
      </div>

      <div className="relative">
        <div className="text-5xl font-semibold tracking-tight">৳{amount}</div>
        <div className="mt-1 text-xs text-muted-foreground">Waste Collection Service Fee</div>
      </div>

      {isPaid ? (
        <div className="relative w-full rounded-full bg-[var(--site-accent-soft)] py-3 text-center text-sm font-medium text-[var(--site-accent)]">
          ✓ Payment Confirmed
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={isProcessing}
          onClick={() => onPay(invoiceId)}
          className="relative flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--site-accent)] py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay via SSLCommerz
            </>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-[var(--site-line)] bg-white/50 py-14">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--site-accent-soft)]">
        <Info className="h-5 w-5 text-[var(--site-accent)]" />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

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
        toast.success("Redirecting to payment gateway…");
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

  const invoices        = (data as any)?.data || [];
  const pendingInvoices = invoices.filter((i: any) => i.status === "PENDING");
  const paidInvoices    = invoices.filter((i: any) => i.status === "PAID");

  return (
    <RoleGuard allowedRoles={["CITIZEN"]}>
      <div className="space-y-10">
        <PageHeader
          title="Billing & payments"
          description="View your invoices and pay securely via SSLCommerz."
        />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-60 rounded-3xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">
            Failed to load invoices. Please try again later.
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <h2 className="mb-5 text-xl font-semibold tracking-tight flex items-center gap-2">
                <span
                  className="h-2 w-2 animate-pulse rounded-full bg-amber-400"
                />
                Pending Payments
              </h2>
              {pendingInvoices.length === 0 ? (
                <EmptyState message="No pending invoices at this time." />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {pendingInvoices.map((invoice: any) => (
                      <InvoiceCard
                        key={invoice.id || invoice._id}
                        invoice={invoice}
                        onPay={handlePay}
                        isProcessing={processingId === String(invoice.id || invoice._id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-5 text-xl font-semibold tracking-tight flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full bg-[var(--site-accent)]"
                />
                Payment History
              </h2>
              {paidInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No payment history available yet.
                </p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {paidInvoices.map((invoice: any) => (
                    <InvoiceCard
                      key={invoice.id || invoice._id}
                      invoice={invoice}
                      onPay={handlePay}
                      isProcessing={false}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
