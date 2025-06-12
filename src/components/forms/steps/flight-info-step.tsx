"use client";

import { Plane, Zap, InfoIcon, ArrowDown, ArrowUp, Route } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  flightNumberSchema,
  airlineSchema,
  departurePortSchema,
  arrivalPortSchema,
} from "@/lib/schemas/validation";

import type { AnyFieldApi } from "@tanstack/react-form";

interface FlightInfoStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

// Mock flight data lookup function
function getFlightData(flightNumber: string) {
  // Simulate flight lookup - in production this would call an API
  const mockFlights = new Map([
    ["AA", { airline: "American Airlines", departure: "JFK", arrival: "SDQ" }],
    ["DL", { airline: "Delta Air Lines", departure: "ATL", arrival: "SDQ" }],
    ["UA", { airline: "United Airlines", departure: "EWR", arrival: "SDQ" }],
    ["B6", { airline: "JetBlue Airways", departure: "JFK", arrival: "SDQ" }],
  ]);

  const prefix = flightNumber.slice(0, 2);
  return mockFlights.get(prefix) || null;
}

export function FlightInfoStep({ form }: FlightInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Flight Information
        </h2>
        <p className="text-muted-foreground">
          Enter your flight details for travel processing
        </p>
      </div>

      {/* Travel Direction - First Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDown className="h-5 w-5" />
            Travel Direction
          </CardTitle>
          <CardDescription>
            Are you entering or leaving the Dominican Republic?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField name="flightInfo.travelDirection">
            {(field: AnyFieldApi) => (
              <div className="space-y-4">
                <FormRadioGroup
                  field={field}
                  options={[
                    {
                      value: "ENTRY",
                      id: "entry",
                      label: "Entering Dominican Republic",
                      description: "I'm arriving in the Dominican Republic",
                      icon: <ArrowDown className="h-6 w-6" />,
                      iconBg: "bg-green-100",
                      iconColor: "text-green-700",
                    },
                    {
                      value: "EXIT",
                      id: "exit",
                      label: "Leaving Dominican Republic",
                      description: "I'm departing from the Dominican Republic",
                      icon: <ArrowUp className="h-6 w-6" />,
                      iconBg: "bg-blue-100",
                      iconColor: "text-blue-700",
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

      {/* Main Flight Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Details
          </CardTitle>
          <CardDescription>
            Enter your flight details for travel processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Flight Number with Smart Auto-fill */}
          <form.AppField
            name="flightInfo.flightNumber"
            validators={{
              onChange: ({ value }: { value: string }) => {
                const result = flightNumberSchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
              onChangeAsyncDebounceMs: 500,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChangeAsync: async ({ value }: any) => {
                if (value && value.length >= 2) {
                  // Simulate flight lookup
                  const flightData = getFlightData(value);
                  if (flightData) {
                    // Auto-fill the other fields
                    form.setFieldValue(
                      "flightInfo.airline",
                      flightData.airline
                    );
                    form.setFieldValue(
                      "flightInfo.departurePort",
                      flightData.departure
                    );
                    form.setFieldValue(
                      "flightInfo.arrivalPort",
                      flightData.arrival
                    );
                    return undefined; // Valid
                  } else {
                    // Clear the auto-filled fields if flight not found
                    form.setFieldValue("flightInfo.airline", "");
                    form.setFieldValue("flightInfo.departurePort", "");
                    form.setFieldValue("flightInfo.arrivalPort", "");
                  }
                }
                return undefined; // Don't show async error, let onChange handle format validation
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <div className="space-y-2">
                <Label htmlFor="flight-number" className="text-sm font-medium">
                  <Zap className="mr-1 inline h-4 w-4" />
                  Flight Number *
                </Label>
                <Input
                  id="flight-number"
                  placeholder="e.g., AA1234, DL567"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value.toUpperCase())
                  }
                  className="max-w-xs"
                />
                <p className="text-muted-foreground text-sm">
                  <Zap className="mr-1 inline h-3 w-3" />
                  Smart auto-fill: Enter flight number to automatically populate
                  airline and airports
                </p>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm" role="alert">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.AppField>

          {/* Auto-filled Airline */}
          <form.AppField
            name="flightInfo.airline"
            validators={{
              onChange: ({ value }: { value: string }) => {
                const result = airlineSchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label="Airline"
                placeholder="Will auto-fill when you enter flight number"
                required
              />
            )}
          </form.AppField>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Departure Port */}
            <form.AppField
              name="flightInfo.departurePort"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = departurePortSchema.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Departure Airport"
                  placeholder="Will auto-fill"
                  required
                />
              )}
            </form.AppField>

            {/* Arrival Port */}
            <form.AppField
              name="flightInfo.arrivalPort"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = arrivalPortSchema.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Arrival Airport"
                  placeholder="Will auto-fill"
                  required
                />
              )}
            </form.AppField>
          </div>

          {/* Flight Date */}
          <div className="grid max-w-md grid-cols-3 gap-4">
            <form.AppField name="flightInfo.flightDate.year">
              {(field: AnyFieldApi) => (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="flight-year" className="text-sm font-medium">
                    Year
                  </Label>
                  <Input
                    id="flight-year"
                    type="number"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 2}
                    placeholder="2024"
                    value={field.state.value || ""}
                    onChange={(e) =>
                      field.handleChange(Number(e.target.value) || undefined)
                    }
                  />
                </div>
              )}
            </form.AppField>
            <form.AppField name="flightInfo.flightDate.month">
              {(field: AnyFieldApi) => (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="flight-month" className="text-sm font-medium">
                    Month
                  </Label>
                  <Input
                    id="flight-month"
                    type="number"
                    min="1"
                    max="12"
                    placeholder="12"
                    value={field.state.value || ""}
                    onChange={(e) =>
                      field.handleChange(Number(e.target.value) || undefined)
                    }
                  />
                </div>
              )}
            </form.AppField>
            <form.AppField name="flightInfo.flightDate.day">
              {(field: AnyFieldApi) => (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="flight-day" className="text-sm font-medium">
                    Day
                  </Label>
                  <Input
                    id="flight-day"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="25"
                    value={field.state.value || ""}
                    onChange={(e) =>
                      field.handleChange(Number(e.target.value) || undefined)
                    }
                  />
                </div>
              )}
            </form.AppField>
          </div>

          {/* Confirmation Number */}
          <form.AppField name="flightInfo.confirmationNumber">
            {(field: AnyFieldApi) => (
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="confirmation" className="text-sm font-medium">
                  Booking Confirmation Number (Optional)
                </Label>
                <Input
                  id="confirmation"
                  placeholder="e.g., ABC123 (if available)"
                  value={field.state.value || ""}
                  onChange={(e) =>
                    field.handleChange(e.target.value.toUpperCase())
                  }
                  className="max-w-xs"
                />
                <p className="text-muted-foreground text-xs">
                  Your airline booking reference number
                </p>
              </div>
            )}
          </form.AppField>
        </CardContent>
      </Card>

      {/* Travel Route - Last Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Travel Route
          </CardTitle>
          <CardDescription>
            Is this a direct flight or do you have connections?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField name="flightInfo.hasStops">
            {(field: AnyFieldApi) => {
              // Handle boolean conversion for hasStops field
              const currentValue = field.state.value ? "yes" : "no";
              const handleValueChange = (value: string) => {
                field.handleChange(value === "yes");
              };

              return (
                <FormRadioGroup
                  field={
                    {
                      ...field,
                      state: { ...field.state, value: currentValue },
                      handleChange: handleValueChange,
                    } as AnyFieldApi
                  }
                  options={[
                    {
                      value: "no",
                      id: "direct",
                      label: "Direct Flight",
                      description: "No connecting flights or stops",
                      icon: <Plane className="h-5 w-5" />,
                      iconColor: "text-green-600",
                    },
                    {
                      value: "yes",
                      id: "stops",
                      label: "With Connections",
                      description: "Has connecting flights or stops",
                      icon: <Route className="h-5 w-5" />,
                      iconColor: "text-blue-600",
                    },
                  ]}
                  layout="grid"
                  columns="2"
                  padding="small"
                  size="small"
                />
              );
            }}
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
                <strong>Group flight benefits:</strong> Since you&apos;re
                traveling as a group, you can use the same flight information
                for all group members. Individual flight details can be set if
                needed.
              </AlertDescription>
            </Alert>
          );
        }}
      </form.AppField>
    </div>
  );
}
