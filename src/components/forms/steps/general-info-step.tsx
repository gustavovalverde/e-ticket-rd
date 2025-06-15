"use client";

import { MapPin, InfoIcon } from "lucide-react";
import React from "react";

import { FormField } from "@/components/forms/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountrySelect } from "@/components/ui/country-select";
import { useStore } from "@/components/ui/tanstack-form";
import {
  validatePermanentAddress,
  validateResidenceCountry,
  validateCity,
  validateState,
  validatePostalCode,
} from "@/lib/schemas/validation";

import type { AnyFieldApi } from "@tanstack/react-form";

interface GeneralInfoStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

export function GeneralInfoStep({ form }: GeneralInfoStepProps) {
  const isGroupTravel = useStore(
    form.store,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.values.travelCompanions.isGroupTravel
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Permanent Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.AppField
            name="generalInfo.permanentAddress"
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
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label="Street Address"
                placeholder="Enter your complete street address"
                required
              />
            )}
          </form.AppField>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <form.AppField
              name="generalInfo.residenceCountry"
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
              {(field: AnyFieldApi) => (
                <FormField field={field} label="Country" required>
                  <CountrySelect
                    field={field}
                    placeholder="Select your country of residence"
                  />
                </FormField>
              )}
            </form.AppField>

            <form.AppField
              name="generalInfo.city"
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
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="City"
                  placeholder="Enter your city"
                  required
                />
              )}
            </form.AppField>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <form.AppField
              name="generalInfo.state"
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
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="State/Province"
                  placeholder="Enter your state or province"
                />
              )}
            </form.AppField>

            <form.AppField
              name="generalInfo.postalCode"
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
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Postal Code"
                  placeholder="Enter your postal/ZIP code"
                />
              )}
            </form.AppField>
          </div>
        </CardContent>
      </Card>

      {/* Benefits for Group Travel */}
      {isGroupTravel && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Group travel:</strong> Address information can be shared
            with family members if applicable.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
