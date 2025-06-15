import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import React from "react";

import type { ApplicationData } from "@/lib/schemas/forms";

interface ETicketPDFProps {
  submittedData: ApplicationData;
  applicationCode: string;
  applicationUUID: string;
  issueDate: Date;
}

// Create styles to match the official ticket
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 0,
    fontSize: 10,
  },
  header: {
    backgroundColor: "#1e40af",
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
  headerText: {
    marginLeft: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  eTicketTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  republicaText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  headerRight: {
    alignItems: "center",
  },
  gobiernoText: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 5,
  },
  migracionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
    flex: 1,
  },
  applicationInfo: {
    marginBottom: 20,
  },
  applicationCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mainContent: {
    flexDirection: "row",
  },
  leftColumn: {
    flex: 2,
    marginRight: 20,
  },
  rightColumn: {
    flex: 1,
    alignItems: "center",
  },
  dateSection: {
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateTable: {
    border: 1,
    borderColor: "#000000",
    width: 200,
  },
  dateRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: "#000000",
  },
  dateCell: {
    flex: 1,
    padding: 5,
    borderRight: 1,
    borderColor: "#000000",
    textAlign: "center",
  },
  dateCellLast: {
    flex: 1,
    padding: 5,
    textAlign: "center",
  },
  migrationType: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrCode: {
    width: 150,
    height: 150,
    marginBottom: 10,
    border: 2,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  qrText: {
    fontSize: 8,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  flightSection: {
    marginBottom: 20,
  },
  flightTable: {
    border: 1,
    borderColor: "#000000",
  },
  flightHeader: {
    backgroundColor: "#1e40af",
    color: "#FFFFFF",
    flexDirection: "row",
    padding: 5,
  },
  flightHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 10,
  },
  flightRow: {
    flexDirection: "row",
    padding: 5,
  },
  flightCell: {
    flex: 1,
    textAlign: "center",
  },
  passengersSection: {
    marginTop: 20,
  },
  passengersTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  passengersTable: {
    border: 1,
    borderColor: "#000000",
  },
  passengersHeader: {
    backgroundColor: "#1e40af",
    color: "#FFFFFF",
    flexDirection: "row",
    padding: 5,
  },
  passengersHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 10,
  },
  passengersRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderColor: "#000000",
    padding: 5,
  },
  passengersCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 9,
  },
});

// Helper function to format date
const formatDate = (date: Date) => {
  return {
    month: (date.getMonth() + 1).toString().padStart(2, "0"),
    day: date.getDate().toString().padStart(2, "0"),
    year: date.getFullYear().toString(),
  };
};

// Helper function to get country flag emoji
const getCountryFlag = (countryCode: string): string => {
  const countryFlags = new Map([
    ["DOM", "🇩🇴"],
    ["USA", "🇺🇸"],
    ["CAN", "🇨🇦"],
    ["ESP", "🇪🇸"],
    ["FRA", "🇫🇷"],
    ["GBR", "🇬🇧"],
    ["DEU", "🇩🇪"],
    ["ITA", "🇮🇹"],
    ["NLD", "🇳🇱"],
    ["BRA", "🇧🇷"],
    ["COL", "🇨🇴"],
    ["VEN", "🇻🇪"],
    ["ARG", "🇦🇷"],
    ["MEX", "🇲🇽"],
    ["PAN", "🇵🇦"],
    ["CUB", "🇨🇺"],
    ["HTI", "🇭🇹"],
    ["JAM", "🇯🇲"],
    ["PRI", "🇵🇷"],
  ]);

  return countryFlags.get(countryCode) || "🏳️";
};

