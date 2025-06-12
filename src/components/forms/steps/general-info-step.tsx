"use client";

import { MapPin, InfoIcon, ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

import { FormField } from "@/components/forms/form-field";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  permanentAddressSchema,
  residenceCountrySchema,
  citySchema,
  stateSchema,
  postalCodeSchema,
  hasStopsSchema,
  entryOrExitSchema,
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
          Tell us about your residence and travel direction
        </p>
      </div>

      {/* Travel Direction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Travel Direction
          </CardTitle>
          <CardDescription>
            Are you entering or leaving the Dominican Republic?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="generalInfo.entryOrExit"
            validators={{
              onChange: ({ value }: { value: string }) => {
                const result = entryOrExitSchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <div className="space-y-4">
                <FormRadioGroup
                  field={field}
                  options={[
                    {
                      value: "ENTRY",
                      id: "entry",
                      label: "Entering Dominican Republic",
                      description: undefined,
                      icon: <ArrowDown className="h-6 w-6" />,
                      iconBg: undefined,
                      iconColor: undefined,
                    },
                    {
                      value: "EXIT",
                      id: "exit",
                      label: "Leaving Dominican Republic",
                      description: undefined,
                      icon: <ArrowUp className="h-6 w-6" />,
                      iconBg: undefined,
                      iconColor: undefined,
                    },
                  ]}
                  layout="grid"
                  columns="2"
                  padding="small"
                  size="small"
                />
              </div>
            )}
          </form.AppField>
        </CardContent>
      </Card>

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

      {/* Travel Route */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Travel Route
          </CardTitle>
          <CardDescription>
            Is this a direct flight or do you have connections?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="generalInfo.hasStops"
            validators={{
              onChange: ({ value }: { value: boolean }) => {
                const result = hasStopsSchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <div className="space-y-4">
                <Label className="text-base font-medium">Flight Type</Label>
                <RadioGroup
                  value={field.state.value ? "yes" : "no"}
                  onValueChange={(value) => field.handleChange(value === "yes")}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="no" id="direct" />
                    <Label htmlFor="direct" className="flex-1 cursor-pointer">
                      <div className="font-medium">Direct Flight</div>
                      <div className="text-muted-foreground text-sm">
                        No connecting flights or stops
                      </div>
                    </Label>
                  </div>
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="yes" id="stops" />
                    <Label htmlFor="stops" className="flex-1 cursor-pointer">
                      <div className="font-medium">With Connections</div>
                      <div className="text-muted-foreground text-sm">
                        Has connecting flights or stops
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm" role="alert">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.AppField>
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
