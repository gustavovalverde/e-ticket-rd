"use client";

import { User, FileText, Shield, InfoIcon } from "lucide-react";
import React from "react";

import { FormField } from "@/components/forms/form-field";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
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
import {
  firstNameSchema,
  lastNameSchema,
  passportNumberSchema,
  nationalitySchema,
  genderSchema,
} from "@/lib/schemas/validation";

import type { AnyFieldApi } from "@tanstack/react-form";

interface PersonalInfoStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Personal Information
        </h2>
        <p className="text-muted-foreground">
          Enter your personal details exactly as they appear on your passport
        </p>
      </div>

      {/* Name Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Full Name
          </CardTitle>
          <CardDescription>
            Enter your name exactly as it appears on your passport
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <form.AppField
              name="personalInfo.firstName"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = firstNameSchema.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="First Name"
                  placeholder="Enter your first name"
                  required
                />
              )}
            </form.AppField>

            <form.AppField
              name="personalInfo.lastName"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = lastNameSchema.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Last Name"
                  placeholder="Enter your last name"
                  required
                />
              )}
            </form.AppField>
          </div>
        </CardContent>
      </Card>

      {/* Birth Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Birth Information
          </CardTitle>
          <CardDescription>
            Your birth details as shown on official documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form.AppField name="personalInfo.birthDate">
            {(field: AnyFieldApi) => (
              <div className="grid w-full items-center gap-1.5">
                <Label className="text-sm font-medium">Date of Birth *</Label>
                <div className="grid max-w-md grid-cols-3 gap-4">
                  <form.AppField name="personalInfo.birthDate.year">
                    {(yearField: AnyFieldApi) => (
                      <div className="grid w-full items-center gap-1.5">
                        <Label
                          htmlFor="birth-year"
                          className="text-sm font-medium"
                        >
                          Year
                        </Label>
                        <Input
                          id="birth-year"
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          placeholder="1990"
                          value={yearField.state.value || ""}
                          onChange={(e) =>
                            yearField.handleChange(
                              Number(e.target.value) || undefined
                            )
                          }
                        />
                      </div>
                    )}
                  </form.AppField>
                  <form.AppField name="personalInfo.birthDate.month">
                    {(monthField: AnyFieldApi) => (
                      <div className="grid w-full items-center gap-1.5">
                        <Label
                          htmlFor="birth-month"
                          className="text-sm font-medium"
                        >
                          Month
                        </Label>
                        <Input
                          id="birth-month"
                          type="number"
                          min="1"
                          max="12"
                          placeholder="12"
                          value={monthField.state.value || ""}
                          onChange={(e) =>
                            monthField.handleChange(
                              Number(e.target.value) || undefined
                            )
                          }
                        />
                      </div>
                    )}
                  </form.AppField>
                  <form.AppField name="personalInfo.birthDate.day">
                    {(dayField: AnyFieldApi) => (
                      <div className="grid w-full items-center gap-1.5">
                        <Label
                          htmlFor="birth-day"
                          className="text-sm font-medium"
                        >
                          Day
                        </Label>
                        <Input
                          id="birth-day"
                          type="number"
                          min="1"
                          max="31"
                          placeholder="25"
                          value={dayField.state.value || ""}
                          onChange={(e) =>
                            dayField.handleChange(
                              Number(e.target.value) || undefined
                            )
                          }
                        />
                      </div>
                    )}
                  </form.AppField>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm" role="alert">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.AppField>

          <form.AppField
            name="personalInfo.birthCountry"
            validators={{
              onChange: ({ value }: { value: string }) => {
                if (!value || value.trim() === "")
                  return "Country of birth is required";
                return undefined;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label="Country of Birth"
                placeholder="Enter your country of birth"
                required
              />
            )}
          </form.AppField>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <form.AppField
              name="personalInfo.gender"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = genderSchema.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <div className="grid w-full items-center gap-1.5">
                  <Label className="text-sm font-medium">Gender *</Label>
                  <FormRadioGroup
                    field={field}
                    options={[
                      {
                        value: "MALE",
                        id: "male",
                        label: "Male",
                        icon: <User className="h-5 w-5" />,
                        iconBg: undefined,
                        iconColor: "text-blue-600",
                      },
                      {
                        value: "FEMALE",
                        id: "female",
                        label: "Female",
                        icon: <User className="h-5 w-5" />,
                        iconBg: undefined,
                        iconColor: "text-pink-600",
                      },
                      {
                        value: "OTHER",
                        id: "other",
                        label: "Other",
                        icon: <User className="h-5 w-5" />,
                        iconBg: undefined,
                        iconColor: "text-gray-600",
                      },
                    ]}
                    layout="stack"
                    padding="small"
                    size="small"
                  />
                </div>
              )}
            </form.AppField>

            <form.AppField name="personalInfo.maritalStatus">
              {(field: AnyFieldApi) => (
                <div className="grid w-full items-center gap-1.5">
                  <Label
                    htmlFor="marital-status"
                    className="text-sm font-medium"
                  >
                    Marital Status *
                  </Label>
                  <Select
                    value={field.state.value || ""}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SINGLE">Single</SelectItem>
                      <SelectItem value="MARRIED">Married</SelectItem>
                      <SelectItem value="DIVORCED">Divorced</SelectItem>
                      <SelectItem value="WIDOWED">Widowed</SelectItem>
                      <SelectItem value="COMMON_LAW">Common Law</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm" role="alert">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.AppField>
          </div>

          <form.AppField
            name="personalInfo.occupation"
            validators={{
              onChange: ({ value }: { value: string }) => {
                if (!value || value.trim() === "")
                  return "Occupation is required";
                return undefined;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label="Occupation"
                placeholder="Enter your occupation/profession"
                required
              />
            )}
          </form.AppField>
        </CardContent>
      </Card>

      {/* Passport Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Passport Information
          </CardTitle>
          <CardDescription>
            Enter your passport details exactly as shown
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <form.AppField
              name="personalInfo.passport.number"
              validators={{
                onChange: ({ value }: { value: string }) => {
                  const result = passportNumberSchema.safeParse(value);
                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Passport Number"
                  placeholder="Enter your passport number"
                  required
                />
              )}
            </form.AppField>

            <form.AppField name="personalInfo.passport.confirmNumber">
              {(field: AnyFieldApi) => (
                <FormField
                  field={field}
                  label="Confirm Passport Number"
                  placeholder="Re-enter your passport number"
                  required
                />
              )}
            </form.AppField>
          </div>

          <form.AppField
            name="personalInfo.passport.nationality"
            validators={{
              onChange: ({ value }: { value: string }) => {
                const result = nationalitySchema.safeParse(value);
                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field: AnyFieldApi) => (
              <FormField
                field={field}
                label="Nationality"
                placeholder="Enter your nationality"
                required
              />
            )}
          </form.AppField>

          <form.AppField name="personalInfo.passport.expiryDate">
            {(field: AnyFieldApi) => (
              <div className="grid w-full items-center gap-1.5">
                <Label
                  htmlFor="passport-expiry"
                  className="text-sm font-medium"
                >
                  Passport Expiry Date *
                </Label>
                <Input
                  id="passport-expiry"
                  type="date"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="max-w-xs"
                />
                <p className="text-muted-foreground text-xs">
                  Your passport should be valid for at least 6 months
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

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Privacy & Security:</strong> Your personal information is
          encrypted and protected. We only use this data for migration control
          processing and will never share it with unauthorized parties.
        </AlertDescription>
      </Alert>

      {/* Benefits for Group Travel */}
      <form.AppField name="groupTravel.isGroupTravel">
        {(groupField: AnyFieldApi) => {
          if (!groupField.state.value) return null;

          return (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Family data sharing:</strong> Since you&apos;re
                traveling as a group, we can help speed up similar information
                for family members like shared nationality or addresses.
              </AlertDescription>
            </Alert>
          );
        }}
      </form.AppField>
    </div>
  );
}
