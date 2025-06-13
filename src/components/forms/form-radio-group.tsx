"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FieldProvider,
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
  label?: string;
  layout?: "stack" | "grid";
  columns?: "1" | "2" | "3";
  padding?: "small" | "medium" | "large";
  size?: "small" | "large";
  description?: string;
  className?: string;
}

export function FormRadioGroup({
  field,
  options,
  label,
  layout = "stack",
  columns = "1",
  padding = "small",
  size = "large",
  description,
  className,
}: FormRadioGroupProps) {
  const isRequired = getFieldRequirement(field.name);

  // Safe grid class selection
  const getGridClass = (cols: "1" | "2" | "3") => {
    switch (cols) {
      case "1":
        return "grid-cols-1";
      case "2":
        return "grid-cols-1 sm:grid-cols-2";
      case "3":
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1";
    }
  };

  // Safe padding class selection
  const getPaddingClass = (p: "small" | "medium" | "large") => {
    switch (p) {
      case "small":
        return "p-3";
      case "medium":
        return "p-4";
      case "large":
        return "p-5";
      default:
        return "p-3";
    }
  };

  // Safe size class selection
  const getSizeClasses = (s: "small" | "large") => {
    switch (s) {
      case "small":
        return {
          icon: "h-4 w-4",
          text: "text-sm",
          description: "text-xs",
        };
      case "large":
      default:
        return {
          icon: "h-6 w-6",
          text: "text-base",
          description: "text-sm",
        };
    }
  };

  const currentSize = getSizeClasses(size);
  const gridClass = getGridClass(columns);
  const paddingClass = getPaddingClass(padding);

  return (
    <FieldProvider field={field}>
      <FormItem className={cn("space-y-3", className)}>
        {label && (
          <FormLabel
            className={cn(
              "text-base leading-none font-medium",
              isRequired &&
                "after:text-destructive after:ml-0.5 after:content-['*']"
            )}
          >
            {label}
          </FormLabel>
        )}
        <FormControl>
          <RadioGroup
            value={field.state.value || ""}
            onValueChange={field.handleChange}
            onBlur={field.handleBlur}
            className={cn(
              layout === "grid"
                ? `grid gap-3 ${gridClass}`
                : "flex flex-col gap-3"
            )}
          >
            {options.map((option) => (
              <label
                key={option.id}
                htmlFor={option.id}
                className={cn(
                  "border-border hover:bg-muted/50 flex cursor-pointer items-center space-x-4 rounded-lg border transition-colors",
                  paddingClass
                )}
              >
                <RadioGroupItem value={option.value} id={option.id} />
                <div className="flex flex-1 items-center gap-3">
                  {option.icon && (
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-lg",
                        option.iconBg || "bg-primary/10",
                        option.iconColor || "text-primary",
                        currentSize.icon
                      )}
                    >
                      {option.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <span
                      className={cn(
                        "leading-none font-medium",
                        currentSize.text
                      )}
                    >
                      {option.label}
                    </span>
                    {option.description && (
                      <p
                        className={cn(
                          "text-muted-foreground mt-1",
                          currentSize.description
                        )}
                      >
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </RadioGroup>
        </FormControl>
        {description && (
          <FormDescription className="text-sm leading-relaxed">
            {description}
          </FormDescription>
        )}
        {/* Use proper FormMessage component following TanStack Form best practices */}
        <FormMessage />
      </FormItem>
    </FieldProvider>
  );
}
