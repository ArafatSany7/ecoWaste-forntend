"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/api/payment.api";
import { invoiceApi } from "@/api/invoice.api";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
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

  const glowColor = isPaid ? "oklch(0.72 0.22 160)" : "oklch(0.82 0.18 85)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl p-6 flex flex-col gap-5 overflow-hidden"
      style={{
        background: `${glowColor}0a`,
        border: `1px solid ${glowColor}25`,
        boxShadow: `0 0 24px ${glowColor}10`,
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: glowColor, transform: "translate(40%, -40%)" }}
      />

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4" style={{ color: glowColor }} />
            <span className="font-bold text-white text-sm font-mono">INV-{shortId}</span>
          </div>
          <span className="text-xs" style={{ color: "oklch(0.55 0.04 160)" }}>
            Due: {dueDate}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: `${glowColor}18`,
            color: glowColor,
            border: `1px solid ${glowColor}30`,
          }}
        >
          {isPaid && <CheckCircle2 className="h-3 w-3" />}
          {isPaid ? "Paid" : "Pending"}
        </div>
      </div>

      <div>
        <div className="text-4xl font-black" style={{ color: glowColor }}>
          ৳{amount}
        </div>
        <div className="text-xs mt-1" style={{ color: "oklch(0.55 0.04 160)" }}>
          Waste Collection Service Fee
        </div>
      </div>

      {isPaid ? (
        <div
          className="w-full py-3 rounded-xl text-center text-sm font-medium"
          style={{ background: "oklch(0.72 0.22 160 / 0.1)", color: "oklch(0.72 0.22 160)" }}
        >
          ✓ Payment Confirmed
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isProcessing}
          onClick={() => onPay(invoiceId)}
          className="w-full py-3 rounded-xl text-sm font-semibold text-black flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          style={{
            background: isProcessing
              ? "oklch(0.82 0.18 85 / 0.6)"
              : "linear-gradient(135deg, oklch(0.82 0.18 85), oklch(0.72 0.22 160))",
            boxShadow: isProcessing ? "none" : "var(--glow-gold)",
          }}
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
    <div
      className="flex flex-col items-center gap-3 py-14 rounded-2xl border border-dashed"
      style={{ borderColor: "oklch(1 0 0 / 0.1)", background: "oklch(1 0 0 / 0.02)" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "oklch(0.72 0.22 160 / 0.12)" }}
      >
        <Info className="h-5 w-5" style={{ color: "oklch(0.72 0.22 160)" }} />
      </div>
      <p className="text-sm" style={{ color: "oklch(0.55 0.04 160)" }}>{message}</p>
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
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-black text-white tracking-tight">Billing & Payments</h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.60 0.04 160)" }}>
            View your invoices and pay securely via{" "}
            <span style={{ color: "oklch(0.82 0.18 85)" }}>SSLCommerz</span>.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2].map((i) => (
              <Skeleton
                key={i}
                className="h-52 rounded-2xl"
                style={{ background: "oklch(0.14 0.03 160)" }}
              />
            ))}
          </div>
        ) : isError ? (
          <div
            className="rounded-2xl p-8 text-center border"
            style={{
              background: "oklch(0.577 0.245 27 / 0.08)",
              borderColor: "oklch(0.577 0.245 27 / 0.3)",
              color: "oklch(0.75 0.15 27)",
            }}
          >
            Failed to load invoices. Please try again later.
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "oklch(0.82 0.18 85)", boxShadow: "var(--glow-gold)" }}
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
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "oklch(0.72 0.22 160)" }}
                />
                Payment History
              </h2>
              {paidInvoices.length === 0 ? (
                <p className="text-sm" style={{ color: "oklch(0.5 0.04 160)" }}>
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
