import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* No top padding on the landing page — hero is full viewport with fixed navbar overlay */}
      <div className="flex flex-col min-h-screen bg-white text-slate-900">
        {children}
      </div>
      <Footer />
    </>
  );
}
