"use client";

import { useForm } from "@tanstack/react-form";
import { ChevronLeft, ChevronRight, Save, FileCheck } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  groupTravelSchema,
  generalInfoSchema,
  personalInfoSchema,
  contactInfoSchema,
  flightInfoSchema,
  customsDeclarationSchema,
  type ETicketFormData,
} from "@/lib/validations/eticket-schemas";

import {
  ProgressIndicator,
  useStepProgress,
  type Step,
} from "./progress-indicator";
import { ContactInfoStep } from "./steps/contact-info-step";
import { CustomsDeclarationStep } from "./steps/customs-declaration-step";
import { FlightInfoStep } from "./steps/flight-info-step";
import { GeneralInfoStep } from "./steps/general-info-step";
import { GroupTravelStep } from "./steps/group-travel-step";
import { PersonalInfoStep } from "./steps/personal-info-step";

interface MultiStepETicketFormProps {
  onSubmit?: (data: ETicketFormData) => void;
  initialData?: Partial<ETicketFormData>;
  applicationCode?: string;
  className?: string;
}

// Constants for step IDs to avoid duplication
const STEP_IDS = {
  GROUP_TRAVEL: "group-travel",
  GENERAL_INFO: "general-info",
  PERSONAL_INFO: "personal-info",
  CONTACT_INFO: "contact-info",
  FLIGHT_INFO: "flight-info",
  CUSTOMS_DECLARATION: "customs-declaration",
} as const;

const STEP_TITLES = {
  TRAVEL_GROUP: "Travel Group",
  GENERAL_INFORMATION: "General Information",
  PERSONAL_INFORMATION: "Personal Information",
  CONTACT_INFORMATION: "Contact Information",
  FLIGHT_INFORMATION: "Flight Information",
  CUSTOMS_DECLARATION: "Customs Declaration",
} as const;

const FORM_STEPS: Step[] = [
  {
    id: STEP_IDS.GROUP_TRAVEL,
    title: STEP_TITLES.TRAVEL_GROUP,
    description: "Are you traveling with companions?",
  },
  {
    id: STEP_IDS.GENERAL_INFO,
    title: STEP_TITLES.GENERAL_INFORMATION,
    description: "Address and travel direction",
  },
  {
    id: STEP_IDS.PERSONAL_INFO,
    title: STEP_TITLES.PERSONAL_INFORMATION,
    description: "Identity and passport details",
  },
  {
    id: STEP_IDS.CONTACT_INFO,
    title: STEP_TITLES.CONTACT_INFORMATION,
    description: "Email and phone (optional)",
  },
  {
    id: STEP_IDS.FLIGHT_INFO,
    title: STEP_TITLES.FLIGHT_INFORMATION,
    description: "Flight details and airline",
  },
  {
    id: STEP_IDS.CUSTOMS_DECLARATION,
    title: STEP_TITLES.CUSTOMS_DECLARATION,
    description: "Items and goods declaration",
  },
];

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = "eticket-draft";

