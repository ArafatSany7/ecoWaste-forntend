"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { name: "How It Works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
  { name: "Roles", href: "#roles" },
  { name: "Sustainability", href: "#sustainability" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <div className="bg-primary p-1.5 rounded-lg">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              EcoWaste
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <div className="h-4 w-px bg-border"></div>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md hover:bg-accent hover:text-accent-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col border-l-0 sm:max-w-xs">
                <SheetHeader className="border-b pb-4 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg">
                      <Leaf className="h-5 w-5 text-primary-foreground" />
                    </div>
                    EcoWaste
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 py-6">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="mt-4 flex flex-col gap-3">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full justify-start rounded-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
