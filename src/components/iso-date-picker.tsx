"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { parseISO, toISODate } from "@/lib/utils/date-utils";

import type React from "react";

// Minimal subset of TanStack FieldApi needed for binding
export interface StringFieldApi {
  state: { value: string };
  handleChange: (value: string) => void;
}

export type ISODatePickerProps = {
  field: StringFieldApi;
} & Omit<React.ComponentProps<typeof DatePicker>, "value" | "onChange">;

/**
 * Date picker that works with ISO date strings (YYYY-MM-DD).
 * Handles conversion between string values and Date objects automatically.
 */
export function ISODatePicker({
  field,
  mode = "any",
  maxDate,
  className,
  placeholder,
  disabled,
  ...rest
}: ISODatePickerProps) {
  const parsedDate = parseISO(field.state.value);

  return (
    <DatePicker
      value={parsedDate || undefined}
      onChange={(d) => field.handleChange(toISODate(d))}
      mode={mode}
      maxDate={maxDate}
      className={className}
      placeholder={placeholder}
      disabled={disabled}
      {...rest}
    />
  );
}
