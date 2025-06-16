import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import React from "react";

import { ETicketPDF } from "@/components/pdf/e-ticket-pdf";
import { createApplicationUUID } from "@/lib/utils/application-utils";

import type { ApplicationData } from "@/lib/schemas/forms";

// Generate QR Code as base64 data URL
const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      width: 150,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating QR code:", error);
    // Fallback: return a simple placeholder data URL
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlPSIjZGRkIi8+PHRleHQgeD0iNzUiIHk9Ijc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==";
  }
};

// API Route Handler with proper error handling
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submittedData, applicationCode } = body as {
      submittedData: ApplicationData;
      applicationCode: string;
    };

    if (!submittedData || !applicationCode) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    const issueDate = new Date();
    const applicationUUID = createApplicationUUID(applicationCode);

    // Generate QR code before PDF rendering
    const qrCodeDataURL = await generateQRCode(applicationUUID);

    // Generate PDF using the clean PDF component
    const pdfBuffer = await renderToBuffer(
      <ETicketPDF
        submittedData={submittedData}
        applicationCode={applicationCode}
        qrCodeDataURL={qrCodeDataURL}
        issueDate={issueDate}
      />
    );

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="eticket-${applicationCode}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to generate PDF." },
    { status: 405 }
  );
}
