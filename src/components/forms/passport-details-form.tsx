"use client";

import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type { PassportDetailsFormProps } from "@/lib/types/form";
import type { AnyFieldApi } from "@tanstack/react-form";

export function PassportDetailsForm({ form }: PassportDetailsFormProps) {
  return (
    <FormSection
      title="Passport & Travel Details"
      description="Please provide your passport and nationality information"
      required
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form.AppField name="passportNumber">
          {(field: AnyFieldApi) => (
            <div className="section-title-gap-sm">
              <Label htmlFor="passportNumber">Passport Number</Label>
              <Input
                id="passportNumber"
                type="text"
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

        <form.AppField name="nationality">
          {(field: AnyFieldApi) => (
            <div className="section-title-gap-sm">
              <Label>Nationality</Label>
              <RadioGroup
                value={field.state.value as string}
                onValueChange={field.handleChange}
                className="section-title-gap-sm"
              >
                <div className="border-border hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors">
                  <RadioGroupItem value="dominican" id="dominican" />
                  <Label htmlFor="dominican" className="flex-1 cursor-pointer">
                    Dominican Republic
                  </Label>
                </div>
                <div className="border-border hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="flex-1 cursor-pointer">
                    Other
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
      </div>
    </FormSection>
  );
}