export function MultiStepETicketForm({
  onSubmit,
  initialData,
  applicationCode,
  className,
}: MultiStepETicketFormProps) {
  const [currentStepId, setCurrentStepId] = useState<string>(
    STEP_IDS.GROUP_TRAVEL
  );
  const [stepErrors, setStepErrors] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive design
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Initialize form with TanStack Form
  const form = useForm({
    defaultValues: {
      groupTravel: {
        isGroupTravel: false,
        numberOfCompanions: undefined,
        groupNature: undefined,
      },
      generalInfo: {
        permanentAddress: "",
        residenceCountry: "",
        city: "",
        state: "",
        postalCode: "",
        hasStops: false,
        entryOrExit: "ENTRADA" as const,
      },
      personalInfo: {
        firstName: "",
        lastName: "",
        birthDate: {
          year: new Date().getFullYear() - 25,
          month: 1,
          day: 1,
        },
        gender: "MASCULINO" as const,
        birthCountry: "",
        maritalStatus: "SOLTERO" as const,
        occupation: "",
        passport: {
          number: "",
          confirmNumber: "",
          nationality: "",
          isDifferentNationality: false,
          additionalNationality: "",
        },
        isForeignResident: false,
      },
      contactInfo: {
        email: "",
        phone: {
          countryCode: "+1",
          number: "",
        },
      },
      flightInfo: {
        departurePort: "",
        arrivalPort: "",
        airline: "",
        flightDate: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
        },
        flightNumber: "",
        confirmationNumber: "",
      },
      customsDeclaration: {
        carriesOverTenThousand: false,
        carriesAnimalsOrFood: false,
        carriesTaxableGoods: false,
      },
      ...initialData,
    } as ETicketFormData,
    onSubmit: async ({ value }) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
        onSubmit?.(value);
      } catch {
        // Handle error silently for now
      }
    },
  });

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const currentData = form.state.values;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [form]);

  // Load draft data on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    if (savedDraft && !initialData) {
      try {
        const draftData = JSON.parse(savedDraft) as ETicketFormData;
        // Reset form with draft data
        form.reset(draftData);
      } catch {
        // Handle error silently
      }
    }
  }, [form, initialData]);

  // Step validation and progress tracking
  const steps = FORM_STEPS.map((step) => {
    let isCompleted = false;
    const hasError = stepErrors[step.id] || false;

    // Check if step is completed based on form data
    const values = form.state.values;
    switch (step.id) {
      case STEP_IDS.GROUP_TRAVEL:
        isCompleted = values.groupTravel?.isGroupTravel !== undefined;
        break;
      case STEP_IDS.GENERAL_INFO:
        isCompleted = Boolean(
          values.generalInfo?.permanentAddress &&
            values.generalInfo?.residenceCountry &&
            values.generalInfo?.city
        );
        break;
      case STEP_IDS.PERSONAL_INFO:
        isCompleted = Boolean(
          values.personalInfo?.firstName &&
            values.personalInfo?.lastName &&
            values.personalInfo?.passport?.number
        );
        break;
      case STEP_IDS.CONTACT_INFO:
        isCompleted = true; // Optional step
        break;
      case STEP_IDS.FLIGHT_INFO:
        isCompleted = Boolean(
          values.flightInfo?.flightNumber &&
            values.flightInfo?.airline &&
            values.flightInfo?.departurePort
        );
        break;
      case STEP_IDS.CUSTOMS_DECLARATION:
        isCompleted = currentStepId !== STEP_IDS.CUSTOMS_DECLARATION; // Completed when user moves past it
        break;
    }

    return { ...step, isCompleted, hasError };
  });

  const stepProgress = useStepProgress(steps, currentStepId);

  // Step navigation functions
  const validateCurrentStep = async (): Promise<boolean> => {
    try {
      const values = form.state.values;
      switch (currentStepId) {
        case STEP_IDS.GROUP_TRAVEL:
          await groupTravelSchema.parseAsync(values.groupTravel);
          break;
        case STEP_IDS.GENERAL_INFO:
          await generalInfoSchema.parseAsync(values.generalInfo);
          break;
        case STEP_IDS.PERSONAL_INFO:
          await personalInfoSchema.parseAsync(values.personalInfo);
          break;
        case STEP_IDS.CONTACT_INFO:
          await contactInfoSchema.parseAsync(values.contactInfo);
          break;
        case STEP_IDS.FLIGHT_INFO:
          await flightInfoSchema.parseAsync(values.flightInfo);
          break;
        case STEP_IDS.CUSTOMS_DECLARATION:
          await customsDeclarationSchema.parseAsync(values.customsDeclaration);
          break;
      }

      setStepErrors((prev) => ({ ...prev, [currentStepId]: false }));
      return true;
    } catch (error) {
      console.error("Validation error for step", currentStepId, ":", error);
      setStepErrors((prev) => ({ ...prev, [currentStepId]: true }));
      return false;
    }
  };

  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && stepProgress.canGoNext && stepProgress.nextStep) {
      setCurrentStepId(stepProgress.nextStep.id);
    }
  };

  const goToPreviousStep = () => {
    if (stepProgress.canGoPrevious && stepProgress.previousStep) {
      setCurrentStepId(stepProgress.previousStep.id);
    }
  };

  // Render current step component
  const renderCurrentStep = () => {
    const stepProps = {
      form,
      onNext: goToNextStep,
      onPrevious: goToPreviousStep,
    };

    switch (currentStepId) {
      case STEP_IDS.GROUP_TRAVEL:
        return <GroupTravelStep {...stepProps} />;
      case STEP_IDS.GENERAL_INFO:
        return <GeneralInfoStep {...stepProps} />;
      case STEP_IDS.PERSONAL_INFO:
        return <PersonalInfoStep {...stepProps} />;
      case STEP_IDS.CONTACT_INFO:
        return <ContactInfoStep {...stepProps} />;
      case STEP_IDS.FLIGHT_INFO:
        return <FlightInfoStep {...stepProps} />;
      case STEP_IDS.CUSTOMS_DECLARATION:
        return <CustomsDeclarationStep {...stepProps} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStepId === STEP_IDS.CUSTOMS_DECLARATION;

  return (
    <div className={cn("container mx-auto max-w-6xl p-4", className)}>
      {/* Application Code Display */}
      {applicationCode && (
        <Alert className="mb-6">
          <FileCheck className="h-4 w-4" />
          <AlertDescription>
            <strong>Application Code:</strong> {applicationCode}
            <br />
            <span className="text-muted-foreground text-sm">
              Save this code to access your application later
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                E-Ticket Application
              </CardTitle>
              <CardDescription>
                Complete all steps to generate your e-ticket
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressIndicator
                steps={steps}
                currentStepId={currentStepId}
                variant={isMobile ? "mobile" : "default"}
              />

              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    const currentData = form.state.values;
                    localStorage.setItem(
                      STORAGE_KEY,
                      JSON.stringify(currentData)
                    );
                  }}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Progress
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    form.reset();
                  }}
                >
                  Clear Draft
                </Button>
              </div>

              {/* Steps Overview */}
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-medium text-gray-900">
                  Steps Overview
                </h4>
                <div className="space-y-2">
                  {steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-600">{step.title}</span>
                      <Badge
                        variant={step.isCompleted ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {step.isCompleted ? "Complete" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {steps.find((s) => s.id === currentStepId)?.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {steps.find((s) => s.id === currentStepId)?.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  {stepProgress.currentStepIndex + 1} of {steps.length}
                </Badge>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">{renderCurrentStep()}</CardContent>

            <Separator />

            <CardContent className="pt-6">
              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={!stepProgress.canGoPrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {isLastStep ? (
                  <Button
                    onClick={() => form.handleSubmit()}
                    className="flex items-center gap-2"
                  >
                    Submit Application
                  </Button>
                ) : (
                  <Button
                    onClick={goToNextStep}
                    disabled={!stepProgress.canGoNext}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
