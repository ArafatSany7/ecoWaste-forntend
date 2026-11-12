import { PageHero } from "@/components/layout/PageShell";
import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { Reveal } from "@/components/motion/primitives";

const FIELD =
  "min-h-12 w-full rounded-2xl border border-[var(--site-line)] bg-white/70 px-4 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/60 focus:border-[var(--site-accent)] focus:bg-white focus:ring-4 focus:ring-[var(--site-accent-soft)]";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your city"
        accentWords={["your", "city"]}
        lead="Interested in deploying EcoWaste in your city? Reach out to our team."
      />
      <MaxWidthWrapper className="pb-32">
        <Reveal className="mx-auto max-w-2xl">
          <form className="site-glass flex flex-col gap-6 rounded-3xl p-8 md:p-10">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input id="name" type="text" className={FIELD} placeholder="Jane Doe" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input id="email" type="email" className={FIELD} placeholder="jane@example.com" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea id="message" className={`${FIELD} min-h-36 py-3`} placeholder="How can we help?" />
            </div>
            <button
              type="submit"
              className="min-h-12 rounded-full bg-[var(--site-accent)] px-8 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Send message
            </button>
          </form>
        </Reveal>
      </MaxWidthWrapper>
    </>
  );
}
