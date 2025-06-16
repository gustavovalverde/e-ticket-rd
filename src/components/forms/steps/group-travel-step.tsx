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
  User,
  CheckCircle,
} from "lucide-react";
import React, { useEffect } from "react";

import { FormField } from "@/components/forms/form-field";
import {
  FormRadioGroup,
  BooleanRadioGroup,
} from "@/components/forms/form-radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/components/ui/tanstack-form";
import {
  createDefaultTraveler,
  updateTravelersAddressInheritance,
  type TravelerData,
  type ApplicationData,
} from "@/lib/schemas/forms";
import { validateGroupNature } from "@/lib/schemas/validation";

import type { AppFieldApi, FormStepProps } from "@/lib/types/form-api";

export function TravelCompanionsStep({ form }: FormStepProps) {
  const isGroupTravel = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.travelCompanions
        .isGroupTravel
  );

  const numberOfCompanions = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.travelCompanions
        .numberOfCompanions
  );

  const groupNature = useStore(
    form.store,
    (state: unknown) =>
      (state as { values: ApplicationData }).values.travelCompanions.groupNature
  );

  const travelers = useStore(
    form.store,
    (state: unknown) => (state as { values: ApplicationData }).values.travelers
  );

  // Auto-manage travelers array based on group travel settings
  useEffect(() => {
    const currentTravelers = travelers || [];

    // Helper functions to reduce cognitive complexity (moved inside useEffect to fix dependencies)
    const createTravelersForGroup = (
      currentTravelers: TravelerData[],
      numberOfCompanions: number
    ): TravelerData[] => {
      const newTravelers: TravelerData[] = [];

      // Always add lead traveler first
      const leadTraveler =
        currentTravelers.find((t: TravelerData) => t.isLeadTraveler) ||
        createDefaultTraveler(true);
      newTravelers.push(leadTraveler);

      // Add companions
      const existingCompanions = currentTravelers.filter(
        (t: TravelerData) => !t.isLeadTraveler
      );

      for (let i = 0; i < numberOfCompanions; i++) {
        const existingCompanion = existingCompanions.find(
          (_companion: TravelerData, index: number) => index === i
        );
        newTravelers.push(existingCompanion || createDefaultTraveler(false));
      }

      return newTravelers;
    };

    const hasAddressInheritanceChanged = (
      updatedTravelers: TravelerData[],
      currentTravelers: TravelerData[]
    ): boolean => {
      return updatedTravelers.some((traveler, index) => {
        const currentTraveler = currentTravelers.find(
          (_: TravelerData, currentIndex: number) => currentIndex === index
        );
        return (
          traveler.addressInheritance.usesSharedAddress !==
          currentTraveler?.addressInheritance?.usesSharedAddress
        );
      });
    };

    const handleGroupTravel = (currentTravelers: TravelerData[]) => {
      if (!numberOfCompanions || numberOfCompanions <= 0) return;

      const totalTravelersNeeded = numberOfCompanions + 1; // +1 for lead traveler

      if (currentTravelers.length !== totalTravelersNeeded) {
        const newTravelers = createTravelersForGroup(
          currentTravelers,
          numberOfCompanions
        );
        const updatedTravelers = updateTravelersAddressInheritance(
          newTravelers,
          groupNature
        );
        form.setFieldValue("travelers", updatedTravelers);
      } else {
        // Update address inheritance for existing travelers if group nature changed
        const updatedTravelers = updateTravelersAddressInheritance(
          currentTravelers,
          groupNature
        );

        if (hasAddressInheritanceChanged(updatedTravelers, currentTravelers)) {
          form.setFieldValue("travelers", updatedTravelers);
        }
      }
    };

    const handleSoloTravel = (currentTravelers: TravelerData[]) => {
      if (currentTravelers.length === 0) {
        form.setFieldValue("travelers", [createDefaultTraveler(true)]);
        return;
      }

      if (currentTravelers.length > 1) {
        // Remove extra travelers for solo travel
        const leadTraveler =
          currentTravelers.find((t: TravelerData) => t.isLeadTraveler) ||
          currentTravelers[0];
        const soloTraveler = { ...leadTraveler, isLeadTraveler: true };
        form.setFieldValue("travelers", [soloTraveler]);
        return;
      }

      if (
        currentTravelers.length === 1 &&
        !currentTravelers[0]?.isLeadTraveler
      ) {
        // Ensure the single traveler is marked as lead
        const soloTraveler = { ...currentTravelers[0], isLeadTraveler: true };
        form.setFieldValue("travelers", [soloTraveler]);
      }
    };

    // Execute the appropriate handler based on travel type
    if (isGroupTravel) {
      handleGroupTravel(currentTravelers);
    } else {
      handleSoloTravel(currentTravelers);
    }
  }, [isGroupTravel, numberOfCompanions, groupNature, form, travelers]);

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
            {(field: AppFieldApi) => (
              <BooleanRadioGroup
                field={field}
                options={[
                  {
                    value: false,
                    id: "solo",
                    label: "Traveling Solo",
                    description: "I'm traveling alone",
                    icon: <UserCheck className="h-5 w-5" />,
                    iconColor: "text-blue-600",
                  },
                  {
                    value: true,
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
          {/* Group Type */}
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
                {(field: AppFieldApi) => (
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

          {/* Group Size */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Group Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form.AppField
                name="travelCompanions.numberOfCompanions"
                validators={{
                  onChange: ({ value }: { value: number }) => {
                    if (!value) {
                      return "Number of companions is required";
                    }
                    if (value < 1) {
                      return "At least 1 companion is required";
                    }
                    if (value > 6) {
                      return "Maximum 6 companions allowed";
                    }
                    return undefined;
                  },
                }}
              >
                {(field: AppFieldApi) => (
                  <FormField
                    field={field}
                    label="Number of Companions"
                    type="number"
                    placeholder="Enter number of companions"
                    min={1}
                    max={6}
                    step={1}
                    required
                    description="1-6 companions"
                    className="max-w-xs"
                  />
                )}
              </form.AppField>
            </CardContent>
          </Card>

          {/* Travelers Array Management */}
          <form.AppField name="travelers" mode="array">
            {(field: AppFieldApi) => (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Travel Group ({field.state.value.length} travelers)
                    </div>
                    <Badge variant="outline">
                      {field.state.value.length === 1
                        ? "Lead Traveler"
                        : `${field.state.value.length} Total`}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {field.state.value.map(
                    (traveler: TravelerData, index: number) => (
                      <TravelerPreviewCard
                        key={index}
                        traveler={traveler}
                        index={index}
                      />
                    )
                  )}
                </CardContent>
              </Card>
            )}
          </form.AppField>

          {/* Quick Info Alert */}
          {groupNature && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                {groupNature === "Family" || groupNature === "Partner" ? (
                  <>
                    <strong>Address sharing:</strong> The lead traveler&apos;s
                    address will be used for all group members.
                  </>
                ) : (
                  <>
                    <strong>Individual addresses:</strong> Each traveler will
                    provide their own address information.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}

// =====================================================
// HELPER COMPONENTS
// =====================================================

interface TravelerPreviewCardProps {
  traveler: TravelerData;
  index: number;
}

function TravelerPreviewCard({ traveler, index }: TravelerPreviewCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <div className="flex-shrink-0">
        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
          {traveler.isLeadTraveler ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <User className="h-5 w-5" />
          )}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant={traveler.isLeadTraveler ? "default" : "secondary"}>
            {traveler.isLeadTraveler ? "Lead Traveler" : `Companion ${index}`}
          </Badge>
          {traveler.addressInheritance.usesSharedAddress && (
            <Badge variant="outline">Shared Address</Badge>
          )}
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {traveler.isLeadTraveler
            ? "You will complete your information in the next step"
            : "Companion information will be collected in the next step"}
        </p>
      </div>
    </div>
  );
}
