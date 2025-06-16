"use client";

import { lightFormat } from "date-fns";
import { User, FileText, Check, Info, Home, CheckCircle } from "lucide-react";
import * as React from "react";

import { FormField } from "@/components/forms/form-field";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountrySelect } from "@/components/ui/country-select";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldContext, useStore } from "@/components/ui/tanstack-form";
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

import type { ApplicationData } from "@/lib/schemas/forms";
import type { AppFormApi, AppFieldApi, FormStepId } from "@/lib/types/form-api";

// =====================================================
// CONSTANTS
// =====================================================

const ICON_COLOR_BLUE = "text-blue-600";
const DEFAULT_STEP_ID = "all-travelers";

// =====================================================
// REUSABLE MIGRATORY INFO COMPONENTS
// =====================================================

interface MigratoryInfoSectionProps {
  form: AppFormApi;
  fieldPrefix?: string; // For array fields: "travelers[0]" or ""
  travelerIndex?: number;
  showResidencyStatus?: boolean;
  showHeader?: boolean;
  showAddress?: boolean; // Whether to show address section
  stepId?: FormStepId; // Step context for unique ID generation
}

/**
 * Comprehensive migratory information section that includes:
 * - Name information
 * - Birth information
 * - Passport information
 * - Residency status (conditional)
 * - Address information (conditional)
 */
