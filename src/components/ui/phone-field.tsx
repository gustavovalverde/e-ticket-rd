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
      {" "}
      {/* Enhanced mobile spacing */}
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
        {/* Mobile-first layout: stack on small screens, side-by-side on larger */}
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <Select
            value={countryCodeField.state.value || "+1"}
            onValueChange={countryCodeField.handleChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "min-h-[44px] w-full sm:w-32", // Touch-friendly height, full width on mobile
                "transition-colors duration-200", // Smooth interactions
                hasError &&
                  "border-destructive focus-visible:ring-destructive/20"
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
            type="tel"
            inputMode="tel" // Mobile numeric keyboard
            autoComplete="tel-national" // Better mobile autocomplete
            placeholder={placeholder}
            value={numberField.state.value || ""}
            onBlur={numberField.handleBlur}
            onChange={(e) => numberField.handleChange(e.target.value)}
            disabled={disabled}
            className={cn(
              "min-h-[44px] flex-1 text-base", // Touch-friendly height and readable text
              "transition-colors duration-200", // Smooth interactions
              hasError && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
        </div>
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
