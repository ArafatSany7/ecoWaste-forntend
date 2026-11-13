import { ReactNode } from "react";
import { Eyebrow, SplitHeading } from "@/components/motion/primitives";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow = "Dashboard", title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SplitHeading as="h1" text={title} className="text-3xl font-semibold md:text-5xl" />
        {description && <p className="max-w-xl text-sm text-muted-foreground md:text-base">{description}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
