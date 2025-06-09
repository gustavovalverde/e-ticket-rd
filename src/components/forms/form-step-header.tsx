"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FormStepHeaderProps {
  currentStep: number;
  title: string;
  onBack?: () => void;
}

export function FormStepHeader({
  currentStep,
  title,
  onBack,
}: FormStepHeaderProps) {
  return (
    <div className="mb-6 flex items-center gap-4">
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
          aria-label="Go back to previous step"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}

      <div className="flex items-center gap-2">
        <div className="text-primary flex items-center gap-1 text-sm font-medium">
          <span className="text-primary">✦</span>
          <span>Form</span>
          <span className="text-muted-foreground">/</span>
          <span>{currentStep}.</span>
        </div>
      </div>

      {title && (
        <h1 className="text-foreground text-xl font-semibold">{title}</h1>
      )}
    </div>
  );
}
