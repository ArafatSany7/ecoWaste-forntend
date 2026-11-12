"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

export function Reveal({ delay = 0, y = 40, className, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface SplitHeadingProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  accentWords?: string[];
}

export function SplitHeading({ text, className, as = "h2", delay = 0, accentWords = [] }: SplitHeadingProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const words = text.split(" ");
  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
      className={cn("flex flex-wrap gap-x-[0.28em] gap-y-0 leading-[1.02] tracking-tight", className)}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]" aria-hidden>
          <motion.span
            className={cn("inline-block", accentWords.includes(w) && "text-[var(--site-accent)]")}
            variants={
              reduce
                ? { hidden: {}, show: {} }
                : {
                    hidden: { y: "110%", rotateX: -70, opacity: 0 },
                    show: { y: 0, rotateX: 0, opacity: 1, transition: { duration: 0.9, ease: EASE_OUT } },
                  }
            }
            style={{ transformOrigin: "bottom" }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--site-accent)]",
        className
      )}
    >
      <span className="h-px w-6 bg-[var(--site-accent)]" />
      {children}
    </span>
  );
}

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: number;
}

export function TiltCard({ intensity = 9, className, children, ...rest }: TiltCardProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduce || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * intensity * 2);
    rx.set(-(py - 0.5) * intensity * 2);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="perspective-1200">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry }}
        whileHover={reduce ? undefined : { scale: 1.015 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className={cn("group relative preserve-3d overflow-hidden rounded-3xl site-glass", className)}
        {...(rest as object)}
      >
        <div className="site-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative" style={{ transform: "translateZ(30px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

interface PillButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  onClick?: () => void;
}

export function PillButton({ href, children, variant = "solid", className, onClick }: PillButtonProps) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const solid = variant === "solid";
  return (
    <motion.div onPointerMove={onMove} onPointerLeave={onLeave} style={{ x, y }} className="inline-block">
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "group/pill relative inline-flex min-h-11 items-center gap-3 overflow-hidden rounded-full py-1.5 pl-6 pr-1.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--site-accent)]",
          solid
            ? "bg-[var(--site-accent)] text-white"
            : "border border-[var(--site-line)] bg-[var(--site-glass)] text-foreground hover:border-[var(--site-accent)]",
          className
        )}
      >
        <span className="relative z-10">{children}</span>
        <span
          className={cn(
            "relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-500 group-hover/pill:rotate-45",
            solid ? "bg-white text-[var(--site-accent)]" : "bg-[var(--site-accent)] text-white"
          )}
        >
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-[var(--site-accent)]"
    />
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-[var(--site-line)] py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 text-3xl font-semibold tracking-tight text-outline md:text-5xl">
            {t}
            <span className="h-2 w-2 rounded-full bg-[var(--site-accent)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function useParallax(target: React.RefObject<HTMLElement | null>, distance = 80) {
  const { scrollYProgress } = useScroll({ target, offset: ["start end", "end start"] });
  return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
}
