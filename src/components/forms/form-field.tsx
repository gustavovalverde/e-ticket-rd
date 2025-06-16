"use client";

import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FieldProvider,
} from "@/components/ui/tanstack-form";
import { cn } from "@/lib/utils";
import { getFieldRequirement } from "@/lib/utils/form-utils";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

interface FormFieldProps {
  field: AnyFieldApi;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean; // Manual override if provided
  disabled?: boolean;
  className?: string;
  description?: string;
  children?: ReactNode; // For custom input components like DatePicker
  // HTML input constraints
  min?: number | string;
  max?: number | string;
  step?: number | string;
  // Mobile enhancement props
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  autoComplete?: string;
}

export function FormField({
  field,
  label,
  type = "text",
  placeholder,
  required, // Manual override
  disabled = false,
  className,
  description,
  children,
  min,
  max,
  step,
  inputMode,
  autoComplete,
}: FormFieldProps) {
  // Determine if field is required (manual override or automatic detection)
  const isRequired =
    required !== undefined ? required : getFieldRequirement(field.name);

  // Use TanStack Form's recommended error checking pattern
  const hasError = !field.state.meta.isValid;

  // Use explicit values or sensible defaults
  const mobileAttributes = {
    inputMode: inputMode || ("text" as const),
    autoComplete: autoComplete || "off",
  };

  return (
    <FieldProvider field={field}>
      <FormItem className={cn("space-y-2", className)}>
        <div className="space-y-1">
          <FormLabel
            className={cn(
              "text-base leading-none font-medium", // Better mobile readability
              isRequired &&
                "after:text-destructive after:ml-0.5 after:content-['*']"
            )}
          >
            {label}
          </FormLabel>
          {description && (
            <FormDescription className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </FormDescription>
          )}
        </div>
        <FormControl>
          {children ? (
            // Custom input component (like DatePicker)
            children
          ) : (
            // Standard input with mobile enhancements
            <Input
              name={field.name}
              type={type}
              placeholder={placeholder}
              value={field.state.value || ""}
              onBlur={field.handleBlur} // Important: enables onBlur validation
              onChange={(e) => {
                const value = e.target.value;
                // Convert to number for number inputs, otherwise keep as string
                if (type === "number") {
                  field.handleChange(value === "" ? undefined : Number(value));
                } else {
                  field.handleChange(value);
                }
              }}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              inputMode={mobileAttributes.inputMode}
              autoComplete={mobileAttributes.autoComplete}
              className={cn(
                // Mobile-first styling enhancements
                "min-h-[44px] text-base", // Touch-friendly height and readable text
                "transition-colors duration-200", // Smooth interactions
                hasError &&
                  "border-destructive focus-visible:ring-destructive/20"
              )}
            />
          )}
        </FormControl>
        {/* Use proper FormMessage component following TanStack Form best practices */}
        <FormMessage />
      </FormItem>
    </FieldProvider>
  );
}
