"use client";

import { User, Plane, FileText, CheckCircle, Info } from "lucide-react";
import { useCallback, useState } from "react";
import { z } from "zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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

import { FormLayout } from "./form-layout";

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

  // Flight Information
  flightNumber: z.string().min(1, { message: "Flight number is required" }),
  arrivalDate: z.string().min(1, { message: "Arrival date is required" }),

  additionalInfo: z.string(),
});

// Define form steps using proper icons
const FORM_STEPS = [
  { icon: Info, label: "Travel Type" },
  { icon: User, label: "Personal Info" },
  { icon: FileText, label: "Passport Details" },
  { icon: Plane, label: "Flight Info" },
  { icon: CheckCircle, label: "Review" },
];

export function ETicketForm() {
  const [currentStep] = useState(1); // 0-indexed for button-9

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
      flightNumber: "",
      arrivalDate: "",
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
    console.log("Navigate to previous step");
  };

  const handleContinue = () => {
    // TODO: Implement navigation to next step
    console.log("Navigate to next step");
    form.handleSubmit();
  };

  const handleStepChange = (step: number) => {
    // TODO: Implement step navigation
    console.log("Navigate to step:", step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Travel Type Selection
                <span
                  className="text-destructive text-sm"
                  aria-label="Required section"
                >
                  *
                </span>
              </CardTitle>
              <CardDescription>
                Please select your travel type and destination
              </CardDescription>
            </CardHeader>
            <CardContent className="section-title-gap-lg">
              <form.AppField name="radioOption">
                {(field) => (
                  <field.FormItem>
                    <field.FormLabel className="heading-sm text-foreground">
                      How are you traveling?
                    </field.FormLabel>
                    <field.FormControl>
                      <RadioGroup
                        value={field.state.value}
                        onValueChange={field.handleChange}
                        className="section-title-gap-sm"
                      >
                        <div className="border-border hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors">
                          <RadioGroupItem value="option-1" id="option-1" />
                          <Label
                            htmlFor="option-1"
                            className="flex-1 cursor-pointer"
                          >
                            Individual Travel
                          </Label>
                        </div>
                        <div className="border-border hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors">
                          <RadioGroupItem value="option-2" id="option-2" />
                          <Label
                            htmlFor="option-2"
                            className="flex-1 cursor-pointer"
                          >
                            Family/Group Travel
                          </Label>
                        </div>
                      </RadioGroup>
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              </form.AppField>
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Personal Information
                <span
                  className="text-destructive text-sm"
                  aria-label="Required section"
                >
                  *
                </span>
              </CardTitle>
              <CardDescription>
                Please provide your basic personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="section-title-gap-lg">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <form.AppField name="firstName">
                  {(field) => (
                    <div className="section-title-gap-sm">
                      <field.FormLabel>First Name</field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </div>
                  )}
                </form.AppField>

                <form.AppField name="lastName">
                  {(field) => (
                    <div className="section-title-gap-sm">
                      <field.FormLabel>Last Name</field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </div>
                  )}
                </form.AppField>

                <form.AppField name="email">
                  {(field) => (
                    <div className="section-title-gap-sm">
                      <field.FormLabel>Email Address</field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </div>
                  )}
                </form.AppField>

                <form.AppField name="phone">
                  {(field) => (
                    <div className="section-title-gap-sm">
                      <field.FormLabel>Phone Number</field.FormLabel>
                      <div className="flex gap-2">
                        <Select defaultValue="+1">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">
                              United States (+1)
                            </SelectItem>
                            <SelectItem value="+1-ca">Canada (+1)</SelectItem>
                            <SelectItem value="+52">Mexico (+52)</SelectItem>
                            <SelectItem value="+1-809">
                              Dominican Republic (+1-809)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <field.FormControl>
                          <Input
                            type="tel"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="flex-1"
                          />
                        </field.FormControl>
                      </div>
                      <field.FormMessage />
                    </div>
                  )}
                </form.AppField>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Passport & Travel Details
                <span
                  className="text-destructive text-sm"
                  aria-label="Required section"
                >
                  *
                </span>
              </CardTitle>
              <CardDescription>
                Please provide your passport and nationality information
              </CardDescription>
            </CardHeader>
            <CardContent className="section-title-gap-lg">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <form.AppField name="passportNumber">
                  {(field) => (
                    <div className="section-title-gap-sm">
                      <field.FormLabel>Passport Number</field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </div>
                  )}
                </form.AppField>

                <form.AppField name="nationality">
                  {(field) => (
                    <div className="section-title-gap-sm">
                      <field.FormLabel>Nationality</field.FormLabel>
                      <field.FormControl>
                        <RadioGroup
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          className="section-title-gap-sm"
                        >
                          <div className="border-border hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors">
                            <RadioGroupItem value="dominican" id="dominican" />
                            <Label
                              htmlFor="dominican"
                              className="flex-1 cursor-pointer"
                            >
                              Dominican Republic
                            </Label>
                          </div>
                          <div className="border-border hover:bg-muted/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors">
                            <RadioGroupItem value="other" id="other" />
                            <Label
                              htmlFor="other"
                              className="flex-1 cursor-pointer"
                            >
                              Other
                            </Label>
                          </div>
                        </RadioGroup>
                      </field.FormControl>
                      <field.FormMessage />
                    </div>
                  )}
                </form.AppField>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Flight Information
                <span
                  className="text-destructive text-sm"
                  aria-label="Required section"
                >
                  *
                </span>
              </CardTitle>
              <CardDescription>
                Please provide your flight details
              </CardDescription>
            </CardHeader>
            <CardContent className="section-title-gap-lg">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <form.AppField name="flightNumber">
                  {(field) => (
                    <div className="section-title-gap-sm">
                      <field.FormLabel>Flight Number</field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="text"
                          placeholder="e.g., AA1234"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </div>
                  )}
                </form.AppField>

                <form.AppField name="arrivalDate">
                  {(field) => (
                    <div className="section-title-gap-sm">
                      <field.FormLabel>Arrival Date</field.FormLabel>
                      <field.FormControl>
                        <Input
                          type="date"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </div>
                  )}
                </form.AppField>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Review & Additional Information</CardTitle>
              <CardDescription>
                Review your information and provide any additional details
              </CardDescription>
            </CardHeader>
            <CardContent className="section-title-gap-lg">
              <form.AppField name="additionalInfo">
                {(field) => (
                  <div className="section-title-gap-sm">
                    <field.FormLabel>
                      Additional Information (Optional)
                    </field.FormLabel>
                    <field.FormControl>
                      <Textarea
                        placeholder="Any additional information..."
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        rows={4}
                      />
                    </field.FormControl>
                    <field.FormDescription>
                      Any additional information that might be relevant for your
                      application.
                    </field.FormDescription>
                    <field.FormMessage />
                  </div>
                )}
              </form.AppField>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <form.AppForm>
      <FormLayout
        steps={FORM_STEPS}
        currentStep={currentStep}
        title="Contact and Passport Information"
        subtitle="Please provide your contact details and passport information as they appear on your travel document."
        onBack={handleBack}
        onContinue={handleContinue}
        onStepChange={handleStepChange}
        continueLabel="Continue"
        canContinue={form.state.canSubmit}
      >
        <form onSubmit={handleSubmit} className="section-title-gap-lg">
          {renderStep()}
        </form>
      </FormLayout>
    </form.AppForm>
  );
}
