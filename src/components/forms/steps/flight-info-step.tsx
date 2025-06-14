"use client";

import { lightFormat, isAfter, parseISO } from "date-fns";
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
import {
  FormRadioGroup,
  BooleanRadioGroup,
} from "@/components/forms/form-radio-group";
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
import { useFieldContext, useStore } from "@/components/ui/tanstack-form";
import { useFlightLookup } from "@/lib/hooks/use-flight-lookup";
import {
  validateFlightNumber,
  formatFlightNumber,
} from "@/lib/schemas/validation";

import type { AnyFieldApi } from "@tanstack/react-form";

interface TravelInfoStepProps {
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
  maxDate,
}: {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  mode?: "future" | "past" | "any";
  className?: string;
  maxDate?: Date;
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
      maxDate={maxDate}
    />
  );
}

export function FlightInfoStep({ form }: TravelInfoStepProps) {
  const { result, error, isLoading, lookupFlight, reset } = useFlightLookup();
  const {
    result: originResult,
    error: originError,
    isLoading: originIsLoading,
    lookupFlight: originLookupFlight,
    reset: originReset,
  } = useFlightLookup();

  // Use the form's store to subscribe to changes and ensure reactivity
  const flightInfoValues = useStore(
    form.store,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.values.flightInfo
  );

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

  const handleOriginFlightLookup = useCallback(
    async (flightNumber: string) => {
      await originLookupFlight(flightNumber, true);
    },
    [originLookupFlight]
  );

  const handleClearOriginFlight = useCallback(() => {
    originReset();
    form.setFieldValue("flightInfo.originFlightNumber", "");
    form.setFieldValue("flightInfo.originAirline", "");
    form.setFieldValue("flightInfo.originDeparturePort", "");
    form.setFieldValue("flightInfo.originArrivalPort", "");
    form.setFieldValue("flightInfo.originAircraft", "");
    form.setFieldValue("flightInfo.originEstimatedArrival", "");
  }, [originReset, form]);

  // Helper function to check if travel details are complete
  const areTravelDetailsComplete = () => {
    const values = flightInfoValues; // Use reactive values from the store

    // Check if basic required fields are filled
    const hasTravelDate = values?.travelDate && values.travelDate.trim() !== "";
    const hasFlightNumber =
      values?.flightNumber && values.flightNumber.trim() !== "";

    if (!hasTravelDate || !hasFlightNumber) {
      return false;
    }

    // Check if flight details are available either through:
    // 1. Successful flight lookup, OR
    // 2. Manual entry of required fields
    const hasFlightLookupSuccess = result?.success;
    const hasManualFlightDetails = Boolean(
      values?.airline?.trim() &&
        values?.departurePort?.trim() &&
        values?.arrivalPort?.trim()
    );

    return hasFlightLookupSuccess || hasManualFlightDetails;
  };

  // Helper function to check if this is entry to Dominican Republic
  const isEntryToDR = () => {
    return flightInfoValues?.travelDirection === "ENTRY";
  };

  // Helper function to check if user selected connections
  const hasConnectionFlights = () => {
    return flightInfoValues?.hasStops === true;
  };

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

  // Fill in origin flight details when search succeeds
  useEffect(() => {
    if (originResult?.success && originResult.flight) {
      const { flight } = originResult;
      form.setFieldValue("flightInfo.originAirline", flight.airline);
      form.setFieldValue("flightInfo.originAircraft", flight.aircraft);
      form.setFieldValue("flightInfo.originDeparturePort", flight.origin.iata);
      form.setFieldValue(
        "flightInfo.originArrivalPort",
        flight.destination.iata
      );
      form.setFieldValue(
        "flightInfo.originEstimatedArrival",
        flight.estimatedArrival
      );
    }
  }, [originResult, form]);

  return (
    <div className="space-y-6">
      {/* Travel Direction - First Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Travel Direction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form.AppField
            name="flightInfo.travelDirection"
            validators={{
              onChange: ({ value }: { value: string }) => {
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

      {/* Main Travel Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Travel Details
          </CardTitle>
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
              <FormField field={dateField} label="Travel Date" required>
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
                            description="Auto-fill: Enter flight number (e.g., AA1234) to populate airline and airports"
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
                                  onBlur={(e) => {
                                    // Handle TanStack Form blur
                                    flightField.handleBlur();

                                    // Auto-search if validation passes
                                    const currentValue = e.target.value;
                                    const validation =
                                      validateFlightNumber(currentValue);

                                    if (
                                      hasDate &&
                                      validation.isValid &&
                                      currentValue.trim() &&
                                      !isLoading &&
                                      !result?.success // Don't search again if already found
                                    ) {
                                      handleFlightLookup(currentValue);
                                    }
                                  }}
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
                              <span>Searching...</span>
                            </div>
                          )}

                          {/* Success indicator */}
                          {result?.success && (
                            <div className="animate-in fade-in space-y-3 duration-200">
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span>Flight found!</span>
                              </div>
                            </div>
                          )}

                          {/* Error indicator */}
                          {error && hasValidFormat && (
                            <div className="animate-in fade-in flex items-center gap-2 text-sm text-red-600 duration-200">
                              <AlertCircle className="h-4 w-4" />
                              <span>
                                Flight not found. Please enter details below.
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
                        disabled
                        placeholder="Auto-populated from flight search"
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
              />
            )}
          </form.AppField>
        </CardContent>
      </Card>

      {/* Travel Route - Only show when Travel Details are complete and entering DR */}
      {areTravelDetailsComplete() && isEntryToDR() && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Travel Route
            </CardTitle>
            <CardDescription>
              How are you arriving to the Dominican Republic?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppField
              name="flightInfo.hasStops"
              validators={{
                onChange: ({ value }: { value: boolean | undefined }) => {
                  if (value === undefined) {
                    return "Please select how you're arriving to Dominican Republic";
                  }
                  return undefined;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <BooleanRadioGroup
                  field={field}
                  options={[
                    {
                      value: false,
                      id: "direct",
                      label: "Direct Flight",
                      description: "Flying directly to Dominican Republic",
                      icon: <Plane className="h-5 w-5" />,
                      iconColor: "text-green-600",
                    },
                    {
                      value: true,
                      id: "stops",
                      label: "With Connections",
                      description:
                        "Connecting from another flight to reach Dominican Republic",
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
      )}

      {/* Origin Flight Details - Only show when user has connections */}
      {areTravelDetailsComplete() &&
        isEntryToDR() &&
        hasConnectionFlights() && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Origin Flight Details
              </CardTitle>
              <CardDescription>
                Tell us about your first flight (from your origin country)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Origin Travel Date */}
              <form.AppField
                name="flightInfo.originTravelDate"
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (!value || value.trim() === "") {
                      return "Origin travel date is required";
                    }

                    // Get the main travel date for comparison
                    const mainTravelDate = flightInfoValues?.travelDate;
                    if (
                      mainTravelDate &&
                      isAfter(parseISO(value), parseISO(mainTravelDate))
                    ) {
                      return "Origin flight date cannot be after your arrival date to Dominican Republic";
                    }

                    return undefined;
                  },
                  onBlur: ({ value }: { value: string }) => {
                    if (!value || value.trim() === "") {
                      return "Origin travel date is required";
                    }

                    // Get the main travel date for comparison
                    const mainTravelDate = flightInfoValues?.travelDate;
                    if (
                      mainTravelDate &&
                      isAfter(parseISO(value), parseISO(mainTravelDate))
                    ) {
                      return "Origin flight date cannot be after your arrival date to Dominican Republic";
                    }

                    return undefined;
                  },
                }}
              >
                {(dateField: AnyFieldApi) => {
                  // Calculate max date based on main travel date
                  const mainTravelDate = flightInfoValues?.travelDate;
                  const maxDate = mainTravelDate
                    ? new Date(mainTravelDate)
                    : undefined;

                  return (
                    <FormField
                      field={dateField}
                      label="Origin Travel Date"
                      required
                      description={
                        mainTravelDate
                          ? `Must be on or before ${lightFormat(new Date(mainTravelDate), "MMM dd, yyyy")}`
                          : "Date of your first flight"
                      }
                    >
                      <DatePickerWithFormContext
                        mode="any"
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
                        maxDate={maxDate}
                        className="w-full max-w-sm"
                      />
                    </FormField>
                  );
                }}
              </form.AppField>

              {/* Origin Flight Number with Smart Search */}
              <form.AppField name="flightInfo.originTravelDate">
                {(originDateField: AnyFieldApi) => {
                  const hasOriginDate =
                    originDateField.state.value &&
                    originDateField.state.value.trim() !== "";

                  return (
                    <div
                      className={`space-y-6 transition-all duration-300 ${
                        hasOriginDate ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      <form.AppField
                        name="flightInfo.originFlightNumber"
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
                        {(originFlightField: AnyFieldApi) => {
                          const validation = validateFlightNumber(
                            originFlightField.state.value || ""
                          );
                          const hasValidFormat = validation.isValid;

                          return (
                            <div className="space-y-6">
                              <FormField
                                field={originFlightField}
                                label={`Origin Flight Number ${!hasOriginDate ? "(Choose your origin date first)" : ""}`}
                                required
                                disabled={!hasOriginDate}
                                description="Auto-fill: Enter flight number (e.g., IB6275) to populate airline and airports"
                              >
                                {originResult?.success ? (
                                  <div className="border-input bg-background flex w-full max-w-sm items-center rounded-md border px-3 py-2 text-sm">
                                    <span className="flex-1">
                                      {originFlightField.state.value}
                                    </span>
                                    <Button
                                      type="button"
                                      onClick={handleClearOriginFlight}
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
                                      name={originFlightField.name}
                                      type="text"
                                      placeholder={
                                        hasOriginDate
                                          ? "e.g., IB6275, LH441, AF447"
                                          : "Choose your origin date first"
                                      }
                                      value={originFlightField.state.value}
                                      onBlur={(e) => {
                                        // Handle TanStack Form blur
                                        originFlightField.handleBlur();

                                        // Auto-search if validation passes
                                        const currentValue = e.target.value;
                                        const validation =
                                          validateFlightNumber(currentValue);

                                        if (
                                          hasOriginDate &&
                                          validation.isValid &&
                                          currentValue.trim() &&
                                          !originIsLoading &&
                                          !originResult?.success // Don't search again if already found
                                        ) {
                                          handleOriginFlightLookup(
                                            currentValue
                                          );
                                        }
                                      }}
                                      onChange={(e) => {
                                        const formatted =
                                          formattedFlightNumberHandler(
                                            e.target.value
                                          );
                                        originFlightField.handleChange(
                                          formatted
                                        );
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          if (
                                            hasOriginDate &&
                                            hasValidFormat &&
                                            !originIsLoading
                                          ) {
                                            handleOriginFlightLookup(
                                              originFlightField.state.value
                                            );
                                          }
                                        }
                                      }}
                                      className="flex-1 rounded-r-none border-r-0"
                                      disabled={!hasOriginDate}
                                    />
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        handleOriginFlightLookup(
                                          originFlightField.state.value
                                        )
                                      }
                                      disabled={
                                        !hasOriginDate ||
                                        !hasValidFormat ||
                                        originIsLoading
                                      }
                                      size="default"
                                      variant="outline"
                                      className="shrink-0 rounded-l-none border-l-0"
                                    >
                                      {originIsLoading ? (
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
                              {originIsLoading && hasValidFormat && (
                                <div className="animate-in fade-in flex items-center gap-2 text-sm text-blue-600 duration-200">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Searching...</span>
                                </div>
                              )}

                              {/* Success indicator */}
                              {originResult?.success && (
                                <div className="animate-in fade-in space-y-3 duration-200">
                                  <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Flight found!</span>
                                  </div>
                                </div>
                              )}

                              {/* Error indicator */}
                              {originError && hasValidFormat && (
                                <div className="animate-in fade-in flex items-center gap-2 text-sm text-red-600 duration-200">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>
                                    Flight not found. Please enter details
                                    below.
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

              {/* Origin Flight Details */}
              {(originResult !== null || originError) && (
                <div className="bg-muted/30 space-y-6 rounded-lg p-4 transition-all duration-300">
                  <h4 className="text-muted-foreground text-sm font-medium">
                    Origin Flight Details
                    {originResult?.success && " ✓"}
                  </h4>

                  {originResult?.success ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Airline
                        </p>
                        <p className="text-sm font-medium">
                          {originResult.flight?.airline}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Aircraft
                        </p>
                        <p className="text-sm font-medium">
                          {originResult.flight?.aircraft}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Departure Port
                        </p>
                        <p className="text-sm font-medium">
                          {originResult.flight?.origin.iata}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">
                          Connection Airport
                        </p>
                        <p className="text-sm font-medium">
                          {originResult.flight?.destination.iata}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <form.AppField
                        name="flightInfo.originAirline"
                        validators={{
                          onBlur: ({ value }: { value: string }) => {
                            if (!value || value.trim() === "") {
                              return "Origin airline is required";
                            }
                            return undefined;
                          },
                        }}
                      >
                        {(field: AnyFieldApi) => (
                          <FormField
                            field={field}
                            label="Origin Airline"
                            placeholder="e.g., Iberia"
                            required
                          />
                        )}
                      </form.AppField>

                      <form.AppField name="flightInfo.originAircraft">
                        {(field: AnyFieldApi) => (
                          <FormField
                            field={field}
                            label="Origin Aircraft Type"
                            disabled
                            placeholder="Auto-populated from flight search"
                            className="text-muted-foreground bg-muted"
                          />
                        )}
                      </form.AppField>

                      <form.AppField
                        name="flightInfo.originDeparturePort"
                        validators={{
                          onBlur: ({ value }: { value: string }) => {
                            if (!value || value.trim() === "") {
                              return "Origin departure airport is required";
                            }
                            return undefined;
                          },
                        }}
                      >
                        {(field: AnyFieldApi) => (
                          <FormField
                            field={field}
                            label="Origin Departure Airport"
                            placeholder="e.g., LIS (your starting point)"
                            required
                            description="Where your journey begins"
                          />
                        )}
                      </form.AppField>

                      <form.AppField
                        name="flightInfo.originArrivalPort"
                        validators={{
                          onBlur: ({ value }: { value: string }) => {
                            if (!value || value.trim() === "") {
                              return "Origin arrival airport is required";
                            }
                            return undefined;
                          },
                        }}
                      >
                        {(field: AnyFieldApi) => (
                          <FormField
                            field={field}
                            label="Connection Airport"
                            placeholder="e.g., MAD (where you connect)"
                            required
                            description="Where you connect to your final flight"
                          />
                        )}
                      </form.AppField>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {/* Benefits for Connection Flights */}
      {hasConnectionFlights() && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Connection flights:</strong> This helps us understand your
            complete journey and ensure proper immigration processing.
          </AlertDescription>
        </Alert>
      )}

      {/* Benefits for Group Travel */}
      <form.AppField name="travelCompanions.isGroupTravel">
        {(groupField: AnyFieldApi) => {
          if (!groupField.state.value) return null;

          return (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Group travel:</strong> Flight information can be shared
                with your group members.
              </AlertDescription>
            </Alert>
          );
        }}
      </form.AppField>
    </div>
  );
}
