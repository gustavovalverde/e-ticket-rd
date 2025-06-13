"use client";

import { Users, Heart, Briefcase, UserCheck, InfoIcon } from "lucide-react";
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
            {(field: AnyFieldApi) => {
              // Handle boolean conversion for this specific field
              const currentValue = field.state.value ? "yes" : "no";
              const handleValueChange = (value: string) => {
                field.handleChange(value === "yes");
              };

              return (
                <FormRadioGroup
                  field={
                    {
                      ...field,
                      state: { ...field.state, value: currentValue },
                      handleChange: handleValueChange,
                    } as AnyFieldApi
                  }
                  options={[
                    {
                      value: "no",
                      id: "solo",
                      label: "Traveling Solo",
                      description: "I'm traveling alone",
                      icon: <UserCheck className="h-5 w-5" />,
                      iconColor: "text-blue-600",
                    },
                    {
                      value: "yes",
                      id: "group",
                      label: "Group Travel",
                      description: "I'm traveling with others",
                      icon: <Users className="h-5 w-5" />,
                      iconColor: "text-green-600",
                    },
                  ]}
                  layout="grid"
                  columns="2"
                  padding="large"
                  size="large"
                />
              );
            }}
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
                    How many people are traveling with you? (1-20 companions)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form.AppField name="groupTravel.numberOfCompanions">
                    {(field: AnyFieldApi) => (
                      <FormField
                        field={field}
                        label="Number of Companions"
                        type="number"
                        placeholder="Enter number of companions"
                        min={1}
                        max={20}
                        step={1}
                        required
                        className="max-w-xs"
                      />
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
                      <FormRadioGroup
                        field={field}
                        options={[
                          {
                            value: "Family",
                            id: "family",
                            label: "Family",
                            description: "Traveling with family members",
                            icon: <Heart className="h-5 w-5" />,
                            iconColor: "text-red-600",
                          },
                          {
                            value: "Friends",
                            id: "friends",
                            label: "Friends",
                            description: "Traveling with friends",
                            icon: <Users className="h-5 w-5" />,
                            iconColor: "text-blue-600",
                          },
                          {
                            value: "Work_Colleagues",
                            id: "work",
                            label: "Work Colleagues",
                            description: "Business or work-related travel",
                            icon: <Briefcase className="h-5 w-5" />,
                            iconColor: "text-gray-600",
                          },
                          {
                            value: "Partner",
                            id: "partner",
                            label: "Partner/Spouse",
                            description: "Traveling with partner or spouse",
                            icon: <Heart className="h-5 w-5" />,
                            iconColor: "text-pink-600",
                          },
                        ]}
                        layout="grid"
                        columns="2"
                        padding="small"
                        size="small"
                      />
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
