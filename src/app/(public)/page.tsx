"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { MapPin, Zap, Truck, ShieldCheck, Route, Users, BarChart3, CreditCard, Lock, Radio } from "lucide-react";
import {
  Reveal,
  SplitHeading,
  Eyebrow,
  TiltCard,
  PillButton,
  Marquee,
} from "@/components/motion/primitives";

const STEPS = [
  {
    number: "01",
    badge: "Citizen intake",
    title: "Citizens report",
    body: "Requests are logged in seconds. Geolocation and photo verification set priority automatically.",
    icon: MapPin,
    detail: "Geo-tagged and photo verified",
    load: 25,
    tint: "oklch(0.97 0.03 150)",
  },
  {
    number: "02",
    badge: "Intelligent dispatch",
    title: "The system routes",
    body: "The dispatch engine clusters pickups and computes the leanest collector routes in real time, cutting fuel use by up to 30%.",
    icon: Zap,
    detail: "Multi-stop route clustered and scheduled",
    load: 50,
    tint: "oklch(0.97 0.04 120)",
  },
  {
    number: "03",
    badge: "Field execution",
    title: "Collectors execute",
    body: "Operators follow live turn-by-turn guidance, update bin status on site and close jobs with timestamped proof.",
    icon: Truck,
    detail: "Collector en route, bin being serviced",
    load: 75,
    tint: "oklch(0.97 0.035 175)",
  },
  {
    number: "04",
    badge: "City analytics",
    title: "Admins monitor",
    body: "Supervisors see live zone telemetry, KPI reports and automated billing audits across the whole municipality.",
    icon: ShieldCheck,
    detail: "Pickup logged, compliance audited",
    load: 100,
    tint: "oklch(0.96 0.05 100)",
  },
];

const FEATURES = [
  { icon: Route, title: "AI-powered routing", body: "Routes adapt to traffic, load and priority so fleets drive less and collect more.", span: "md:col-span-2" },
  { icon: Users, title: "Citizen engagement", body: "Report, request and track pickups through one transparent portal.", span: "" },
  { icon: BarChart3, title: "Data analytics", body: "KPI dashboards and automated compliance reports for city administrators.", span: "" },
  { icon: CreditCard, title: "Seamless payments", body: "Integrated gateway billing with automated invoice management.", span: "md:col-span-2" },
  { icon: Lock, title: "Role-based access", body: "Citizens, collectors and admins each see exactly what they need.", span: "" },
  { icon: Radio, title: "Real-time tracking", body: "Status updates flow from field to citizen instantly. No refresh needed.", span: "" },
];

const STATS = [
  { value: "50+", label: "Cities partnered" },
  { value: "10M+", label: "Tons managed" },
  { value: "99.4%", label: "Grid uptime" },
  { value: "30%", label: "Efficiency gain" },
];

const STATEMENT =
  "We turn the daily chaos of urban waste into a quiet, measurable system where every request is seen, every route is earned and every ton is accounted for.";

function ScrollWord({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [10, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.26em] inline-block">
      {word}
    </motion.span>
  );
}

function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = STATEMENT.split(" ");
  return (
    <section className="relative px-6 py-32 md:py-48">
      <div className="mx-auto max-w-6xl">
        <Eyebrow>Our approach</Eyebrow>
        <p ref={ref} className="mt-10 text-3xl font-medium leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1.6 / words.length;
            return <ScrollWord key={i} word={w} range={[start, Math.min(end, 1)]} progress={scrollYProgress} />;
          })}
        </p>
      </div>
    </section>
  );
}

function ProgressRing({ value, progress }: { value: number; progress: MotionValue<number> }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const draw = useTransform(progress, [0, 1], [c, c * (1 - value / 100)]);
  const count = useTransform(progress, [0, 1], [0, value]);
  const label = useTransform(count, (v) => `${Math.round(v)}%`);
  return (
    <div className="relative flex h-40 w-40 items-center justify-center md:h-52 md:w-52">
      <svg viewBox="0 0 128 128" className="absolute inset-0 -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--site-line)" strokeWidth="8" />
        <motion.circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="var(--site-accent)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          style={{ strokeDashoffset: draw }}
        />
      </svg>
      <div className="text-center">
        <motion.div className="text-4xl font-semibold tracking-tight md:text-5xl">{label}</motion.div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Workflow</div>
      </div>
    </div>
  );
}

function StackCard({
  step,
  index,
  total,
  progress,
}: {
  step: (typeof STEPS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const Icon = step.icon;
  const enterStart = index === 0 ? 0 : (index - 1) / total;
  const enterEnd = index === 0 ? 0.0001 : index / total;
  const leaveStart = index / total;
  const leaveEnd = (index + 1) / total;

  const rawY = useTransform(progress, [enterStart, enterEnd], [index === 0 ? 0 : 108, 0]);
  const y = useTransform(rawY, (v) => `${v}%`);
  const rotateX = useTransform(progress, [leaveStart, leaveEnd], [0, reduce ? 0 : -7]);
  const scale = useTransform(progress, [leaveStart, leaveEnd], [1, reduce ? 1 : 0.92]);
  const veil = useTransform(progress, [leaveStart, leaveEnd], [0, 0.5]);
  const lift = useTransform(progress, [leaveStart, leaveEnd], [0, -24]);
  const ringProgress = useTransform(progress, [enterStart, enterEnd + 0.04], [0, 1], { clamp: true });

  return (
    <motion.article
      style={{ y, rotateX, scale, translateY: lift, zIndex: index, transformOrigin: "50% 0%" }}
      className="absolute inset-0 overflow-hidden rounded-[2rem] border border-[var(--site-line)] shadow-[0_40px_80px_-40px_oklch(0.3_0.06_160/0.4)]"
    >
      <div className="absolute inset-0" style={{ background: step.tint }} />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--site-lime)] opacity-30 blur-3xl" />
      <div className="relative grid h-full gap-6 p-7 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-12">
        <div className="flex flex-col justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--site-accent)] shadow-sm">
              <Icon className="h-5 w-5" />
            </span>
            <span className="rounded-full border border-[var(--site-line)] bg-white/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--site-accent)]">
              {step.badge}
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-semibold tracking-tight md:text-5xl">{step.title}</h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{step.detail}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          <ProgressRing value={step.load} progress={ringProgress} />
          <span className="text-7xl font-semibold leading-none tracking-tighter text-outline md:text-8xl">{step.number}</span>
        </div>
      </div>
      <motion.div style={{ opacity: veil }} className="pointer-events-none absolute inset-0 bg-[var(--background)]" />
    </motion.article>
  );
}

