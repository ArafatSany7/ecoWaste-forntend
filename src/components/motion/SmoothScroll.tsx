"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scroll";

export function SmoothScroll() {
  // A reload always starts at the top: skip the browser's scroll restoration for that one
  // navigation only, so back/forward still return you to where you were.
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "reload") {
      if (window.location.hash) {
        window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    window.history.scrollRestoration = "auto";
    const beforeUnload = () => {
      window.history.scrollRestoration = "manual";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: true,
      stopInertiaOnNavigate: true,
    });
    registerLenis(lenis);
    document.documentElement.classList.add("lenis");
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      registerLenis(null);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);
  return null;
}
