import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import React from "react";

import { createApplicationUUID } from "@/lib/utils/application-utils";

import type { ApplicationData } from "@/lib/schemas/forms";

// Design system color - Primary color from globals.css
// oklch(0.391 0.085 240.876) converts to approximately #2563eb
const PRIMARY_COLOR = "#2563eb";

// Styles following React-PDF best practices with design system colors
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontSize: 10,
  },
  header: {
    backgroundColor: PRIMARY_COLOR, // Using design system primary color
    color: "#FFFFFF",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "center",
  },
  headerRightTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerRightSubtitle: {
    fontSize: 10,
    textAlign: "center",
  },
  content: {
    padding: 20,
  },
  applicationCode: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
  },
  mainLayout: {
    flexDirection: "row",
    gap: 20,
  },
  leftColumn: {
    flex: 2,
  },
  rightColumn: {
    flex: 1,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 15,
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    textAlign: "center",
    flex: 1,
  },
  tableCellLast: {
    padding: 5,
    textAlign: "center",
    flex: 1,
  },
  tableHeader: {
    backgroundColor: PRIMARY_COLOR, // Using design system primary color
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  migrationType: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 15,
  },
  passengersTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  qrSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  qrText: {
    fontSize: 8,
    textAlign: "center",
    fontWeight: "bold",
    maxWidth: 180,
    lineHeight: 1.2,
  },
});

// Helper function to format date according to Dominican format
const formatDate = (date: Date) => ({
  month: (date.getMonth() + 1).toString().padStart(2, "0"),
  day: date.getDate().toString().padStart(2, "0"),
  year: date.getFullYear().toString(),
});

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
    console.error("Error generating QR code:", error);
    // Fallback: return a simple placeholder data URL
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlPSIjZGRkIi8+PHRleHQgeD0iNzUiIHk9Ijc1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==";
  }
};

// Reusable Date Table Component following design system patterns
interface DateTableProps {
  title: string;
  date: Date;
}

const DateTable: React.FC<DateTableProps> = ({ title, date }) => {
  const formatted = formatDate(date);

  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Mes</Text>
          <Text style={styles.tableCell}>Día</Text>
          <Text style={styles.tableCellLast}>Año</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{formatted.month}</Text>
          <Text style={styles.tableCell}>{formatted.day}</Text>
          <Text style={styles.tableCellLast}>{formatted.year}</Text>
        </View>
      </View>
    </>
  );
};

// Flight Information Table Component
interface FlightTableProps {
  flightNumber: string;
  airline: string;
}

const FlightTable: React.FC<FlightTableProps> = ({ flightNumber, airline }) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.tableHeader]}>
      <Text style={styles.tableCell}>NÚMERO DE VUELO</Text>
      <Text style={styles.tableCellLast}>NOMBRE DE AEROLÍNEA</Text>
    </View>
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{flightNumber}</Text>
      <Text style={styles.tableCellLast}>{airline}</Text>
    </View>
  </View>
);

// QR Code Section Component
interface QRCodeSectionProps {
  qrCodeDataURL: string;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({ qrCodeDataURL }) => {
  return (
    <View style={styles.qrSection}>
      {qrCodeDataURL && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image style={styles.qrCode} src={qrCodeDataURL} />
      )}
      <Text style={styles.qrText}>
        CÓDIGO QR DE USO EXCLUSIVO PARA VALIDACIÓN ADUANAL.
      </Text>
    </View>
  );
};

// Passengers Table Component
interface PassengersTableProps {
  personalInfo: ApplicationData["personalInfo"];
  travelCompanions?: ApplicationData["travelCompanions"];
}

const PassengersTable: React.FC<PassengersTableProps> = ({
  personalInfo,
  travelCompanions,
}) => {
  const nationality =
    personalInfo.passport.isDifferentNationality &&
    personalInfo.passport.nationality
      ? personalInfo.passport.nationality
      : personalInfo.birthCountry;

  return (
    <>
      <Text style={styles.passengersTitle}>PASAJEROS</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { flex: 2 }]}>NOMBRES</Text>
          <Text style={styles.tableCell}>PAÍS DE NACIONALIDAD</Text>
          <Text style={styles.tableCellLast}>NÚMERO DE PASAPORTE</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>
            {personalInfo.firstName.toUpperCase()}{" "}
            {personalInfo.lastName.toUpperCase()}
          </Text>
          <Text style={styles.tableCell}>{nationality}</Text>
          <Text style={styles.tableCellLast}>
            {personalInfo.passport.number}
          </Text>
        </View>

        {/* Group travel information if applicable */}
        {travelCompanions?.isGroupTravel &&
          travelCompanions.numberOfCompanions &&
          travelCompanions.numberOfCompanions > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                + {travelCompanions.numberOfCompanions} ACOMPAÑANTES
              </Text>
              <Text style={styles.tableCell}>
                {travelCompanions.groupNature?.toUpperCase() || "GRUPO"}
              </Text>
              <Text style={styles.tableCellLast}>VER TICKETS INDIVIDUALES</Text>
            </View>
          )}
      </View>
    </>
  );
};

// Main E-Ticket Document Component following design system structure
interface ETicketDocumentProps {
  submittedData: ApplicationData;
  applicationCode: string;
  qrCodeDataURL: string;
  issueDate: Date;
}

const ETicketDocument: React.FC<ETicketDocumentProps> = ({
  submittedData,
  applicationCode,
  qrCodeDataURL,
  issueDate,
}) => {
  const flightDate = new Date(submittedData.flightInfo.travelDate);
  const migrationType =
    submittedData.flightInfo.travelDirection === "ENTRY" ? "ENTRADA" : "SALIDA";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section with Design System Colors */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View>
              <Text style={styles.headerTitle}>E-TICKET</Text>
              <Text style={styles.headerSubtitle}>REPÚBLICA DOMINICANA</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerRightSubtitle}>GOBIERNO DE LA</Text>
            <Text style={styles.headerRightSubtitle}>REPÚBLICA DOMINICANA</Text>
            <Text style={styles.headerRightTitle}>MIGRACIÓN</Text>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          {/* Application Code */}
          <Text style={styles.applicationCode}>
            CÓDIGO DE APLICACIÓN: {applicationCode}
          </Text>

          {/* Main Layout with Left/Right Columns */}
          <View style={styles.mainLayout}>
            {/* Left Column - Form Data */}
            <View style={styles.leftColumn}>
              {/* Issue Date */}
              <DateTable title="FECHA DE EMISIÓN" date={issueDate} />

              {/* Migration Type */}
              <Text style={styles.migrationType}>
                MIGRACIÓN: {migrationType}
              </Text>

              {/* Flight Date */}
              <DateTable title="FECHA DE VUELO" date={flightDate} />

              {/* Flight Information */}
              <FlightTable
                flightNumber={submittedData.flightInfo.flightNumber}
                airline={submittedData.flightInfo.airline}
              />
            </View>

            {/* Right Column - QR Code */}
            <View style={styles.rightColumn}>
              <QRCodeSection qrCodeDataURL={qrCodeDataURL} />
            </View>
          </View>

          {/* Passengers Section */}
          <PassengersTable
            personalInfo={submittedData.personalInfo}
            travelCompanions={submittedData.travelCompanions}
          />
        </View>
      </Page>
    </Document>
  );
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

    // Generate PDF using clean JSX syntax with design system integration
    const pdfBuffer = await renderToBuffer(
      <ETicketDocument
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
