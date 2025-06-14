"use client";

import { lightFormat } from "date-fns";
import { User, FileText, Check, Info } from "lucide-react";
import * as React from "react";

import { FormField } from "@/components/forms/form-field";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/components/ui/tanstack-form";
import {
  validateFirstName,
  validateLastName,
  validatePassportNumber,
  validateNationality,
  validateSex,
  validateOccupation,
  OCCUPATION_OPTIONS,
  CIVIL_STATUS_OPTIONS,
} from "@/lib/schemas/validation";
import { booleanFieldAdapter } from "@/lib/utils/form-utils";

import type { AnyFieldApi } from "@tanstack/react-form";

interface MigratoryInfoStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

// Custom DatePicker that uses FormControl context for proper accessibility
function DatePickerWithFormContext({
  value,
  onChange,
  mode,
  className,
}: {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode?: "future" | "past" | "any";
  className?: string;
}) {
  // Get accessibility attributes from TanStack Form context
  const { formItemId, hasError } = useFieldContext();

  return (
    <DatePicker
      id={formItemId} // Use the proper form item ID
      value={value}
      onChange={onChange}
      mode={mode}
      className={className}
      aria-invalid={hasError}
    />
  );
}

// Custom Select that uses FormControl context for proper accessibility
function SelectWithFormContext({
  field,
  placeholder,
  children,
}: {
  field: AnyFieldApi;
  placeholder: string;
  children: React.ReactNode;
}) {
  // Get accessibility attributes from TanStack Form context
  const { formItemId, hasError } = useFieldContext();

  return (
    <Select
      name={field.name}
      value={field.state.value || ""}
      onValueChange={(value) => field.handleChange(value)}
    >
      <SelectTrigger id={formItemId} aria-invalid={hasError}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

export function MigratoryInfoStep({ form }: MigratoryInfoStepProps) {
  // Get travel direction to conditionally show residency status
  const travelDirection = form.getFieldValue("flightInfo.travelDirection");
  const isEnteringDR = travelDirection === "ENTRY";

  return (
    <div className="space-y-6">
      {/* Name Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Full Name
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <form.AppField
              name="personalInfo.firstName"
              validators={{
                onBlur: ({ value }: { value: string }) => {
                  if (!value || value.trim() === "") {
                    return "First name is required";
                  }
                  const result = validateFirstName.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Given or first name(s)"
                  required
                />
              )}
            </form.AppField>

            <form.AppField
              name="personalInfo.lastName"
              validators={{
                onBlur: ({ value }: { value: string }) => {
                  if (!value || value.trim() === "") {
                    return "Last name is required";
                  }
                  const result = validateLastName.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Last Name or family name"
                  required
                />
              )}
            </form.AppField>
          </div>
        </CardContent>
      </Card>

      {/* Birth Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Birth Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.AppField name="personalInfo.birthDate">
            {(field: AnyFieldApi) => (
              <FormField field={field} label="Date of Birth" required>
                <DatePickerWithFormContext
                  mode="past"
                  value={
                    field.state.value ? new Date(field.state.value) : undefined
                  }
                  onChange={(date) =>
                    field.handleChange(
                      date ? lightFormat(date, "yyyy-MM-dd") : ""
                    )
                  }
                  className="max-w-xs"
                />
              </FormField>
            )}
          </form.AppField>

          <form.AppField
            name="personalInfo.birthCountry"
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "")
                  return "Country of birth is required";
                return undefined;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label="Country of Birth"
                placeholder="Enter your country of birth"
                required
              />
            )}
          </form.AppField>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <form.AppField
              name="personalInfo.sex"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  if (!value || value.trim() === "") {
                    return "Sex is required";
                  }
                  const result = validateSex.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormRadioGroup
                  field={field}
                  label="Sex"
                  options={[
                    {
                      value: "MALE",
                      id: "male",
                      label: "Male",
                      icon: <User className="h-5 w-5" />,
                      iconColor: "text-blue-600",
                    },
                    {
                      value: "FEMALE",
                      id: "female",
                      label: "Female",
                      icon: <User className="h-5 w-5" />,
                      iconColor: "text-pink-600",
                    },
                  ]}
                  layout="stack"
                  padding="small"
                  size="small"
                />
              )}
            </form.AppField>

            <form.AppField name="personalInfo.civilStatus">
              {(field: AnyFieldApi) => (
                <FormField field={field} label="Civil Status" required>
                  <SelectWithFormContext
                    field={field}
                    placeholder="Select civil status"
                  >
                    {CIVIL_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectWithFormContext>
                </FormField>
              )}
            </form.AppField>
          </div>

          <form.AppField
            name="personalInfo.occupation"
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "")
                  return "Occupation is required";
                const result = validateOccupation.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormField field={field} label="Occupation" required>
                <SelectWithFormContext
                  field={field}
                  placeholder="Select occupation"
                >
                  {OCCUPATION_OPTIONS.map((occupation) => (
                    <SelectItem key={occupation} value={occupation}>
                      {occupation
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectWithFormContext>
              </FormField>
            )}
          </form.AppField>
        </CardContent>
      </Card>

      {/* Residency Status - Only show when entering Dominican Republic */}
      {isEnteringDR && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Residency Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form.AppField
              name="personalInfo.isForeignResident"
              validators={{
                onChange: ({ value }: { value: boolean }) => {
                  // Only validate when entering DR
                  if (isEnteringDR && (value === null || value === undefined)) {
                    return "Please indicate your residency status in Dominican Republic";
                  }
                  return undefined;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormRadioGroup
                  field={booleanFieldAdapter(field)}
                  label="Are you a foreign resident in the Dominican Republic?"
                  required={isEnteringDR}
                  options={[
                    {
                      value: "no",
                      id: "not-foreign-resident",
                      label: "No",
                      description: "I am not a foreign resident",
                      icon: <Check className="h-5 w-5" />,
                      iconColor: "text-green-600",
                    },
                    {
                      value: "yes",
                      id: "foreign-resident",
                      label: "Yes",
                      description: "I am a foreign resident",
                      icon: <Info className="h-5 w-5" />,
                      iconColor: "text-blue-600",
                    },
                  ]}
                  layout="grid"
                  columns="2"
                  padding="small"
                  size="small"
                />
              )}
            </form.AppField>
          </CardContent>
        </Card>
      )}

      {/* Passport Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Passport Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <form.AppField
              name="personalInfo.passport.number"
              validators={{
                onBlur: ({ value }: { value: string }) => {
                  if (!value || value.trim() === "") {
                    return "Passport number is required";
                  }
                  const result = validatePassportNumber.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Passport Number"
                  placeholder="Enter your passport number"
                  required
                />
              )}
            </form.AppField>

            <form.AppField name="personalInfo.passport.confirmNumber">
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Confirm Passport Number"
                  placeholder="Re-enter your passport number"
                  required
                />
              )}
            </form.AppField>
          </div>

          {/* Passport Nationality Question */}
          <form.AppField name="personalInfo.passport.isDifferentNationality">
            {(field: AnyFieldApi) => (
              <FormRadioGroup
                field={booleanFieldAdapter(field)}
                label="Is your passport nationality different from your country of birth?"
                options={[
                  {
                    value: "no",
                    id: "same-nationality",
                    label: "No",
                    description: "Same nationality as country of birth",
                    icon: <Check className="h-5 w-5" />,
                    iconColor: "text-green-600",
                  },
                  {
                    value: "yes",
                    id: "different-nationality",
                    label: "Yes",
                    description: "Passport has different nationality",
                    icon: <Info className="h-5 w-5" />,
                    iconColor: "text-amber-600",
                  },
                ]}
                layout="grid"
                columns="2"
                padding="small"
                size="small"
              />
            )}
          </form.AppField>

          {/* Conditional Nationality Field */}
          <form.AppField name="personalInfo.passport.isDifferentNationality">
            {(nationalityField: AnyFieldApi) => {
              if (!nationalityField.state.value) return null;

              return (
                <form.AppField
                  name="personalInfo.passport.nationality"
                  validators={{
                    onBlur: ({ value }: { value: string }) => {
                      if (!value || value.trim() === "") {
                        return "Nationality is required";
                      }
                      const result = validateNationality.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field: AnyFieldApi) => (
                    <FormField
                      field={field}
                      label="Passport Nationality"
                      placeholder="Enter your passport nationality"
                      required
                      description="Enter the nationality that appears in the passport with which you are going to travel."
                    />
                  )}
                </form.AppField>
              );
            }}
          </form.AppField>

          <form.AppField name="personalInfo.passport.expiryDate">
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label="Passport Expiry Date"
                required
                description="Must be valid for at least 3 months. Some countries require 6 months."
              >
                <DatePickerWithFormContext
                  mode="future"
                  value={
                    field.state.value ? new Date(field.state.value) : undefined
                  }
                  onChange={(date) =>
                    field.handleChange(
                      date ? lightFormat(date, "yyyy-MM-dd") : ""
                    )
                  }
                  className="max-w-xs"
                />
              </FormField>
            )}
          </form.AppField>
        </CardContent>
      </Card>
    </div>
  );
}
