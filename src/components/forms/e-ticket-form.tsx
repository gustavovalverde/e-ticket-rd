"use client";

import { useCallback, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppForm } from "@/components/ui/tanstack-form";
import { Textarea } from "@/components/ui/textarea";

import { FormFieldGrid, FormField } from "./form-field-grid";
import { FormSection } from "./form-section";
import { FormStepHeader } from "./form-step-header";

// E-ticket form validation schema
const formSchema = z.object({
  // Contact Information
  preferredName: z.string(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
  countryCode: z.string().min(1, { message: "Country code is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  radioOption: z.string().min(1, { message: "Please select an option" }),

  // Passport Details
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  passportNumber: z
    .string()
    .min(6, { message: "Passport number must be at least 6 characters" })
    .max(20, { message: "Passport number must be less than 20 characters" }),
  passportIssueDate: z
    .string()
    .min(1, { message: "Passport issue date is required" }),
  passportExpiryDate: z
    .string()
    .min(1, { message: "Passport expiry date is required" }),
  nationality: z.string().min(1, { message: "Please select your nationality" }),
  countryOfBirth: z
    .string()
    .min(1, { message: "Country of birth is required" }),
  additionalInfo: z.string(),
});

export function ETicketForm() {
  const [currentStep] = useState(6);

  const form = useAppForm({
    validators: {
      onChange: formSchema,
    },
    defaultValues: {
      preferredName: "Juan Perez",
      email: "juan.perez@gmail.com",
      phone: "829-688-6552",
      countryCode: "+1",
      dateOfBirth: "",
      radioOption: "option-1",
      firstName: "JOSE",
      lastName: "PEREZ",
      passportNumber: "RD900891",
      passportIssueDate: "",
      passportExpiryDate: "",
      nationality: "dominican",
      countryOfBirth: "dominican",
      additionalInfo: "",
    },
    onSubmit: ({ value: _value }) => {
      // TODO: Submit form data to backend
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleBack = () => {
    // TODO: Implement navigation to previous step
  };

  const handleCancel = () => {
    form.reset();
  };

  return (
    <form.AppForm>
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6 p-6">
        {/* Form Header */}
        <FormStepHeader
          currentStep={currentStep}
          title="Contact and Passport Information"
          onBack={handleBack}
        />

        {/* Contact Information Section */}
        <FormSection
          title="Contact Information"
          description="Please enter your preferred name and contact details. Your preferred name will be used in our communications with you, and it can be different from your passport name."
        >
          <FormFieldGrid>
            {/* Preferred Name */}
            <FormField>
              <form.AppField name="preferredName">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>
                      Your preferred name (optional)
                    </field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="Juan Perez"
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Radio Options */}
            <FormField>
              <form.AppField name="radioOption">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Radio Options</field.FormLabel>
                    <field.FormControl>
                      <RadioGroup
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option-1" id="option-1" />
                          <Label htmlFor="option-1">Radio Button Text</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="option-2" id="option-2" />
                          <Label htmlFor="option-2">Radio Button Text</Label>
                        </div>
                      </RadioGroup>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Email */}
            <FormField>
              <form.AppField name="email">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Your email address</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="email"
                        placeholder="juan.perez@gmail.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormDescription>
                      This is where we&apos;ll send your e-ticket confirmation.
                    </field.FormDescription>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Country Code */}
            <FormField>
              <form.AppField name="countryCode">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Country</field.FormLabel>
                    <field.FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+1">United States (+1)</SelectItem>
                          <SelectItem value="+1-ca">Canada (+1)</SelectItem>
                          <SelectItem value="+52">Mexico (+52)</SelectItem>
                          <SelectItem value="+1-do">
                            Dominican Republic (+1)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Phone Number */}
            <FormField>
              <form.AppField name="phone">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Phone Number</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="tel"
                        placeholder="(829) 688-6552"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormDescription>
                      Include area code for your phone number.
                    </field.FormDescription>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Date of Birth */}
            <FormField>
              <form.AppField name="dateOfBirth">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Date of Birth</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>
          </FormFieldGrid>
        </FormSection>

        {/* Passport Details Section */}
        <FormSection
          title="Passport Details"
          description="Enter your details as they appear on the passport you are using to enter the Dominican Republic."
        >
          <FormFieldGrid>
            {/* First Name */}
            <FormField>
              <form.AppField name="firstName">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Given or first name(s)</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="JOSE"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.value.toUpperCase())
                        }
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormDescription>
                      Enter exactly as shown on your passport.
                    </field.FormDescription>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Last Name */}
            <FormField>
              <form.AppField name="lastName">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Surname or family name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="PEREZ"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.value.toUpperCase())
                        }
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormDescription>
                      Enter exactly as shown on your passport.
                    </field.FormDescription>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Passport Number */}
            <FormField>
              <form.AppField name="passportNumber">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Passport number</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="RD900891"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.value.toUpperCase())
                        }
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Passport Issue Date */}
            <FormField>
              <form.AppField name="passportIssueDate">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Passport Issue Date</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Nationality Radio */}
            <FormField>
              <form.AppField name="nationality">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Nationality</field.FormLabel>
                    <field.FormControl>
                      <RadioGroup
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dominican" id="dominican" />
                          <Label htmlFor="dominican">Dominican Republic</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </RadioGroup>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Country of Birth */}
            <FormField>
              <form.AppField name="countryOfBirth">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>Country of Birth</field.FormLabel>
                    <field.FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country of birth" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dominican">
                            Dominican Republic
                          </SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="mx">Mexico</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>

            {/* Additional Information */}
            <FormField fullWidth>
              <form.AppField name="additionalInfo">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel>
                      Additional Information (Optional)
                    </field.FormLabel>
                    <field.FormControl>
                      <Textarea
                        placeholder="Enter any additional information..."
                        rows={4}
                        value={field.state.value || ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormDescription>
                      Any additional information that might be relevant for your
                      application.
                    </field.FormDescription>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </FormField>
          </FormFieldGrid>
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!form.state.canSubmit}>
            Submit Application
          </Button>
        </div>
      </form>
    </form.AppForm>
  );
}
