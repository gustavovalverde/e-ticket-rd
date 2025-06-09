"use client";

import { CheckCircle, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { MultiStepETicketForm } from "@/components/forms/multi-step-eticket-form";
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

import type { ETicketFormData } from "@/lib/validations/eticket-schemas";

export default function ETicketFormPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<ETicketFormData | null>(
    null
  );
  const [applicationCode] = useState(
    `ETK${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  );

  const handleFormSubmit = (data: ETicketFormData) => {
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
      <div className="container mx-auto max-w-4xl p-4">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
          <h1 className="mb-2 text-3xl font-bold text-green-900">
            E-Ticket Successfully Generated!
          </h1>
          <p className="text-muted-foreground">
            Your Dominican Republic e-ticket has been created and is ready for
            travel.
          </p>
        </div>

        {/* Application Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Application Summary
            </CardTitle>
            <CardDescription>
              Application Code:{" "}
              <Badge variant="outline" className="ml-2">
                {applicationCode}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Personal Information */}
              <div className="space-y-2">
                <h4 className="font-medium">Personal Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {submittedData.personalInfo.firstName}{" "}
                    {submittedData.personalInfo.lastName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Passport:</span>{" "}
                    {submittedData.personalInfo.passport.number}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Nationality:</span>{" "}
                    {submittedData.personalInfo.passport.nationality}
                  </p>
                </div>
              </div>

              {/* Travel Information */}
              <div className="space-y-2">
                <h4 className="font-medium">Travel Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Direction:</span>{" "}
                    {submittedData.generalInfo.entryOrExit === "ENTRADA"
                      ? "Entry to Dominican Republic"
                      : "Exit from Dominican Republic"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Flight:</span>{" "}
                    {submittedData.flightInfo.flightNumber} (
                    {submittedData.flightInfo.airline})
                  </p>
                  <p>
                    <span className="text-muted-foreground">Route:</span>{" "}
                    {submittedData.flightInfo.departurePort} →{" "}
                    {submittedData.flightInfo.arrivalPort}
                  </p>
                </div>
              </div>

              {/* Group Information */}
              {submittedData.groupTravel.isGroupTravel && (
                <div className="space-y-2 md:col-span-2">
                  <h4 className="font-medium">Group Travel</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Companions:</span>{" "}
                      {submittedData.groupTravel.numberOfCompanions}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Group Type:</span>{" "}
                      {submittedData.groupTravel.groupNature}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Simulation */}
        <Card className="mb-6 text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
              <div className="text-center">
                <FileText className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">QR Code</p>
                <p className="text-xs text-gray-400">Generated Here</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              CÓDIGO QR DE USO EXCLUSIVO PARA VALIDACIÓN ADUANAL
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg">
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="lg">
            Send by Email
          </Button>
          <Button variant="outline" size="lg" onClick={resetForm}>
            Create New Application
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Important Notice */}
        <Alert className="mt-6">
          <AlertDescription>
            <strong>Important:</strong> Keep this application code safe:{" "}
            <Badge variant="outline">{applicationCode}</Badge>
            <br />
            You can use it to access and modify your e-ticket later if needed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto max-w-6xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dominican Republic E-Ticket Application
              </h1>
              <p className="text-muted-foreground">
                Complete your electronic ticket for migration control
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="py-8">
        <MultiStepETicketForm
          onSubmit={handleFormSubmit}
          applicationCode={applicationCode}
        />
      </div>

      {/* Features Notice */}
      <div className="border-t bg-white">
        <div className="container mx-auto max-w-6xl p-4">
          <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
            <div>
              <h3 className="mb-2 font-medium">Smart Forms</h3>
              <p className="text-muted-foreground text-sm">
                Auto-fill flight details, share information for group travel
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Auto-Save</h3>
              <p className="text-muted-foreground text-sm">
                Your progress is saved automatically every 30 seconds
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Mobile Optimized</h3>
              <p className="text-muted-foreground text-sm">
                Works perfectly on phones, tablets, and desktop computers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