export const ETicketPDF: React.FC<ETicketPDFProps> = ({
  submittedData,
  applicationCode,
  applicationUUID,
  issueDate,
}) => {
  const formattedIssueDate = formatDate(issueDate);
  const formattedFlightDate = formatDate(
    new Date(submittedData.flightInfo.travelDate)
  );

  // Get nationality (required field, no fallback)
  const nationality =
    submittedData.personalInfo.passport.isDifferentNationality &&
    submittedData.personalInfo.passport.nationality
      ? submittedData.personalInfo.passport.nationality
      : submittedData.personalInfo.birthCountry;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>🇩🇴</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.eTicketTitle}>E-TICKET</Text>
              <Text style={styles.republicaText}>REPÚBLICA DOMINICANA</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.gobiernoText}>GOBIERNO DE LA</Text>
            <Text style={styles.gobiernoText}>REPÚBLICA DOMINICANA</Text>
            <Text style={styles.migracionText}>MIGRACIÓN</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Application Code */}
          <View style={styles.applicationInfo}>
            <Text style={styles.applicationCode}>
              CÓDIGO DE APLICACIÓN: {applicationCode}
            </Text>
          </View>

          {/* Main Content Row */}
          <View style={styles.mainContent}>
            {/* Left Column */}
            <View style={styles.leftColumn}>
              {/* Issue Date */}
              <View style={styles.dateSection}>
                <Text style={styles.dateTitle}>FECHA DE EMISIÓN</Text>
                <View style={styles.dateTable}>
                  <View style={styles.dateRow}>
                    <Text style={[styles.dateCell, { fontWeight: "bold" }]}>
                      Mes
                    </Text>
                    <Text style={[styles.dateCell, { fontWeight: "bold" }]}>
                      Día
                    </Text>
                    <Text style={[styles.dateCellLast, { fontWeight: "bold" }]}>
                      Año
                    </Text>
                  </View>
                  <View style={styles.dateRow}>
                    <Text style={styles.dateCell}>
                      {formattedIssueDate.month}
                    </Text>
                    <Text style={styles.dateCell}>
                      {formattedIssueDate.day}
                    </Text>
                    <Text style={styles.dateCellLast}>
                      {formattedIssueDate.year}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Migration Type */}
              <Text style={styles.migrationType}>
                MIGRACIÓN:{" "}
                {submittedData.flightInfo.travelDirection === "ENTRY"
                  ? "ENTRADA"
                  : "SALIDA"}
              </Text>

              {/* Flight Date */}
              <View style={styles.dateSection}>
                <Text style={styles.dateTitle}>FECHA DE VUELO</Text>
                <View style={styles.dateTable}>
                  <View style={styles.dateRow}>
                    <Text style={[styles.dateCell, { fontWeight: "bold" }]}>
                      Mes
                    </Text>
                    <Text style={[styles.dateCell, { fontWeight: "bold" }]}>
                      Día
                    </Text>
                    <Text style={[styles.dateCellLast, { fontWeight: "bold" }]}>
                      Año
                    </Text>
                  </View>
                  <View style={styles.dateRow}>
                    <Text style={styles.dateCell}>
                      {formattedFlightDate.month}
                    </Text>
                    <Text style={styles.dateCell}>
                      {formattedFlightDate.day}
                    </Text>
                    <Text style={styles.dateCellLast}>
                      {formattedFlightDate.year}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Column - QR Code */}
            <View style={styles.rightColumn}>
              <View style={styles.qrContainer}>
                <View style={styles.qrCode}>
                  <Text style={{ textAlign: "center", fontSize: 8 }}>
                    QR CODE{"\n"}
                    {applicationUUID.slice(0, 8)}...
                  </Text>
                </View>
                <Text style={styles.qrText}>
                  CÓDIGO QR DE USO EXCLUSIVO PARA VALIDACIÓN ADUANAL.
                </Text>

                {/* Flight Information Table */}
                <View style={styles.flightTable}>
                  <View style={styles.flightHeader}>
                    <Text style={styles.flightHeaderCell}>NÚMERO DE VUELO</Text>
                    <Text style={styles.flightHeaderCell}>
                      NOMBRE DE AEROLÍNEA
                    </Text>
                  </View>
                  <View style={styles.flightRow}>
                    <Text style={styles.flightCell}>
                      {submittedData.flightInfo.flightNumber}
                    </Text>
                    <Text style={styles.flightCell}>
                      {submittedData.flightInfo.airline}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Passengers Section */}
          <View style={styles.passengersSection}>
            <Text style={styles.passengersTitle}>PASAJEROS</Text>
            <View style={styles.passengersTable}>
              <View style={styles.passengersHeader}>
                <Text style={[styles.passengersHeaderCell, { flex: 2 }]}>
                  NOMBRES
                </Text>
                <Text style={styles.passengersHeaderCell}>
                  PAÍS DE NACIONALIDAD
                </Text>
                <Text style={styles.passengersHeaderCell}>
                  NÚMERO DE PASAPORTE
                </Text>
              </View>

              {/* Main traveler */}
              <View style={styles.passengersRow}>
                <Text style={[styles.passengersCell, { flex: 2 }]}>
                  {submittedData.personalInfo.firstName.toUpperCase()}{" "}
                  {submittedData.personalInfo.lastName.toUpperCase()}
                </Text>
                <Text style={styles.passengersCell}>
                  {nationality} {getCountryFlag(nationality)}
                </Text>
                <Text style={styles.passengersCell}>
                  {submittedData.personalInfo.passport.number}
                </Text>
              </View>

              {/* Additional group members if traveling as group */}
              {submittedData.travelCompanions.isGroupTravel &&
                submittedData.travelCompanions.numberOfCompanions &&
                submittedData.travelCompanions.numberOfCompanions > 0 && (
                  <View style={styles.passengersRow}>
                    <Text style={[styles.passengersCell, { flex: 2 }]}>
                      + {submittedData.travelCompanions.numberOfCompanions}{" "}
                      ACOMPAÑANTES
                    </Text>
                    <Text style={styles.passengersCell}>
                      {submittedData.travelCompanions.groupNature?.toUpperCase()}
                    </Text>
                    <Text style={styles.passengersCell}>
                      VER TICKETS INDIVIDUALES
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
