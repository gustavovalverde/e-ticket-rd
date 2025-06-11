"use client";

import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { FlightInfoFormProps } from "@/lib/types/form";
import type { AnyFieldApi } from "@tanstack/react-form";

export function FlightInfoForm({ form }: FlightInfoFormProps) {
  return (
    <FormSection
      title="Flight Information"
      description="Please provide your flight details"
      required
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form.AppField name="flightNumber">
          {(field: AnyFieldApi) => (
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="flightNumber">Flight Number</Label>
              <Input
                id="flightNumber"
                type="text"
                placeholder="e.g., AA1234"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.AppField>

        <form.AppField name="arrivalDate">
          {(field: AnyFieldApi) => (
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="arrivalDate">Arrival Date</Label>
              <Input
                id="arrivalDate"
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-destructive text-sm">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.AppField>
      </div>
    </FormSection>
  );
}
