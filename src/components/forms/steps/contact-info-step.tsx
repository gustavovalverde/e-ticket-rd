"use client";

import { Mail } from "lucide-react";
import React from "react";
import { isValidPhoneNumber } from "react-phone-number-input";

import { FormField } from "@/components/forms/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/tanstack-form";
import { validateEmail } from "@/lib/schemas/validation";

import type { AppFieldApi, FormStepProps } from "@/lib/types/form-api";

export function ContactInfoStep({ form }: FormStepProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.AppField name="contactInfo.preferredName">
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="Preferred Name"
                type="text"
                // placeholder="How would you like to be addressed?"
                description="(Optional) This can be your nickname or a name you prefer to be called"
              />
            )}
          </form.AppField>

          <form.AppField
            name="contactInfo.email"
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return "Email address is required for e-ticket delivery";
                }
                const result = validateEmail.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormField
                field={field}
                label="Email Address"
                type="email"
                // placeholder="Enter your email address"
                description="We'll send the e-ticket to this address"
              />
            )}
          </form.AppField>

          <form.AppField
            name="contactInfo.phone"
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return "Phone number is required for travel notifications";
                }
                return isValidPhoneNumber(value)
                  ? undefined
                  : "Invalid phone number";
              },
            }}
          >
            {(field: AppFieldApi) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    international
                    defaultCountry="DO"
                    value={field.state.value || undefined}
                    onChange={field.handleChange}
                  />
                </FormControl>
                <FormDescription>
                  Enter a phone number with country code.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          </form.AppField>
        </CardContent>
      </Card>
    </div>
  );
}
