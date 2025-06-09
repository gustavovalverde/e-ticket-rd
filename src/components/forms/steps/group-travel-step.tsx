"use client";

import { Users, Heart, Briefcase, UserCheck, InfoIcon } from "lucide-react";
import React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getErrorMessage } from "@/lib/utils";

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
          <form.Field name="groupTravel.isGroupTravel">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(field: any) => (
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
                    <Label htmlFor="solo" className="flex-1 cursor-pointer">
                      <div className="font-medium">Traveling Solo</div>
                      <div className="text-muted-foreground text-sm">
                        I&apos;m traveling alone
                      </div>
                    </Label>
                  </div>
                  <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="yes" id="group" />
                    <Label htmlFor="group" className="flex-1 cursor-pointer">
                      <div className="font-medium">Group Travel</div>
                      <div className="text-muted-foreground text-sm">
                        I&apos;m traveling with others
                      </div>
                    </Label>
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
        </CardContent>
      </Card>

      {/* Group Details - Only show if traveling in group */}
      <form.Field name="groupTravel.isGroupTravel">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {(isGroupField: any) => {
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
                  <form.Field name="groupTravel.numberOfCompanions">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(field: any) => (
                      <div className="space-y-4">
                        <Label className="text-base font-medium">
                          Number of Companions *
                        </Label>
                        <RadioGroup
                          value={field.state.value?.toString() || ""}
                          onValueChange={(value) =>
                            field.handleChange(Number(value))
                          }
                          className="grid grid-cols-2 gap-4 md:grid-cols-4"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <div
                              key={num}
                              className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-3"
                            >
                              <RadioGroupItem
                                value={num.toString()}
                                id={`companions-${num}`}
                              />
                              <Label
                                htmlFor={`companions-${num}`}
                                className="flex-1 cursor-pointer text-center"
                              >
                                {num} {num === 1 ? "person" : "people"}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <p className="text-muted-foreground text-sm">
                          Count adults and children traveling with you
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
                  <form.Field name="groupTravel.groupNature">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(field: any) => (
                      <div className="space-y-4">
                        <Label className="text-base font-medium">
                          Group Relationship *
                        </Label>
                        <RadioGroup
                          value={field.state.value || ""}
                          onValueChange={field.handleChange}
                          className="grid grid-cols-1 gap-4 md:grid-cols-2"
                        >
                          <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                            <RadioGroupItem value="Familia" id="family" />
                            <Label
                              htmlFor="family"
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                <div className="font-medium">Family</div>
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Spouse, children, relatives
                              </div>
                            </Label>
                          </div>
                          <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                            <RadioGroupItem value="Amigos" id="friends" />
                            <Label
                              htmlFor="friends"
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <div className="font-medium">Friends</div>
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Personal friends
                              </div>
                            </Label>
                          </div>
                          <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                            <RadioGroupItem
                              value="Compañeros de trabajo"
                              id="colleagues"
                            />
                            <Label
                              htmlFor="colleagues"
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                <div className="font-medium">
                                  Work Colleagues
                                </div>
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Business travel companions
                              </div>
                            </Label>
                          </div>
                          <div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-4">
                            <RadioGroupItem value="Pareja" id="couple" />
                            <Label
                              htmlFor="couple"
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                <div className="font-medium">
                                  Partner/Couple
                                </div>
                              </div>
                              <div className="text-muted-foreground text-sm">
                                Romantic partner
                              </div>
                            </Label>
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
      </form.Field>
    </div>
  );
}
