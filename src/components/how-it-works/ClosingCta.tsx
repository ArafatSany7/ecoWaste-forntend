import { Eyebrow, PillButton, Reveal, SplitHeading } from "@/components/motion/primitives";
import { STEPS } from "./story";

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden px-6 pb-32 pt-24 md:pb-44 md:pt-32">
      <div className="pointer-events-none absolute inset-0 site-grid opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-[640px] -translate-x-1/2 rounded-full bg-[oklch(0.88_0.2_128/0.28)] blur-[110px]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        <Reveal y={16}>
          <Eyebrow>Your turn</Eyebrow>
        </Reveal>
        <SplitHeading
          text="Book your first pickup in under a minute"
          accentWords={["first", "pickup"]}
          className="text-4xl font-semibold md:text-6xl"
        />
        <Reveal delay={0.2} className="max-w-xl">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Request, track and pay for waste collection from one place — and follow every truck live, just like you did here.
          </p>
        </Reveal>
        <Reveal delay={0.3} className="flex flex-wrap items-center justify-center gap-4">
          <PillButton href="/register">Get started free</PillButton>
          <PillButton href="/contact" variant="ghost">
            Talk to us
          </PillButton>
        </Reveal>

        <Reveal delay={0.4} className="mt-8 w-full">
          <ol className="grid grid-cols-2 gap-3 text-left sm:grid-cols-3 md:grid-cols-5">
            {STEPS.map((s) => (
              <li key={s.id} className="site-frost rounded-2xl px-4 py-3">
                <span className="font-mono text-[11px] text-[var(--site-accent)]">{s.number}</span>
                <div className="mt-1 text-sm font-medium leading-snug">{s.title}</div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
