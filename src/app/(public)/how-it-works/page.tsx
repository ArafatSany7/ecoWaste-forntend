import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "How it works - EcoWaste",
  description:
    "Follow a waste pickup from request to payment on a live city map — request, approval, dispatch, collection and confirmation.",
};

export default function HowItWorksPage() {
  return (
    <main className="relative flex flex-col overflow-x-clip">
      <PageHero
        eyebrow="How it works"
        title="From request to resolution, live"
        accentWords={["live"]}
        lead="An interactive map tour of every pickup is on its way. Scroll through each step as a collector moves across the city."
      />
      <div className="pb-32" />
    </main>
  );
}
