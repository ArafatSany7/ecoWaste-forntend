import { cn } from "@/lib/utils";

interface MaxWidthWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export function MaxWidthWrapper({ className, children }: MaxWidthWrapperProps) {
  return (
    <div className={cn("mx-auto w-full max-w-screen-xl px-4 md:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}
