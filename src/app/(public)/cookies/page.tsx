import { LegalPage } from "@/components/layout/PageShell";

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="EcoWaste uses cookies to improve your experience."
      sections={[
        { heading: "Essential cookies", body: "We use essential cookies to manage authentication sessions and maintain security." },
        { heading: "Analytics cookies", body: "We use analytics cookies to understand how our platform is used so we can improve it." },
      ]}
    />
  );
}
