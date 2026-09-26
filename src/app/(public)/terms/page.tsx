import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

export default function TermsPage() {
  return (
    <MaxWidthWrapper className="py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-emerald dark:prose-invert mt-8">
          <p>
            Welcome to EcoWaste. By using our platform, you agree to these terms of service.
          </p>
          <h3>User Responsibilities</h3>
          <p>Users must provide accurate information when reporting issues and adhere to community guidelines.</p>
          <h3>Service Availability</h3>
          <p>While we strive for 99.9% uptime, services may occasionally be impacted by maintenance or external factors.</p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
