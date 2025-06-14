"use client";

import { format, startOfToday, isBefore } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import type { DayButton } from "react-day-picker";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  mode?: "future" | "past" | "any";
  placeholder?: string;
  maxDate?: Date;
}

// Enhanced day button component with rounded styling from the demo
function DatePickerDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        // Base styles - rounded and clean
        "h-9 w-9 rounded-full p-0 font-normal",

        // Hover state
        "hover:bg-accent hover:text-accent-foreground",

        // Today state
        modifiers.today &&
          "border-primary bg-accent text-accent-foreground border",

        // Selected state
        modifiers.selected &&
          "bg-primary text-primary-foreground hover:bg-primary/90",

        // Disabled state
        modifiers.disabled &&
          "text-muted-foreground cursor-not-allowed opacity-50",

        // Outside month state
        modifiers.outside && "text-muted-foreground opacity-50",

        className
      )}
      disabled={modifiers.disabled}
      {...props}
    >
      {day.date.getDate()}
    </Button>
  );
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  className,
  id,
  mode = "future",
  placeholder,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const today = startOfToday();

  // Add state to manage the displayed month independently from the selected value
  const [displayMonth, setDisplayMonth] = React.useState<Date>(() => {
    // Initialize with selected value's month if available, otherwise use default
    if (value) return value;
    return mode === "past" ? new Date(1990, 0) : today;
  });

  // Update display month when value changes (but allow independent navigation)
  React.useEffect(() => {
    if (value && open) {
      setDisplayMonth(value);
    }
  }, [value, open]);

  // Generate disabled date function based on mode and maxDate
  const getDisabledDate = (date: Date): boolean => {
    // Check maxDate constraint first
    if (maxDate && date > maxDate) {
      return true;
    }

    switch (mode) {
      case "future":
        return isBefore(date, today);
      case "past":
        return date >= today;
      case "any":
      default:
        return false;
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return mode === "past" ? "Select birth date" : "Select date";
  };

  const handleDateSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "min-h-[44px] w-full justify-start text-left text-base font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{getPlaceholder()}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          disabled={getDisabledDate}
          captionLayout="dropdown"
          startMonth={
            mode === "past"
              ? new Date(1930, 0)
              : new Date(today.getFullYear(), 0)
          }
          endMonth={
            mode === "past"
              ? new Date(today.getFullYear(), 11)
              : maxDate
                ? new Date(maxDate.getFullYear(), maxDate.getMonth())
                : new Date(today.getFullYear() + 10, 11)
          }
          components={{
            DayButton: DatePickerDayButton,
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
