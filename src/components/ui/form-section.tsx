"use client";

import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  required = false,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-lg leading-none font-semibold tracking-tight">
          {title}
          {required && (
            <span
              className="text-destructive text-sm"
              aria-label="Required section"
            >
              *
            </span>
          )}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
