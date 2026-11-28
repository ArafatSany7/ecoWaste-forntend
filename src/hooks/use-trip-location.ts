"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { collectorApi, type LocationFix } from "@/api/collector.api";

export type SharingState =
  | { kind: "off" }
  | { kind: "waiting" }
  | { kind: "live"; lastSentAt: number; accuracy: number | null }
  | { kind: "retrying"; lastSentAt: number | null }
  | { kind: "error"; message: string };

export interface VehiclePosition {
  latitude: number;
  longitude: number;
  heading: number | null;
}

const SEND_INTERVAL_MS = 5000;

const GEO_ERRORS: Record<number, string> = {
  1: "Location permission is blocked. Allow location for this site in your browser settings, then reload.",
  2: "GPS signal isn't available. Move to open sky or check that location services are on.",
  3: "Getting a GPS fix is taking too long. Keep this screen open — it will keep trying.",
};

const noopSubscribe = () => () => {};

function toFix(pos: GeolocationPosition): LocationFix {
  const { latitude, longitude, heading, speed, accuracy } = pos.coords;
  const fix: LocationFix = { latitude, longitude };
  if (heading != null && Number.isFinite(heading) && heading >= 0 && heading <= 360) fix.heading = heading;
  if (speed != null && Number.isFinite(speed) && speed >= 0 && speed <= 100) fix.speed = speed;
  if (Number.isFinite(accuracy) && accuracy >= 0) fix.accuracy = accuracy;
  return fix;
}

export function useTripLocation(active: boolean) {
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator !== "undefined" && "geolocation" in navigator,
    () => true,
  );
  const [state, setState] = useState<SharingState>({ kind: "off" });
  const [position, setPosition] = useState<VehiclePosition | null>(null);

  useEffect(() => {
    if (!active || !supported) return;

    let latest: GeolocationPosition | null = null;
    let lastSent: number | null = null;
    let inFlight = false;
    let stopped = false;
    let lock: WakeLockSentinel | null = null;

    const send = async (force = false) => {
      if (!latest || inFlight || stopped) return;
      if (!force && lastSent && Date.now() - lastSent < SEND_INTERVAL_MS) return;
      inFlight = true;
      const pos = latest;
      try {
        await collectorApi.updateLocation(toFix(pos));
        if (stopped) return;
        lastSent = Date.now();
        setState({ kind: "live", lastSentAt: lastSent, accuracy: Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null });
      } catch (err) {
        if (stopped) return;
        const message = (err as { message?: string })?.message ?? "";
        if (/active trip/i.test(message)) {
          setState({ kind: "error", message: "This trip is no longer active, so location sharing stopped." });
          stopped = true;
          navigator.geolocation.clearWatch(watchId);
        } else {
          setState({ kind: "retrying", lastSentAt: lastSent });
        }
      } finally {
        inFlight = false;
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (stopped) return;
        latest = pos;
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          heading: pos.coords.heading != null && Number.isFinite(pos.coords.heading) ? pos.coords.heading : null,
        });
        setState((s) => (s.kind === "off" || s.kind === "error" ? { kind: "waiting" } : s));
        void send();
      },
      (err) => {
        if (!stopped) setState({ kind: "error", message: GEO_ERRORS[err.code] ?? "Couldn't read your location." });
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );

    const timer = window.setInterval(() => void send(), SEND_INTERVAL_MS);

    const acquireLock = async () => {
      try {
        if ("wakeLock" in navigator && document.visibilityState === "visible") {
          lock = await navigator.wakeLock.request("screen");
        }
      } catch {
        lock = null;
      }
    };
    void acquireLock();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void acquireLock();
        void send(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopped = true;
      navigator.geolocation.clearWatch(watchId);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
      void lock?.release().catch(() => {});
      setState({ kind: "off" });
      setPosition(null);
    };
  }, [active, supported]);

  let shown: SharingState = state;
  if (!active) shown = { kind: "off" };
  else if (!supported) shown = { kind: "error", message: "This browser can't share its location. Use Chrome or Safari on your phone." };
  else if (state.kind === "off") shown = { kind: "waiting" };

  return { sharing: shown, position: active ? position : null };
}
