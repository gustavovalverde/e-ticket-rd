"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

interface FormRadioGroupProps {
  field: AnyFieldApi;
  options: RadioOption[];
  layout?: "grid" | "stack";
  columns?: "1" | "2";
  padding?: "small" | "large";
}

export function FormRadioGroup({
  field,
  options,
  layout = "stack",
  columns = "1",
  padding = "small",
}: FormRadioGroupProps) {
  const errorId = `${field.name}-error`;
  const paddingClass = padding === "small" ? "p-4" : "p-6";
  const layoutClass =
    layout === "grid"
      ? `grid gap-4 ${columns === "2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`
      : "space-y-3";

  return (
    <div className="space-y-3">
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
            className={`border-border hover:bg-muted/50 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 flex cursor-pointer items-center space-x-4 rounded-lg border ${paddingClass} transition-colors`}
          >
            <RadioGroupItem value={option.value} id={option.id} />
            <div className="flex flex-1 items-center gap-4">
              {option.icon && (
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                    option.iconBg || "bg-gray-100"
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
