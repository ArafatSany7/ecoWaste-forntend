"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown, MapPin, Zap, Truck, ShieldCheck, Leaf, CheckCircle2 } from "lucide-react";
import { useIsMounted } from "@/lib/three-utils";

/* ─── Lazy R3F Scenes (ssr: false) ─────────────────────────────────── */
const DynamicCanvas = dynamic(
  () => import("@/components/3d/DynamicCanvas"),
  { ssr: false }
);
const EcoScene = dynamic(
  () => import("@/components/3d/EcoScene"),
  { ssr: false }
);
const SmartBinScene = dynamic(
  () => import("@/components/3d/SmartBinScene"),
  { ssr: false }
);

/* ─── Story Step Data ───────────────────────────────────────────────── */
const STORY_DATA = [
  {
    id: 0,
    number: "01",
    tabLabel: "01 Report",
    badge: "Citizen Ingestion",
    title: "Citizens Report",
    body: "Citizens log waste collection requests in seconds. Geolocation and AI image verification validate request priority automatically.",
    color: "#059669",
    bgColor: "rgba(5, 150, 105, 0.08)",
    borderColor: "rgba(5, 150, 105, 0.25)",
    icon: <MapPin className="h-5 w-5" />,
    hudLabel: "CITIZEN SUBMISSION",
    hudDetail: "Request Geo-tagged & Photo Verified",
    hudLoad: "25%",
  },
  {
    id: 1,
    number: "02",
    tabLabel: "02 Route",
    badge: "Intelligent Dispatch",
    title: "System Routes",
    body: "Our dispatch engine computes optimal collector routing in real-time, reducing fuel consumption by up to 30% across the smart grid.",
    color: "#0284c7",
    bgColor: "rgba(2, 132, 199, 0.08)",
    borderColor: "rgba(2, 132, 199, 0.25)",
    icon: <Zap className="h-5 w-5" />,
    hudLabel: "AI DISPATCH ENGINE",
    hudDetail: "Multi-point Route Clustered & Scheduled",
    hudLoad: "50%",
  },
  {
    id: 2,
    number: "03",
    tabLabel: "03 Execute",
    badge: "Field Execution",
    title: "Collectors Execute",
    body: "Field operators receive live GPS turns, update bin collection statuses on-site, and mark jobs done with instant timestamp verification.",
    color: "#0d9488",
    bgColor: "rgba(13, 148, 136, 0.08)",
    borderColor: "rgba(13, 148, 136, 0.25)",
    icon: <Truck className="h-5 w-5" />,
    hudLabel: "FIELD SERVICE OPS",
    hudDetail: "Collector En Route • Smart Bin Servicing",
    hudLoad: "75%",
  },
  {
    id: 3,
    number: "04",
    tabLabel: "04 Monitor",
    badge: "City Analytics & Audit",
    title: "Admins Monitor",
    body: "City supervisors access real-time zone telemetry, KPI reports, and automated billing audits to ensure 99% municipal service reliability.",
    color: "#d97706",
    bgColor: "rgba(217, 119, 6, 0.08)",
    borderColor: "rgba(217, 119, 6, 0.25)",
    icon: <ShieldCheck className="h-5 w-5" />,
    hudLabel: "MUNICIPAL CLEARANCE",
    hudDetail: "Pickup Logged • Compliance KPI Audited",
    hudLoad: "100%",
  },
];

/* ─── Animated Stat Counter ─────────────────────────────────────────── */
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-2"
    >
      <span className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
        {value}
      </span>
      <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Feature Card ──────────────────────────────────────────────────── */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  delay?: number;
}

