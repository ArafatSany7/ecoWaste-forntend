"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { CalendarClock, CheckCircle2, ChevronDown, MapPin, Route, ShieldCheck, Truck } from "lucide-react";
import { Eyebrow, EASE_OUT } from "@/components/motion/primitives";
import { INTRO_END, STEPS, stepIndexAt, truckProgress, type Step } from "./story";

const CityMap = dynamic(() => import("./CityMap"), { ssr: false });

const SECTION_HEIGHT = "640vh";
/** Portion of the timeline a card spends fading in / out. Short = crisp hand-offs. */
const FADE = 0.022;

/** Invisible glass still costs a backdrop blur every frame — take it out of rendering. */
const hideWhenClear = (o: number) => (o < 0.01 ? "hidden" : "visible");

function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}

// ---------- Step details: small, product-like readouts under each card ----------

function Detail({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-foreground/80">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--site-accent-soft)] text-[var(--site-accent)]">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">{children}</span>
    </div>
  );
}

function DispatchEta({ progress }: { progress: MotionValue<number> }) {
  const eta = useTransform(progress, (p) => `${Math.max(0, Math.ceil(12 * (1 - truckProgress(p))))} min`);
  const km = useTransform(progress, (p) => `${(4.2 * (1 - truckProgress(p))).toFixed(1)} km`);
  const bar = useTransform(progress, (p) => truckProgress(p));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between font-mono text-sm tabular-nums">
        <span className="text-muted-foreground">
          ETA <motion.span className="font-semibold text-foreground">{eta}</motion.span>
        </span>
        <motion.span className="text-muted-foreground">{km}</motion.span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--site-line)]">
        <motion.div style={{ scaleX: bar }} className="h-full origin-left rounded-full bg-[var(--site-accent)]" />
      </div>
    </div>
  );
}

/** Amount ticks up, then the check draws itself and the badge settles to "Paid". */
function PaymentReceipt({ progress, start }: { progress: MotionValue<number>; start: number }) {
  const settle = [start + 0.015, start + 0.06];
  const amount = useTransform(progress, settle, [0, 250]);
  const amountText = useTransform(amount, (v) => `৳${v.toFixed(2)}`);
  const check = useTransform(progress, [start + 0.05, start + 0.08], [0, 1]);
  const badge = useTransform(progress, [start + 0.05, start + 0.07], [0.35, 1]);
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[var(--site-accent-soft)] px-4 py-3">
      <div>
        <div className="font-mono text-xs text-foreground/70">Invoice #EW-2041</div>
        <motion.div className="text-lg font-semibold tabular-nums">{amountText}</motion.div>
      </div>
      <motion.span
        style={{ opacity: badge }}
        className="flex items-center gap-1.5 rounded-full bg-[var(--site-accent)] px-3 py-1 text-xs font-semibold text-white"
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.5} />
          <motion.path
            d="M4.8 8.3 7 10.4l4.2-4.6"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: check }}
          />
        </svg>
        Paid
      </motion.span>
    </div>
  );
}

function StepDetails({ step, progress }: { step: Step; progress: MotionValue<number> }) {
  switch (step.id) {
    case "request":
      return (
        <>
          <Detail icon={MapPin}>House 14, Road 7 · Mixed recyclables</Detail>
          <Detail icon={CalendarClock}>Tomorrow, 10:30 AM</Detail>
        </>
      );
    case "approve":
      return (
        <>
          <Detail icon={ShieldCheck}>Approved by Zone 3 admin</Detail>
          <Detail icon={Route}>Optimal route · 4.2 km · 5 turns</Detail>
        </>
      );
    case "dispatch":
      return (
        <>
          <Detail icon={Truck}>Collector Rahim · Truck EW-12</Detail>
          <DispatchEta progress={progress} />
        </>
      );
    case "collect":
      return (
        <>
          <Detail icon={CheckCircle2}>Pickup verified on-site</Detail>
          <Detail icon={Truck}>18 kg collected · bin cleared</Detail>
        </>
      );
    case "pay":
      return <PaymentReceipt progress={progress} start={step.range[0]} />;
  }
}

// ---------- Card (scrubbed by its own slice of the scroll) ----------

