"use client";

import {
  PlaneIcon,
  Ship,
  Car,
  ArrowDown,
  ArrowUp,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Info,
} from "lucide-react";
import { useEffect, useCallback } from "react";

import { FormField } from "@/components/forms/form-field";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFlightLookup } from "@/lib/hooks/use-flight-lookup";
import {
  validateFlightNumber,
  formatFlightNumber,
} from "@/lib/schemas/flight-validation";

import type { TravelInfoFormProps } from "@/lib/types/form";
import type { AnyFieldApi } from "@tanstack/react-form";

export function TravelInfoForm({ form }: TravelInfoFormProps) {
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
      {/* Trip Direction Selection */}
      <FormSection
        title="Travel Direction"
        description="Are you entering or leaving the Dominican Republic?"
        required
      >
        <form.AppField name="travelType.tripDirection">
          {(field: AnyFieldApi) => (
            <FormRadioGroup
              field={field}
              layout="grid"
              columns="2"
              padding="large"
              options={[
                {
                  value: "entry",
                  id: "entry",
                  label: "Arriving",
                  description: "I'm coming to the Dominican Republic",
                  icon: <ArrowDown className="h-6 w-6" />,
                  iconBg: "bg-green-100",
                  iconColor: "text-green-700",
                },
                {
                  value: "exit",
                  id: "exit",
                  label: "Departing",
                  description: "I'm leaving the Dominican Republic",
                  icon: <ArrowUp className="h-6 w-6" />,
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-700",
                },
              ]}
            />
          )}
        </form.AppField>
      </FormSection>

      {/* Transport Method Selection */}
      <FormSection
        title="Transport Method"
        description="How are you traveling to/from the Dominican Republic?"
        required
      >
        <form.AppField name="travelType.transportMethod">
          {(field: AnyFieldApi) => (
            <FormRadioGroup
              field={field}
              options={[
                {
                  value: "air",
                  id: "air",
                  label: "Air Travel",
                  description: "By airplane",
                  icon: <PlaneIcon className="h-5 w-5" />,
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                },
                {
                  value: "sea",
                  id: "sea",
                  label: "Sea Travel",
                  description: "By ship or boat",
                  icon: <Ship className="h-5 w-5" />,
                  iconBg: "bg-cyan-100",
                  iconColor: "text-cyan-600",
                },
                {
                  value: "land",
                  id: "land",
                  label: "Land Travel",
                  description: "By car, bus, or other ground transport",
                  icon: <Car className="h-5 w-5" />,
                  iconBg: "bg-green-100",
                  iconColor: "text-green-600",
                },
              ]}
            />
          )}
        </form.AppField>
      </FormSection>

      {/* Flight Information Section - Only show for air travel */}
      <form.AppField name="travelType.transportMethod">
        {(transportField: AnyFieldApi) => {
          if (transportField.state.value === "air") {
            return (
              <FormSection
                title="Flight Information"
                description="Let's start with your travel date, then we'll help find your flight"
                required
              >
                <div className="space-y-6">
                  {/* Travel Date */}
                  <form.AppField name="flightInfo.travelDate">
                    {(dateField: AnyFieldApi) => (
                      <div className="grid w-full items-center gap-1.5">
                        <Label
                          htmlFor="travelDate"
                          className="text-sm font-medium"
                        >
                          Travel Date *
                        </Label>
                        <DatePicker
                          id="travelDate"
                          value={
                            dateField.state.value
                              ? new Date(dateField.state.value)
                              : undefined
                          }
                          onChange={(date) =>
                            dateField.handleChange(
                              date?.toISOString().split("T")[0] || ""
                            )
                          }
                          className="w-full"
                          aria-invalid={dateField.state.meta.errors.length > 0}
                          aria-describedby={
                            dateField.state.meta.errors.length > 0
                              ? "travelDate-error"
                              : "travelDate-description"
                          }
                        />
                        <p
                          id="travelDate-description"
                          className="text-muted-foreground text-xs"
                        >
                          Pick your travel date in the calendar icon or input it
                          manually.
                        </p>
                        {dateField.state.meta.errors.length > 0 && (
                          <p
                            id="travelDate-error"
                            className="text-destructive text-sm"
                            role="alert"
                          >
                            {dateField.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.AppField>

                  {/* Flight Number */}
                  <form.AppField name="flightInfo.travelDate">
                    {(dateField: AnyFieldApi) => {
                      const hasDate =
                        dateField.state.value &&
                        dateField.state.value.trim() !== "";

                      return (
                        <div
                          className={`space-y-3 transition-all duration-300 ${
                            hasDate ? "opacity-100" : "opacity-50"
                          }`}
                        >
                          <form.AppField
                            name="flightInfo.flightNumber"
                            validators={{
                              onBlur: async ({ value }: { value: string }) => {
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
                                <>
                                  <Label
                                    htmlFor="flightNumber"
                                    className="text-sm font-medium"
                                  >
                                    Flight Number {hasDate && "*"}
                                    {!hasDate && (
                                      <span className="text-muted-foreground ml-2 text-sm font-normal">
                                        (Choose your date first)
                                      </span>
                                    )}
                                  </Label>
                                  <div className="flex">
                                    {result?.success ? (
                                      <div className="flex w-full items-center">
                                        <p className="flex-1 py-2 text-sm font-medium">
                                          {flightField.state.value}
                                        </p>
                                        <Button
                                          type="button"
                                          onClick={handleClearFlight}
                                          size="sm"
                                          variant="outline"
                                          className="ml-2 shrink-0"
                                        >
                                          <X className="h-4 w-4" />
                                          Clear
                                        </Button>
                                      </div>
                                    ) : (
                                      <>
                                        <Input
                                          id="flightNumber"
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
                                          className={`flex-1 rounded-r-none border-r-0 ${
                                            flightField.state.value &&
                                            !hasValidFormat
                                              ? "border-destructive focus:border-destructive"
                                              : ""
                                          }`}
                                          disabled={!hasDate}
                                        />
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            handleFlightLookup(
                                              flightField.state.value
                                            )
                                          }
                                          disabled={
                                            !hasDate ||
                                            !hasValidFormat ||
                                            isLoading
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
                                      </>
                                    )}
                                  </div>

                                  {/* Loading indicator */}
                                  {isLoading && hasValidFormat && (
                                    <div className="animate-in fade-in flex items-center gap-2 text-sm text-blue-600 duration-200">
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      <span>Searching for your flight...</span>
                                    </div>
                                  )}

                                  {/* Success indicator */}
                                  {result?.success && (
                                    <div className="animate-in fade-in space-y-2 duration-200">
                                      <div className="flex items-center gap-2 text-sm text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>
                                          Perfect! We found your flight.
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm text-blue-600">
                                        <Info className="h-4 w-4" />
                                        <span>
                                          If this is the wrong flight, click the
                                          ✕ button to search for a different
                                          flight.
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Error indicator */}
                                  {error && hasValidFormat && (
                                    <div className="animate-in fade-in flex items-center gap-2 text-sm text-red-600 duration-200">
                                      <AlertCircle className="h-4 w-4" />
                                      <span>
                                        We couldn&apos;t find that flight.
                                        Please enter your details below
                                      </span>
                                    </div>
                                  )}

                                  <p className="text-muted-foreground text-xs">
                                    Format: 2-3 letters + 1-4 numbers (like
                                    AA1234, U22621, or AAL8)
                                  </p>

                                  {flightField.state.meta.errors.length > 0 && (
                                    <p className="text-destructive text-sm">
                                      {flightField.state.meta.errors[0]}
                                    </p>
                                  )}
                                </>
                              );
                            }}
                          </form.AppField>
                        </div>
                      );
                    }}
                  </form.AppField>

                  {/* Flight Details */}
                  {(result !== null || error) && (
                    <div className="bg-muted/30 space-y-4 rounded-lg p-4 transition-all duration-300">
                      <h4 className="text-muted-foreground text-sm font-medium">
                        Flight Details
                        {result?.success && " ✓"}
                      </h4>

                      {result?.success ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <Label className="text-muted-foreground text-xs">
                              Airline
                            </Label>
                            <p className="text-sm font-medium">
                              {result.flight?.airline}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground text-xs">
                              Aircraft
                            </Label>
                            <p className="text-sm font-medium">
                              {result.flight?.aircraft}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground text-xs">
                              Departure Port
                            </Label>
                            <p className="text-sm font-medium">
                              {result.flight?.origin.iata}
                            </p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground text-xs">
                              Arrival Port
                            </Label>
                            <p className="text-sm font-medium">
                              {result.flight?.destination.iata}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.AppField name="flightInfo.airline">
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
                              <div className="grid w-full items-center gap-1.5">
                                <Label
                                  htmlFor="aircraft"
                                  className="text-muted-foreground text-sm font-medium"
                                >
                                  Aircraft Type
                                </Label>
                                <Input
                                  id="aircraft"
                                  type="text"
                                  placeholder="We'll show this when we find your flight"
                                  value={field.state.value}
                                  className="text-muted-foreground bg-muted"
                                  disabled
                                  readOnly
                                  aria-describedby="aircraft-description"
                                />
                                <p
                                  id="aircraft-description"
                                  className="text-muted-foreground text-xs"
                                >
                                  We&apos;ll fill this in when we find your
                                  flight
                                </p>
                              </div>
                            )}
                          </form.AppField>

                          <form.AppField name="flightInfo.departurePort">
                            {(field: AnyFieldApi) => (
                              <FormField
                                field={field}
                                label="Departure Airport"
                                placeholder="e.g., MIA"
                                required
                              />
                            )}
                          </form.AppField>

                          <form.AppField name="flightInfo.arrivalPort">
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
                </div>
              </FormSection>
            );
          }
          return null;
        }}
      </form.AppField>

      {/* Travel Companions */}
      <FormSection
        title="Travel Companions"
        description="Are you traveling alone or with others?"
        required
      >
        <form.AppField name="travelType.travelingAlone">
          {(field: AnyFieldApi) => (
            <FormRadioGroup
              field={field}
              options={[
                {
                  value: "alone",
                  id: "alone-yes",
                  label: "Yes, I'm traveling alone",
                },
                {
                  value: "with-others",
                  id: "alone-no",
                  label: "No, I'm traveling with others",
                },
              ]}
            />
          )}
        </form.AppField>
      </FormSection>

      {/* Conditional Group Type Selection */}
      <form.AppField name="travelType.travelingAlone">
        {(travelingAloneField: AnyFieldApi) => {
          if (travelingAloneField.state.value === "with-others") {
            return (
              <FormSection
                title="Travel Group"
                description="Who are you traveling with?"
                required
              >
                <form.AppField name="travelType.groupType">
                  {(field: AnyFieldApi) => (
                    <FormRadioGroup
                      field={field}
                      options={[
                        {
                          value: "family",
                          id: "family",
                          label: "Family",
                          description:
                            "Same household • Share address and other information",
                        },
                        {
                          value: "couple",
                          id: "couple",
                          label: "Couple",
                          description:
                            "Romantic partner • May share address and other information",
                        },
                        {
                          value: "friends",
                          id: "friends",
                          label: "Friends",
                          description:
                            "Different households • Individual details",
                        },
                        {
                          value: "coworkers",
                          id: "coworkers",
                          label: "Work Colleagues",
                          description: "Business travel • Individual details",
                        },
                      ]}
                    />
                  )}
                </form.AppField>
              </FormSection>
            );
          }
          return null;
        }}
      </form.AppField>
    </div>
  );
}
