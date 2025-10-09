"use client";

import { parseISO, format } from "date-fns";
import {
  Check,
  CheckCircle,
  FileText,
  Home,
  Info,
  InfoIcon,
  MapPin,
  User,
} from "lucide-react";
import * as React from "react";

import { FormField } from "@/components/forms/form-field";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { PassportOcrUpload } from "@/components/forms/passport-ocr-upload";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  CIVIL_STATUS_OPTIONS,
  OCCUPATION_OPTIONS,
  validateCity,
  validateFirstName,
  validateLastName,
  validateNationality,
  validateOccupation,
  validatePassportNumber,
  validatePermanentAddress,
  validatePostalCode,
  validateResidenceCountry,
  validateSex,
  validateState,
} from "@/lib/schemas/validation";
import { booleanFieldAdapter } from "@/lib/utils/form-utils";

import type { ApplicationData } from "@/lib/schemas/forms";
import type { AppFieldApi, AppFormApi, FormStepId } from "@/lib/types/form-api";
import type { MrzResult } from "@/lib/types/passport";

// =====================================================
// CONSTANTS
// =====================================================

const ICON_COLOR_BLUE = "text-blue-600";
const DEFAULT_STEP_ID = "all-travelers";

const PASSPORT_NUMBER_FIELD_PATH = "personalInfo.passport.number";
const PASSPORT_CONFIRM_FIELD_PATH = "personalInfo.passport.confirmNumber";
const PASSPORT_NATIONALITY_FIELD_PATH = "personalInfo.passport.nationality";

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

// Moved to the top to prevent recreation on every render
const fieldName = (fieldPrefix: string, name: string) =>
  fieldPrefix ? `${fieldPrefix}.${name}` : name;

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

      {/* Migration Information Context Alert - Inherited from general-info-step.tsx */}
      <MigrationInfoAlert form={form} travelerIndex={travelerIndex} />
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
            name={fieldName(fieldPrefix, "personalInfo.firstName")}
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
                inputMode="text"
                autoComplete="given-name"
              />
            )}
          </form.AppField>

          <form.AppField
            name={fieldName(fieldPrefix, "personalInfo.lastName")}
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
                inputMode="text"
                autoComplete="family-name"
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Birth Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form.AppField name={fieldName(fieldPrefix, "personalInfo.birthDate")}>
          {(field: AppFieldApi) => (
            <FormField field={field} label="Date of Birth" required>
              <DatePickerWithFormContext
                field={field}
                mode="past"
                className="max-w-xs"
              />
            </FormField>
          )}
        </form.AppField>

        <form.AppField
          name={fieldName(fieldPrefix, "personalInfo.birthCountry")}
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
            name={fieldName(fieldPrefix, "personalInfo.sex")}
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

          <form.AppField
            name={fieldName(fieldPrefix, "personalInfo.civilStatus")}
          >
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
          name={fieldName(fieldPrefix, "personalInfo.occupation")}
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
          name={fieldName(fieldPrefix, "personalInfo.isForeignResident")}
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Passport Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Passport OCR Scanner */}
        <PassportScannerSection form={form} fieldPrefix={fieldPrefix} />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <form.AppField
            name={fieldName(fieldPrefix, PASSPORT_NUMBER_FIELD_PATH)}
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
                  fieldPrefix,
                  PASSPORT_CONFIRM_FIELD_PATH
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
                className="uppercase"
                inputMode="text"
                autoComplete="off"
              />
            )}
          </form.AppField>

          <form.AppField
            name={fieldName(fieldPrefix, PASSPORT_CONFIRM_FIELD_PATH)}
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
                  fieldPrefix,
                  PASSPORT_NUMBER_FIELD_PATH
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
                className="uppercase"
                inputMode="text"
                autoComplete="off"
              />
            )}
          </form.AppField>
        </div>

        <form.AppField
          name={fieldName(fieldPrefix, PASSPORT_NATIONALITY_FIELD_PATH)}
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

        <form.AppField
          name={fieldName(fieldPrefix, "personalInfo.passport.expiryDate")}
        >
          {(field: AppFieldApi) => (
            <FormField field={field} label="Passport Expiry Date" required>
              <DatePickerWithFormContext
                field={field}
                mode="future"
                className="max-w-xs"
              />
            </FormField>
          )}
        </form.AppField>

        {/* Different Nationality Question */}
        <form.AppField
          name={fieldName(
            fieldPrefix,
            "personalInfo.passport.isDifferentNationality"
          )}
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
            name={fieldName(
              fieldPrefix,
              "personalInfo.passport.additionalNationality"
            )}
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
 * Address Information Alert - Inherited from general-info-step.tsx pattern
 * Provides contextual information about address collection
 */
