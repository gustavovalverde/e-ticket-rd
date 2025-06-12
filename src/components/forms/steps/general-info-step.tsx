"use client";

import { MapPin, InfoIcon } from "lucide-react";
import React from "react";

import { FormField } from "@/components/forms/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  permanentAddressSchema,
  residenceCountrySchema,
  citySchema,
  stateSchema,
  postalCodeSchema,
} from "@/lib/schemas/validation";

import type { AnyFieldApi } from "@tanstack/react-form";

interface GeneralInfoStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

export function GeneralInfoStep({ form }: GeneralInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          General Information
        </h2>
        <p className="text-muted-foreground">
          Tell us about your current residence
        </p>
      </div>

      {/* Current Residence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Current Residence
          </CardTitle>
          <CardDescription>Where do you currently live?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.AppField
            name="generalInfo.permanentAddress"
            validators={{
              onChange: ({ value }: { value: string }) => {
                const result = permanentAddressSchema.safeParse(value);
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
              name="generalInfo.city"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = citySchema.safeParse(value);
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

            <form.AppField
              name="generalInfo.state"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = stateSchema.safeParse(value);
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
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <form.AppField
              name="generalInfo.residenceCountry"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = residenceCountrySchema.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Country"
                  placeholder="Enter your country of residence"
                  required
                />
              )}
            </form.AppField>

            <form.AppField
              name="generalInfo.postalCode"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = postalCodeSchema.safeParse(value);
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
      <form.AppField name="groupTravel.isGroupTravel">
        {(groupField: AnyFieldApi) => {
          if (!groupField.state.value) return null;

          return (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Address sharing:</strong> Since you&apos;re traveling as
                a group, you can share this address information with your travel
                companions. Each person can have different addresses if needed.
              </AlertDescription>
            </Alert>
          );
        }}
      </form.AppField>
    </div>
  );
}
