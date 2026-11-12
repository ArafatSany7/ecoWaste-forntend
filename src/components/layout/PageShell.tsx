import { Eyebrow, Reveal, SplitHeading } from "@/components/motion/primitives";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  accentWords?: string[];
  lead?: string;
}

export function PageHero({ eyebrow, title, accentWords, lead }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pb-16 pt-40 md:pt-48 site-grain">
      <div className="pointer-events-none absolute inset-0 site-grid" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-[720px] -translate-x-1/2 rounded-full bg-[oklch(0.88_0.2_128/0.3)] blur-[110px]" />
      <MaxWidthWrapper className="relative z-10 flex flex-col gap-8">
        <Reveal y={16}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <SplitHeading
          as="h1"
          text={title}
          accentWords={accentWords}
          delay={0.1}
          className="max-w-4xl text-5xl font-semibold md:text-7xl"
        />
        {lead && (
          <Reveal delay={0.4} className="max-w-2xl">
            <p className="text-lg leading-relaxed text-muted-foreground">{lead}</p>
          </Reveal>
        )}
      </MaxWidthWrapper>
    </section>
  );
}

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageProps {
  title: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} lead={intro} />
      <MaxWidthWrapper className="pb-32">
        <div className="mx-auto flex max-w-3xl flex-col">
          {sections.map((s, i) => (
            <Reveal key={s.heading} className="grid gap-4 border-t border-[var(--site-line)] py-10 md:grid-cols-[80px_1fr]">
              <span className="font-mono text-sm text-[var(--site-accent)]">0{i + 1}</span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{s.heading}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
          <p className="border-t border-[var(--site-line)] pt-8 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
