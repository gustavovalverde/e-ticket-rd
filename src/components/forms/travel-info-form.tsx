"use client";

import {
  PlaneIcon,
  Ship,
  Car,
  ArrowDown,
  ArrowUp,
  Search,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { TravelInfoFormProps } from "@/lib/types/form";
import type { AnyFieldApi } from "@tanstack/react-form";

export function TravelInfoForm({ form }: TravelInfoFormProps) {
  return (
    <div className="space-y-8">
      {/* Trip Direction Selection */}
      <FormSection
        title="Travel Direction"
        description="Are you entering or leaving the Dominican Republic?"
        required
      >
        <form.AppField name="travelType.tripDirection">
          {(field: AnyFieldApi) => (
            <div className="space-y-3">
              <RadioGroup
                value={field.state.value}
                onValueChange={field.handleChange}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <div className="border-border flex items-center space-x-4 rounded-lg border p-6 transition-all duration-200 hover:border-green-200 hover:bg-green-50">
                  <RadioGroupItem value="entry" id="entry" />
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                      <ArrowDown className="h-6 w-6" />
                    </div>
                    <div>
                      <Label
                        htmlFor="entry"
                        className="cursor-pointer text-lg font-semibold"
                      >
                        Arriving
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        I&apos;m coming to the Dominican Republic
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-border flex items-center space-x-4 rounded-lg border p-6 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50">
                  <RadioGroupItem value="exit" id="exit" />
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <ArrowUp className="h-6 w-6" />
                    </div>
                    <div>
                      <Label
                        htmlFor="exit"
                        className="cursor-pointer text-lg font-semibold"
                      >
                        Departing
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        I&apos;m leaving the Dominican Republic
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
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
            <div className="space-y-3">
              <RadioGroup
                value={field.state.value}
                onValueChange={field.handleChange}
                className="space-y-3"
              >
                <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                  <RadioGroupItem value="air" id="air" />
                  <div className="flex flex-1 items-center gap-3">
                    <PlaneIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label
                        htmlFor="air"
                        className="cursor-pointer text-base font-medium"
                      >
                        Air Travel
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        By airplane
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                  <RadioGroupItem value="sea" id="sea" />
                  <div className="flex flex-1 items-center gap-3">
                    <Ship className="h-5 w-5 text-cyan-600" />
                    <div>
                      <Label
                        htmlFor="sea"
                        className="cursor-pointer text-base font-medium"
                      >
                        Sea Travel
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        By ship or boat
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                  <RadioGroupItem value="land" id="land" />
                  <div className="flex flex-1 items-center gap-3">
                    <Car className="h-5 w-5 text-green-600" />
                    <div>
                      <Label
                        htmlFor="land"
                        className="cursor-pointer text-base font-medium"
                      >
                        Land Travel
                      </Label>
                      <p className="text-muted-foreground text-sm">
                        By car, bus, or other ground transport
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
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
                description="Enter your flight details for smart auto-fill"
                required
              >
                <div className="space-y-6">
                  {/* Flight Number with Smart Search */}
                  <form.AppField name="flightInfo.flightNumber">
                    {(field: AnyFieldApi) => (
                      <div className="space-y-3">
                        <Label htmlFor="flightNumber">Flight Number</Label>
                        <div className="flex gap-2">
                          <Input
                            id="flightNumber"
                            type="text"
                            placeholder="e.g., AA1234, DL567, JB889"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          We&apos;ll auto-fill airline, route, and schedule
                          information when you enter your flight number
                        </p>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-destructive text-sm">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.AppField>

                  {/* Travel Date */}
                  <form.AppField name="flightInfo.travelDate">
                    {(field: AnyFieldApi) => (
                      <div className="space-y-3">
                        <Label htmlFor="travelDate">Travel Date</Label>
                        <div className="flex gap-2">
                          <Input
                            id="travelDate"
                            type="date"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" size="icon">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-destructive text-sm">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.AppField>

                  {/* Auto-filled Flight Details (Read-only) */}
                  <div className="bg-muted/30 space-y-3 rounded-lg p-4">
                    <h4 className="text-muted-foreground text-sm font-medium">
                      Flight Details (Auto-filled)
                    </h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-muted-foreground text-xs">
                          Airline
                        </Label>
                        <p className="text-sm">
                          Will auto-fill from flight number
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">
                          Route
                        </Label>
                        <p className="text-sm">
                          Will auto-fill from flight number
                        </p>
                      </div>
                    </div>
                  </div>
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
            <div className="space-y-3">
              <RadioGroup
                value={field.state.value}
                onValueChange={field.handleChange}
                className="space-y-3"
              >
                <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                  <RadioGroupItem value="alone" id="alone-yes" />
                  <Label
                    htmlFor="alone-yes"
                    className="flex-1 cursor-pointer text-base font-medium"
                  >
                    Yes, I&apos;m traveling alone
                  </Label>
                </div>
                <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                  <RadioGroupItem value="with-others" id="alone-no" />
                  <Label
                    htmlFor="alone-no"
                    className="flex-1 cursor-pointer text-base font-medium"
                  >
                    No, I&apos;m traveling with others
                  </Label>
                </div>
              </RadioGroup>
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
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
                    <div className="space-y-3">
                      <RadioGroup
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        className="space-y-3"
                      >
                        <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                          <RadioGroupItem value="family" id="family" />
                          <div className="flex-1">
                            <Label
                              htmlFor="family"
                              className="cursor-pointer text-base font-medium"
                            >
                              Family
                            </Label>
                            <p className="text-muted-foreground text-sm">
                              Spouse, children, parents, siblings
                            </p>
                          </div>
                        </div>
                        <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                          <RadioGroupItem value="couple" id="couple" />
                          <div className="flex-1">
                            <Label
                              htmlFor="couple"
                              className="cursor-pointer text-base font-medium"
                            >
                              Couple
                            </Label>
                            <p className="text-muted-foreground text-sm">
                              Traveling as a romantic couple
                            </p>
                          </div>
                        </div>
                        <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                          <RadioGroupItem value="friends" id="friends" />
                          <div className="flex-1">
                            <Label
                              htmlFor="friends"
                              className="cursor-pointer text-base font-medium"
                            >
                              Friends
                            </Label>
                            <p className="text-muted-foreground text-sm">
                              Group of friends traveling together
                            </p>
                          </div>
                        </div>
                        <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                          <RadioGroupItem value="coworkers" id="coworkers" />
                          <div className="flex-1">
                            <Label
                              htmlFor="coworkers"
                              className="cursor-pointer text-base font-medium"
                            >
                              Work Colleagues
                            </Label>
                            <p className="text-muted-foreground text-sm">
                              Business travel with colleagues
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-sm">
                          {field.state.meta.errors[0]}
                        </p>
                      )}
                    </div>
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
