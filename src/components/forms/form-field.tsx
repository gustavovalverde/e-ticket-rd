"use client";

import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
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

  // Auto-detect mobile optimization attributes based on field type and name
  const getMobileAttributes = () => {
    // If explicitly provided, use them
    if (inputMode || autoComplete) {
      return { inputMode, autoComplete };
    }

    const fieldName = field.name.toLowerCase();
    const COUNTRY_NAME_AUTOCOMPLETE = "country-name";

    // Field type mappings for cleaner logic
    const fieldMappings = [
      // Email fields
      {
        condition: () => type === "email" || fieldName.includes("email"),
        result: { inputMode: "email" as const, autoComplete: "email" },
      },
      // Phone fields
      {
        condition: () => type === "tel" || fieldName.includes("phone"),
        result: { inputMode: "tel" as const, autoComplete: "tel" },
      },
      // Numeric fields
      {
        condition: () =>
          type === "number" ||
          fieldName.includes("number") ||
          fieldName.includes("companions") ||
          fieldName.includes("year") ||
          fieldName.includes("month") ||
          fieldName.includes("day"),
        result: { inputMode: "numeric" as const, autoComplete: "off" },
      },
      // Name fields - specific first
      {
        condition: () =>
          fieldName.includes("firstname") ||
          fieldName.includes("first-name") ||
          fieldName.includes("givenname") ||
          fieldName.includes("given-name"),
        result: { inputMode: "text" as const, autoComplete: "given-name" },
      },
      {
        condition: () =>
          fieldName.includes("lastname") ||
          fieldName.includes("last-name") ||
          fieldName.includes("familyname") ||
          fieldName.includes("family-name"),
        result: { inputMode: "text" as const, autoComplete: "family-name" },
      },
      // Address fields
      {
        condition: () => fieldName.includes("address"),
        result: { inputMode: "text" as const, autoComplete: "address-line1" },
      },
      {
        condition: () => fieldName.includes("city"),
        result: { inputMode: "text" as const, autoComplete: "address-level2" },
      },
      {
        condition: () =>
          fieldName.includes("state") || fieldName.includes("province"),
        result: { inputMode: "text" as const, autoComplete: "address-level1" },
      },
      {
        condition: () =>
          fieldName.includes("postal") || fieldName.includes("zip"),
        result: { inputMode: "text" as const, autoComplete: "postal-code" },
      },
      // Country/nationality fields
      {
        condition: () =>
          fieldName.includes("nationality") ||
          (fieldName.includes("birth") && fieldName.includes("country")) ||
          fieldName.includes("country"),
        result: {
          inputMode: "text" as const,
          autoComplete: COUNTRY_NAME_AUTOCOMPLETE,
        },
      },
      // Occupation fields
      {
        condition: () =>
          fieldName.includes("occupation") || fieldName.includes("job"),
        result: {
          inputMode: "text" as const,
          autoComplete: "organization-title",
        },
      },
      // Travel-specific fields (no autocomplete)
      {
        condition: () =>
          fieldName.includes("airline") ||
          fieldName.includes("aircraft") ||
          fieldName.includes("flight") ||
          fieldName.includes("confirmation") ||
          fieldName.includes("passport") ||
          (fieldName.includes("port") &&
            (fieldName.includes("departure") || fieldName.includes("arrival"))),
        result: { inputMode: "text" as const, autoComplete: "off" },
      },
      // Generic name fields (fallback)
      {
        condition: () => fieldName.includes("name"),
        result: { inputMode: "text" as const, autoComplete: "name" },
      },
    ];

    // Find first matching mapping
    for (const mapping of fieldMappings) {
      if (mapping.condition()) {
        return mapping.result;
      }
    }

    // Default for text inputs
    return { inputMode: "text" as const, autoComplete: "off" };
  };

  const mobileAttributes = getMobileAttributes();

  return (
    <FieldProvider field={field}>
      <FormItem className={cn("space-y-3", className)}>
        <FormLabel
          className={cn(
            "text-base leading-none font-medium", // Better mobile readability
            isRequired &&
              "after:text-destructive after:ml-0.5 after:content-['*']"
          )}
        >
          {label}
        </FormLabel>
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
        {description && (
          <FormDescription className="text-sm leading-relaxed">
            {description}
          </FormDescription>
        )}
        {/* TanStack Form error display pattern */}
        {!field.state.meta.isValid && (
          <p className="text-destructive text-sm" role="alert">
            {field.state.meta.errors.join(", ")}
          </p>
        )}
      </FormItem>
    </FieldProvider>
  );
}
