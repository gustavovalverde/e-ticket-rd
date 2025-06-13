"use client";

import { lightFormat } from "date-fns";
import {
  Plane,
  ArrowDown,
  ArrowUp,
  Route,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Info,
  MapPin,
} from "lucide-react";
import React, { useCallback, useEffect, forwardRef } from "react";

import { FormField } from "@/components/forms/form-field";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/components/ui/tanstack-form";
import { useFlightLookup } from "@/lib/hooks/use-flight-lookup";
import {
  validateFlightNumber,
  formatFlightNumber,
} from "@/lib/schemas/flight-validation";
import { booleanFieldAdapter } from "@/lib/utils/form-utils";

import type { AnyFieldApi } from "@tanstack/react-form";

interface FlightInfoStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

// Forwarded Input component that receives FormControl accessibility attributes
const ForwardedInput = forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input>
>((props, ref) => <Input ref={ref} {...props} />);
ForwardedInput.displayName = "ForwardedInput";

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

export function FlightInfoStep({ form }: FlightInfoStepProps) {
  const { result, error, isLoading, lookupFlight, reset } = useFlightLookup();

  const formattedFlightNumberHandler = useCallback((value: string) => {
    return formatFlightNumber(value);
  }, []);

  const handleFlightLookup = useCallback(
    async (flightNumber: string) => {
      await lookupFlight(flightNumber, true);
    },
    [lookupFlight]
  );

  const handleClearFlight = useCallback(() => {
    reset();
    form.setFieldValue("flightInfo.flightNumber", "");
    form.setFieldValue("flightInfo.airline", "");
    form.setFieldValue("flightInfo.departurePort", "");
    form.setFieldValue("flightInfo.arrivalPort", "");
    form.setFieldValue("flightInfo.aircraft", "");
    form.setFieldValue("flightInfo.estimatedArrival", "");
  }, [reset, form]);

  // Fill in flight details when search succeeds
  useEffect(() => {
    if (result?.success && result.flight) {
      const { flight } = result;
      form.setFieldValue("flightInfo.airline", flight.airline);
      form.setFieldValue("flightInfo.aircraft", flight.aircraft);
      form.setFieldValue("flightInfo.departurePort", flight.origin.iata);
      form.setFieldValue("flightInfo.arrivalPort", flight.destination.iata);
      form.setFieldValue(
        "flightInfo.estimatedArrival",
        flight.estimatedArrival
      );
    }
  }, [result, form]);

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
            <MapPin className="h-5 w-5" />
            Travel Direction
          </CardTitle>
          <CardDescription>
            Are you entering or leaving the Dominican Republic?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="flightInfo.travelDirection"
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return "Please select your travel direction";
                }
                return undefined;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormRadioGroup
                field={field}
                options={[
                  {
                    value: "ENTRY",
                    id: "entry",
                    label: "Entering Dominican Republic",
                    description: undefined,
                    icon: <ArrowDown className="h-6 w-6" />,
                    iconColor: "text-green-700",
                  },
                  {
                    value: "EXIT",
                    id: "exit",
                    label: "Leaving Dominican Republic",
                    description: undefined,
                    icon: <ArrowUp className="h-6 w-6" />,
                    iconColor: "text-blue-700",
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

      {/* Main Flight Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Details
          </CardTitle>
          <CardDescription>
            Let&rsquo;s start with your travel date, then we&rsquo;ll help find
            your flight
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Travel Date */}
          <form.AppField
            name="flightInfo.travelDate"
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return "Travel date is required";
                }
                // Check if the date is in the future (for arrivals)
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                  return "Travel date must be today or in the future";
                }
                return undefined;
              },
            }}
          >
            {(dateField: AnyFieldApi) => (
              <FormField
                field={dateField}
                label="Travel Date"
                required
                description="Pick your travel date in the calendar icon or input it manually."
              >
                <DatePickerWithFormContext
                  mode="future"
                  value={
                    dateField.state.value
                      ? new Date(dateField.state.value)
                      : undefined
                  }
                  onChange={(date) =>
                    dateField.handleChange(
                      date ? lightFormat(date, "yyyy-MM-dd") : ""
                    )
                  }
                  className="w-full max-w-sm"
                />
              </FormField>
            )}
          </form.AppField>

          {/* Flight Number with Smart Search */}
          <form.AppField name="flightInfo.travelDate">
            {(dateField: AnyFieldApi) => {
              const hasDate =
                dateField.state.value && dateField.state.value.trim() !== "";

              return (
                <div
                  className={`space-y-6 transition-all duration-300 ${
                    hasDate ? "opacity-100" : "opacity-50"
                  }`}
                >
                  <form.AppField
                    name="flightInfo.flightNumber"
                    validators={{
                      onBlur: ({ value }: { value: string }) => {
                        if (!value || !value.trim()) return undefined;
                        const validation = validateFlightNumber(value);
                        return validation.isValid
                          ? undefined
                          : validation.error;
                      },
                    }}
                  >
                    {(flightField: AnyFieldApi) => {
                      const validation = validateFlightNumber(
                        flightField.state.value || ""
                      );
                      const hasValidFormat = validation.isValid;

                      return (
                        <div className="space-y-6">
                          <FormField
                            field={flightField}
                            label={`Flight Number ${!hasDate ? "(Choose your date first)" : ""}`}
                            required
                            disabled={!hasDate}
                            description="Smart auto-fill: Enter flight number to automatically populate airline and airports. Format: 2-3 letters + 1-4 numbers (like AA1234, U22621, or AAL8)"
                          >
                            {result?.success ? (
                              <div className="border-input bg-background flex w-full max-w-sm items-center rounded-md border px-3 py-2 text-sm">
                                <span className="flex-1">
                                  {flightField.state.value}
                                </span>
                                <Button
                                  type="button"
                                  onClick={handleClearFlight}
                                  size="sm"
                                  variant="ghost"
                                  className="ml-2 h-auto p-1"
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Clear</span>
                                </Button>
                              </div>
                            ) : (
                              <div className="flex max-w-sm">
                                <ForwardedInput
                                  name={flightField.name}
                                  type="text"
                                  placeholder={
                                    hasDate
                                      ? "e.g., AA1234, DL567, UA123"
                                      : "Choose your date first"
                                  }
                                  value={flightField.state.value}
                                  onBlur={flightField.handleBlur}
                                  onChange={(e) => {
                                    const formatted =
                                      formattedFlightNumberHandler(
                                        e.target.value
                                      );
                                    flightField.handleChange(formatted);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      if (
                                        hasDate &&
                                        hasValidFormat &&
                                        !isLoading
                                      ) {
                                        handleFlightLookup(
                                          flightField.state.value
                                        );
                                      }
                                    }
                                  }}
                                  className="flex-1 rounded-r-none border-r-0"
                                  disabled={!hasDate}
                                />
                                <Button
                                  type="button"
                                  onClick={() =>
                                    handleFlightLookup(flightField.state.value)
                                  }
                                  disabled={
                                    !hasDate || !hasValidFormat || isLoading
                                  }
                                  size="default"
                                  variant="outline"
                                  className="shrink-0 rounded-l-none border-l-0"
                                >
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Searching
                                    </>
                                  ) : (
                                    <>
                                      <Search className="h-4 w-4" />
                                      Search
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </FormField>

                          {/* Loading indicator */}
                          {isLoading && hasValidFormat && (
                            <div className="animate-in fade-in flex items-center gap-2 text-sm text-blue-600 duration-200">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Searching for your flight...</span>
                            </div>
                          )}

                          {/* Success indicator */}
                          {result?.success && (
                            <div className="animate-in fade-in space-y-3 duration-200">
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span>Perfect! We found your flight.</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Info className="h-4 w-4" />
                                <span>
                                  If this is the wrong flight, click the ✕
                                  button to search for a different flight.
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Error indicator */}
                          {error && hasValidFormat && (
                            <div className="animate-in fade-in flex items-center gap-2 text-sm text-red-600 duration-200">
                              <AlertCircle className="h-4 w-4" />
                              <span>
                                We couldn&rsquo;t find that flight. Please enter
                                your details below
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  </form.AppField>
                </div>
              );
            }}
          </form.AppField>

          {/* Flight Details */}
          {(result !== null || error) && (
            <div className="bg-muted/30 space-y-6 rounded-lg p-4 transition-all duration-300">
              <h4 className="text-muted-foreground text-sm font-medium">
                Flight Details
                {result?.success && " ✓"}
              </h4>

              {result?.success ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Airline
                    </p>
                    <p className="text-sm font-medium">
                      {result.flight?.airline}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Aircraft
                    </p>
                    <p className="text-sm font-medium">
                      {result.flight?.aircraft}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Departure Port
                    </p>
                    <p className="text-sm font-medium">
                      {result.flight?.origin.iata}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Arrival Port
                    </p>
                    <p className="text-sm font-medium">
                      {result.flight?.destination.iata}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.AppField
                    name="flightInfo.airline"
                    validators={{
                      onBlur: ({ value }: { value: string }) => {
                        if (!value || value.trim() === "") {
                          return "Airline is required";
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field: AnyFieldApi) => (
                      <FormField
                        field={field}
                        label="Airline"
                        placeholder="e.g., American Airlines"
                        required
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="flightInfo.aircraft">
                    {(field: AnyFieldApi) => (
                      <FormField
                        field={field}
                        label="Aircraft Type"
                        description="We'll fill this in when we find your flight"
                        disabled
                        placeholder="We'll show this when we find your flight"
                        className="text-muted-foreground bg-muted"
                      />
                    )}
                  </form.AppField>

                  <form.AppField
                    name="flightInfo.departurePort"
                    validators={{
                      onBlur: ({ value }: { value: string }) => {
                        if (!value || value.trim() === "") {
                          return "Departure airport is required";
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field: AnyFieldApi) => (
                      <FormField
                        field={field}
                        label="Departure Airport"
                        placeholder="e.g., MIA"
                        required
                      />
                    )}
                  </form.AppField>

                  <form.AppField
                    name="flightInfo.arrivalPort"
                    validators={{
                      onBlur: ({ value }: { value: string }) => {
                        if (!value || value.trim() === "") {
                          return "Arrival airport is required";
                        }
                        return undefined;
                      },
                    }}
                  >
                    {(field: AnyFieldApi) => (
                      <FormField
                        field={field}
                        label="Arrival Airport"
                        placeholder="e.g., SDQ"
                        required
                      />
                    )}
                  </form.AppField>
                </div>
              )}
            </div>
          )}

          {/* Confirmation Number */}
          <form.AppField name="flightInfo.confirmationNumber">
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label="Booking Confirmation Number (Optional)"
                placeholder="e.g., ABC123 (if available)"
                className="max-w-sm"
                description="Your airline booking reference number"
              />
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
          <form.AppField
            name="flightInfo.hasStops"
            validators={{
              onBlur: ({ value }: { value: boolean }) => {
                if (value === null || value === undefined) {
                  return "Please select if your flight is direct or has connections";
                }
                return undefined;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormRadioGroup
                field={booleanFieldAdapter(field)}
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
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Group flight benefits:</strong> Since you&rsquo;re
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
