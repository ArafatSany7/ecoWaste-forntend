import Link from "next/link";
import { Leaf } from "lucide-react";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

const FOOTER_LINKS = {
  Product: [
    { name: "Features", href: "/#features" },
    { name: "How it works", href: "/#story" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Contact", href: "/contact" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--site-line)] pt-20">
      <MaxWidthWrapper>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex max-w-sm flex-col gap-5">
            <Link href="/" className="flex w-fit items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--site-accent)] text-white">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="text-lg font-semibold tracking-tight">EcoWaste</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Smarter waste management for smarter cities. Connecting citizens with efficient, transparent field service operations.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--site-accent)]">{category}</h3>
              <ul className="flex flex-col gap-1">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex min-h-9 items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:translate-x-1 hover:text-foreground"
                    >
                      <span className="h-px w-0 bg-[var(--site-accent)] transition-all duration-300 group-hover:w-3" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 select-none text-center text-[22vw] font-semibold leading-[0.8] tracking-tighter text-outline opacity-60 lg:text-[16rem]">
          EcoWaste
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--site-line)] py-8 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} EcoWaste Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            <Link href="/cookies" className="transition-colors hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