function Story() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const rail = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section id="story" ref={ref} className="relative" style={{ height: "420vh" }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden px-6 pt-24 lg:flex-row lg:items-center lg:gap-16 lg:px-16">
        <div className="pointer-events-none absolute inset-0 site-grid opacity-70" />

        <div className="relative z-10 flex flex-col gap-6 lg:w-[34%]">
          <Eyebrow>How it works</Eyebrow>
          <SplitHeading
            text="From report to resolution"
            accentWords={["resolution"]}
            className="text-4xl font-semibold md:text-6xl"
          />
          <div className="hidden items-center gap-4 lg:flex">
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-[var(--site-line)]">
              <motion.div style={{ width: rail }} className="h-full rounded-full bg-[var(--site-accent)]" />
            </div>
            <span className="font-mono text-xs text-muted-foreground">04</span>
          </div>
        </div>

        <div className="perspective-1200 relative z-10 h-[62vh] w-full lg:h-[68vh] lg:flex-1">
          <div className="relative h-full w-full preserve-3d">
            {STEPS.map((s, i) => (
              <StackCard key={s.number} step={s} index={i} total={STEPS.length} progress={progress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const textY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 160]);
  const textOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const statsY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 80]);
  const orbA = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : -140]);
  const orbB = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 200]);

  return (
    <main className="relative flex flex-col overflow-x-clip">
      <section ref={heroRef} className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 pb-24 pt-32 site-grain">
        <div className="pointer-events-none absolute inset-0 site-grid" />
        <motion.div
          style={{ y: orbA }}
          className="pointer-events-none absolute -left-32 top-1/4 h-[460px] w-[460px] rounded-full bg-[var(--site-lime)] opacity-40 blur-[110px]"
        />
        <motion.div
          style={{ y: orbB }}
          className="pointer-events-none absolute -right-24 top-10 h-[520px] w-[520px] rounded-full bg-[oklch(0.85_0.12_175)] opacity-40 blur-[120px]"
        />

        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 mx-auto w-full max-w-7xl">
          <Reveal y={20}>
            <span className="site-glass inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--site-accent)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--site-accent)]" />
              </span>
              Platform v2.0 is live
            </span>
          </Reveal>

          <SplitHeading
            as="h1"
            text="Smarter waste for sustainable cities"
            accentWords={["sustainable", "cities"]}
            delay={0.15}
            className="mt-8 max-w-5xl text-5xl font-semibold sm:text-6xl md:text-7xl lg:text-[7.5rem]"
          />

          <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <Reveal delay={0.5} className="max-w-md">
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Connect citizens, empower collectors and run urban field service on one intelligent, data-driven platform.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PillButton href="/register">Get started free</PillButton>
                <PillButton href="/#story" variant="ghost">
                  See how it works
                </PillButton>
              </div>
            </Reveal>

            <motion.div style={{ y: statsY }} className="site-glass grid grid-cols-2 gap-x-10 gap-y-6 rounded-3xl p-7 md:min-w-[380px]">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-semibold tracking-tight text-[var(--site-accent)] md:text-4xl">{s.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Marquee items={["Smart routing", "Live tracking", "Zero waste", "Citizen first", "Verified pickups", "Clean cities"]} />

      <Statement />

      <Story />

      <section id="features" className="relative px-6 py-32 md:py-44">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-6">
              <Eyebrow>Capabilities</Eyebrow>
              <SplitHeading
                text="Everything a smart city needs"
                accentWords={["smart", "city"]}
                className="max-w-3xl text-4xl font-semibold md:text-6xl"
              />
            </div>
            <Reveal delay={0.2} className="max-w-sm">
              <p className="text-muted-foreground">
                One unified platform connecting citizens, field teams and municipal administrators in real time.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={(i % 3) * 0.08} className={f.span}>
                  <TiltCard className="h-full min-h-[240px] p-8">
                    <div className="flex h-full flex-col justify-between gap-12">
                      <div className="flex items-start justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--site-line)] bg-[var(--site-accent-soft)] text-[var(--site-accent)] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight">{f.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <Reveal y={60} className="mx-auto max-w-7xl">
          <div className="site-glass site-grain relative overflow-hidden rounded-[2.5rem] px-8 py-20 text-center md:px-20 md:py-28">
            <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[700px] -translate-x-1/2 rounded-full bg-[var(--site-lime)] opacity-40 blur-[110px]" />
            <div className="relative z-10 flex flex-col items-center gap-8">
              <Eyebrow>Join EcoWaste</Eyebrow>
              <SplitHeading
                text="Ready for a cleaner city?"
                accentWords={["cleaner", "city?"]}
                className="justify-center text-4xl font-semibold md:text-7xl"
              />
              <p className="max-w-lg text-muted-foreground">
                Join thousands of citizens and municipalities building a sustainable future together.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <PillButton href="/register">Create free account</PillButton>
                <PillButton href="/contact" variant="ghost">
                  Contact sales
                </PillButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
