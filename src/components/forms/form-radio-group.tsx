"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { getFieldRequirement } from "@/lib/utils/form-utils";

import type { AnyFieldApi } from "@tanstack/react-form";
import type { ReactNode } from "react";

interface RadioOption {
  value: string;
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  iconBg?: string;
  iconColor?: string;
}

// Type for field validation
interface FieldValidators {
  onChange?: (params: { value: string }) => string | undefined;
  onBlur?: (params: { value: string }) => string | undefined;
  onChangeAsync?: (params: { value: string }) => Promise<string | undefined>;
  onChangeAsyncDebounceMs?: number;
}

interface FormRadioGroupProps {
  field: AnyFieldApi;
  options: RadioOption[];
  label?: string;
  layout?: "grid" | "stack";
  columns?: "1" | "2";
  padding?: "small" | "large";
  size?: "small" | "large"; // Controls icon container size
  validators?: FieldValidators;
}

export function FormRadioGroup({
  field,
  options,
  label,
  layout = "stack",
  columns = "1",
  padding = "small",
  size = "large",
}: FormRadioGroupProps) {
  const errorId = `${field.name}-error`;
  const isRequired = getFieldRequirement(field.name);

  // Calculate padding class based on size and padding props
  let paddingClass: string;
  if (size === "small") {
    paddingClass = padding === "small" ? "p-2" : "p-3";
  } else {
    paddingClass = padding === "small" ? "p-4" : "p-6";
  }

  const spacingClass = size === "small" ? "space-x-2" : "space-x-4";
  const layoutClass =
    layout === "grid"
      ? `grid gap-4 ${columns === "2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`
      : "space-y-3";

  const iconSizeClass = size === "small" ? "h-6 w-6" : "h-12 w-12";

  return (
    <div className="space-y-3">
      {label && (
        <Label
          className={cn(
            "text-base leading-none font-medium",
            isRequired &&
              "after:text-destructive after:ml-0.5 after:content-['*']"
          )}
        >
          {label}
        </Label>
      )}
      <RadioGroup
        name={field.name}
        value={field.state.value}
        onValueChange={field.handleChange}
        className={layoutClass}
        aria-invalid={field.state.meta.errors.length > 0}
        aria-describedby={
          field.state.meta.errors.length > 0 ? errorId : undefined
        }
      >
        {options.map((option) => (
          <Label
            key={option.value}
            htmlFor={option.id}
            className={`border-border hover:bg-muted/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 flex cursor-pointer items-center ${spacingClass} rounded-lg border ${paddingClass} transition-colors`}
          >
            <RadioGroupItem value={option.value} id={option.id} />
            <div className="flex flex-1 items-center gap-4">
              {option.icon && (
                <div
                  className={`flex ${iconSizeClass} flex-shrink-0 items-center justify-center rounded-full ${
                    option.iconBg || "bg-white-100"
                  } ${option.iconColor || "text-gray-700"}`}
                >
                  {option.icon}
                </div>
              )}
              <div className="flex-1">
                <div className="text-base font-medium">{option.label}</div>
                {option.description && (
                  <p className="text-muted-foreground text-sm">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          </Label>
        ))}
      </RadioGroup>
      {field.state.meta.errors.length > 0 && (
        <p id={errorId} className="text-destructive text-sm" role="alert">
          {field.state.meta.errors[0]}
        </p>
      )}
    </div>
  );
}
