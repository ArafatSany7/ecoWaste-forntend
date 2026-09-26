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
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        {children}
      </div>
      <Footer />
    </>
  );
}
