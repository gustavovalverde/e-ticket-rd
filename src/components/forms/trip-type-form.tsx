"use client";

import { PlaneIcon, Ship, Car, ArrowRight, ArrowLeft } from "lucide-react";

import { FormSection } from "@/components/ui/form-section";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { TripTypeFormProps } from "@/lib/types/form";
import type { AnyFieldApi } from "@tanstack/react-form";

export function TripTypeForm({ form }: TripTypeFormProps) {
  return (
    <div className="section-title-gap-lg">
      {/* Trip Direction Selection */}
      <FormSection
        title="Travel Direction"
        description="Are you entering or leaving the Dominican Republic?"
        required
      >
        <form.AppField name="travelType.tripDirection">
          {(field: AnyFieldApi) => (
            <form.FormItem>
              <form.FormControl>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="section-title-gap-sm"
                >
                  <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                    <RadioGroupItem value="entry" id="entry" />
                    <div className="flex flex-1 items-center gap-3">
                      <ArrowRight className="h-5 w-5 text-green-600" />
                      <div>
                        <Label
                          htmlFor="entry"
                          className="cursor-pointer text-base font-medium"
                        >
                          Entrada a la República Dominicana
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Entering the Dominican Republic
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                    <RadioGroupItem value="exit" id="exit" />
                    <div className="flex flex-1 items-center gap-3">
                      <ArrowLeft className="h-5 w-5 text-blue-600" />
                      <div>
                        <Label
                          htmlFor="exit"
                          className="cursor-pointer text-base font-medium"
                        >
                          Salida de la República Dominicana
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          Leaving the Dominican Republic
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </form.FormControl>
              <form.FormMessage />
            </form.FormItem>
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
            <form.FormItem>
              <form.FormControl>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="section-title-gap-sm"
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
                          Aéreo
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
                          Marítimo
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
                          Terrestre
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          By land (car, bus, etc.)
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </form.FormControl>
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </FormSection>

      {/* Group Type Selection */}
      <FormSection
        title="Travel Type"
        description="Are you traveling alone or with others?"
        required
      >
        <form.AppField name="travelType.groupType">
          {(field: AnyFieldApi) => (
            <form.FormItem>
              <form.FormControl>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={field.handleChange}
                  className="section-title-gap-sm"
                >
                  <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label
                      htmlFor="individual"
                      className="flex-1 cursor-pointer text-base font-medium"
                    >
                      Individual Travel
                    </Label>
                  </div>
                  <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                    <RadioGroupItem value="family" id="family" />
                    <Label
                      htmlFor="family"
                      className="flex-1 cursor-pointer text-base font-medium"
                    >
                      Family Travel
                    </Label>
                  </div>
                  <div className="border-border hover:bg-muted/50 flex items-center space-x-4 rounded-lg border p-4 transition-colors">
                    <RadioGroupItem value="group" id="group" />
                    <Label
                      htmlFor="group"
                      className="flex-1 cursor-pointer text-base font-medium"
                    >
                      Group Travel
                    </Label>
                  </div>
                </RadioGroup>
              </form.FormControl>
              <form.FormMessage />
            </form.FormItem>
          )}
        </form.AppField>
      </FormSection>
    </div>
  );
}
