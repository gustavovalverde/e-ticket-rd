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
        {/* Travel Information */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="mb-2 font-medium">Travel Information</h4>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>Direction: {values.travelType?.tripDirection}</p>
            <p>Transport: {values.travelType?.transportMethod}</p>
            <p>Group Type: {values.travelType?.groupType}</p>
            {values.flightInfo?.flightNumber && (
              <p>Flight: {values.flightInfo.flightNumber}</p>
            )}
            {values.flightInfo?.airline && (
              <p>Airline: {values.flightInfo.airline}</p>
            )}
            {values.flightInfo?.departurePort && (
              <p>Departure: {values.flightInfo.departurePort}</p>
            )}
            {values.flightInfo?.arrivalPort && (
              <p>Arrival: {values.flightInfo.arrivalPort}</p>
            )}
            {values.flightInfo?.travelDate && (
              <p>Travel Date: {values.flightInfo.travelDate}</p>
            )}
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

        <Button type="button" onClick={onSubmit} className="w-full">
          Submit Application
        </Button>
      </div>
    </FormSection>
  );
}
