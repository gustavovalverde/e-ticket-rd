"use client";

import { User, Plane, FileText, CheckCircle, Info } from "lucide-react";
import { useCallback, useState } from "react";

import { useAppForm } from "@/components/ui/tanstack-form";
import {
  applicationFormOptions,
  type ApplicationFormData,
} from "@/lib/schemas/form-options";

import { FlightInfoForm } from "./flight-info-form";
import { FormLayout } from "./form-layout";
import { PassportDetailsForm } from "./passport-details-form";
import { ReviewForm } from "./review-form";
import { TravellerInfoForm } from "./traveller-info-form";
import { TripTypeForm } from "./trip-type-form";

// Define form steps using proper icons
const FORM_STEPS = [
  { icon: Info, label: "Travel Type" },
  { icon: User, label: "Personal Info" },
  { icon: FileText, label: "Passport Details" },
  { icon: Plane, label: "Flight Info" },
  { icon: CheckCircle, label: "Review" },
];

export function ApplicationForm() {
  const [currentStep] = useState(0); // 0-indexed for button-9, start with trip type

  const form = useAppForm({
    ...applicationFormOptions,
    onSubmit: async ({ value }: { value: ApplicationFormData }) => {
      // TODO: Submit form data to backend
      console.log("Form submitted:", value);
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
        return <TripTypeForm form={form} />;

      case 1:
        return <TravellerInfoForm form={form} />;

      case 2:
        return <PassportDetailsForm form={form} />;

      case 3:
        return <FlightInfoForm form={form} />;

      case 4:
        return <ReviewForm form={form} onSubmit={() => form.handleSubmit()} />;

      default:
        return null;
    }
  };

  return (
    <form.AppForm>
      <FormLayout
        steps={FORM_STEPS}
        currentStep={currentStep}
        title="Dominican Republic Travel Application"
        subtitle="Please provide your travel details and personal information to complete your travel application."
        onBack={handleBack}
        onContinue={handleContinue}
        onStepChange={handleStepChange}
        continueLabel="Continue"
        canContinue={form.state.canSubmit}
      >
        <form onSubmit={handleSubmit} id="travel-application-form">
          {renderStep()}
        </form>
      </FormLayout>
    </form.AppForm>
  );
}
