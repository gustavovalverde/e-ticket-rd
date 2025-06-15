import { AlertCircle, X } from "lucide-react";
import React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/lib/utils/form-utils";

interface ValidationErrorProps {
  error?: unknown;
  errors?: unknown[];
  title?: string;
  className?: string;
  variant?: "inline" | "alert" | "toast";
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function ValidationError({
  error,
  errors = [],
  title = "Validation Error",
  className,
  variant = "inline",
  dismissible = false,
  onDismiss,
}: ValidationErrorProps) {
  // Normalize errors into a single array
  const allErrors = React.useMemo(() => {
    const errorList: unknown[] = [];

    if (error) {
      errorList.push(error);
    }

    if (errors.length > 0) {
      errorList.push(...errors);
    }

    return errorList;
  }, [error, errors]);

  // If no errors, don't render anything
  if (allErrors.length === 0) {
    return null;
  }

  // Extract error messages
  const errorMessages = allErrors.map((err) => getErrorMessage(err));

  if (variant === "inline") {
    return (
      <div
        className={cn("text-destructive space-y-1 text-sm", className)}
        role="alert"
      >
        {errorMessages.map((message, index) => (
          <p key={index} className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{message}</span>
          </p>
        ))}
      </div>
    );
  }

  if (variant === "alert") {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="hover:bg-destructive/20 absolute top-2 right-2 rounded-sm p-1 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <AlertDescription>
          {errorMessages.length === 1 ? (
            <p>{errorMessages[0]}</p>
          ) : (
            <div>
              <p className="mb-2 font-medium">{title}</p>
              <ul className="space-y-1">
                {errorMessages.map((message, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-destructive">•</span>
                    <span>{message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Toast variant (for use with toast libraries)
  return (
    <div
      className={cn(
        "bg-destructive text-destructive-foreground rounded-lg p-4 shadow-lg",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          {errorMessages.length === 1 ? (
            <p className="text-sm">{errorMessages[0]}</p>
          ) : (
            <div>
              <p className="mb-2 text-sm font-medium">{title}</p>
              <ul className="space-y-1 text-sm">
                {errorMessages.map((message, index) => (
                  <li key={index}>• {message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="rounded-sm p-1 transition-colors hover:bg-white/20"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Hook for managing validation errors
export function useValidationErrors() {
  const [errors, setErrors] = React.useState<unknown[]>([]);

  const addError = React.useCallback((error: unknown) => {
    setErrors((prev) => [...prev, error]);
  }, []);

  const removeError = React.useCallback((index: number) => {
    setErrors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  const hasErrors = errors.length > 0;

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    hasErrors,
  };
}
