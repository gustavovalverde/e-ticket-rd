"use client";

import { CheckCircle, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ApplicationSummary } from "./application-summary";
import { QRCodeDisplay } from "./qr-code-display";

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
      <ApplicationSummary
        data={submittedData}
        applicationCode={applicationCode}
      />

      {/* QR Code Section */}
      <div className="mb-6">
        <QRCodeDisplay data={JSON.stringify(submittedData)} />
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <Button size="lg">
          <FileText className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" size="lg">
          Send by Email
        </Button>
        <Button variant="outline" size="lg" onClick={onReset}>
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