function FeatureCard({ icon, title, body, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col gap-4 group"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">{body}</p>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function ImmersiveLandingPage() {
  const mounted = useIsMounted();

  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  /* Active step tracking (0, 1, 2, 3) */
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  /* Hero parallax: smooth hardware-accelerated transforms without spring desync */
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY       = useTransform(heroScroll, [0, 1], [0, 140]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);
  const heroCanvasY = useTransform(heroScroll, [0, 1], [0, 70]);

  /* Scroll-driven story (300vh) */
  const { scrollYProgress: storyScroll } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  const binFillSmooth = useSpring(storyScroll, { stiffness: 120, damping: 20 });

  /* Update active step strictly without ghost overlaps */
  useEffect(() => {
    return storyScroll.on("change", (latest) => {
      if (latest < 0.25) setActiveStepIndex(0);
      else if (latest < 0.50) setActiveStepIndex(1);
      else if (latest < 0.75) setActiveStepIndex(2);
      else setActiveStepIndex(3);
    });
  }, [storyScroll]);

  const scrollToStep = (targetRatio: number) => {
    if (!storyRef.current) return;
    const rect = storyRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const sectionStart = rect.top + scrollTop;
    const totalScrollable = storyRef.current.offsetHeight - window.innerHeight;
    const targetY = sectionStart + totalScrollable * targetRatio;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const currentStep = STORY_DATA[activeStepIndex];

  return (
    <main className="flex flex-col min-h-full bg-white text-slate-900 overflow-x-clip">

      {/* ══════════════════════════════════════════════════════════════
          HERO — Modern Light 3D Canvas
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex items-center justify-center min-h-[100dvh] overflow-hidden pt-16 bg-gradient-to-b from-slate-50 via-white to-slate-50"
      >
        {/* Soft background ambient glow blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-200/30 rounded-full blur-3xl opacity-70" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-10 left-1/4 w-[500px] h-[300px] bg-cyan-100/40 rounded-full blur-3xl opacity-60" />
        </div>

        {/* 3D Canvas with smooth depth parallax */}
        {mounted && (
          <motion.div
            style={{ y: heroCanvasY }}
            className="absolute inset-0 z-0 hidden md:block pointer-events-none"
          >
            <DynamicCanvas camera={{ position: [0, 0, 7], fov: 55 }}>
              <EcoScene />
            </DynamicCanvas>
          </motion.div>
        )}

        {/* Hero Content — hardware accelerated, zero spring desync */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto gap-7 will-change-transform"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/80 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            EcoWaste Platform v2.0 • Live
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.0] text-slate-900">
            Smarter Waste <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              for Sustainable Cities
            </span>
          </h1>

          {/* Subtext */}
          <p className="max-w-xl text-base md:text-lg text-slate-600 leading-relaxed font-normal">
            Connect citizens, empower collectors, and streamline urban field service
            operations with an intelligent, data-driven platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-1">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 transition-all"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
            <Link href="#story">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 shadow-xs transition-all"
              >
                See How It Works
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-400"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4 text-emerald-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50/80 border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <StatBadge value="50+" label="Cities Partnered" />
          <StatBadge value="10M+" label="Tons Managed" />
          <StatBadge value="99.4%" label="Grid Uptime" />
          <StatBadge value="30%" label="Efficiency Boost" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SCROLLYTELLING STORY — Clean Light Studio
      ══════════════════════════════════════════════════════════════ */}
      <section
        id="story"
        ref={storyRef}
        className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50"
        style={{ height: "300vh" }}
      >
        {/* Sticky viewport frame */}
        <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-between overflow-hidden px-4 md:px-12 lg:px-20 py-8">

          {/* Left Column — 3D Smart Bin with Studio Lighting & Live Telemetry HUD */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative h-[48%] md:h-full">
            {/* Soft backdrop radial light */}
            <div
              className="absolute inset-0 pointer-events-none transition-colors duration-700"
              style={{
                background: `radial-gradient(ellipse 65% 65% at 50% 50%, ${currentStep.bgColor} 0%, transparent 70%)`,
              }}
            />

            {/* Section Tag */}
            <div className="absolute top-2 left-2 md:top-6 md:left-6 z-10">
              <span
                className="text-xs font-bold uppercase tracking-wider bg-white/90 border border-slate-200/80 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-xs"
                style={{ color: currentStep.color }}
              >
                <span className="w-2 h-2 rounded-full animate-ping" style={{ background: currentStep.color }} />
                Interactive Scrollytelling
              </span>
            </div>

            {/* 3D Smart Bin Canvas */}
            {mounted && (
              <div className="w-full h-full max-h-[320px] md:max-h-[500px]">
                <DynamicCanvas camera={{ position: [0, 0, 5], fov: 48 }}>
                  <SmartBinScene fillProgress={binFillSmooth} />
                </DynamicCanvas>
              </div>
            )}

            {/* Live Telemetry HUD */}
            <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-2 z-10 mt-1 md:mt-2 border border-slate-200/90 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono tracking-wider font-bold" style={{ color: currentStep.color }}>
                  {currentStep.hudLabel}
                </span>
                <span className="font-mono font-bold text-slate-800">
                  CAPACITY: {currentStep.hudLoad}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full overflow-hidden bg-slate-100 border border-slate-200/60">
                <motion.div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: currentStep.hudLoad,
                    background: `linear-gradient(90deg, #0284c7, ${currentStep.color})`,
                  }}
                />
              </div>
              <p className="text-xs font-medium text-slate-500 truncate">
                {currentStep.hudDetail}
              </p>
            </div>
          </div>

          {/* Right Column — Narrative Step Card (Physically impossible to overlap) */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-2 md:px-8 py-2 md:py-0 relative h-[52%] md:h-full">
            <div className="w-full max-w-md flex flex-col gap-5">

              {/* Step Navigation Tabs */}
              <div className="flex items-center justify-between bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 w-full shadow-inner">
                {STORY_DATA.map((s, idx) => {
                  const isActive = activeStepIndex === idx;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollToStep((idx + 0.1) / 4)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all relative"
                      style={{
                        color: isActive ? "#0f172a" : "#64748b",
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-step-tab-white"
                          className="absolute inset-0 bg-white rounded-xl shadow-xs -z-10 border border-slate-200/70"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      {s.tabLabel}
                    </button>
                  );
                })}
              </div>

              {/* Step Card Container with AnimatePresence: guarantees single visible card */}
              <div className="relative w-full min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStepIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full bg-white/95 backdrop-blur-xl rounded-3xl p-7 md:p-8 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                          style={{
                            background: currentStep.bgColor,
                            color: currentStep.color,
                            border: `1px solid ${currentStep.borderColor}`,
                          }}
                        >
                          {currentStep.badge}
                        </span>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
                          style={{
                            background: currentStep.bgColor,
                            color: currentStep.color,
                          }}
                        >
                          {currentStep.icon}
                        </div>
                      </div>

                      <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight" style={{ color: currentStep.color }}>
                        {currentStep.number}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{currentStep.title}</h3>
                      <p className="text-sm md:text-base leading-relaxed text-slate-600">
                        {currentStep.body}
                      </p>
                    </div>

                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">
                        EcoWaste Grid • Step {activeStepIndex + 1} of 4
                      </span>
                      <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: currentStep.color }}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Live Synchronized
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Scroll prompt */}
              <div className="flex items-center justify-between text-xs px-2 text-slate-400 font-medium">
                <span>Scroll to drive narrative</span>
                <span>Click tabs to jump</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 px-6 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full"
            >
              Platform Capabilities
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
            >
              Everything a Smart City Needs
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="max-w-xl text-base text-slate-600"
            >
              A single unified platform connecting citizens, field teams, and municipal administrators in real-time.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              delay={0}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>}
              title="AI-Powered Routing"
              body="Optimise collector routes in real-time based on traffic, load capacity, and priority reports to slash fuel consumption."
            />
            <FeatureCard
              delay={0.1}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
              title="Citizen Engagement"
              body="Allow citizens to report issues, request special pickups, and track resolution status transparently through a unified portal."
            />
            <FeatureCard
              delay={0.2}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
              title="Data Analytics"
              body="Comprehensive dashboards for city admins to track KPIs, monitor sustainability goals, and generate automated compliance reports."
            />
            <FeatureCard
              delay={0.3}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
              title="Seamless Payments"
              body="Integrated SSLCommerz payment gateway for frictionless waste service billing and automated invoice management."
            />
            <FeatureCard
              delay={0.4}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
              title="Role-Based Access"
              body="Granular permission control for Citizens, Collectors, and Admins — every user sees exactly what they need."
            />
            <FeatureCard
              delay={0.5}
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
              title="Real-Time Tracking"
              body="Live status updates propagate instantly from field collectors back to citizens and admins — zero manual refresh needed."
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-10 md:p-16 text-center flex flex-col items-center gap-7 bg-gradient-to-tr from-emerald-600 via-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-600/20"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/15 border border-white/20 shadow-md">
              <Leaf className="w-8 h-8 text-white" />
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Ready for a Cleaner City?
              </h2>
              <p className="text-base md:text-lg max-w-lg mx-auto text-emerald-50">
                Join thousands of citizens and municipalities already building a sustainable future with EcoWaste.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-full text-sm font-bold bg-white text-emerald-800 shadow-lg hover:bg-emerald-50 transition-all"
                >
                  Create Free Account
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 rounded-full text-sm font-bold text-white border border-white/30 hover:bg-white/10 transition-all"
                >
                  Contact Sales
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
