// Shared scroll timeline for the How it works experience.
// Every visual (camera, truck, route, cards) reads progress 0..1 against these ranges.

export type StepId = "request" | "approve" | "dispatch" | "collect" | "pay";

export interface Step {
  id: StepId;
  number: string;
  title: string;
  body: string;
  range: readonly [number, number];
}

export const STEPS: readonly Step[] = [
  {
    id: "request",
    number: "01",
    title: "Request a pickup",
    body: "A resident pins their address, picks a waste category and books a pickup in under a minute.",
    range: [0.07, 0.23],
  },
  {
    id: "approve",
    number: "02",
    title: "Admin approves",
    body: "The zone admin reviews the request and the platform plots the most efficient route from the depot.",
    range: [0.23, 0.39],
  },
  {
    id: "dispatch",
    number: "03",
    title: "Collector dispatched",
    body: "The nearest collector heads out. Residents follow the truck live as it moves across the city.",
    range: [0.39, 0.69],
  },
  {
    id: "collect",
    number: "04",
    title: "Waste collected",
    body: "The collector arrives, verifies the pickup on-site and marks the bin as cleared.",
    range: [0.69, 0.84],
  },
  {
    id: "pay",
    number: "05",
    title: "Payment confirmed",
    body: "An invoice is issued automatically and settled securely. Everyone gets a receipt.",
    range: [0.84, 1],
  },
] as const;

export const DISPATCH = STEPS[2].range;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Local 0..1 progress of `p` within [a, b]. */
export const segment = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Scroll-scrubbed motion is symmetric, so in-out curves read most natural. */
export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** 0..1 position of the truck along its route for a given story progress. */
export function truckProgress(p: number) {
  return easeInOutSine(segment(p, DISPATCH[0] + 0.01, DISPATCH[1] - 0.03));
}

/** Scroll progress where the intro hands over to step 01. */
export const INTRO_END = STEPS[0].range[0];

export function stepIndexAt(p: number) {
  if (p < INTRO_END) return -1;
  const i = STEPS.findIndex((s) => p < s.range[1]);
  return i === -1 ? STEPS.length - 1 : i;
}
