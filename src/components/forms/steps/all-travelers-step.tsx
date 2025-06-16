"use client";

import React from "react";

import { MigratoryInfoSection } from "@/components/forms/components/migratory-info-section";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/components/ui/tanstack-form";

import type { TravelerData } from "@/lib/schemas/forms";
import type { AppFieldApi, FormStepProps } from "@/lib/types/form-api";

export function AllTravelersStep({ form }: FormStepProps) {
  const isGroupTravel = useStore(
    form.store,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.values.travelCompanions.isGroupTravel
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {isGroupTravel ? "All Travelers Information" : "Traveler Information"}
        </h2>
        <p className="text-muted-foreground">
          {isGroupTravel
            ? "Complete migratory information for each traveler in your group"
            : "Complete your migratory information"}
        </p>
      </div>

      {/* TanStack Form array rendering */}
      <form.AppField name="travelers" mode="array">
        {(field: AppFieldApi) => (
          <div className="space-y-8">
            {field.state.value.map((traveler: TravelerData, index: number) => {
              // Create stable key to prevent re-mounting on updates
              const stableKey = traveler.isLeadTraveler
                ? "lead-traveler"
                : `companion-${index}`;

              return (
                <div key={stableKey}>
                  {/* Reuse MigratoryInfoSection for each traveler */}
                  <MigratoryInfoSection
                    form={form}
                    fieldPrefix={`travelers[${index}]`}
                    travelerIndex={index}
                    showResidencyStatus={true}
                    showHeader={isGroupTravel} // Only show header for group travel
                    showAddress={isGroupTravel} // Only show address for group travel (solo uses General Info address)
                  />
                </div>
              );
            })}

            {field.state.value.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No travelers found. Please go back to configure your travel
                    companions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </form.AppField>
    </div>
  );
}
