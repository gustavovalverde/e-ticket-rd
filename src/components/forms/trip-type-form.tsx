"use client";

import { PlaneIcon, Ship, Car, ArrowDown, ArrowUp } from "lucide-react";

import { FormSection } from "@/components/ui/form-section";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { TripTypeFormProps } from "@/lib/types/form";
import type { AnyFieldApi } from "@tanstack/react-form";

export function TripTypeForm({ form }: TripTypeFormProps) {
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

      {/* Traveling Alone Selection */}
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
                          <RadioGroupItem value="friends" id="friends" />
                          <Label
                            htmlFor="friends"
                            className="flex-1 cursor-pointer text-base font-medium"
                          >
                            Friends
                          </Label>
                        </div>
                        <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                          <RadioGroupItem value="coworkers" id="coworkers" />
                          <Label
                            htmlFor="coworkers"
                            className="flex-1 cursor-pointer text-base font-medium"
                          >
                            Work Colleagues
                          </Label>
                        </div>
                        <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                          <RadioGroupItem value="family" id="family" />
                          <Label
                            htmlFor="family"
                            className="flex-1 cursor-pointer text-base font-medium"
                          >
                            Family
                          </Label>
                        </div>
                        <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                          <RadioGroupItem value="couple" id="couple" />
                          <Label
                            htmlFor="couple"
                            className="flex-1 cursor-pointer text-base font-medium"
                          >
                            Couple
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
            );
          }
          return null;
        }}
      </form.AppField>
    </div>
  );
}