function AddressInformationAlert({
  form,
  _fieldPrefix,
  travelerIndex,
}: {
  form: AppFormApi;
  _fieldPrefix?: string;
  travelerIndex?: number;
}) {
  const isGroupTravel = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.travelCompanions
        ?.isGroupTravel
  );

  const groupNature = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.travelCompanions
        ?.groupNature
  );

  const isLeadTraveler = travelerIndex === 0;

  // Show different alerts based on context
  if (!isGroupTravel) {
    // Solo traveler
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Address information:</strong> This will be used for your
          e-ticket and any official correspondence.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLeadTraveler) {
    // Lead traveler in group
    const familyMessage =
      groupNature === "Family" || groupNature === "Partner"
        ? "Your address will be used for all family members in your group."
        : "Each traveler in your group will need to provide their own address information.";

    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Group travel:</strong> {familyMessage}
        </AlertDescription>
      </Alert>
    );
  }

  // Companion traveler (non-lead)
  return (
    <Alert>
      <InfoIcon className="h-4 w-4" />
      <AlertDescription>
        <strong>Individual address:</strong> Please provide your own address
        information as this group requires individual addresses.
      </AlertDescription>
    </Alert>
  );
}

/**
 * Migration Information Context Alert - Inherited from general-info-step.tsx pattern
 * Provides context about why migration information is needed
 */
function MigrationInfoAlert({
  form,
  travelerIndex,
}: {
  form: AppFormApi;
  travelerIndex?: number;
}) {
  const travelDirection = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.flightInfo.travelDirection
  );

  const isLeadTraveler = travelerIndex === 0;

  if (travelDirection === "ENTRY") {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Entry to Dominican Republic:</strong> This information is
          required for immigration control and will be verified against your
          passport at arrival.
        </AlertDescription>
      </Alert>
    );
  }

  if (travelDirection === "EXIT") {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Departure from Dominican Republic:</strong> This information
          helps ensure a smooth departure process at the airport.
        </AlertDescription>
      </Alert>
    );
  }

  // Fallback for when travel direction is not set
  if (isLeadTraveler) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>E-Ticket System:</strong> This information will be used to
          generate your official e-ticket for Dominican Republic migration
          control.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
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

  return (
    <div className="space-y-6">
      <IndividualAddressForm form={form} fieldPrefix={fieldPrefix} />

      {/* Contextual Information Alert - Inherited from general-info-step.tsx */}
      <AddressInformationAlert
        form={form}
        _fieldPrefix={fieldPrefix}
        travelerIndex={travelerIndex}
      />
    </div>
  );
}

/**
 * Enhanced Address Form - Based on well-designed general-info-step.tsx
 * For travelers who need their own address information
 */
