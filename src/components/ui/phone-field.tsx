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
  FieldProvider,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/tanstack-form";
import { cn } from "@/lib/utils";
import { getFieldRequirement } from "@/lib/utils/form-utils";

import type { AnyFieldApi } from "@tanstack/react-form";

interface PhoneFieldProps {
  numberField: AnyFieldApi;
  countryCodeField: AnyFieldApi;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// Country codes for Dominican Republic system
const COUNTRY_CODES = [
  {
    code: "+1",
    country: "DO",
    label: "+1 (Dominican Republic)",
    value: "+1-DO",
  },
  { code: "+1", country: "US", label: "+1 (United States)", value: "+1-US" },
  { code: "+1", country: "CA", label: "+1 (Canada)", value: "+1-CA" },
  {
    code: "+44",
    country: "GB",
    label: "+44 (United Kingdom)",
    value: "+44-GB",
  },
  { code: "+34", country: "ES", label: "+34 (Spain)", value: "+34-ES" },
  { code: "+33", country: "FR", label: "+33 (France)", value: "+33-FR" },
  { code: "+49", country: "DE", label: "+49 (Germany)", value: "+49-DE" },
  { code: "+39", country: "IT", label: "+39 (Italy)", value: "+39-IT" },
  { code: "+52", country: "MX", label: "+52 (Mexico)", value: "+52-MX" },
  { code: "+57", country: "CO", label: "+57 (Colombia)", value: "+57-CO" },
  { code: "+58", country: "VE", label: "+58 (Venezuela)", value: "+58-VE" },
  { code: "+507", country: "PA", label: "+507 (Panama)", value: "+507-PA" },
  { code: "+506", country: "CR", label: "+506 (Costa Rica)", value: "+506-CR" },
  {
    code: "+503",
    country: "SV",
    label: "+503 (El Salvador)",
    value: "+503-SV",
  },
  { code: "+502", country: "GT", label: "+502 (Guatemala)", value: "+502-GT" },
  { code: "+504", country: "HN", label: "+504 (Honduras)", value: "+504-HN" },
  { code: "+505", country: "NI", label: "+505 (Nicaragua)", value: "+505-NI" },
] as const;

// Enhanced phone input component with country code selection
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
  // Get the current country code value, default to Dominican Republic
  const currentValue = countryCodeField.state.value || "+1";

  // Find the matching country option or default to Dominican Republic
  const currentOption =
    COUNTRY_CODES.find((item) => item.code === currentValue) ||
    COUNTRY_CODES[0];

  return (
    <div className="flex max-w-sm">
      <Select
        value={currentOption.value}
        onValueChange={(value) => {
          // Extract the country code from the compound value
          const selectedOption = COUNTRY_CODES.find(
            (item) => item.value === value
          );
          if (selectedOption) {
            countryCodeField.handleChange(selectedOption.code);
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger
          className={cn(
            "min-h-[44px] w-32 rounded-r-none border-r-0",
            hasError && "border-destructive"
          )}
        >
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        name={numberField.name}
        type="tel"
        placeholder={placeholder}
        value={numberField.state.value || ""}
        onBlur={numberField.handleBlur}
        onChange={(e) => numberField.handleChange(e.target.value)}
        disabled={disabled}
        inputMode="tel"
        autoComplete="tel"
        className={cn(
          "min-h-[44px] flex-1 rounded-l-none border-l-0 text-base",
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
  disabled = false,
  className,
}: PhoneFieldProps) {
  const isRequired = getFieldRequirement(numberField.name);
  const hasError =
    !numberField.state.meta.isValid || !countryCodeField.state.meta.isValid;

  // Use the number field as the primary field for error display
  // since it's the main input and typically has the validation logic
  return (
    <FieldProvider field={numberField}>
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
        {/* TanStack Form error display pattern */}
        {(!numberField.state.meta.isValid ||
          !countryCodeField.state.meta.isValid) && (
          <p className="text-destructive text-sm" role="alert">
            {!numberField.state.meta.isValid
              ? numberField.state.meta.errors.join(", ")
              : countryCodeField.state.meta.errors.join(", ")}
          </p>
        )}
      </FormItem>
    </FieldProvider>
  );
}
