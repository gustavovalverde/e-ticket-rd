"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Steps } from "@/components/pro-blocks/application/buttons/button-9";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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

        {/* Main Content Card - Following shadcn pro-block pattern */}
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </CardHeader>

          <CardContent className="space-y-8">{children}</CardContent>

          <CardFooter className="flex items-center justify-between">
            {/* Back Button */}
            {onBack ? (
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Button>
            ) : (
              <div /> // Spacer for alignment
            )}

            {/* Continue Button */}
            <Button
              type="submit"
              onClick={onContinue}
              disabled={!canContinue}
              className="gap-2"
            >
              {continueLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
