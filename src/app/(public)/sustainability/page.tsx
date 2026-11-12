import { PageHero } from "@/components/layout/PageShell";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { Reveal, TiltCard } from "@/components/motion/primitives";

const IMPACT = [
  { stat: "30%", title: "Less emissions", body: "Through AI-powered route optimization, fleets spend less time idling and driving unnecessary miles." },
  { stat: "2x", title: "Higher recycling", body: "Better citizen engagement leads to better sorting and higher recycling rates across partnered cities." },
];

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact"
        title="Sustainability at the core"
        accentWords={["Sustainability"]}
        lead="By optimizing collection routes and empowering citizens, we significantly reduce the carbon footprint of urban waste operations."
      />
      <MaxWidthWrapper className="pb-32">
        <div className="grid gap-5 md:grid-cols-2">
          {IMPACT.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <TiltCard className="h-full p-10">
                <div className="text-7xl font-semibold tracking-tighter text-[var(--site-accent)] md:text-8xl">{c.stat}</div>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{c.body}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </MaxWidthWrapper>
    </>
  );
}
