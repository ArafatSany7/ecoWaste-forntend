"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Leaf } from "lucide-react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { PillButton, EASE_OUT } from "@/components/motion/primitives";

const NAV_LINKS = [
  { name: "How it works", href: "/#story" },
  { name: "Features", href: "/#features" },
  { name: "About", href: "/about" },
  { name: "Sustainability", href: "/sustainability" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "px-4 pt-3" : "px-0 pt-0"
        }`}
      >
        <div
          className={`w-full border backdrop-blur-xl backdrop-saturate-150 transition-[max-width,border-radius,background-color,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled
              ? "max-w-5xl rounded-[28px] border-[var(--site-line)] bg-white/70 shadow-[0_12px_40px_-16px_oklch(0.3_0.06_160/0.3)]"
              : "max-w-[100vw] rounded-none border-transparent border-b-[var(--site-line)] bg-white/30 shadow-none"
          }`}
        >
        <div
          className={`mx-auto flex w-full max-w-6xl items-center justify-between transition-[height,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled ? "h-14 pl-4 pr-1.5" : "h-16 px-5"
          }`}
        >
          <Link href="/" className="group flex items-center gap-2.5" aria-label="EcoWaste home">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--site-accent)] text-white">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">EcoWaste</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const current = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {link.name}
                  <span
                    className={`absolute inset-x-4 bottom-1 h-px origin-left bg-[var(--site-accent)] transition-transform duration-500 ${
                      current ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="min-h-11 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Log out
                </button>
                <PillButton href="/dashboard">Dashboard</PillButton>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Log in
                </Link>
                <PillButton href="/register">Get started</PillButton>
              </>
            )}
          </div>

          <button
            className="site-glass flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[var(--background)] px-8 pb-10 pt-28 lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.6, ease: EASE_OUT }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-4xl font-semibold tracking-tight transition-colors hover:text-[var(--site-accent)]"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <>
                  <PillButton href="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </PillButton>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="min-h-11 rounded-full border border-[var(--site-line)] px-6 text-sm font-medium"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <PillButton href="/register" onClick={() => setOpen(false)}>
                    Get started
                  </PillButton>
                  <PillButton href="/login" variant="ghost" onClick={() => setOpen(false)}>
                    Log in
                  </PillButton>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
