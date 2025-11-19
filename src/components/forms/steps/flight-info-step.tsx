"use client";

import { isAfter, lightFormat, parseISO, format } from "date-fns";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Info,
  Loader2,
  MapPin,
  Plane,
  Route,
  Search,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useTransition } from "react";
import { useFormStatus } from "react-dom";

import { FormField } from "@/components/forms/form-field";
import {
  BooleanRadioGroup,
  FormRadioGroup,
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
import { useStore } from "@/components/ui/tanstack-form";
import { useFlightLookup } from "@/lib/hooks/use-flight-lookup";
import { validateFlightNumber } from "@/lib/schemas/validation";
import {
  autoDetectTravelDirection,
  validateFlightConnection,
} from "@/lib/utils/flight-utils";

import type { FlightLookupResult } from "@/lib/types/flight";
import type { AppFormApi, FormStepId } from "@/lib/types/form-api";
import type { AnyFieldApi } from "@tanstack/react-form";

// Component interfaces with proper typing
interface FlightInfoStepProps {
  form: AppFormApi;
  onNext?: () => void;
  onPrevious?: () => void;
  stepId?: FormStepId;
}

interface FlightSearchSectionProps {
  form: AppFormApi;
  stepId: string;
  hasDate: boolean;
  travelDate: string;
  flightResult: FlightLookupResult | null;
  flightError: string | null;
  isFlightLoading: boolean;
  onFlightLookup: (flightNumber: string) => Promise<void>;
  onClearFlight: () => void;
  isOrigin?: boolean;
  originDate?: string;
}

interface FlightDetailsDisplayProps {
  result: FlightLookupResult | null;
  error: string | null;
  form: AppFormApi;
  fieldPrefix?: string;
  isOrigin?: boolean;
}

// Enhanced flight number field with proper FormField integration
function FlightNumberField({
  field,
  hasDate,
  isOrigin = false,
  onLookup,
  onClear,
  result,
  error,
  isLoading,
}: {
  field: AnyFieldApi;
  hasDate: boolean;
  isOrigin?: boolean;
  onLookup: (flightNumber: string) => void;
  onClear: () => void;
  result: FlightLookupResult | null;
  error: string | null;
  isLoading: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { pending: formPending } = useFormStatus();

  const validation = validateFlightNumber(field.state.value || "");
  const hasValidFormat = validation.isValid;
  const flightLabel = isOrigin ? "Origin Flight Number" : "Flight Number";

  const handleLookup = useCallback(() => {
    if (hasDate && hasValidFormat && !isLoading && !isPending) {
      startTransition(() => {
        onLookup(field.state.value);
      });
    }
  }, [
    hasDate,
    hasValidFormat,
    isLoading,
    isPending,
    onLookup,
    field.state.value,
  ]);

  // Helper function to get placeholder text
  const getPlaceholderText = () => {
    if (!hasDate) {
      return "Choose your date first";
    }
    return isOrigin
      ? "e.g., IB6275, LH441, AF447"
      : "e.g., AA1234, DL567, UA123";
  };

  return (
    <div
      className={`space-y-4 transition-all duration-300 ${
        hasDate ? "opacity-100" : "opacity-50"
      }`}
    >
      {/* Standard FormField - always uses input element */}
      <FormField
        field={field}
        label={`${flightLabel} ${!hasDate ? "(Choose your date first)" : ""}`}
        type="text"
        placeholder={getPlaceholderText()}
        required
        disabled={!hasDate || formPending || result?.success}
        description="Auto-fill: Enter flight number to populate airline and airports"
        className="max-w-sm"
        inputMode="text"
      />

      {/* Search button and clear button row */}
      {hasDate && (
        <div className="flex max-w-sm gap-2">
          {!result?.success && (
            <Button
              type="button"
              onClick={handleLookup}
              disabled={
                !hasValidFormat || isLoading || isPending || formPending
              }
              size="default"
              variant="outline"
              className="shrink-0"
            >
              {isLoading || isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search Flight
                </>
              )}
            </Button>
          )}

          {result?.success && (
            <Button
              type="button"
              onClick={onClear}
              size="default"
              variant="outline"
              disabled={formPending}
            >
              <X className="h-4 w-4" />
              Clear & Search Again
            </Button>
          )}
        </div>
      )}

      {/* Flight lookup status */}
      {hasValidFormat && hasDate && (
        <FlightSearchStatus
          isLoading={isLoading || isPending}
          result={result}
          error={error}
        />
      )}
    </div>
  );
}

// Travel Direction Component
function TravelDirectionSection({
  form,
  stepId,
  flightResult,
}: {
  form: AppFormApi;
  stepId: FormStepId;
  flightResult?: FlightLookupResult | null;
}) {
  // Check if direction was auto-detected
  const showAutoDetectedInfo = flightResult?.success && flightResult.flight;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Travel Direction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
              stepId={stepId}
              options={[
                {
                  value: "ENTRY",
                  label: "Entering Dominican Republic",
                  icon: <ArrowDown className="h-6 w-6" />,
                  iconColor: "text-green-700",
                },
                {
                  value: "EXIT",
                  label: "Leaving Dominican Republic",
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

        {/* Auto-detection feedback */}
        <form.AppField name="flightInfo.travelDirection">
          {(directionField: AnyFieldApi) =>
            showAutoDetectedInfo &&
            directionField.state.value &&
            flightResult?.flight && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Auto-detected:</strong> Based on your flight from{" "}
                  <code>{flightResult.flight.origin.iata}</code> to{" "}
                  <code>{flightResult.flight.destination.iata}</code>,
                  we&apos;ve detected you&apos;re{" "}
                  {directionField.state.value === "ENTRY"
                    ? "entering"
                    : "leaving"}{" "}
                  the Dominican Republic. You can change this if needed.
                </AlertDescription>
              </Alert>
            )
          }
        </form.AppField>
      </CardContent>
    </Card>
  );
}

// Flight Search Component with React 19 optimizations
function FlightSearchSection({
  form,
  travelDate,
  flightResult,
  flightError,
  isFlightLoading,
  onFlightLookup,
  onClearFlight,
  isOrigin = false,
  originDate,
}: FlightSearchSectionProps) {
  const fieldName = isOrigin
    ? "flightInfo.originFlightNumber"
    : "flightInfo.flightNumber";
  const dateLabel = isOrigin ? "Origin Travel Date" : "Travel Date";
  const dateFieldName = isOrigin
    ? "flightInfo.originTravelDate"
    : "flightInfo.travelDate";

  const effectiveDate = isOrigin ? originDate : travelDate;

  return (
    <div className="space-y-6">
      {/* Date Field */}
      <form.AppField
        name={dateFieldName}
        validators={{
          onBlur: ({ value }: { value: string }) => {
            if (!value || value.trim() === "") {
              return `${dateLabel} is required`;
            }

            if (!isOrigin) {
              // Main travel date validation
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (selectedDate < today) {
                return "Travel date must be today or in the future";
              }
            } else {
              // Origin date validation - must be before or on main travel date
              const mainTravelDate = travelDate;
              if (
                mainTravelDate &&
                isAfter(parseISO(value), parseISO(mainTravelDate))
              ) {
                return "Origin flight date cannot be after your arrival date to Dominican Republic";
              }
            }
            return undefined;
          },
        }}
      >
        {(dateField: AnyFieldApi) => {
          const maxDate =
            isOrigin && travelDate ? new Date(travelDate) : undefined;

          // Helper function to get description text - fixes nested ternary
          const getDescriptionText = () => {
            if (isOrigin && travelDate) {
              return `Must be on or before ${lightFormat(new Date(travelDate), "MMM dd, yyyy")}`;
            }
            if (isOrigin) {
              return "Date of your first flight";
            }
            return undefined;
          };

          return (
            <FormField
              field={dateField}
              label={dateLabel}
              required
              description={getDescriptionText()}
            >
              <DatePicker
                value={
                  dateField.state.value
                    ? parseISO(dateField.state.value)
                    : undefined
                }
                onChange={(date) => {
                  const isoString = date ? format(date, "yyyy-MM-dd") : "";
                  dateField.handleChange(isoString);
                }}
                mode={isOrigin ? "any" : "future"}
                maxDate={maxDate}
                className="w-full max-w-sm"
              />
            </FormField>
          );
        }}
      </form.AppField>

      {/* Enhanced Flight Number Field */}
      <form.AppField
        name={fieldName}
        validators={{
          onBlur: ({ value }: { value: string }) => {
            // First handle validation
            if (!value || !value.trim()) return undefined;
            const validation = validateFlightNumber(value);

            // Auto-search on blur if conditions are met
            if (
              validation.isValid &&
              Boolean(effectiveDate) &&
              !isFlightLoading &&
              !flightResult?.success
            ) {
              // Trigger search after a brief delay to ensure blur is processed
              setTimeout(() => {
                onFlightLookup(value);
              }, 100);
            }

            return validation.isValid ? undefined : validation.error;
          },
        }}
      >
        {(flightField: AnyFieldApi) => (
          <FlightNumberField
            field={flightField}
            hasDate={Boolean(effectiveDate)}
            isOrigin={isOrigin}
            onLookup={onFlightLookup}
            onClear={onClearFlight}
            result={flightResult}
            error={flightError}
            isLoading={isFlightLoading}
          />
        )}
      </form.AppField>
    </div>
  );
}

// Optimized Flight Search Status Component
function FlightSearchStatus({
  isLoading,
  result,
  error,
}: {
  isLoading: boolean;
  result: FlightLookupResult | null;
  error: string | null;
}) {
  if (isLoading) {
    return (
      <div className="animate-in fade-in flex items-center gap-2 text-sm text-blue-600 duration-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Searching flight details...</span>
      </div>
    );
  }

  if (result?.success) {
    return (
      <div className="animate-in fade-in space-y-3 duration-200">
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Flight found! Details populated below.</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-in fade-in flex items-center gap-2 text-sm text-red-600 duration-200">
        <AlertCircle className="h-4 w-4" />
        <span>Flight not found. Please enter details manually below.</span>
      </div>
    );
  }

  return null;
}

// Flight Details Display Component (unchanged - already well implemented)
function FlightDetailsDisplay({
  result,
  error,
  form,
  fieldPrefix = "flightInfo",
  isOrigin = false,
}: FlightDetailsDisplayProps) {
  if (!result && !error) return null;

  const getFieldName = (field: string) => {
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    return isOrigin
      ? `${fieldPrefix}.origin${capitalizedField}`
      : `${fieldPrefix}.${field}`;
  };

  return (
    <div className="bg-muted/30 space-y-6 rounded-lg p-4 transition-all duration-300">
      <h4 className="text-muted-foreground text-sm font-medium">
        {isOrigin ? "Origin Flight Details" : "Flight Details"}
        {result?.success && " ✓"}
      </h4>

      {result?.success ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Airline</p>
            <p className="text-sm font-medium">{result.flight?.airline}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Aircraft
            </p>
            <p className="text-sm font-medium">{result.flight?.aircraft}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              {isOrigin ? "Origin Departure" : "Departure Port"}
            </p>
            <p className="text-sm font-medium">{result.flight?.origin.iata}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              {isOrigin ? "Connection Airport" : "Arrival Port"}
            </p>
            <p className="text-sm font-medium">
              {result.flight?.destination.iata}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <form.AppField
            name={getFieldName("airline")}
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return `${isOrigin ? "Origin airline" : "Airline"} is required`;
                }
                return undefined;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label={isOrigin ? "Origin Airline" : "Airline"}
                placeholder={
                  isOrigin ? "e.g., Iberia" : "e.g., American Airlines"
                }
                required
                inputMode="text"
                autoComplete="off"
              />
            )}
          </form.AppField>

          <form.AppField name={getFieldName("aircraft")}>
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label={`${isOrigin ? "Origin " : ""}Aircraft Type`}
                disabled
                placeholder="Auto-populated from flight search"
                className="bg-muted text-muted-foreground"
                inputMode="text"
                autoComplete="off"
              />
            )}
          </form.AppField>

          <form.AppField
            name={getFieldName("departurePort")}
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return `${isOrigin ? "Origin departure airport" : "Departure airport"} is required`;
                }
                return undefined;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label={
                  isOrigin ? "Origin Departure Airport" : "Departure Airport"
                }
                placeholder={
                  isOrigin ? "e.g., LIS (your starting point)" : "e.g., MIA"
                }
                description={isOrigin ? "Where your journey begins" : undefined}
                required
                inputMode="text"
              />
            )}
          </form.AppField>

          <form.AppField
            name={getFieldName("arrivalPort")}
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return `${isOrigin ? "Connection airport" : "Arrival airport"} is required`;
                }
                return undefined;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label={isOrigin ? "Connection Airport" : "Arrival Airport"}
                placeholder={
                  isOrigin ? "e.g., MAD (where you connect)" : "e.g., SDQ"
                }
                description={
                  isOrigin
                    ? "Where you connect to your final flight"
                    : undefined
                }
                required
                inputMode="text"
              />
            )}
          </form.AppField>
        </div>
      )}
    </div>
  );
}

