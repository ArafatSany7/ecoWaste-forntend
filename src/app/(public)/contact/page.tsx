import { MaxWidthWrapper } from "@/components/layout/MaxWidthWrapper";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <MaxWidthWrapper className="py-24">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Interested in deploying EcoWaste in your city? Reach out to our team.
          </p>
        </div>
        
        <form className="space-y-6 mt-8 p-8 border rounded-3xl bg-card shadow-soft dark:shadow-soft-dark">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input type="text" className="w-full h-10 px-3 rounded-md border bg-background" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input type="email" className="w-full h-10 px-3 rounded-md border bg-background" placeholder="jane@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <textarea className="w-full p-3 rounded-md border bg-background min-h-[120px]" placeholder="How can we help?"></textarea>
          </div>
          <Button className="w-full" size="lg">Send Message</Button>
        </form>
      </div>
    </MaxWidthWrapper>
  );
}
