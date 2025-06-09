"use client";

import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  hasError?: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStepId: string;
  className?: string;
  variant?: "default" | "mobile";
}

export function ProgressIndicator({
  steps,
  currentStepId,
  className,
  variant = "default",
}: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId);
  const completedSteps = steps.filter((step) => step.isCompleted).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  if (variant === "mobile") {
    return (
      <div className={cn("w-full space-y-4", className)}>
        {/* Mobile Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedSteps} of {steps.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Current Step Info */}
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{currentStepIndex + 1}</Badge>
            <div>
              {(() => {
                const currentStep =
                  steps.find((_, index) => index === currentStepIndex) || null;
                if (!currentStep) return null;

                return (
                  <>
                    <h3 className="leading-none font-medium">
                      {currentStep.title}
                    </h3>
                    {currentStep.description && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        {currentStep.description}
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>
            Step {currentStepIndex + 1} of {steps.length}
          </span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Desktop Step List */}
      <nav aria-label="Progress" className="space-y-4">
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStepId;
          const isCompleted = step.isCompleted;
          const isPast = index < currentStepIndex;
          const isFuture = index > currentStepIndex;

          // Helper function to determine step icon
          const getStepIcon = () => {
            if (isCompleted) {
              return <CheckCircle className="h-6 w-6 text-green-600" />;
            }
            if (step.hasError) {
              return <AlertCircle className="text-destructive h-6 w-6" />;
            }
            if (isCurrent) {
              return (
                <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium">
                  {index + 1}
                </div>
              );
            }
            return <Circle className="text-muted-foreground h-6 w-6" />;
          };

          // Helper function to determine title class
          const getTitleClass = () => {
            if (isCurrent) return "text-primary";
            if (isCompleted || isPast) return "text-foreground";
            return "text-muted-foreground";
          };

          // Helper function to determine description class
          const getDescriptionClass = () => {
            if (isCurrent) return "text-primary/70";
            return "text-muted-foreground";
          };

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-start gap-4 rounded-lg p-4 transition-colors",
                {
                  "bg-primary/5 border-primary/20 border": isCurrent,
                  "bg-muted/50": isPast && !isCurrent,
                  "opacity-60": isFuture,
                }
              )}
            >
              {/* Step Icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                {getStepIcon()}
              </div>

              {/* Step Content */}
              <div className="min-w-0 flex-1">
                <h3
                  className={cn(
                    "text-sm leading-6 font-medium",
                    getTitleClass()
                  )}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p
                    className={cn(
                      "mt-1 text-sm leading-5",
                      getDescriptionClass()
                    )}
                  >
                    {step.description}
                  </p>
                )}
                {step.hasError && (
                  <p className="text-destructive mt-1 text-sm">
                    Please complete the required fields
                  </p>
                )}
              </div>

              {/* Step Status Badge */}
              <div className="shrink-0">
                {isCompleted && (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800"
                  >
                    Complete
                  </Badge>
                )}
                {isCurrent && !isCompleted && (
                  <Badge variant="secondary">Current</Badge>
                )}
                {step.hasError && <Badge variant="destructive">Error</Badge>}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

// Utility hook for managing step progress
export function useStepProgress(steps: Step[], currentStepId: string) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStepId);
  const completedSteps = steps.filter((step) => step.isCompleted).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const canGoNext = currentStepIndex < totalSteps - 1;
  const canGoPrevious = currentStepIndex > 0;

  const nextStep = canGoNext ? steps[currentStepIndex + 1] : null;
  const previousStep = canGoPrevious ? steps[currentStepIndex - 1] : null;

  return {
    currentStepIndex,
    completedSteps,
    totalSteps,
    progressPercentage,
    canGoNext,
    canGoPrevious,
    nextStep,
    previousStep,
  };
}
