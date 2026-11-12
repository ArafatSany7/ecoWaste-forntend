"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, ShieldCheck, Route, Radio } from "lucide-react";
import { EASE_OUT } from "@/components/motion/primitives";

const AuthScene = dynamic(() => import("@/components/auth/AuthScene"), { ssr: false });

interface AuthSplitProps {
  children: React.ReactNode;
  headline: string;
  sub: string;
  formSide?: "left" | "right";
}

const CHIPS = [
  { icon: Route, label: "Smart routes", pos: "left-[8%] top-[22%]", delay: 0.6 },
  { icon: Radio, label: "Live tracking", pos: "right-[8%] top-[38%]", delay: 0.8 },
  { icon: ShieldCheck, label: "Verified pickups", pos: "left-[14%] bottom-[26%]", delay: 1 },
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

export function AuthSplit({ children, headline, sub, formSide = "left" }: AuthSplitProps) {
  const reduce = useReducedMotion();
  const wide = useWide();
  const flip = formSide === "right";

  return (
    <div className={`relative flex min-h-screen flex-col lg:flex-row ${flip ? "lg:flex-row-reverse" : ""}`}>
      <div className="relative flex flex-1 items-center justify-center px-5 pb-16 pt-28 sm:px-10 lg:w-1/2 lg:py-24">
        <div className="pointer-events-none absolute inset-0 site-grid opacity-60" />
        <motion.div
          initial={reduce ? false : { opacity: 0, x: flip ? 40 : -40, filter: "blur(8px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="site-glass relative z-10 w-full max-w-md rounded-3xl p-8 md:p-10"
        >
          {children}
        </motion.div>
      </div>

      <motion.aside
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 }}
        className="relative hidden overflow-hidden p-4 lg:block lg:w-1/2"
      >
        <div className="relative h-full min-h-[calc(100vh-2rem)] overflow-hidden rounded-[2rem] border border-[var(--site-line)] bg-gradient-to-br from-[oklch(0.95_0.07_125)] via-[oklch(0.93_0.06_150)] to-[oklch(0.88_0.08_170)] site-grain">
          <div className="pointer-events-none absolute inset-0 site-grid opacity-70" />
          <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-[var(--site-lime)] opacity-50 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-[oklch(0.8_0.12_175)] opacity-50 blur-[100px]" />

          {wide && (
            <div className="absolute inset-0">
              <AuthScene reduceMotion={!!reduce} />
            </div>
          )}

          {CHIPS.map(({ icon: Icon, label, pos, delay }) => (
            <motion.div
              key={label}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { delay, duration: 0.8 },
                y: { delay, duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className={`site-glass absolute z-10 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-xs font-medium ${pos}`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--site-accent)] text-white">
                <Icon className="h-3.5 w-3.5" />
              </span>
              {label}
            </motion.div>
          ))}

          <div className="absolute inset-x-0 bottom-0 z-10 p-8">
            <div className="site-glass rounded-3xl p-6">
              <Link href="/" className="mb-4 flex w-fit items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--site-accent)] text-white">
                  <Leaf className="h-4 w-4" />
                </span>
                <span className="font-semibold tracking-tight">EcoWaste</span>
              </Link>
              <h2 className="text-2xl font-semibold leading-tight tracking-tight">{headline}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{sub}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
