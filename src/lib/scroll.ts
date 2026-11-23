import type Lenis from "lenis";

// Shared handle to the page's Lenis instance so navigation can bypass smooth scrolling.

let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Jump straight to a position or element with no smooth-scroll animation. */
export function scrollInstant(target: number | HTMLElement) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: true, force: true });
    return;
  }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "instant" });
}

/** Jump to `#hash` (or the top when empty), waiting a few frames for the element to mount. */
export function jumpToHash(hash: string, attempts = 30) {
  if (!hash) {
    scrollInstant(0);
    return;
  }
  const el = document.getElementById(hash);
  if (el) {
    scrollInstant(el);
    return;
  }
  if (attempts > 0) requestAnimationFrame(() => jumpToHash(hash, attempts - 1));
}
