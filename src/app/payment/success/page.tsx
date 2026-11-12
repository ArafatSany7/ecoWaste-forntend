"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden eco-bg-void"
    >
      {/* Glow blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 50% 40%, oklch(0.72 0.22 160 / 0.18) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-sm w-full flex flex-col items-center gap-8 text-center rounded-3xl p-10"
        style={{
          background: "oklch(1 0 0 / 0.04)",
          backdropFilter: "blur(24px)",
          border: "1px solid oklch(0.72 0.22 160 / 0.25)",
          boxShadow: "var(--glow-emerald)",
        }}
      >
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(0.72 0.22 160 / 0.15)",
            border: "2px solid oklch(0.72 0.22 160 / 0.4)",
            boxShadow: "var(--glow-emerald)",
          }}
        >
          <CheckCircle2 className="h-10 w-10" style={{ color: "oklch(0.72 0.22 160)" }} />
        </motion.div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-white">Payment Successful!</h1>
          <p className="text-sm" style={{ color: "oklch(0.60 0.04 160)" }}>
            Your transaction has been completed. Your invoice is now marked as paid.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl text-sm font-semibold text-black"
              style={{
                background: "linear-gradient(135deg, oklch(0.72 0.22 160), oklch(0.78 0.18 195))",
                boxShadow: "var(--glow-emerald)",
              }}
            >
              Return to Dashboard
            </motion.button>
          </Link>
          <Link href="/dashboard/billing">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl text-sm font-medium glass"
              style={{ color: "oklch(0.72 0.22 160)" }}
            >
              View Billing History
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
