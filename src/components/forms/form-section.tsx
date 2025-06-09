"use client";

import StyledShell from "@/components/pro-blocks/styled-shell";
import { Button } from "@/components/ui/button";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: "outline" | "ghost" | "destructive";
  };
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  className,
}: FormSectionProps) {
  return (
    <StyledShell className={className}>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-card-foreground mb-1 text-lg font-semibold">
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="mb-8 space-y-6">{children}</div>

      {/* Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <div className="border-border flex justify-end gap-3 border-t pt-4">
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "outline"}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </StyledShell>
  );
}
