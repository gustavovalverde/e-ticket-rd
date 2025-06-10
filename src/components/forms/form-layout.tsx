"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Steps } from "@/components/pro-blocks/application/buttons/button-9";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface FormStep {
  icon: React.ElementType;
  label: string;
}

interface FormLayoutProps {
  children: ReactNode;
  steps: FormStep[];
  currentStep: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onContinue: () => void;
  onStepChange?: (step: number) => void;
  continueLabel?: string;
  backLabel?: string;
  canContinue?: boolean;
  showStepIndicator?: boolean;
  className?: string;
}

export function FormLayout({
  children,
  steps,
  currentStep,
  title,
  subtitle,
  onBack,
  onContinue,
  onStepChange,
  continueLabel = "Continue",
  backLabel = "Back",
  canContinue = true,
  showStepIndicator = true,
  className,
}: FormLayoutProps) {
  const handleStepChange = (step: number) => {
    if (onStepChange) {
      onStepChange(step);
    }
  };

  return (
    <div className={cn("bg-background min-h-screen", className)}>
      <div className="container-padding-x section-padding-y container mx-auto max-w-3xl">
        {/* Step Progress Indicator using Pro Block */}
        {showStepIndicator && (
          <Steps
            steps={steps}
            activeStep={currentStep}
            onStepChange={handleStepChange}
          />
        )}

        {/* Main Content Card */}
        <Card className="bg-card border-border">
          {/* Header using design system classes */}
          <div className="border-border bg-card container-padding-x border-b py-6">
            <div className="section-title-gap-sm">
              <h1 className="heading-md text-card-foreground">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Form Content */}
          <CardContent className="container-padding-x section-padding-y">
            {children}
          </CardContent>

          {/* Navigation Footer */}
          <div className="border-border bg-muted/20 container-padding-x border-t py-6">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <div>
                {onBack ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-foreground gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel}
                  </Button>
                ) : (
                  <div /> // Spacer for alignment
                )}
              </div>

              {/* Continue Button */}
              <Button
                type="submit"
                onClick={onContinue}
                disabled={!canContinue}
                className="min-w-32 gap-2"
                size="lg"
              >
                {continueLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
