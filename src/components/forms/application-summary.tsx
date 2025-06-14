"use client";

import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ApplicationData } from "@/lib/schemas/forms";

interface ApplicationSummaryProps {
  data: ApplicationData;
  applicationCode: string;
}

export function ApplicationSummary({
  data,
  applicationCode,
}: ApplicationSummaryProps) {
  return (
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
          <div className="space-y-2">
            <h4 className="font-medium">Migratory Information</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                {data.personalInfo.firstName} {data.personalInfo.lastName}
              </p>
              <p>
                <span className="text-muted-foreground">Passport:</span>{" "}
                {data.personalInfo.passport.number}
              </p>
              <p>
                <span className="text-muted-foreground">Nationality:</span>{" "}
                {data.personalInfo.passport.nationality}
              </p>
              <p>
                <span className="text-muted-foreground">Birth Country:</span>{" "}
                {data.personalInfo.birthCountry}
              </p>
            </div>
          </div>

          {/* Travel Information */}
          <div className="space-y-2">
            <h4 className="font-medium">Travel Information</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Direction:</span>{" "}
                {data.flightInfo.travelDirection === "ENTRY"
                  ? "Entry to Dominican Republic"
                  : "Exit from Dominican Republic"}
              </p>
              <p>
                <span className="text-muted-foreground">Flight:</span>{" "}
                {data.flightInfo.flightNumber} ({data.flightInfo.airline})
              </p>
              <p>
                <span className="text-muted-foreground">Route:</span>{" "}
                {data.flightInfo.departurePort} → {data.flightInfo.arrivalPort}
              </p>
              <p>
                <span className="text-muted-foreground">Flight Type:</span>{" "}
                {data.flightInfo.hasStops
                  ? "With Connections"
                  : "Direct Flight"}
              </p>
              <p>
                <span className="text-muted-foreground">Address:</span>{" "}
                {data.generalInfo.permanentAddress}
              </p>
            </div>
          </div>

          {/* Contact Information (if provided) */}
          {(data.contactInfo.preferredName ||
            data.contactInfo.email ||
            data.contactInfo.phone?.number) && (
            <div className="space-y-2">
              <h4 className="font-medium">Contact Information</h4>
              <div className="space-y-1 text-sm">
                {data.contactInfo.preferredName && (
                  <p>
                    <span className="text-muted-foreground">
                      Preferred Name:
                    </span>{" "}
                    {data.contactInfo.preferredName}
                  </p>
                )}
                {data.contactInfo.email && (
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {data.contactInfo.email}
                  </p>
                )}
                {data.contactInfo.phone?.number && (
                  <p>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    {data.contactInfo.phone.countryCode}{" "}
                    {data.contactInfo.phone.number}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Group Information (if group travel) */}
          {data.travelCompanions.isGroupTravel && (
            <div className="space-y-2">
              <h4 className="font-medium">Group Travel</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Companions:</span>{" "}
                  {data.travelCompanions.numberOfCompanions}
                </p>
                <p>
                  <span className="text-muted-foreground">Group Type:</span>{" "}
                  {data.travelCompanions.groupNature}
                </p>
              </div>
            </div>
          )}

          {/* Customs Declaration */}
          <div className="space-y-2 md:col-span-2">
            <h4 className="font-medium">Customs Declaration</h4>
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
              <p>
                <span className="text-muted-foreground">Over $10,000 USD:</span>{" "}
                <Badge
                  variant={
                    data.customsDeclaration.carriesOverTenThousand
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {data.customsDeclaration.carriesOverTenThousand
                    ? "Yes"
                    : "No"}
                </Badge>
              </p>
              <p>
                <span className="text-muted-foreground">Animals/Food:</span>{" "}
                <Badge
                  variant={
                    data.customsDeclaration.carriesAnimalsOrFood
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {data.customsDeclaration.carriesAnimalsOrFood ? "Yes" : "No"}
                </Badge>
              </p>
              <p>
                <span className="text-muted-foreground">Taxable Goods:</span>{" "}
                <Badge
                  variant={
                    data.customsDeclaration.carriesTaxableGoods
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {data.customsDeclaration.carriesTaxableGoods ? "Yes" : "No"}
                </Badge>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
