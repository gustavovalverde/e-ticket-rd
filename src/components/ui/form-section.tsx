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
        <h3
          className={cn(
            "text-lg leading-none font-semibold tracking-tight",
            // Consistent asterisk styling matching FormField
            required &&
              "after:text-destructive after:ml-0.5 after:content-['*']"
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