function StepCard({ step, index, progress, active }: {
  step: Step;
  index: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const [a, b] = step.range;
  const last = index === STEPS.length - 1;
  const input = last ? [a, a + FADE] : [a, a + FADE, b - FADE, b];
  const opacity = useTransform(progress, input, last ? [0, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, input, last ? [28, 0] : [28, 0, 0, -28]);
  const visibility = useTransform(opacity, hideWhenClear);

  return (
    <motion.article
      style={{ opacity, y, visibility }}
      aria-hidden={!active}
      className="site-frost col-start-1 row-start-1 flex flex-col gap-5 rounded-[28px] p-6 md:p-7"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--site-accent)]">
          Step {step.number}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {step.number} / 0{STEPS.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{step.title}</h2>
        <p className="text-sm leading-relaxed text-foreground/70 md:text-base">{step.body}</p>
      </div>
      <div className="flex flex-col gap-3 border-t border-[var(--site-line)] pt-5">
        <StepDetails step={step} progress={progress} />
      </div>
    </motion.article>
  );
}

// ---------- Experience ----------

export function HowItWorksExperience() {
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(-1);

  // Lenis already eases the scroll itself, so the scene follows it 1:1 — adding a spring
  // on top is what made it trail behind the finger.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Mirror scroll into a plain motion value. Styles derived straight from scrollYProgress
  // can be handed to native scroll-timeline animations, which stall mid-fade under Lenis
  // (half-visible cue / rail). Driving everything from this copy keeps every fade exact.
  const progress = useMotionValue(0);
  // Reduced motion: hold the map on its final overview instead of flying the camera.
  const settled = useMotionValue(1);

  useMotionValueEvent(scrollYProgress, "change", (p) => progress.set(p));
  useMotionValueEvent(progress, "change", (p) => setActive(stepIndexAt(p)));
  // Sync once on mount (e.g. back-navigation restores mid-story).
  useEffect(() => progress.set(scrollYProgress.get()), [scrollYProgress, progress]);

  // Intro headline glides aside and fades as step 01 arrives.
  const introEnd = INTRO_END * 0.9;
  const introOpacity = useTransform(progress, [0, introEnd], [1, 0]);
  const introX = useTransform(progress, [0, introEnd], desktop ? ["0vw", "-22vw"] : ["0vw", "0vw"]);
  const introY = useTransform(progress, [0, introEnd], desktop ? ["0vh", "0vh"] : ["0vh", "-14vh"]);
  const introScale = useTransform(progress, [0, introEnd], [1, 0.86]);
  const introVisibility = useTransform(introOpacity, hideWhenClear);
  const cueOpacity = useTransform(progress, [0, INTRO_END * 0.35], [1, 0]);
  const railOpacity = useTransform(progress, [INTRO_END * 0.6, INTRO_END], [0, 1]);
  const railY = useTransform(progress, [INTRO_END * 0.6, INTRO_END], [12, 0]);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const [a, b] = STEPS[i].range;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + ((a + b) / 2) * scrollable, behavior: "smooth" });
  };

  return (
    <section ref={ref} aria-label="How EcoWaste works" className="relative" style={{ height: reduce ? "auto" : SECTION_HEIGHT }}>
      <div className={reduce ? "relative h-[80vh]" : "sticky top-0 h-[100dvh] overflow-hidden"}>
        {/* Map */}
        <motion.div
          role="img"
          aria-label="Animated city map: a pickup is requested at a house, a route is planned from the EcoWaste depot, and a collection truck drives there to collect the waste."
          className="absolute inset-0 bg-[var(--background)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
        >
          <CityMap progress={reduce ? settled : progress} onReady={() => setReady(true)} />
        </motion.div>

        {/* Scrims keep the navbar and overlays legible over the map */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--background)] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--background)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[42vw] bg-gradient-to-r from-[var(--background)]/70 to-transparent lg:block" />

        {!reduce && (
          <>
            {/* Intro */}
            <motion.div
              style={{ opacity: introOpacity, x: introX, y: introY, scale: introScale, visibility: introVisibility }}
              aria-hidden={active !== -1}
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center"
            >
              <div className="site-frost flex max-w-2xl flex-col items-center gap-5 rounded-[32px] px-8 py-10 md:px-12">
                <Eyebrow>How it works</Eyebrow>
                <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                  Follow one pickup across the <span className="text-[var(--site-accent)]">city</span>
                </h1>
                <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                  From a resident&apos;s request to a settled invoice — watch every step happen live on the map.
                </p>
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: cueOpacity }}
              className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
            >
              <motion.div
                className="flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-[0.18em] text-foreground/75"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                Scroll to begin
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.div>

            {/* Step cards — stacked in one grid cell, each scrubbed by its own range */}
            <div className="pointer-events-none absolute inset-x-4 bottom-24 grid sm:inset-x-auto sm:left-1/2 sm:w-[420px] sm:-translate-x-1/2 lg:bottom-auto lg:left-[max(2rem,5vw)] lg:top-1/2 lg:w-[400px] lg:translate-x-0 lg:-translate-y-1/2">
              {STEPS.map((s, i) => (
                <StepCard key={s.id} step={s} index={i} progress={progress} active={i === active} />
              ))}
            </div>

            {/* Step rail */}
            <motion.nav
              aria-label="Story steps"
              style={{ opacity: railOpacity, y: railY }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2"
            >
              <ol className="site-frost flex items-center gap-1 rounded-full p-1.5">
                {STEPS.map((s, i) => {
                  const on = i === active;
                  const done = i < active;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-current={on ? "step" : undefined}
                        aria-label={`Step ${s.number}: ${s.title}`}
                        className="relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent)] focus-visible:ring-offset-2 lg:h-9"
                      >
                        {on && (
                          <motion.span
                            layoutId="hiw-step"
                            className="absolute inset-0 rounded-full bg-[var(--site-accent)]"
                            transition={{ type: "spring", stiffness: 380, damping: 34 }}
                          />
                        )}
                        <span
                          className={`relative font-mono transition-colors duration-300 ${
                            on ? "text-white" : done ? "text-[var(--site-accent)]" : "text-foreground/75"
                          }`}
                        >
                          {s.number}
                        </span>
                        <span
                          className={`relative hidden whitespace-nowrap transition-colors duration-300 xl:inline ${
                            on ? "text-white" : "text-foreground/75"
                          }`}
                        >
                          {s.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </motion.nav>
          </>
        )}
      </div>

      {reduce && (
        <ol className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
          {STEPS.map((s) => (
            <li key={s.id} className="site-frost rounded-3xl p-6">
              <span className="font-mono text-xs text-[var(--site-accent)]">{s.number}</span>
              <h2 className="mt-2 text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
