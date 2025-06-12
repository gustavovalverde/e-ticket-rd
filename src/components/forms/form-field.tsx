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
}: FormFieldProps) {
  // Determine if field is required (manual override or automatic detection)
  const isRequired =
    required !== undefined ? required : getFieldRequirement(field.name);
  const hasError = field.state.meta.errors.length > 0;

  return (
    <FormItem className={className}>
      <FormLabel
        className={cn(
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
          // Standard input with enhanced error styling
          <Input
            name={field.name}
            type={type}
            placeholder={placeholder}
            value={field.state.value || ""}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            disabled={disabled}
            className={cn(
              hasError && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
        )}
      </FormControl>

      {description && <FormDescription>{description}</FormDescription>}

      <FormMessage />
    </FormItem>
  );
}
