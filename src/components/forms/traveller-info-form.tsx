"use client";

import { FormSection } from "@/components/ui/form-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TravellerInfoFormProps } from "@/lib/types/form";
import type { AnyFieldApi } from "@tanstack/react-form";

export function TravellerInfoForm({ form }: TravellerInfoFormProps) {
  return (
    <FormSection
      title="Traveller Information"
      description="Please provide your basic personal details"
      required
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form.AppField name="firstName">
          {(field: AnyFieldApi) => (
            <div className="section-title-gap-sm">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
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

        <form.AppField name="lastName">
          {(field: AnyFieldApi) => (
            <div className="section-title-gap-sm">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
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

        <form.AppField name="email">
          {(field: AnyFieldApi) => (
            <div className="section-title-gap-sm">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
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

        <form.AppField name="phone">
          {(field: AnyFieldApi) => (
            <div className="section-title-gap-sm">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <Select defaultValue="+1">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">United States (+1)</SelectItem>
                    <SelectItem value="+1-ca">Canada (+1)</SelectItem>
                    <SelectItem value="+52">Mexico (+52)</SelectItem>
                    <SelectItem value="+1-809">
                      Dominican Republic (+1-809)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex-1"
                />
              </div>
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
