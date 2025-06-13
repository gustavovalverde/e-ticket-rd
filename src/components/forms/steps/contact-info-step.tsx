"use client";

import { Mail, InfoIcon } from "lucide-react";
import React from "react";

import { FormField } from "@/components/forms/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PhoneField } from "@/components/ui/phone-field";
import { emailSchema } from "@/lib/schemas/validation";

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
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Provide your contact information. This will be used for important
          notifications about your travel.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>How can we reach you?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.AppField name="contactInfo.preferredName">
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label="Preferred Name"
                type="text"
                placeholder="How would you like to be addressed?"
                description="For personalized communications"
              />
            )}
          </form.AppField>

          <form.AppField
            name="contactInfo.email"
            validators={{
              onBlur: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") return undefined;
                const result = emailSchema.safeParse(value);
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
                placeholder="Enter your email address"
                description="We'll send your e-ticket confirmation here"
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

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Why provide contact info?</strong> We can send you:
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>E-ticket confirmation with QR code</li>
            <li>Important travel updates or changes</li>
            <li>Reminders about required documents</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
