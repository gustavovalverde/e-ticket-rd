import * as React from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFieldContext,
} from "@/components/ui/tanstack-form";
import { cn } from "@/lib/utils";
import { getFieldRequirement } from "@/lib/utils/form-utils";

import type { AnyFieldApi } from "@tanstack/react-form";

interface PhoneFieldProps {
  numberField: AnyFieldApi;
  countryCodeField: AnyFieldApi;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

// Internal component that uses useFieldContext for proper accessibility
function PhoneInputWithCountryCode({
  numberField,
  countryCodeField,
  placeholder,
  disabled,
  hasError,
}: {
  numberField: AnyFieldApi;
  countryCodeField: AnyFieldApi;
  placeholder: string;
  disabled: boolean;
  hasError: boolean;
}) {
  // Get accessibility attributes from TanStack Form context
  const { formItemId, hasError: contextHasError } = useFieldContext();

  // Ensure country code always has a value
  const countryCodeValue = countryCodeField.state.value || "+1";

  // Set default value immediately if not already set
  React.useEffect(() => {
    if (!countryCodeField.state.value) {
      countryCodeField.handleChange("+1");
    }
  }, [countryCodeField]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
      <Select
        name={countryCodeField.name}
        value={countryCodeValue}
        onValueChange={countryCodeField.handleChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={`${formItemId}-country-code`} // Unique ID for country code
          aria-invalid={hasError}
          className={cn(
            "min-h-[44px] w-full sm:w-32", // Touch-friendly height, full width on mobile
            "transition-colors duration-200", // Smooth interactions
            hasError && "border-destructive focus-visible:ring-destructive/20"
          )}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="+1">+1 (US/Canada)</SelectItem>
          <SelectItem value="+1809">+1809 (DR)</SelectItem>
          <SelectItem value="+34">+34 (Spain)</SelectItem>
          <SelectItem value="+33">+33 (France)</SelectItem>
          <SelectItem value="+44">+44 (UK)</SelectItem>
          <SelectItem value="+49">+49 (Germany)</SelectItem>
        </SelectContent>
      </Select>
      <Input
        id={formItemId} // Use the proper form item ID for the main input
        name={numberField.name}
        type="tel"
        inputMode="tel" // Mobile numeric keyboard
        autoComplete="tel-national" // Better mobile autocomplete
        placeholder={placeholder}
        value={numberField.state.value || ""}
        onBlur={numberField.handleBlur}
        onChange={(e) => numberField.handleChange(e.target.value)}
        disabled={disabled}
        aria-invalid={contextHasError}
        className={cn(
          "min-h-[44px] flex-1 text-base", // Touch-friendly height and readable text
          "transition-colors duration-200", // Smooth interactions
          hasError && "border-destructive focus-visible:ring-destructive/20"
        )}
      />
    </div>
  );
}

export function PhoneField({
  numberField,
  countryCodeField,
  label = "Phone Number",
  placeholder = "Enter phone number",
  description = "Include area code",
  disabled = false,
  className,
}: PhoneFieldProps) {
  const isRequired = getFieldRequirement(numberField.name);
  const hasError =
    numberField.state.meta.errors.length > 0 ||
    countryCodeField.state.meta.errors.length > 0;

  return (
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
        <PhoneInputWithCountryCode
          numberField={numberField}
          countryCodeField={countryCodeField}
          placeholder={placeholder}
          disabled={disabled}
          hasError={hasError}
        />
      </FormControl>
      {description && (
        <FormDescription className="text-sm leading-relaxed">
          {description}
        </FormDescription>
      )}
      <FormMessage className="text-sm font-medium">
        {/* Show error from either field */}
        {numberField.state.meta.errors[0] ||
          countryCodeField.state.meta.errors[0]}
      </FormMessage>
    </FormItem>
  );
}
