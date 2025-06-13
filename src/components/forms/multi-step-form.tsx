"use client";

import { ChevronLeft, ChevronRight, Save, FileCheck } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";

import { ModeToggle } from "@/components/mode-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAppForm } from "@/components/ui/tanstack-form";
import { ValidationError } from "@/components/ui/validation-error";
import {
  applicationFormOptions,
  type ApplicationData,
} from "@/lib/schemas/forms";
import {
  validateGroupTravelData,
  validateGeneralInfoData,
  validatePersonalInfoData,
  validateContactInfoData,
  validateFlightInfoData,
  validateCustomsDeclarationData,
} from "@/lib/schemas/validation";
import { cn } from "@/lib/utils";

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

interface FormProps {
  onSubmit?: (data: ApplicationData) => void;
  initialData?: Partial<ApplicationData>;
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
    id: STEP_IDS.CONTACT_INFO,
    title: STEP_TITLES.CONTACT_INFORMATION,
  },
  {
    id: STEP_IDS.FLIGHT_INFO,
    title: STEP_TITLES.FLIGHT_INFORMATION,
  },
  {
    id: STEP_IDS.GROUP_TRAVEL,
    title: STEP_TITLES.TRAVEL_GROUP,
  },
  {
    id: STEP_IDS.GENERAL_INFO,
    title: STEP_TITLES.GENERAL_INFORMATION,
  },
  {
    id: STEP_IDS.PERSONAL_INFO,
    title: STEP_TITLES.PERSONAL_INFORMATION,
  },
  {
    id: STEP_IDS.CUSTOMS_DECLARATION,
    title: STEP_TITLES.CUSTOMS_DECLARATION,
  },
];

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = "eticket-draft";

