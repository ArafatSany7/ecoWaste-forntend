import { LegalPage } from "@/components/layout/PageShell";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="Welcome to EcoWaste. By using our platform, you agree to these terms of service."
      sections={[
        { heading: "User responsibilities", body: "Users must provide accurate information when reporting issues and adhere to community guidelines." },
        { heading: "Service availability", body: "While we strive for 99.9% uptime, services may occasionally be impacted by maintenance or external factors." },
      ]}
    />
  );
}
