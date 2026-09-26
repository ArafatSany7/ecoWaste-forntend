import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

export default function AboutPage() {
  return (
    <MaxWidthWrapper className="py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About EcoWaste</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          EcoWaste is dedicated to transforming urban waste management through intelligent, data-driven solutions.
          We bridge the gap between citizens and field operators to build cleaner, more sustainable cities.
        </p>
        <div className="prose prose-emerald dark:prose-invert">
          <p>
            Founded with the vision of smarter cities, our platform provides real-time route optimization, seamless citizen reporting, and comprehensive data analytics for municipalities of all sizes.
          </p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
