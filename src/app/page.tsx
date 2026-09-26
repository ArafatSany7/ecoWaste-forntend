import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center py-24">
        <MaxWidthWrapper>
          <div className="flex flex-col items-center justify-center text-center gap-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
              Smarter Waste Management for <br className="hidden sm:block" />
              <span className="text-primary">Sustainable Cities</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Connect citizens, empower collectors, and streamline urban field service operations with EcoWaste&apos;s intelligent platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Button size="lg" className="rounded-full px-8">Get Started</Button>
              <Button variant="outline" size="lg" className="rounded-full px-8">Learn More</Button>
            </div>
            
            <div className="mt-16 w-full p-8 rounded-2xl bg-card border shadow-soft dark:shadow-soft-dark text-card-foreground">
              This is a soft shadowed card representing a feature placeholder.
            </div>
          </div>
        </MaxWidthWrapper>
      </main>
      <Footer />
    </>
  );
}
