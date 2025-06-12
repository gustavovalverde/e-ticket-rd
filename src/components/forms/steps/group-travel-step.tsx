"use client";

import { Users, Heart, Briefcase, UserCheck, InfoIcon } from "lucide-react";
import React from "react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { groupNatureSchema } from "@/lib/schemas/validation";

import type { AnyFieldApi } from "@tanstack/react-form";

interface GroupTravelStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

export function GroupTravelStep({ form }: GroupTravelStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Travel Companions</h2>
        <p className="text-muted-foreground">
          Are you traveling alone or with others?
        </p>
      </div>

      {/* Group Travel Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Travel Group
          </CardTitle>
          <CardDescription>
            Let us know if you&apos;re traveling with companions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField name="groupTravel.isGroupTravel">
            {(field: AnyFieldApi) => (
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Are you traveling with others? *
                </Label>
                <RadioGroup
                  value={field.state.value ? "yes" : "no"}
                  onValueChange={(value) => field.handleChange(value === "yes")}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="no" id="solo" />
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <Label
                          htmlFor="solo"
                          className="cursor-pointer text-base font-medium"
                        >
                          Traveling Solo
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          I&apos;m traveling alone
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="yes" id="group" />
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <Label
                          htmlFor="group"
                          className="cursor-pointer text-base font-medium"
                        >
                          Group Travel
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          I&apos;m traveling with others
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
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

      {/* Group Details - Only show if traveling in group */}
      <form.AppField name="groupTravel.isGroupTravel">
        {(isGroupField: AnyFieldApi) => {
          if (!isGroupField.state.value) return null;

          return (
            <div className="space-y-6">
              {/* Number of Companions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Group Size
                  </CardTitle>
                  <CardDescription>
                    How many people are traveling with you?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form.AppField name="groupTravel.numberOfCompanions">
                    {(field: AnyFieldApi) => (
                      <div className="space-y-2">
                        <Label htmlFor="companions">
                          Number of Companions *
                        </Label>
                        <Input
                          id="companions"
                          type="number"
                          min="1"
                          max="20"
                          placeholder="Enter number of companions"
                          value={field.state.value || ""}
                          onChange={(e) =>
                            field.handleChange(
                              Number(e.target.value) || undefined
                            )
                          }
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-destructive text-sm">
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.AppField>
                </CardContent>
              </Card>

              {/* Group Nature */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Group Type
                  </CardTitle>
                  <CardDescription>
                    What&apos;s your relationship with your travel companions?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form.AppField
                    name="groupTravel.groupNature"
                    validators={{
                      onChange: ({ value }: { value: string }) => {
                        const result = groupNatureSchema.safeParse(value);
                        return result.success
                          ? undefined
                          : result.error.issues[0]?.message;
                      },
                    }}
                  >
                    {(field: AnyFieldApi) => (
                      <div className="space-y-4">
                        <Label className="text-base font-medium">
                          Group Type *
                        </Label>
                        <FormRadioGroup
                          field={field}
                          options={[
                            {
                              value: "Family",
                              id: "family",
                              label: "Family",
                              description: "Traveling with family members",
                              icon: <Heart className="h-5 w-5" />,
                              iconBg: undefined,
                              iconColor: "text-red-600",
                            },
                            {
                              value: "Friends",
                              id: "friends",
                              label: "Friends",
                              description: "Traveling with friends",
                              icon: <Users className="h-5 w-5" />,
                              iconBg: undefined,
                              iconColor: "text-blue-600",
                            },
                            {
                              value: "Work_Colleagues",
                              id: "work",
                              label: "Work Colleagues",
                              description: "Business or work-related travel",
                              icon: <Briefcase className="h-5 w-5" />,
                              iconBg: undefined,
                              iconColor: "text-gray-600",
                            },
                            {
                              value: "Partner",
                              id: "partner",
                              label: "Partner/Spouse",
                              description: "Traveling with partner or spouse",
                              icon: <Heart className="h-5 w-5" />,
                              iconBg: undefined,
                              iconColor: "text-pink-600",
                            },
                          ]}
                          layout="grid"
                          columns="2"
                          padding="small"
                          size="small"
                        />
                      </div>
                    )}
                  </form.AppField>
                </CardContent>
              </Card>

              {/* Group Benefits Alert */}
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Group travel benefits:</strong> Since you&apos;re
                  traveling as a group, we can:
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                    <li>
                      Share common information like flight details and addresses
                    </li>
                    <li>Speed up the application process for all travelers</li>
                    <li>Keep your group together during processing</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          );
        }}
      </form.AppField>
    </div>
  );
}
