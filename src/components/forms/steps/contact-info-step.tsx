"use client";

import { Mail } from "lucide-react";
import React from "react";

import { FormField } from "@/components/forms/form-field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneField } from "@/components/ui/phone-field";
import { validateEmail } from "@/lib/schemas/validation";

import type { AnyFieldApi } from "@tanstack/react-form";

interface ContactInfoStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

export function ContactInfoStep({ form }: ContactInfoStepProps) {
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
            {(field: AnyFieldApi) => (
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
                if (!value || value.trim() === "") return undefined;
                const result = validateEmail.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
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
            name="contactInfo.phone.number"
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") {
                  return "Phone number is required for travel notifications";
                }
                // Basic phone number validation
                const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
                return phoneRegex.test(value.replace(/\s+/g, ""))
                  ? undefined
                  : "Please enter a valid phone number";
              },
            }}
          >
            {(numberField: AnyFieldApi) => (
              <form.AppField
                name="contactInfo.phone.countryCode"
                validators={{
                  onBlur: ({ value }: { value: string }) => {
                    if (!value || value.trim() === "") {
                      return "Country code is required";
                    }
                    return undefined;
                  },
                }}
              >
                {(countryCodeField: AnyFieldApi) => (
                  <PhoneField
                    numberField={numberField}
                    countryCodeField={countryCodeField}
                  />
                )}
              </form.AppField>
            )}
          </form.AppField>
        </CardContent>
      </Card>
    </div>
  );
}
