"use client";

import { zodValidator } from "@tanstack/zod-form-adapter";
import { MapPin, InfoIcon } from "lucide-react";
import React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { getErrorMessage } from "@/lib/utils";

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
          <form.Field
            name="generalInfo.entryOrExit"
            validators={{ onChange: entryOrExitSchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Travel Direction *
                </Label>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="ENTRY" id="entry" />
                    <Label htmlFor="entry" className="flex-1 cursor-pointer">
                      Entering Dominican Republic
                    </Label>
                  </div>
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="EXIT" id="exit" />
                    <Label htmlFor="exit" className="flex-1 cursor-pointer">
                      Leaving Dominican Republic
                    </Label>
                  </div>
                </RadioGroup>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
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
        <CardContent className="space-y-4">
          <form.Field
            name="generalInfo.permanentAddress"
            validators={{ onChange: permanentAddressSchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter your complete street address"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="generalInfo.city"
              validators={{ onChange: citySchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter your city"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="generalInfo.state"
              validators={{ onChange: stateSchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    placeholder="Enter your state or province"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="generalInfo.residenceCountry"
              validators={{ onChange: residenceCountrySchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    placeholder="Enter your country of residence"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="generalInfo.postalCode"
              validators={{ onChange: postalCodeSchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    placeholder="Enter your postal/ZIP code"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
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
          <form.Field
            name="generalInfo.hasStops"
            validators={{ onChange: hasStopsSchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
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
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Benefits for Group Travel */}
      <form.Field name="groupTravel.isGroupTravel">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(groupField: any) => {
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
      </form.Field>
    </div>
  );
}