function IndividualAddressForm({
  form,
  fieldPrefix = "",
}: {
  form: AppFormApi;
  fieldPrefix?: string;
}) {
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
      // Group travel: use individual address inheritance logic
      return fieldName(
        fieldPrefix,
        `addressInheritance.individualAddress.${field}`
      );
    }
    // Solo travel: collect address directly in traveler record (replaces General Info step)
    return fieldName(
      fieldPrefix,
      `addressInheritance.individualAddress.${field}`
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Street Address - Enhanced with better validation */}
        <form.AppField
          name={getAddressFieldName("permanentAddress")}
          validators={{
            onBlur: ({ value }: { value: string }) => {
              if (!value || value.trim() === "") {
                return "Street address is required";
              }
              const result = validatePermanentAddress.safeParse(value);
              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field: AppFieldApi) => (
            <FormField
              field={field}
              label="Street Address"
              placeholder="Enter your complete street address"
              required
              inputMode="text"
              autoComplete="address-line1"
            />
          )}
        </form.AppField>

        {/* Country and City - Enhanced grid layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <form.AppField
            name={getAddressFieldName("residenceCountry")}
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return "Country is required";
                }
                const result = validateResidenceCountry.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="Country"
                required
                autoComplete="country-name"
              >
                <CountrySelect
                  field={field}
                  placeholder="Country of residence"
                />
              </FormField>
            )}
          </form.AppField>

          <form.AppField
            name={getAddressFieldName("city")}
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return "City is required";
                }
                const result = validateCity.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="City"
                placeholder="Enter your city"
                required
                inputMode="text"
                autoComplete="address-level2"
              />
            )}
          </form.AppField>
        </div>

        {/* State and Postal Code - Enhanced validation */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <form.AppField
            name={getAddressFieldName("state")}
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") return undefined; // Optional field
                const result = validateState.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="State/Province"
                placeholder="Enter your state or province"
                inputMode="text"
                autoComplete="address-level1"
              />
            )}
          </form.AppField>

          <form.AppField
            name={getAddressFieldName("postalCode")}
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") return undefined; // Optional field
                const result = validatePostalCode.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="Postal Code"
                placeholder="Enter your postal/ZIP code"
                inputMode="text"
                autoComplete="postal-code"
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
  field,
  mode,
  className,
}: {
  field: AppFieldApi;
  mode?: "future" | "past" | "any";
  className?: string;
}) {
  const { formItemId } = useFieldContext();

  const parsedDate = field.state.value
    ? parseISO(field.state.value)
    : undefined;

  return (
    <DatePicker
      id={formItemId}
      value={parsedDate}
      onChange={(date) => {
        const isoString = date ? format(date, "yyyy-MM-dd") : "";
        field.handleChange(isoString);
      }}
      mode={mode}
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

/**
 * Passport Scanner Section - Focused component for OCR functionality
 */
function PassportScannerSection({
  form,
  fieldPrefix = "",
}: {
  form: AppFormApi;
  fieldPrefix?: string;
}) {
  const applyOcrDataToFields = React.useCallback(
    (ocrResult: MrzResult) => {
      if (!ocrResult) return;

      // Constants to avoid duplicate strings
      const PASSPORT_NUMBER_FIELD = fieldName(
        fieldPrefix,
        PASSPORT_NUMBER_FIELD_PATH
      );
      const PASSPORT_CONFIRM_FIELD = fieldName(
        fieldPrefix,
        PASSPORT_CONFIRM_FIELD_PATH
      );

      const fieldMappings: Array<{
        sourceValue: string;
        targetFields: string[];
      }> = [
        {
          sourceValue: ocrResult.passportNumber,
          targetFields: [PASSPORT_NUMBER_FIELD, PASSPORT_CONFIRM_FIELD],
        },
        {
          sourceValue: ocrResult.nationality,
          targetFields: [
            fieldName(fieldPrefix, PASSPORT_NATIONALITY_FIELD_PATH),
          ],
        },
        {
          sourceValue: ocrResult.birthDate,
          targetFields: [fieldName(fieldPrefix, "personalInfo.birthDate")],
        },
        {
          sourceValue: ocrResult.expiryDate,
          targetFields: [
            fieldName(fieldPrefix, "personalInfo.passport.expiryDate"),
          ],
        },
      ];

      fieldMappings.forEach((mapping) => {
        // Only skip if the value is undefined/null, not if it's empty string
        if (mapping.sourceValue !== undefined && mapping.sourceValue !== null) {
          mapping.targetFields.forEach((fieldPath) => {
            try {
              // Set the field value with touch: true
              form.setFieldValue(fieldPath, mapping.sourceValue, {
                touch: true,
              });

              // Validate the field to clear any existing errors
              form.validateField(fieldPath, "change");
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error(`Failed to set field ${fieldPath}:`, error);
            }
          });
        }
      });
    },
    [form, fieldPrefix]
  );

  return (
    <div className="space-y-2 rounded-lg border border-dashed p-4">
      <h4 className="text-base font-semibold">Passport Scanner (Optional)</h4>
      <p className="text-muted-foreground text-sm">
        Scan your passport to automatically fill in your information. This is
        optional - you can also enter details manually below.
      </p>
      <p className="text-muted-foreground text-xs">
        Processes on your device, no data is sent to servers. Works offline
        after the first visit.
      </p>
      <PassportOcrUpload onSuccess={applyOcrDataToFields} />
    </div>
  );
}
