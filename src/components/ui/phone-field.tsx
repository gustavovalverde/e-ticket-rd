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
    <FormItem className={className}>
      <FormLabel
        className={cn(
          isRequired &&
            "after:text-destructive after:ml-0.5 after:content-['*']"
        )}
      >
        {label}
      </FormLabel>

      <FormControl>
        <div className="flex gap-2">
          <Select
            value={countryCodeField.state.value || "+1"}
            onValueChange={countryCodeField.handleChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                "w-24",
                hasError &&
                  "border-destructive focus-visible:ring-destructive/20"
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+1">+1</SelectItem>
              <SelectItem value="+1809">+1809</SelectItem>
              <SelectItem value="+34">+34</SelectItem>
              <SelectItem value="+33">+33</SelectItem>
              <SelectItem value="+44">+44</SelectItem>
              <SelectItem value="+49">+49</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="tel"
            placeholder={placeholder}
            value={numberField.state.value || ""}
            onBlur={numberField.handleBlur}
            onChange={(e) => numberField.handleChange(e.target.value)}
            disabled={disabled}
            className={cn(
              "flex-1",
              hasError && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
        </div>
      </FormControl>

      {description && <FormDescription>{description}</FormDescription>}

      <FormMessage>
        {/* Show error from either field */}
        {numberField.state.meta.errors[0] ||
          countryCodeField.state.meta.errors[0]}
      </FormMessage>
    </FormItem>
  );
}
