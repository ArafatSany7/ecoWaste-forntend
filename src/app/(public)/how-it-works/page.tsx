import type { Metadata } from "next";
import { HowItWorksExperience } from "@/components/how-it-works/Experience";
import { ClosingCta } from "@/components/how-it-works/ClosingCta";

export const metadata: Metadata = {
  title: "How it works - EcoWaste",
  description:
    "Follow a waste pickup from request to payment on a live city map — request, approval, dispatch, collection and confirmation.",
};

export default function HowItWorksPage() {
  return (
    <main className="relative flex flex-col overflow-x-clip">
      <HowItWorksExperience />
      <ClosingCta />
    </main>
  );
}
