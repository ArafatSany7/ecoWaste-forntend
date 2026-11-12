import { PageHero } from "@/components/layout/PageShell";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { Reveal, TiltCard } from "@/components/motion/primitives";

const VALUES = [
  { title: "Transparent", body: "Every request, route and pickup is visible to the people it affects." },
  { title: "Data-driven", body: "Decisions come from live telemetry, not guesswork or paperwork." },
  { title: "Citizen first", body: "Simple tools that make reporting and tracking effortless for everyone." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Building cleaner cities together"
        accentWords={["cleaner", "cities"]}
        lead="EcoWaste is dedicated to transforming urban waste management through intelligent, data-driven solutions. We bridge the gap between citizens and field operators."
      />
      <MaxWidthWrapper className="pb-32">
        <Reveal className="max-w-3xl">
          <p className="text-xl leading-relaxed text-muted-foreground md:text-2xl">
            Founded with the vision of smarter cities, our platform provides real-time route optimization, seamless citizen reporting and comprehensive data analytics for municipalities of all sizes.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.1}>
              <TiltCard className="h-full p-8">
                <span className="font-mono text-xs text-[var(--site-accent)]">0{i + 1}</span>
                <h3 className="mt-10 text-2xl font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </MaxWidthWrapper>
    </>
  );
}
