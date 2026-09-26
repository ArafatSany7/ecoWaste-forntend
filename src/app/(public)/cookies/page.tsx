import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";

export default function CookiesPage() {
  return (
    <MaxWidthWrapper className="py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="prose prose-emerald dark:prose-invert mt-8">
          <p>
            EcoWaste uses cookies to improve your experience.
          </p>
          <h3>Essential Cookies</h3>
          <p>We use essential cookies to manage authentication sessions and maintain security.</p>
          <h3>Analytics Cookies</h3>
          <p>We use analytics cookies to understand how our platform is used so we can improve it.</p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