// Travel Route Section Component (unchanged - already well implemented)
function TravelRouteSection({
  form,
  stepId,
}: {
  form: AppFormApi;
  stepId: FormStepId;
}) {
  return (
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
              stepId={stepId}
              options={[
                {
                  value: false,
                  label: "Direct Flight",
                  description: "Flying directly to Dominican Republic",
                  icon: <Plane className="h-5 w-5" />,
                  iconColor: "text-green-600",
                },
                {
                  value: true,
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
  );
}

// Main Component with React 19 optimizations
export function FlightInfoStep({
  form,
  stepId = "flight-info",
}: FlightInfoStepProps) {
  // Flight lookup hooks
  const { result, error, isLoading, lookupFlight, reset } = useFlightLookup();
  const {
    result: originResult,
    error: originError,
    isLoading: originIsLoading,
    lookupFlight: originLookupFlight,
    reset: originReset,
  } = useFlightLookup();

  // Use reactive store subscription for form values
  const flightInfoValues = useStore(
    form.store,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.values.flightInfo
  );

  // Memoized handlers to prevent unnecessary re-renders
  const handleFlightLookup = useCallback(
    async (flightNumber: string) => {
      await lookupFlight(flightNumber, true);
    },
    [lookupFlight]
  );

  const handleClearFlight = useCallback(() => {
    reset();
    const fieldsToReset = [
      "flightInfo.flightNumber",
      "flightInfo.airline",
      "flightInfo.departurePort",
      "flightInfo.arrivalPort",
      "flightInfo.aircraft",
      "flightInfo.estimatedArrival",
    ];
    fieldsToReset.forEach((field) => form.setFieldValue(field, ""));
  }, [reset, form]);

  const handleOriginFlightLookup = useCallback(
    async (flightNumber: string) => {
      await originLookupFlight(flightNumber, true);
    },
    [originLookupFlight]
  );

  const handleClearOriginFlight = useCallback(() => {
    originReset();
    const fieldsToReset = [
      "flightInfo.originFlightNumber",
      "flightInfo.originAirline",
      "flightInfo.originDeparturePort",
      "flightInfo.originArrivalPort",
      "flightInfo.originAircraft",
      "flightInfo.originEstimatedArrival",
    ];
    fieldsToReset.forEach((field) => form.setFieldValue(field, ""));
  }, [originReset, form]);

  // Helper functions for component visibility logic
  const areTravelDetailsComplete = () => {
    const values = flightInfoValues;
    const hasTravelDate = values?.travelDate?.trim();
    const hasFlightNumber = values?.flightNumber?.trim();

    if (!hasTravelDate || !hasFlightNumber) return false;

    const hasFlightLookupSuccess = result?.success;
    const hasManualFlightDetails = Boolean(
      values?.airline?.trim() &&
        values?.departurePort?.trim() &&
        values?.arrivalPort?.trim()
    );

    return hasFlightLookupSuccess || hasManualFlightDetails;
  };

  const isEntryToDR = () => flightInfoValues?.travelDirection === "ENTRY";
  const hasConnectionFlights = () => flightInfoValues?.hasStops === true;

  // Auto-populate flight details on successful lookup
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

      // Auto-detect travel direction if not already set
      const currentTravelDirection = flightInfoValues?.travelDirection;
      if (!currentTravelDirection || currentTravelDirection.trim() === "") {
        const detectedDirection = autoDetectTravelDirection(
          flight.origin.iata,
          flight.destination.iata
        );

        if (detectedDirection) {
          form.setFieldValue("flightInfo.travelDirection", detectedDirection);
        }
      }
    }
  }, [result, form, flightInfoValues?.travelDirection]);

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

  // Validate flight connections when both flights are available
  const connectionValidation = React.useMemo(() => {
    if (
      result?.success &&
      result.flight &&
      originResult?.success &&
      originResult.flight
    ) {
      // Validate airport matching for connection
      return validateFlightConnection(
        originResult.flight.destination.iata,
        result.flight.origin.iata
      );
    }
    return null;
  }, [result, originResult]);

  // Check if travel direction is selected
  const hasTravelDirection = Boolean(flightInfoValues?.travelDirection?.trim());

  return (
    <div className="space-y-6">
      {/* Travel Direction Section */}
      <TravelDirectionSection
        form={form}
        stepId={stepId}
        flightResult={result}
      />

      {/* Main Travel Information - Only show after travel direction is selected */}
      {hasTravelDirection && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Travel Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FlightSearchSection
              form={form}
              stepId={stepId}
              hasDate={Boolean(flightInfoValues?.travelDate?.trim())}
              travelDate={flightInfoValues?.travelDate || ""}
              flightResult={result}
              flightError={error}
              isFlightLoading={isLoading}
              onFlightLookup={handleFlightLookup}
              onClearFlight={handleClearFlight}
            />

            {/* Flight Details Display */}
            <FlightDetailsDisplay result={result} error={error} form={form} />

            {/* Confirmation Number */}
            <form.AppField name="flightInfo.confirmationNumber">
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Booking Confirmation Number (Optional)"
                  placeholder="e.g., ABC123 (if available)"
                  className="max-w-sm"
                  inputMode="text"
                  autoComplete="off"
                />
              )}
            </form.AppField>
          </CardContent>
        </Card>
      )}

      {/* Travel Route Section - Conditional Display */}
      {areTravelDetailsComplete() && isEntryToDR() && (
        <TravelRouteSection form={form} stepId={stepId} />
      )}

      {/* Origin Flight Details - Conditional Display */}
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
              <FlightSearchSection
                form={form}
                stepId={stepId}
                hasDate={Boolean(flightInfoValues?.originTravelDate?.trim())}
                travelDate={flightInfoValues?.travelDate || ""}
                originDate={flightInfoValues?.originTravelDate || ""}
                flightResult={originResult}
                flightError={originError}
                isFlightLoading={originIsLoading}
                onFlightLookup={handleOriginFlightLookup}
                onClearFlight={handleClearOriginFlight}
                isOrigin={true}
              />

              <FlightDetailsDisplay
                result={originResult}
                error={originError}
                form={form}
                isOrigin={true}
              />

              {/* Connection Validation */}
              {connectionValidation && (
                <div className="space-y-2">
                  {!connectionValidation.isValid && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Connection Error:</strong>{" "}
                        {connectionValidation.error}
                      </AlertDescription>
                    </Alert>
                  )}
                  {connectionValidation.isValid && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Connection Validated:</strong> Your flight
                        connection appears valid.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

      {/* Informational Alerts */}
      {hasConnectionFlights() && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Connection flights:</strong> This helps us understand your
            complete journey and ensure proper immigration processing.
          </AlertDescription>
        </Alert>
      )}

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
