import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

export default function SustainabilityPage() {
  return (
    <MaxWidthWrapper className="py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Our Impact & Sustainability</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Sustainability is at the core of everything we do. By optimizing collection routes and empowering citizens, we significantly reduce the carbon footprint of urban waste operations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
          <div className="p-6 border rounded-2xl bg-card shadow-soft dark:shadow-soft-dark">
            <h3 className="text-2xl font-bold mb-2 text-primary">30% Less Emissions</h3>
            <p className="text-muted-foreground">Through AI-powered route optimization, fleets spend less time idling and driving unnecessary miles.</p>
          </div>
          <div className="p-6 border rounded-2xl bg-card shadow-soft dark:shadow-soft-dark">
            <h3 className="text-2xl font-bold mb-2 text-primary">Higher Recycling</h3>
            <p className="text-muted-foreground">Better citizen engagement leads to better sorting and higher recycling rates across partnered cities.</p>
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
