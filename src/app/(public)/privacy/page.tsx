import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

export default function PrivacyPage() {
  return (
    <MaxWidthWrapper className="py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-emerald dark:prose-invert mt-8">
          <p>
            At EcoWaste, we take your privacy seriously. This stub page represents our commitment to safeguarding your data.
          </p>
          <h3>Data Collection</h3>
          <p>We collect location data only when you actively submit a waste report to facilitate accurate pickups.</p>
          <h3>Data Usage</h3>
          <p>Your data is used strictly for operational purposes and aggregated analytics to improve city sustainability.</p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
