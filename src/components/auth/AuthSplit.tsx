"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, Recycle, Route, Truck } from "lucide-react";
import { EASE_OUT } from "@/components/motion/primitives";

const BinScene = dynamic(() => import("@/components/auth/scenes/BinScene"), { ssr: false });
const TruckScene = dynamic(() => import("@/components/auth/scenes/TruckScene"), { ssr: false });

interface AuthSplitProps {
  children: React.ReactNode;
  headline: string;
  sub: string;
  formSide?: "left" | "right";
  scene?: "bin" | "truck";
}

const CHIPS = [
  { icon: Truck, label: "Pickup scheduled", pos: "left-5 top-6" },
  { icon: Recycle, label: "24 kg recycled", pos: "right-5 top-[28%]" },
  { icon: Route, label: "Route optimised", pos: "left-5 top-[46%]" },
];

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

export function AuthSplit({ children, headline, sub, formSide = "left", scene = "bin" }: AuthSplitProps) {
  const reduce = useReducedMotion();
  const wide = useWide();
  const flip = formSide === "right";

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-28">
      <div className="pointer-events-none absolute inset-0 site-grid opacity-60" />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className="site-glass relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-2"
      >
        <div className={`flex items-center justify-center p-6 sm:p-10 md:p-12 ${flip ? "lg:order-2" : ""}`}>
          <div className="w-full max-w-md">{children}</div>
        </div>

        <aside
          className={`relative hidden overflow-hidden bg-gradient-to-br from-[oklch(0.95_0.07_125)] via-[oklch(0.93_0.06_150)] to-[oklch(0.88_0.08_170)] lg:block ${
            flip ? "lg:order-1 border-r" : "border-l"
          } border-[var(--site-line)]`}
        >
          <div className="pointer-events-none absolute inset-0 site-grid opacity-70" />
          <div className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full opacity-60 [background:radial-gradient(circle,var(--site-lime),transparent_68%)]" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full opacity-60 [background:radial-gradient(circle,oklch(0.8_0.12_175),transparent_68%)]" />

          {wide && (
            <div className="absolute inset-0">
              {scene === "truck" ? <TruckScene /> : <BinScene />}
            </div>
          )}

          {CHIPS.map(({ icon: Icon, label, pos }) => (
            <div
              key={label}
              className={`site-glass absolute z-10 flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-xs font-medium ${pos}`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--site-accent)] text-white">
                <Icon className="h-3 w-3" />
              </span>
              {label}
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 z-10 p-5">
            <div className="site-glass rounded-2xl p-5">
              <Link href="/" className="mb-3 flex w-fit items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--site-accent)] text-white">
                  <Leaf className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-semibold tracking-tight">EcoWaste</span>
              </Link>
              <h2 className="text-lg font-semibold leading-snug tracking-tight">{headline}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{sub}</p>
            </div>
          </div>
        </aside>
      </motion.div>
    </div>
  );
}
