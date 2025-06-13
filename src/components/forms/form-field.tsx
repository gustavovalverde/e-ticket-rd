"use client";

import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
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
  const hasError = field.state.meta.errors.length > 0;

  // Auto-detect mobile optimization attributes based on field type and name
  const getMobileAttributes = () => {
    // If explicitly provided, use them
    if (inputMode || autoComplete) {
      return { inputMode, autoComplete };
    }

    // Auto-detect based on field name and type
    const fieldName = field.name.toLowerCase();

    if (type === "email" || fieldName.includes("email")) {
      return { inputMode: "email" as const, autoComplete: "email" };
    }
    if (type === "tel" || fieldName.includes("phone")) {
      return { inputMode: "tel" as const, autoComplete: "tel" };
    }
    if (
      type === "number" ||
      fieldName.includes("number") ||
      fieldName.includes("companions") ||
      fieldName.includes("year") ||
      fieldName.includes("month") ||
      fieldName.includes("day")
    ) {
      return { inputMode: "numeric" as const, autoComplete: "off" };
    }
    if (fieldName.includes("name")) {
      return { inputMode: "text" as const, autoComplete: "name" };
    }
    if (fieldName.includes("address")) {
      return { inputMode: "text" as const, autoComplete: "address-line1" };
    }
    if (fieldName.includes("city")) {
      return { inputMode: "text" as const, autoComplete: "address-level2" };
    }
    if (fieldName.includes("country")) {
      return { inputMode: "text" as const, autoComplete: "country-name" };
    }
    if (fieldName.includes("flight") || fieldName.includes("confirmation")) {
      return { inputMode: "text" as const, autoComplete: "off" };
    }
    if (fieldName.includes("passport")) {
      return { inputMode: "text" as const, autoComplete: "off" };
    }

    // Default for text inputs
    return { inputMode: "text" as const, autoComplete: "off" };
  };

  const mobileAttributes = getMobileAttributes();

  return (
    <FormItem className={cn("space-y-3", className)}>
      {" "}
      {/* Enhanced mobile spacing */}
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
            onBlur={field.handleBlur}
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
              hasError && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
        )}
      </FormControl>
      {description && (
        <FormDescription className="text-sm leading-relaxed">
          {description}
        </FormDescription>
      )}
      <FormMessage className="text-sm font-medium" />
    </FormItem>
  );
}
