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
    <footer className="border-t border-slate-200 bg-slate-50 pb-12 pt-16 mt-auto text-slate-600">
      <MaxWidthWrapper>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-sm">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">EcoWaste</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Smarter waste management for smarter cities. Connecting citizens with efficient, transparent field service operations.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{category}</h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-emerald-600 transition-colors duration-150"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EcoWaste Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">Terms</Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
