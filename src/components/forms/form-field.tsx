"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

interface FormFieldProps {
  field: AnyFieldApi;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
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
  required = false,
  disabled = false,
  className = "",
  description,
  children,
}: FormFieldProps) {
  const fieldId = field.name.replace(/\./g, "-");
  const errorId = `${fieldId}-error`;
  const descriptionId = description ? `${fieldId}-description` : undefined;

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={fieldId} className="text-sm font-medium">
        {label} {required && "*"}
      </Label>

      {children || (
        <Input
          id={fieldId}
          type={type}
          placeholder={placeholder}
          value={field.state.value || ""}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          disabled={disabled}
          className={className}
          aria-invalid={field.state.meta.errors.length > 0}
          aria-describedby={
            [field.state.meta.errors.length > 0 ? errorId : null, descriptionId]
              .filter(Boolean)
              .join(" ") || undefined
          }
        />
      )}

      {description && (
        <p id={descriptionId} className="text-muted-foreground text-xs">
          {description}
        </p>
      )}

      {field.state.meta.errors.length > 0 && (
        <p id={errorId} className="text-destructive text-sm" role="alert">
          {field.state.meta.errors[0]}
        </p>
      )}
    </div>
  );
}
