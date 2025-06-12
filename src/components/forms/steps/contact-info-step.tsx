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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
          Provide your contact information (optional). This will be used for
          important notifications about your travel.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>How can we reach you? (Optional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.AppField
            name="contactInfo.email"
            validators={{
              onChange: ({ value }: { value: string }) => {
                if (!value || value.trim() === "") return undefined; // Optional field
                const result = emailSchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <div className="space-y-2">
                <FormField
                  field={field}
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  description="We'll send your e-ticket confirmation here"
                />
              </div>
            )}
          </form.AppField>

          <form.AppField name="contactInfo.phone.number">
            {(field: AnyFieldApi) => (
              <div className="grid w-full items-center gap-1.5">
                <Label className="text-sm font-medium">Phone Number</Label>
                <div className="flex gap-2">
                  <form.AppField name="contactInfo.phone.countryCode">
                    {(countryField: AnyFieldApi) => (
                      <Select
                        value={countryField.state.value || "+1"}
                        onValueChange={countryField.handleChange}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+1">+1</SelectItem>
                          <SelectItem value="+1809">+1809</SelectItem>
                          <SelectItem value="+34">+34</SelectItem>
                          <SelectItem value="+33">+33</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </form.AppField>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Include area code (optional)
                </p>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm" role="alert">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
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