export function MigratoryInfoSection({
  form,
  fieldPrefix = "",
  travelerIndex,
  showResidencyStatus = true,
  showHeader = true,
  showAddress = true,
  stepId = DEFAULT_STEP_ID,
}: MigratoryInfoSectionProps) {
  // Reactive values using TanStack Form's useStore
  const isEnteringDR = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.flightInfo
        .travelDirection === "ENTRY"
  );

  const isDifferentNationality = useStore(form.store, (state: unknown) => {
    const applicationState = state as { values: ApplicationData };
    if (fieldPrefix && travelerIndex !== undefined) {
      // For array items: travelers[0].personalInfo.passport.isDifferentNationality
      // eslint-disable-next-line security/detect-object-injection
      const traveler = applicationState.values.travelers?.[travelerIndex];
      return traveler?.personalInfo?.passport?.isDifferentNationality;
    }
    // No single traveler path - this is only used for array-based travelers
    return false;
  });

  return (
    <div className="space-y-6">
      {showHeader && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Migratory Information
              {travelerIndex !== undefined && (
                <Badge variant="outline">Traveler {travelerIndex + 1}</Badge>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Name Information */}
      <NameInformationSection form={form} fieldPrefix={fieldPrefix} />

      {/* Birth Information */}
      <BirthInformationSection
        form={form}
        fieldPrefix={fieldPrefix}
        stepId={stepId}
        travelerIndex={travelerIndex}
      />

      {/* Residency Status - Only show when entering DR */}
      {showResidencyStatus && isEnteringDR && (
        <ResidencyStatusSection
          form={form}
          fieldPrefix={fieldPrefix}
          stepId={stepId}
          travelerIndex={travelerIndex}
        />
      )}

      {/* Passport Information */}
      <PassportInformationSection
        form={form}
        fieldPrefix={fieldPrefix}
        stepId={stepId}
        travelerIndex={travelerIndex}
        isDifferentNationality={isDifferentNationality || false}
      />

      {/* Address Section - Uses linked field logic */}
      {showAddress && (
        <AddressSection
          form={form}
          fieldPrefix={fieldPrefix}
          travelerIndex={travelerIndex}
        />
      )}
    </div>
  );
}

/**
 * Name Information Section - Reusable component
 */
export function NameInformationSection({
  form,
  fieldPrefix = "",
}: {
  form: AppFormApi;
  fieldPrefix?: string;
}) {
  const fieldName = (name: string) =>
    fieldPrefix ? `${fieldPrefix}.${name}` : name;

  return (
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
            name={fieldName("personalInfo.firstName")}
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
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="Given or first name(s)"
                required
              />
            )}
          </form.AppField>

          <form.AppField
            name={fieldName("personalInfo.lastName")}
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
            {(field: AppFieldApi) => (
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
  );
}

/**
 * Birth Information Section - Reusable component
 */
export function BirthInformationSection({
  form,
  fieldPrefix = "",
  stepId = DEFAULT_STEP_ID,
  travelerIndex,
}: {
  form: AppFormApi;
  fieldPrefix?: string;
  stepId?: FormStepId;
  travelerIndex?: number;
}) {
  const fieldName = (name: string) =>
    fieldPrefix ? `${fieldPrefix}.${name}` : name;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Birth Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.AppField name={fieldName("personalInfo.birthDate")}>
          {(field: AppFieldApi) => (
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
          name={fieldName("personalInfo.birthCountry")}
          validators={{
            onBlur: ({ value }: { value: string }) => {
              if (!value || value.trim() === "")
                return "Country of birth is required";
              return undefined;
            },
          }}
        >
          {(field: AppFieldApi) => (
            <FormField
              field={field}
              label="Country of Birth"
              required
              description="Select the country where you were born"
            >
              <CountrySelect
                field={field}
                placeholder="Select your country of birth"
              />
            </FormField>
          )}
        </form.AppField>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <form.AppField
            name={fieldName("personalInfo.sex")}
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
            {(field: AppFieldApi) => (
              <FormRadioGroup
                field={field}
                stepId={stepId}
                travelerIndex={travelerIndex}
                label="Sex"
                options={[
                  {
                    value: "MALE",
                    label: "Male",
                    icon: <User className="h-5 w-5" />,
                    iconColor: ICON_COLOR_BLUE,
                  },
                  {
                    value: "FEMALE",
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

          <form.AppField name={fieldName("personalInfo.civilStatus")}>
            {(field: AppFieldApi) => (
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
          name={fieldName("personalInfo.occupation")}
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
          {(field: AppFieldApi) => (
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
  );
}

/**
 * Residency Status Section - Conditional component
 */
export function ResidencyStatusSection({
  form,
  fieldPrefix = "",
  stepId = DEFAULT_STEP_ID,
  travelerIndex,
}: {
  form: AppFormApi;
  fieldPrefix?: string;
  stepId?: FormStepId;
  travelerIndex?: number;
}) {
  const fieldName = (name: string) =>
    fieldPrefix ? `${fieldPrefix}.${name}` : name;

  const isEnteringDR = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.flightInfo
        .travelDirection === "ENTRY"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Residency Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.AppField
          name={fieldName("personalInfo.isForeignResident")}
          validators={{
            onChange: ({ value }: { value: boolean }) => {
              if (isEnteringDR && (value === null || value === undefined)) {
                return "Please indicate your residency status in Dominican Republic";
              }
              return undefined;
            },
          }}
        >
          {(field: AppFieldApi) => (
            <FormRadioGroup
              field={booleanFieldAdapter(field)}
              stepId={stepId}
              travelerIndex={travelerIndex}
              label="Are you a foreign resident in the Dominican Republic?"
              required={isEnteringDR}
              options={[
                {
                  value: "no",
                  label: "No",
                  description: "I am not a foreign resident",
                  icon: <Check className="h-5 w-5" />,
                  iconColor: "text-green-600",
                },
                {
                  value: "yes",
                  label: "Yes",
                  description: "I am a foreign resident",
                  icon: <Info className="h-5 w-5" />,
                  iconColor: ICON_COLOR_BLUE,
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
  );
}

/**
 * Passport Information Section - Reusable component
 */
export function PassportInformationSection({
  form,
  fieldPrefix = "",
  stepId = DEFAULT_STEP_ID,
  travelerIndex,
  isDifferentNationality,
}: {
  form: AppFormApi;
  fieldPrefix?: string;
  stepId?: FormStepId;
  travelerIndex?: number;
  isDifferentNationality: boolean;
}) {
  const fieldName = (name: string) =>
    fieldPrefix ? `${fieldPrefix}.${name}` : name;

  return (
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
            name={fieldName("personalInfo.passport.number")}
            validators={{
              onChange: ({
                value,
                fieldApi,
              }: {
                value: string;
                fieldApi: AppFieldApi;
              }) => {
                if (!value || value.trim() === "") {
                  return "Passport number is required";
                }
                const result = validatePassportNumber.safeParse(value);
                if (!result.success) {
                  return result.error.issues[0]?.message;
                }

                // Trigger re-validation of confirm field if it has a value
                const confirmFieldName = fieldName(
                  "personalInfo.passport.confirmNumber"
                );
                fieldApi.form.validateField(confirmFieldName, "change");

                return undefined;
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="Passport Number"
                type="text"
                placeholder="Enter passport number"
                required
                description="As it appears on your passport"
                className="uppercase"
              />
            )}
          </form.AppField>

          <form.AppField
            name={fieldName("personalInfo.passport.confirmNumber")}
            validators={{
              onChange: ({
                value,
                fieldApi,
              }: {
                value: string;
                fieldApi: AppFieldApi;
              }) => {
                if (!value || value.trim() === "") {
                  return "Please confirm your passport number";
                }

                // Get the original passport number
                const originalFieldName = fieldName(
                  "personalInfo.passport.number"
                );
                const originalValue =
                  fieldApi.form.getFieldValue(originalFieldName);

                if (value !== originalValue) {
                  return "Passport numbers do not match";
                }

                return undefined;
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="Confirm Passport Number"
                type="text"
                placeholder="Re-enter passport number"
                required
                description="Must match the passport number above"
                className="uppercase"
              />
            )}
          </form.AppField>
        </div>

        <form.AppField
          name={fieldName("personalInfo.passport.nationality")}
          validators={{
            onBlur: ({ value }: { value: string }) => {
              if (!value || value.trim() === "")
                return "Nationality is required";
              const result = validateNationality.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field: AppFieldApi) => (
            <FormField
              field={field}
              label="Nationality"
              required
              description="As it appears on your passport"
            >
              <CountrySelect
                field={field}
                placeholder="Select your nationality"
              />
            </FormField>
          )}
        </form.AppField>

        <form.AppField name={fieldName("personalInfo.passport.expiryDate")}>
          {(field: AppFieldApi) => (
            <FormField field={field} label="Passport Expiry Date" required>
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

        {/* Different Nationality Question */}
        <form.AppField
          name={fieldName("personalInfo.passport.isDifferentNationality")}
        >
          {(field: AppFieldApi) => (
            <FormRadioGroup
              field={booleanFieldAdapter(field)}
              stepId={stepId}
              travelerIndex={travelerIndex}
              label="Do you have a different nationality from your passport-issuing country?"
              options={[
                {
                  value: "no",
                  label: "No",
                  description: "My nationality is the same as my passport",
                  icon: <Check className="h-5 w-5" />,
                  iconColor: "text-green-600",
                },
                {
                  value: "yes",
                  label: "Yes",
                  description: "I have a different nationality",
                  icon: <Info className="h-5 w-5" />,
                  iconColor: ICON_COLOR_BLUE,
                },
              ]}
              layout="grid"
              columns="2"
              padding="small"
              size="small"
            />
          )}
        </form.AppField>

        {/* Additional Nationality - Only show if different nationality */}
        {isDifferentNationality && (
          <form.AppField
            name={fieldName("personalInfo.passport.additionalNationality")}
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (isDifferentNationality && (!value || value.trim() === ""))
                  return "Please specify your additional nationality";
                return undefined;
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="Additional Nationality"
                required={isDifferentNationality}
                description="Your other nationality"
              >
                <CountrySelect
                  field={field}
                  placeholder="Select your additional nationality"
                />
              </FormField>
            )}
          </form.AppField>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Address Section - Smart sharing based on group type
 */
export function AddressSection({
  form,
  fieldPrefix = "",
  travelerIndex,
}: {
  form: AppFormApi;
  fieldPrefix?: string;
  travelerIndex?: number;
}) {
  // Check if this traveler uses shared address (from group logic)
  const usesSharedAddress = useStore(form.store, (state: unknown) => {
    const applicationState = state as { values: ApplicationData };
    if (fieldPrefix && travelerIndex !== undefined) {
      // eslint-disable-next-line security/detect-object-injection
      const traveler = applicationState.values.travelers?.[travelerIndex];
      return traveler?.addressInheritance?.usesSharedAddress || false;
    }
    return false;
  });

  const groupNature = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.travelCompanions
        ?.groupNature
  );

  if (usesSharedAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Address Information
            <Badge variant="outline">Shared Address</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Using Shared Address</p>
              <p className="text-muted-foreground text-sm">
                {groupNature === "Family"
                  ? "This family member will use the lead traveler's address"
                  : "This companion will use the lead traveler's address"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <IndividualAddressForm form={form} fieldPrefix={fieldPrefix} />;
}

/**
 * Individual Address Form - For travelers who need their own address
 */
function IndividualAddressForm({
  form,
  fieldPrefix = "",
}: {
  form: AppFormApi;
  fieldPrefix?: string;
}) {
  const fieldName = (name: string) =>
    fieldPrefix ? `${fieldPrefix}.${name}` : name;

  // Determine if we're in a group travel scenario or single traveler
  const isGroupTravel = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.travelCompanions
        ?.isGroupTravel
  );

  // For group travel, use individual address path; for solo, use general info
  const getAddressFieldName = (field: string) => {
    if (isGroupTravel && fieldPrefix) {
      return fieldName(`addressInheritance.individualAddress.${field}`);
    }
    return `generalInfo.${field}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.AppField
          name={getAddressFieldName("permanentAddress")}
          validators={{
            onBlur: ({ value }: { value: string }) => {
              if (!value || value.trim() === "")
                return "Permanent address is required";
              return undefined;
            },
          }}
        >
          {(field: AppFieldApi) => (
            <FormField
              field={field}
              label="Permanent Address"
              placeholder="Enter your permanent address"
              required
              description="Street address, apartment, suite, etc."
            />
          )}
        </form.AppField>

        <form.AppField
          name={getAddressFieldName("residenceCountry")}
          validators={{
            onBlur: ({ value }: { value: string }) => {
              if (!value || value.trim() === "")
                return "Country of residence is required";
              return undefined;
            },
          }}
        >
          {(field: AppFieldApi) => (
            <FormField
              field={field}
              label="Country of Residence"
              required
              description="Country where you currently live"
            >
              <CountrySelect
                field={field}
                placeholder="Select your country of residence"
              />
            </FormField>
          )}
        </form.AppField>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <form.AppField
            name={getAddressFieldName("city")}
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") return "City is required";
                return undefined;
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="City"
                placeholder="Enter city"
                required
              />
            )}
          </form.AppField>

          <form.AppField name={getAddressFieldName("state")}>
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="State/Province"
                placeholder="Enter state or province"
                description="Optional"
              />
            )}
          </form.AppField>

          <form.AppField name={getAddressFieldName("postalCode")}>
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="Postal Code"
                placeholder="Enter postal code"
                description="Optional"
              />
            )}
          </form.AppField>
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// HELPER COMPONENTS
// =====================================================

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
  const { formItemId } = useFieldContext();

  return (
    <DatePicker
      id={formItemId}
      mode={mode}
      value={value}
      onChange={onChange}
      className={className}
      placeholder="Select date"
    />
  );
}

function SelectWithFormContext({
  field,
  placeholder,
  children,
}: {
  field: AppFieldApi;
  placeholder: string;
  children: React.ReactNode;
}) {
  const { formItemId } = useFieldContext();

  return (
    <Select value={field.state.value || ""} onValueChange={field.handleChange}>
      <SelectTrigger id={formItemId}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
