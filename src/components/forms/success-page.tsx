"use client";

import {
  CheckCircle,
  FileText,
  ArrowLeft,
  QrCode,
  Download,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createApplicationUUID } from "@/lib/utils/application-utils";

import type { ApplicationData } from "@/lib/schemas/forms";

interface SuccessPageProps {
  submittedData: ApplicationData;
  applicationCode: string;
  onReset: () => void;
}

export function SuccessPage({
  submittedData,
  applicationCode,
  onReset,
}: SuccessPageProps) {
  // Generate a deterministic UUID for this application
  const applicationUUID = createApplicationUUID(applicationCode);

  // Export functionality state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [flightNumber, setFlightNumber] = useState(
    submittedData.flightInfo?.flightNumber || ""
  );
  const [passportNumber, setPassportNumber] = useState(
    submittedData.travelers?.[0]?.personalInfo?.passport?.number || ""
  );

  const handleExportData = async () => {
    if (!flightNumber.trim() || !passportNumber.trim()) {
      setExportError("Both flight number and passport number are required");
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch("/api/encrypt-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: submittedData,
          flightNumber: flightNumber.trim(),
          passportNumber: passportNumber.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to export data");
      }

      const { data } = await response.json();

      // Create download
      const exportData = {
        ...data,
        applicationCode,
        exported: true,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eticket-backup-${applicationCode}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExportOpen(false);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Failed to export data"
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="section-padding-y container mx-auto max-w-4xl">
      {/* Success Header */}
      <div className="mb-8 text-center">
        <CheckCircle className="text-success mx-auto mb-4 h-16 w-16" />
        <h1 className="heading-lg text-foreground mb-2">
          E-Ticket Successfully Generated!
        </h1>
        <p className="text-muted-foreground">
          Your Dominican Republic e-ticket has been created and is ready for
          travel.
        </p>
      </div>

      {/* Application Summary */}
      <div className="mb-8 space-y-6">
        <Card>
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
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Migratory Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {submittedData.travelers[0].personalInfo.firstName}{" "}
                    {submittedData.travelers[0].personalInfo.lastName}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Passport:</span>{" "}
                    {submittedData.travelers[0].personalInfo.passport.number}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Nationality:</span>{" "}
                    {submittedData.travelers[0].personalInfo.passport
                      .isDifferentNationality &&
                    submittedData.travelers[0].personalInfo.passport.nationality
                      ? submittedData.travelers[0].personalInfo.passport
                          .nationality
                      : submittedData.travelers[0].personalInfo.birthCountry}
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      Birth Country:
                    </span>{" "}
                    {submittedData.travelers[0].personalInfo.birthCountry}
                  </p>
                </div>
              </div>

              {/* Travel Information */}
              <div className="space-y-2">
                <h4 className="font-medium">Travel Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Direction:</span>{" "}
                    {submittedData.flightInfo.travelDirection === "ENTRY"
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
                  <p>
                    <span className="text-muted-foreground">Flight Type:</span>{" "}
                    {submittedData.flightInfo.hasStops === true
                      ? "With Connections"
                      : "Direct Flight"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Address:</span>{" "}
                    {submittedData.travelers?.[0]?.addressInheritance
                      ?.individualAddress?.permanentAddress || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Contact Information (if provided) */}
              {(submittedData.contactInfo.email ||
                submittedData.contactInfo.phone) && (
                <div className="space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    {submittedData.contactInfo.email && (
                      <p>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {submittedData.contactInfo.email}
                      </p>
                    )}
                    {submittedData.contactInfo.phone && (
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {submittedData.contactInfo.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Group Information (if group travel) */}
              {submittedData.travelCompanions?.isGroupTravel && (
                <div className="space-y-2">
                  <h4 className="font-medium">Group Travel</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Companions:</span>{" "}
                      {submittedData.travelCompanions?.numberOfCompanions ||
                        "N/A"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Group Type:</span>{" "}
                      {submittedData.travelCompanions?.groupNature || "N/A"}
                    </p>
                  </div>
                </div>
              )}

              {/* Customs Declaration */}
              <div className="space-y-2 md:col-span-2">
                <h4 className="font-medium">Customs Declaration</h4>
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                  <p>
                    <span className="text-muted-foreground">
                      Over $10,000 USD:
                    </span>{" "}
                    <Badge
                      variant={
                        submittedData.customsDeclaration.carriesOverTenThousand
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {submittedData.customsDeclaration.carriesOverTenThousand
                        ? "Yes"
                        : "No"}
                    </Badge>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Animals/Food:</span>{" "}
                    <Badge
                      variant={
                        submittedData.customsDeclaration.carriesAnimalsOrFood
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {submittedData.customsDeclaration.carriesAnimalsOrFood
                        ? "Yes"
                        : "No"}
                    </Badge>
                  </p>
                  <p>
                    <span className="text-muted-foreground">
                      Taxable Goods:
                    </span>{" "}
                    <Badge
                      variant={
                        submittedData.customsDeclaration.carriesTaxableGoods
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {submittedData.customsDeclaration.carriesTaxableGoods
                        ? "Yes"
                        : "No"}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code for Customs Validation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* QR Code Display */}
            <div className="flex justify-center">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={applicationUUID}
                  size={200}
                  level="M"
                  marginSize={4}
                />
              </div>
            </div>

            {/* QR Code Information */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                CÓDIGO QR DE USO EXCLUSIVO PARA VALIDACIÓN ADUANAL
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mb-8 space-y-6">
        {/* Primary Actions - Side by Side */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={async () => {
              try {
                const response = await fetch("/api/generate-pdf", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    submittedData,
                    applicationCode,
                  }),
                });

                if (response.ok) {
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.style.display = "none";
                  a.href = url;
                  a.download = `eticket-${applicationCode}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } else {
                  // eslint-disable-next-line no-console
                  console.error("Failed to generate PDF");
                  // You could add a toast notification here
                }
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Error downloading PDF:", error);
                // You could add a toast notification here
              }
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>

          <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Export Form Data
                </DialogTitle>
                <DialogDescription>
                  Your form data will be encrypted and can only be restored
                  using your flight number and passport number.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="export-flight">Flight Number</Label>
                  <Input
                    id="export-flight"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="e.g., AA1234"
                    disabled={isExporting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export-passport">Passport Number</Label>
                  <Input
                    id="export-passport"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="Enter passport number"
                    disabled={isExporting}
                  />
                </div>

                {exportError && (
                  <Alert>
                    <AlertDescription>{exportError}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={handleExportData}
                    disabled={
                      isExporting ||
                      !flightNumber.trim() ||
                      !passportNumber.trim()
                    }
                    className="flex-1"
                  >
                    {isExporting ? "Exporting..." : "Export & Download"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsExportOpen(false)}
                    disabled={isExporting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button variant="outline" size="lg" className="w-full">
            Send by Email
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={onReset}
            className="w-full"
          >
            Create New Application
          </Button>

          <Button variant="outline" size="lg" asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Important Notice */}
      <Alert>
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
