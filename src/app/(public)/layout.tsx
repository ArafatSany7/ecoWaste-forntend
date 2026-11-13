import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/primitives";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site relative flex min-h-screen flex-col">
      <SmoothScroll />
      <ScrollProgress />
      <Navbar />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
