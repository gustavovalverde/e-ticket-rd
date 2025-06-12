"use client";

import { zodValidator } from "@tanstack/zod-form-adapter";
import { User, FileText, Shield, InfoIcon } from "lucide-react";
import React from "react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  dateOfBirthSchema,
  passportExpiryDateSchema,
  genderSchema,
} from "@/lib/schemas/validation";
import { getErrorMessage } from "@/lib/utils";

// Simple validation schemas for fields that don't have individual exports
const occupationSchema = nationalitySchema; // Same validation as nationality (just required string)
const maritalStatusSchema = nationalitySchema; // Same validation (just required string)

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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="personalInfo.firstName"
              validators={{ onChange: firstNameSchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name *</Label>
                  <Input
                    id="first-name"
                    placeholder="Enter your first name"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="personalInfo.lastName"
              validators={{ onChange: lastNameSchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name *</Label>
                  <Input
                    id="last-name"
                    placeholder="Enter your last name"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
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
        <CardContent className="space-y-4">
          <form.Field
            name="personalInfo.birthDate"
            validators={{ onChange: dateOfBirthSchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <div className="grid max-w-md grid-cols-3 gap-4">
                  <form.Field name="personalInfo.birthDate.year">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(yearField: any) => (
                      <div className="space-y-2">
                        <Label htmlFor="birth-year">Year</Label>
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
                  </form.Field>
                  <form.Field name="personalInfo.birthDate.month">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(monthField: any) => (
                      <div className="space-y-2">
                        <Label htmlFor="birth-month">Month</Label>
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
                  </form.Field>
                  <form.Field name="personalInfo.birthDate.day">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(dayField: any) => (
                      <div className="space-y-2">
                        <Label htmlFor="birth-day">Day</Label>
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
                  </form.Field>
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="personalInfo.birthCountry"
            validators={{ onChange: nationalitySchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-2">
                <Label htmlFor="birth-country">Country of Birth *</Label>
                <Input
                  id="birth-country"
                  placeholder="Enter your country of birth"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="personalInfo.gender"
              validators={{ onChange: genderSchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <RadioGroup
                    value={field.state.value || ""}
                    onValueChange={(value) => field.handleChange(value)}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MALE" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FEMALE" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="OTHER" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="personalInfo.maritalStatus"
              validators={{ onChange: maritalStatusSchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor="marital-status">Marital Status *</Label>
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
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="personalInfo.occupation"
            validators={{ onChange: occupationSchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation *</Label>
                <Input
                  id="occupation"
                  placeholder="Enter your occupation/profession"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <form.Field
              name="personalInfo.passport.number"
              validators={{ onChange: passportNumberSchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor="passport-number">Passport Number *</Label>
                  <Input
                    id="passport-number"
                    placeholder="Enter your passport number"
                    value={field.state.value || ""}
                    onChange={(e) =>
                      field.handleChange(e.target.value.toUpperCase())
                    }
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="personalInfo.passport.confirmNumber"
              validators={{ onChange: passportNumberSchema }}
              validatorAdapter={zodValidator}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(field: any) => (
                <div className="space-y-2">
                  <Label htmlFor="passport-confirm">
                    Confirm Passport Number *
                  </Label>
                  <Input
                    id="passport-confirm"
                    placeholder="Re-enter your passport number"
                    value={field.state.value || ""}
                    onChange={(e) =>
                      field.handleChange(e.target.value.toUpperCase())
                    }
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-destructive text-sm">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field
            name="personalInfo.passport.nationality"
            validators={{ onChange: nationalitySchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  placeholder="Enter your nationality"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="personalInfo.passport.expiryDate"
            validators={{ onChange: passportExpiryDateSchema }}
            validatorAdapter={zodValidator}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
              <div className="space-y-2">
                <Label htmlFor="passport-expiry">Passport Expiry Date *</Label>
                <Input
                  id="passport-expiry"
                  type="date"
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="max-w-xs"
                />
                <p className="text-muted-foreground text-sm">
                  Your passport should be valid for at least 6 months
                </p>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-destructive text-sm">
                    {getErrorMessage(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
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
      <form.Field name="groupTravel.isGroupTravel">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(groupField: any) => {
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
      </form.Field>
    </div>
  );
}
