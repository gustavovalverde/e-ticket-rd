"use client";

import {
  format,
  lightFormat,
  formatRelative,
  parse,
  isValid,
  addDays,
  isPast,
  startOfToday,
  isMatch,
  isToday,
  isTomorrow,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled = false,
  className,
  id,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [isInvalidDate, setIsInvalidDate] = React.useState(false);

  const today = startOfToday();
  const INPUT_DATE_FORMAT = "dd/MM/yyyy";
  const presets = [
    { label: "Today", date: today },
    { label: "Tomorrow", date: addDays(today, 1) },
    { label: "In 3 days", date: addDays(today, 3) },
  ];

  // Update input value when external value changes
  React.useEffect(() => {
    if (value) {
      // Use lightFormat for better performance on simple date formatting
      setInputValue(lightFormat(value, INPUT_DATE_FORMAT));
    } else {
      setInputValue("");
    }
    setIsInvalidDate(false);
  }, [value]);

  const parseInputDate = (input: string): Date | null => {
    const cleaned = input.trim();
    if (!cleaned) return null;

    // Only accept full 4-digit years to avoid ambiguity
    const formats = [
      INPUT_DATE_FORMAT, // 25/12/2024 (Primary format)
      "d/M/yyyy", // 5/1/2024 (Single digits)
      "dd-MM-yyyy", // 25-12-2024 (Alternative separator)
      "d-M-yyyy", // 5-1-2024 (Single digits with dash)
    ];

    for (const formatStr of formats) {
      if (isMatch(cleaned, formatStr)) {
        const parsedDate = parse(cleaned, formatStr, new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      }
    }
    return null;
  };

  const getValidationMessage = (input: string): string | null => {
    if (!input.trim() || input.length < 10) return null;

    const parsedDate = parseInputDate(input);
    if (!parsedDate) {
      // Use lightFormat for consistent formatting in examples
      const exampleDate = lightFormat(addDays(today, 7), INPUT_DATE_FORMAT);
      return `Use format DD/MM/YYYY (e.g., ${exampleDate})`;
    }

    // Check if date is in the past (for travel dates)
    if (isPast(parsedDate)) {
      return "Travel date must be today or in the future";
    }

    return null;
  };

  const isCompleteDate = (input: string): boolean => {
    const cleaned = input.trim();
    // Only accept 4-digit years: DD/MM/YYYY or DD-MM-YYYY
    return /^\d{1,2}[/-]\d{1,2}[/-]\d{4}$/.test(cleaned);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);

    // Only validate and parse when it looks like a complete date
    if (isCompleteDate(input)) {
      const parsedDate = parseInputDate(input);
      const validationMessage = getValidationMessage(input);

      if (parsedDate && !validationMessage) {
        onChange?.(parsedDate);
        setIsInvalidDate(false);
      } else if (validationMessage) {
        setIsInvalidDate(true);
      } else {
        setIsInvalidDate(false);
      }
    } else {
      // For partial input, just clear any error state
      setIsInvalidDate(false);
    }
  };

  const handleInputBlur = () => {
    // Validate complete input when user finishes typing
    if (inputValue.trim() && inputValue.length >= 10) {
      const parsedDate = parseInputDate(inputValue);
      const validationMessage = getValidationMessage(inputValue);

      if (parsedDate && !validationMessage) {
        onChange?.(parsedDate);
        setIsInvalidDate(false);
      } else if (validationMessage) {
        setIsInvalidDate(true);
      }
    }
  };

  const handlePresetClick = (date: Date) => {
    onChange?.(date);
    setOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    onChange?.(date);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Input
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={`DD/MM/YYYY (e.g., ${lightFormat(addDays(today, 7), INPUT_DATE_FORMAT)})`}
        className={cn(
          "pl-10",
          isInvalidDate && "border-destructive focus-visible:ring-destructive",
          className
        )}
        disabled={disabled}
        aria-invalid={ariaInvalid || isInvalidDate}
        aria-describedby={ariaDescribedBy}
      />

      {isInvalidDate && (
        <p className="text-destructive mt-1 text-sm">
          {getValidationMessage(inputValue)}
        </p>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-0 left-0 h-full px-3 py-2 hover:bg-transparent"
            disabled={disabled}
          >
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="bg-background border-border flex flex-col items-center gap-6 rounded-xl border p-4">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              month={value || today}
              onMonthChange={() => {}} // Allow month navigation
              disabled={(date) => isPast(date)}
              className="rounded-md"
            />

            <div className="grid grid-cols-3 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetClick(preset.date)}
                  className="text-sm"
                  disabled={disabled}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            {value && (
              <div className="border-t pt-2">
                <p className="text-muted-foreground text-sm">
                  Selected:{" "}
                  {isToday(value) || isTomorrow(value)
                    ? formatRelative(value, today)
                    : format(value, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
