import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import React from "react";

import type { ApplicationData } from "@/lib/schemas/forms";

interface ETicketPDFProps {
  submittedData: ApplicationData;
  applicationCode: string;
  qrCodeDataURL: string;
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
    marginLeft: 0,
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
    flex: 1,
    marginRight: 20,
  },
  rightColumn: {
    flex: 1.5,
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
    borderWidth: 1,
    borderColor: "#000000",
    width: 200,
  },
  dateRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  dateCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000000",
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
    borderWidth: 1,
    borderColor: "#000000",
    width: 300,
    marginTop: 10,
  },
  flightHeader: {
    backgroundColor: "#1e40af",
    color: "#FFFFFF",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  flightHeaderCell: {
    width: 75,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 9,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#FFFFFF",
  },
  flightHeaderCellLast: {
    width: 75,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 9,
    padding: 4,
  },
  flightRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  flightCell: {
    width: 75,
    textAlign: "center",
    fontSize: 9,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  flightCellLast: {
    width: 75,
    textAlign: "center",
    fontSize: 9,
    padding: 4,
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
    borderWidth: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    padding: 5,
  },
  passengersCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 9,
    padding: 5,
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

export const ETicketPDF: React.FC<ETicketPDFProps> = ({
  submittedData,
  applicationCode,
  qrCodeDataURL,
  issueDate,
}) => {
  const formattedIssueDate = formatDate(issueDate);
  const formattedFlightDate = formatDate(
    new Date(submittedData.flightInfo.travelDate)
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
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
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image style={styles.qrCode} src={qrCodeDataURL} />
                <Text style={styles.qrText}>
                  CÓDIGO QR DE USO EXCLUSIVO PARA VALIDACIÓN ADUANAL.
                </Text>

                {/* Flight Information Table */}
                <View style={styles.flightTable}>
                  <View style={styles.flightHeader}>
                    <Text style={styles.flightHeaderCell}>VUELO</Text>
                    <Text style={styles.flightHeaderCell}>AEROLÍNEA</Text>
                    <Text style={styles.flightHeaderCell}>ORIGEN</Text>
                    <Text style={styles.flightHeaderCellLast}>DESTINO</Text>
                  </View>
                  <View style={styles.flightRow}>
                    <Text style={styles.flightCell}>
                      {submittedData.flightInfo.flightNumber}
                    </Text>
                    <Text style={styles.flightCell}>
                      {submittedData.flightInfo.airline}
                    </Text>
                    <Text style={styles.flightCell}>
                      {submittedData.flightInfo.departurePort}
                    </Text>
                    <Text style={styles.flightCellLast}>
                      {submittedData.flightInfo.arrivalPort}
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

              {/* All travelers */}
              {submittedData.travelers.map((traveler, index) => {
                // Get nationality for each traveler
                const travelerNationality =
                  traveler.personalInfo.passport.isDifferentNationality &&
                  traveler.personalInfo.passport.nationality
                    ? traveler.personalInfo.passport.nationality
                    : traveler.personalInfo.birthCountry;

                return (
                  <View key={index} style={styles.passengersRow}>
                    <Text style={[styles.passengersCell, { flex: 2 }]}>
                      {traveler.personalInfo.firstName.toUpperCase()}{" "}
                      {traveler.personalInfo.lastName.toUpperCase()}
                    </Text>
                    <Text style={styles.passengersCell}>
                      {travelerNationality}
                    </Text>
                    <Text style={styles.passengersCell}>
                      {traveler.personalInfo.passport.number}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
