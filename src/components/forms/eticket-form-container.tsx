"use client";

import { AlertTriangle, CheckCircle, Loader2, RotateCcw } from "lucide-react";
import { useState, useCallback, useEffect, useMemo } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { MultiStepForm } from "./multi-step-form";
import { SuccessPage } from "./success-page";

import type { ApplicationData } from "@/lib/schemas/forms";

// Enhanced type safety patterns
interface FormContainerProps {
  initialData?: Partial<ApplicationData>;
  onComplete?: (data: ApplicationData) => void;
  className?: string;
  config?: FormContainerConfig;
}

interface FormContainerConfig {
  enableAutosave?: boolean;
  showApplicationCode?: boolean;
  maxRetries?: number;
  onError?: (error: Error) => void;
  enableDraftRecovery?: boolean;
}

interface FormState {
  isSubmitted: boolean;
  submittedData: ApplicationData | null;
  isSubmitting: boolean;
  submitError: string | null;
  applicationCode: string;
  retryCount: number;
}

// Default configuration following design system patterns
const DEFAULT_CONFIG: Required<FormContainerConfig> = {
  enableAutosave: true,
  showApplicationCode: true,
  maxRetries: 3,
  onError: () => {},
  enableDraftRecovery: true,
};

export function FormContainer({
  initialData,
  onComplete,
  className,
  config = {},
}: FormContainerProps = {}) {
  // Merge with default configuration (memoized to prevent useCallback re-creation)
  const formConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  // Enhanced state management with proper typing
  const [formState, setFormState] = useState<FormState>({
    isSubmitted: false,
    submittedData: null,
    isSubmitting: false,
    submitError: null,
    applicationCode: "", // Will be generated client-side to avoid hydration mismatch
    retryCount: 0,
  });

  // Generate application code only on client to avoid hydration mismatch
  useEffect(() => {
    if (!formState.applicationCode) {
      setFormState((prev) => ({
        ...prev,
        applicationCode: `ETK${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      }));
    }
  }, [formState.applicationCode]);

  // Enhanced form submission with error handling and retry logic
  const handleFormSubmit = useCallback(
    async (data: ApplicationData) => {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
        submitError: null,
      }));

      try {
        // Simulate API call with potential failure for demo
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate 10% failure rate for testing
            if (
              Math.random() < 0.1 &&
              formState.retryCount < formConfig.maxRetries
            ) {
              reject(new Error("Network error. Please try again."));
            } else {
              resolve(data);
            }
          }, 1000);
        });

        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          isSubmitted: true,
          submittedData: data,
          retryCount: 0,
        }));

        // Call completion callback if provided
        onComplete?.(data);

        // In a real app, this would submit to the backend
        // eslint-disable-next-line no-console
        console.log("Form submitted:", data);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Submission failed. Please try again.";

        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          submitError: errorMessage,
          retryCount: prev.retryCount + 1,
        }));

        // Call error callback if provided
        formConfig.onError(
          error instanceof Error ? error : new Error(errorMessage)
        );
      }
    },
    [formState.retryCount, formConfig, onComplete]
  );

  // Enhanced reset function with error state cleanup
  const resetForm = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      isSubmitted: false,
      submittedData: null,
      submitError: null,
      retryCount: 0,
    }));

    if (formConfig.enableDraftRecovery) {
      localStorage.removeItem("eticket-draft");
    }
  }, [formConfig.enableDraftRecovery]);

  // Retry submission function
  const retrySubmission = useCallback(() => {
    if (formState.submittedData) {
      handleFormSubmit(formState.submittedData);
    }
  }, [formState.submittedData, handleFormSubmit]);

  // Dismiss error function
  const dismissError = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      submitError: null,
    }));
  }, []);

  // Success page with accessibility improvements
  if (formState.isSubmitted && formState.submittedData) {
    return (
      <div role="main" aria-labelledby="success-heading" className={className}>
        <SuccessPage
          submittedData={formState.submittedData}
          applicationCode={formState.applicationCode}
          onReset={resetForm}
        />
      </div>
    );
  }

  // Main form with enhanced error handling and accessibility
  return (
    <div role="main" aria-labelledby="form-heading" className={className}>
      {/* Error Alert using shadcn Alert component */}
      {formState.submitError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Submission Error</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{formState.submitError}</p>
            <div className="flex items-center gap-2">
              {formState.retryCount < formConfig.maxRetries &&
                formState.submittedData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={retrySubmission}
                    disabled={formState.isSubmitting}
                    className="gap-2"
                  >
                    {formState.isSubmitting ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3 w-3" />
                    )}
                    Retry Submission
                  </Button>
                )}
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissError}
                className="text-destructive hover:text-destructive"
              >
                Dismiss
              </Button>
            </div>
            {formState.retryCount >= formConfig.maxRetries && (
              <p className="text-sm">
                Maximum retry attempts reached. Please check your connection and
                try again later.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Success notification for form recovery */}
      {formConfig.enableDraftRecovery && initialData && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Draft Recovered</AlertTitle>
          <AlertDescription>
            We&apos;ve restored your previous application data. You can continue
            where you left off.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form Component */}
      <MultiStepForm
        onSubmit={handleFormSubmit}
        applicationCode={
          formConfig.showApplicationCode ? formState.applicationCode : undefined
        }
        initialData={initialData}
      />
    </div>
  );
}
