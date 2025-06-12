"use client";

import { useState } from "react";

import { MultiStepETicketForm } from "./multi-step-eticket-form";
import { SuccessPage } from "./success-page";

import type { ApplicationData } from "@/lib/schemas/forms";

export function ETicketFormContainer() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ApplicationData | null>(
    null
  );
  const [applicationCode] = useState(
    `ETK${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  );

  const handleFormSubmit = (data: ApplicationData) => {
    setSubmittedData(data);
    setIsSubmitted(true);

    // In a real app, this would submit to the backend
    // eslint-disable-next-line no-console
    console.log("Form submitted:", data);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    localStorage.removeItem("eticket-draft");
  };

  if (isSubmitted && submittedData) {
    return (
      <SuccessPage
        submittedData={submittedData}
        applicationCode={applicationCode}
        onReset={resetForm}
      />
    );
  }

  return (
    <MultiStepETicketForm
      onSubmit={handleFormSubmit}
      applicationCode={applicationCode}
    />
  );
}