export function MultiStepForm({
  onSubmit,
  initialData,
  applicationCode,
  className,
}: FormProps) {
  const [currentStepId, setCurrentStepId] = useState<string>(
    STEP_IDS.CONTACT_INFO
  );
  const [stepErrors, setStepErrors] = useState<Record<string, boolean>>({});
  const [stepValidationErrors, setStepValidationErrors] = useState<
    Record<string, unknown[]>
  >({});
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
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

  // Initialize form with TanStack Form using useAppForm hook
  const form = useAppForm({
    ...applicationFormOptions,
    defaultValues: {
      ...applicationFormOptions.defaultValues,
      ...initialData,
    },
    onSubmit: async ({ value }: { value: ApplicationData }) => {
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
        const draftData = JSON.parse(savedDraft) as ApplicationData;
        // Reset form with draft data
        form.reset(draftData);
      } catch {
        // Handle error silently
      }
    }
  }, [form, initialData]);

  // Helper function to check if a step has valid data
  const isStepDataValid = (stepId: string): boolean => {
    const values = form.state.values;
    switch (stepId) {
      case STEP_IDS.CONTACT_INFO: {
        // Contact info is optional, but if user entered email or phone, it should be valid
        const hasEmail = values.contactInfo?.email?.trim();
        const hasPhone = values.contactInfo?.phone?.number?.trim();
        return !hasEmail && !hasPhone ? true : Boolean(hasEmail || hasPhone);
      }
      case STEP_IDS.FLIGHT_INFO:
        return Boolean(
          values.flightInfo?.flightNumber &&
            values.flightInfo?.airline &&
            values.flightInfo?.departurePort
        );
      case STEP_IDS.GROUP_TRAVEL:
        return values.groupTravel?.isGroupTravel !== undefined;
      case STEP_IDS.GENERAL_INFO:
        return Boolean(
          values.generalInfo?.permanentAddress &&
            values.generalInfo?.residenceCountry &&
            values.generalInfo?.city
        );
      case STEP_IDS.PERSONAL_INFO:
        return Boolean(
          values.personalInfo?.firstName &&
            values.personalInfo?.lastName &&
            values.personalInfo?.passport?.number
        );
      case STEP_IDS.CUSTOMS_DECLARATION:
        return (
          typeof values.customsDeclaration?.carriesOverTenThousand ===
            "boolean" &&
          typeof values.customsDeclaration?.carriesAnimalsOrFood ===
            "boolean" &&
          typeof values.customsDeclaration?.carriesTaxableGoods === "boolean"
        );
      default:
        return false;
    }
  };

  // Step validation and progress tracking
  const steps = FORM_STEPS.map((step) => {
    // A step is completed if:
    // 1. User has explicitly completed it (tracked in completedSteps), OR
    // 2. The step has valid data AND user has moved past it
    const hasValidData = isStepDataValid(step.id);
    const userCompletedStep = completedSteps.has(step.id);
    const userMovedPastStep =
      FORM_STEPS.findIndex((s) => s.id === step.id) <
      FORM_STEPS.findIndex((s) => s.id === currentStepId);

    const isCompleted =
      userCompletedStep || (hasValidData && userMovedPastStep);
    const hasError = stepErrors[step.id] || false;

    return { ...step, isCompleted, hasError };
  });

  const stepProgress = useStepProgress(steps, currentStepId);

  // Centralized step data management
  const getCurrentStepData = () => {
    switch (currentStepId) {
      case STEP_IDS.CONTACT_INFO:
        return {
          title: STEP_TITLES.CONTACT_INFORMATION,
          subtitle: "Email and phone",
        };
      case STEP_IDS.FLIGHT_INFO:
        return {
          title: STEP_TITLES.FLIGHT_INFORMATION,
          subtitle: "Flight details and airline",
        };
      case STEP_IDS.GROUP_TRAVEL:
        return {
          title: STEP_TITLES.TRAVEL_GROUP,
          subtitle: "Are you traveling with companions?",
        };
      case STEP_IDS.GENERAL_INFO:
        return {
          title: STEP_TITLES.GENERAL_INFORMATION,
          subtitle: "Address and travel direction",
        };
      case STEP_IDS.PERSONAL_INFO:
        return {
          title: STEP_TITLES.PERSONAL_INFORMATION,
          subtitle: "Identity and passport details",
        };
      case STEP_IDS.CUSTOMS_DECLARATION:
        return {
          title: STEP_TITLES.CUSTOMS_DECLARATION,
          subtitle: "Items and goods declaration",
        };
      default:
        return {
          title: "E-Ticket Application",
          subtitle: "",
        };
    }
  };

  // Proper form submission handler
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  // Step navigation functions
  const validateCurrentStep = async (): Promise<boolean> => {
    try {
      const values = form.state.values;
      switch (currentStepId) {
        case STEP_IDS.CONTACT_INFO:
          await validateContactInfoData.parseAsync(values.contactInfo);
          break;
        case STEP_IDS.FLIGHT_INFO:
          await validateFlightInfoData.parseAsync(values.flightInfo);
          break;
        case STEP_IDS.GROUP_TRAVEL:
          await validateGroupTravelData.parseAsync(values.groupTravel);
          break;
        case STEP_IDS.GENERAL_INFO:
          await validateGeneralInfoData.parseAsync(values.generalInfo);
          break;
        case STEP_IDS.PERSONAL_INFO:
          await validatePersonalInfoData.parseAsync(values.personalInfo);
          break;
        case STEP_IDS.CUSTOMS_DECLARATION:
          await validateCustomsDeclarationData.parseAsync(
            values.customsDeclaration
          );
          break;
      }

      // Clear errors if validation passes
      setStepErrors((prev) => ({ ...prev, [currentStepId]: false }));
      setStepValidationErrors((prev) => ({ ...prev, [currentStepId]: [] }));
      return true;
    } catch (error) {
      setStepErrors((prev) => ({ ...prev, [currentStepId]: true }));

      // Extract detailed error information for user display
      const errorList: string[] = [];

      if (error && typeof error === "object" && "issues" in error) {
        // Zod validation errors
        const zodError = error as {
          issues: Array<{ message: string; path: string[] }>;
        };

        zodError.issues.forEach((issue) => {
          // Use just the message for better UX, without field path prefix
          errorList.push(issue.message);
        });

        // Log for development debugging (without exposing to user)
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log(
            "Validation errors for step",
            currentStepId,
            ":",
            zodError.issues
          );
        }
      } else if (error instanceof Error) {
        errorList.push(error.message);
      } else {
        errorList.push("Please check the required fields and try again");
      }

      setStepValidationErrors((prev) => ({
        ...prev,
        [currentStepId]: errorList,
      }));
      return false;
    }
  };

  const goToNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && stepProgress.canGoNext && stepProgress.nextStep) {
      // Mark current step as completed when moving to next
      setCompletedSteps((prev) => new Set(prev).add(currentStepId));
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
      case STEP_IDS.CONTACT_INFO:
        return <ContactInfoStep {...stepProps} />;
      case STEP_IDS.FLIGHT_INFO:
        return <FlightInfoStep {...stepProps} />;
      case STEP_IDS.GROUP_TRAVEL:
        return <GroupTravelStep {...stepProps} />;
      case STEP_IDS.GENERAL_INFO:
        return <GeneralInfoStep {...stepProps} />;
      case STEP_IDS.PERSONAL_INFO:
        return <PersonalInfoStep {...stepProps} />;
      case STEP_IDS.CUSTOMS_DECLARATION:
        return <CustomsDeclarationStep {...stepProps} />;
      default:
        return null;
    }
  };

  // Helper functions to safely get step data without dynamic object access
  const getStepError = (stepId: string): boolean => {
    switch (stepId) {
      case STEP_IDS.CONTACT_INFO:
        return Boolean(stepErrors[STEP_IDS.CONTACT_INFO]);
      case STEP_IDS.FLIGHT_INFO:
        return Boolean(stepErrors[STEP_IDS.FLIGHT_INFO]);
      case STEP_IDS.GROUP_TRAVEL:
        return Boolean(stepErrors[STEP_IDS.GROUP_TRAVEL]);
      case STEP_IDS.GENERAL_INFO:
        return Boolean(stepErrors[STEP_IDS.GENERAL_INFO]);
      case STEP_IDS.PERSONAL_INFO:
        return Boolean(stepErrors[STEP_IDS.PERSONAL_INFO]);
      case STEP_IDS.CUSTOMS_DECLARATION:
        return Boolean(stepErrors[STEP_IDS.CUSTOMS_DECLARATION]);
      default:
        return false;
    }
  };

  const getStepValidationErrors = (stepId: string): unknown[] => {
    switch (stepId) {
      case STEP_IDS.CONTACT_INFO:
        return stepValidationErrors[STEP_IDS.CONTACT_INFO] || [];
      case STEP_IDS.FLIGHT_INFO:
        return stepValidationErrors[STEP_IDS.FLIGHT_INFO] || [];
      case STEP_IDS.GROUP_TRAVEL:
        return stepValidationErrors[STEP_IDS.GROUP_TRAVEL] || [];
      case STEP_IDS.GENERAL_INFO:
        return stepValidationErrors[STEP_IDS.GENERAL_INFO] || [];
      case STEP_IDS.PERSONAL_INFO:
        return stepValidationErrors[STEP_IDS.PERSONAL_INFO] || [];
      case STEP_IDS.CUSTOMS_DECLARATION:
        return stepValidationErrors[STEP_IDS.CUSTOMS_DECLARATION] || [];
      default:
        return [];
    }
  };

  const isLastStep = currentStepId === STEP_IDS.CUSTOMS_DECLARATION;
  const currentStepHasErrors = getStepError(currentStepId);
  const currentStepValidationErrors = getStepValidationErrors(currentStepId);

  return (
    <form.AppForm>
      <div className={cn("bg-background min-h-screen", className)}>
        <div className="container-padding-x section-padding-y container mx-auto max-w-6xl">
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
                <CardContent className="space-y-6">
                  <ProgressIndicator
                    steps={steps}
                    currentStepId={currentStepId}
                    variant={isMobile ? "mobile" : "default"}
                  />

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        const currentData = form.state.values;
                        localStorage.setItem(
                          STORAGE_KEY,
                          JSON.stringify(currentData)
                        );
                      }}
                    >
                      <Save className="h-4 w-4" />
                      Save Progress
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        localStorage.removeItem(STORAGE_KEY);
                        form.reset();
                        setStepErrors({});
                        setStepValidationErrors({});
                      }}
                    >
                      Clear Draft
                    </Button>
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
                        {getCurrentStepData().title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getCurrentStepData().subtitle}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">
                        {stepProgress.currentStepIndex + 1} of {steps.length}
                      </Badge>
                      <ModeToggle />
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                {/* Step Validation Errors */}
                {currentStepHasErrors &&
                  currentStepValidationErrors.length > 0 && (
                    <div className="px-6 pt-6">
                      <ValidationError
                        errors={currentStepValidationErrors}
                        title="Please fix the following issues:"
                        variant="alert"
                        dismissible
                        onDismiss={() => {
                          setStepErrors((prev) => ({
                            ...prev,
                            [currentStepId]: false,
                          }));
                          setStepValidationErrors((prev) => ({
                            ...prev,
                            [currentStepId]: [],
                          }));
                        }}
                      />
                    </div>
                  )}

                <CardContent className="space-y-8">
                  <form onSubmit={handleSubmit} id="eticket-application-form">
                    {renderCurrentStep()}
                  </form>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={!stepProgress.canGoPrevious}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {isLastStep ? (
                    <Button
                      onClick={() => form.handleSubmit()}
                      disabled={!form.state.canSubmit}
                      className="gap-2"
                    >
                      Submit Application
                    </Button>
                  ) : (
                    <Button
                      onClick={goToNextStep}
                      disabled={!stepProgress.canGoNext}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </form.AppForm>
  );
}
