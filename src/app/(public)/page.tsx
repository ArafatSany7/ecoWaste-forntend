import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, BarChart3, Users, ArrowRight, CheckCircle2, ShieldCheck, Zap, Leaf } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-full">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <MaxWidthWrapper>
          <div className="flex flex-col items-center justify-center text-center gap-8">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary">
              <span className="flex gap-2 items-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                EcoWaste System v2.0 Live
              </span>
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl">
              Smarter Waste Management for <br className="hidden sm:block" />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">Sustainable Cities</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Connect citizens, empower collectors, and streamline urban field service operations with our intelligent, data-driven platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 w-full sm:w-auto">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-8 w-full sm:w-auto gap-2">
                  Start Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="rounded-full px-8 w-full sm:w-auto">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-muted/30 border-y">
        <MaxWidthWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col gap-2">
              <h4 className="text-4xl font-bold text-foreground">50+</h4>
              <p className="text-sm text-muted-foreground font-medium">Cities Partnered</p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-4xl font-bold text-foreground">10M+</h4>
              <p className="text-sm text-muted-foreground font-medium">Tons Managed</p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-4xl font-bold text-foreground">99%</h4>
              <p className="text-sm text-muted-foreground font-medium">Uptime</p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-4xl font-bold text-foreground">30%</h4>
              <p className="text-sm text-muted-foreground font-medium">Efficiency Boost</p>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* FEATURES GRID SECTION */}
      <section id="features" className="py-24 bg-background">
        <MaxWidthWrapper>
          <div className="flex flex-col items-center text-center gap-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
            <p className="max-w-2xl text-muted-foreground">
              Everything a modern city needs to handle waste management efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-soft dark:shadow-soft-dark border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Navigation className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Routing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Optimize collector routes in real-time based on traffic, load capacity, and priority reports to reduce fuel consumption.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-soft dark:shadow-soft-dark border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Citizen Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Allow citizens to report issues, request special pickups, and track resolution status transparently through a unified portal.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-soft dark:shadow-soft-dark border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Data Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Comprehensive dashboards for city admins to track KPIs, monitor sustainability goals, and generate automated compliance reports.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <MaxWidthWrapper>
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl font-bold">How EcoWaste Works</h2>
              <p className="text-lg text-muted-foreground">
                Our platform creates a seamless loop between citizens reporting issues and collectors resolving them, monitored by city administrators.
              </p>
              <ul className="flex flex-col gap-6 mt-4">
                <li className="flex gap-4">
                  <div className="bg-background shadow-sm border h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Citizens Report</h4>
                    <p className="text-muted-foreground">Users submit waste collection requests with location data and photos.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-background shadow-sm border h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">System Routes</h4>
                    <p className="text-muted-foreground">The system automatically assigns and optimizes routes for field collectors.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-background shadow-sm border h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Collectors Execute</h4>
                    <p className="text-muted-foreground">Collectors use the mobile app to navigate and mark jobs as complete.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-background shadow-sm border h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Admins Monitor</h4>
                    <p className="text-muted-foreground">City officials review analytics and ensure operations run smoothly.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="w-full lg:w-1/2 bg-card rounded-2xl shadow-soft dark:shadow-soft-dark border p-8 h-[500px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
              <div className="flex flex-col gap-4 w-full max-w-sm z-10">
                <div className="bg-background rounded-xl p-4 shadow-sm border flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <ShieldCheck className="h-8 w-8 text-emerald-500" />
                  <div>
                    <p className="font-medium">Request Verified</p>
                    <p className="text-xs text-muted-foreground">2 mins ago</p>
                  </div>
                </div>
                <div className="bg-background rounded-xl p-4 shadow-sm border flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="font-medium">Route Optimized</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <div className="bg-background rounded-xl p-4 shadow-sm border flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  <CheckCircle2 className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">Pickup Completed</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <MaxWidthWrapper className="relative z-10">
          <div className="flex flex-col items-center justify-center text-center gap-8 max-w-3xl mx-auto bg-card p-12 rounded-3xl border shadow-soft dark:shadow-soft-dark">
            <Leaf className="h-12 w-12 text-primary" />
            <h2 className="text-3xl md:text-5xl font-bold">Ready for a Cleaner City?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of citizens and municipalities already using EcoWaste to build a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-8 w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="rounded-full px-8 w-full sm:w-auto">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </main>
  );
}
