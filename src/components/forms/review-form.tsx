"use client";

import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/ui/form-section";

import type { ReviewFormProps } from "@/lib/types/form";

export function ReviewForm({ form, onSubmit }: ReviewFormProps) {
  const values = form.state.values;

  return (
    <FormSection
      title="Review Your Information"
      description="Please review all your information before submitting"
      required
    >
      <div className="space-y-6">
        {/* Trip Type */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="mb-2 font-medium">Trip Type</h4>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>Direction: {values.travelType?.tripDirection}</p>
            <p>Transport: {values.travelType?.transportMethod}</p>
            <p>Group Type: {values.travelType?.groupType}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="mb-2 font-medium">Personal Information</h4>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>
              Name: {values.firstName} {values.lastName}
            </p>
            <p>Email: {values.email}</p>
            <p>Phone: {values.phone}</p>
          </div>
        </div>

        {/* Passport Details */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="mb-2 font-medium">Passport Details</h4>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>Passport Number: {values.passportNumber}</p>
            <p>Nationality: {values.nationality}</p>
          </div>
        </div>

        {/* Flight Information */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="mb-2 font-medium">Flight Information</h4>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>Flight Number: {values.flightNumber}</p>
            <p>Arrival Date: {values.arrivalDate}</p>
          </div>
        </div>

        <Button type="button" onClick={onSubmit} className="w-full">
          Submit Application
        </Button>
      </div>
    </FormSection>
  );
}
