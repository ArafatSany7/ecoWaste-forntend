import { LegalPage } from "@/components/layout/PageShell";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="At EcoWaste, we take your privacy seriously. This page represents our commitment to safeguarding your data."
      sections={[
        { heading: "Data collection", body: "We collect location data only when you actively submit a waste report to facilitate accurate pickups." },
        { heading: "Data usage", body: "Your data is used strictly for operational purposes and aggregated analytics to improve city sustainability." },
      ]}
    />
  );
}
