import Link from "next/link";
import { Leaf } from "lucide-react";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

const FOOTER_LINKS = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ],
  Company: [
    { name: "About", href: "#about" },
    { name: "Sustainability", href: "#sustainability" },
    { name: "Careers", href: "#careers" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 pb-8 pt-16 mt-auto">
      <MaxWidthWrapper>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                EcoWaste
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Smarter waste management for smarter cities. Connecting citizens with efficient, transparent field service operations.
            </p>
          </div>

          
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h3 className="font-semibold text-foreground">{category}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EcoWaste Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
}
