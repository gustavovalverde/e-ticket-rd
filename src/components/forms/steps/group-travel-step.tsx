"use client";

import {
  Users,
  Briefcase,
  InfoIcon,
  Hash,
  Tags,
  Home,
  UserCheck,
  Heart,
} from "lucide-react";
import React from "react";

import { FormField } from "@/components/forms/form-field";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/components/ui/tanstack-form";
import { validateGroupNature } from "@/lib/schemas/validation";
import { booleanFieldAdapter } from "@/lib/utils/form-utils";

import type { AnyFieldApi } from "@tanstack/react-form";

interface TravelCompanionsStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  onNext: () => void;
  onPrevious: () => void;
}

export function TravelCompanionsStep({ form }: TravelCompanionsStepProps) {
  const isGroupTravel = useStore(
    form.store,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.values.travelCompanions.isGroupTravel
  );

  return (
    <div className="space-y-6">
      {/* Group Travel Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Travel Companions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form.AppField name="travelCompanions.isGroupTravel">
            {(field: AnyFieldApi) => (
              <FormRadioGroup
                field={booleanFieldAdapter(field)}
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
            )}
          </form.AppField>
        </CardContent>
      </Card>

      {/* Group Details - Only show if traveling in group */}
      {isGroupTravel && (
        <div className="space-y-6">
          {/* Number of Companions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Group Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField name="travelCompanions.numberOfCompanions">
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
                    description="1-20 companions"
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
                <Tags className="h-5 w-5" />
                Group Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="travelCompanions.groupNature"
                validators={{
                  onChange: ({ value }: { value: string }) => {
                    if (!value || value.trim() === "") {
                      return "Group type is required";
                    }
                    const result = validateGroupNature.safeParse(value);
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
                        icon: <Home className="h-5 w-5" />,
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
                        value: "Partner",
                        id: "partner",
                        label: "Partner/Spouse",
                        description: "Traveling with partner or spouse",
                        icon: <Heart className="h-5 w-5" />,
                        iconColor: "text-pink-600",
                      },
                      {
                        value: "Work_Colleagues",
                        id: "work",
                        label: "Work Colleagues",
                        description: "Business or work-related travel",
                        icon: <Briefcase className="h-5 w-5" />,
                        iconColor: "text-gray-600",
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
              <strong>Group travel:</strong> Common information can be shared
              between group members.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
