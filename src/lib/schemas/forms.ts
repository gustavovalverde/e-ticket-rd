import { formOptions } from "@tanstack/react-form";

import type {
  OCCUPATION_OPTIONS,
  CIVIL_STATUS_OPTIONS,
} from "@/lib/schemas/validation";

// ===== APPLICATION FORM OPTIONS =====

// Main application form configuration
export const applicationFormOptions = formOptions({
  defaultValues: {
    travelCompanions: {
      isGroupTravel: undefined as boolean | undefined,
      numberOfCompanions: undefined as number | undefined,
      groupNature: undefined as
        | "Family"
        | "Friends"
        | "Work_Colleagues"
        | "Partner"
        | undefined,
    },
    generalInfo: {
      permanentAddress: "",
      residenceCountry: "",
      city: "",
      state: "",
      postalCode: "",
    },
    personalInfo: {
      firstName: "",
      lastName: "",
      birthDate: "", // Simplified to string format (YYYY-MM-DD)
      sex: "" as "MALE" | "FEMALE" | "",
      birthCountry: "",
      civilStatus: "" as (typeof CIVIL_STATUS_OPTIONS)[number] | "",
      occupation: "" as (typeof OCCUPATION_OPTIONS)[number] | "",
      passport: {
        number: "",
        confirmNumber: "",
        isDifferentNationality: undefined as boolean | undefined,
        nationality: "",
        expiryDate: "", // Simplified passport expiry to string format
        additionalNationality: "",
      },
      isForeignResident: undefined as boolean | undefined,
    },
    contactInfo: {
      preferredName: "",
      email: "",
      phone: {
        countryCode: "+1",
        number: "",
      },
    },
    flightInfo: {
      travelDirection: "" as "ENTRY" | "EXIT" | "",
      travelDate: "",
      departurePort: "",
      arrivalPort: "",
      airline: "",
      aircraft: "",
      flightNumber: "",
      confirmationNumber: "",
      hasStops: undefined as "yes" | "no" | undefined,
      // Origin flight details (for connections)
      originFlightNumber: "",
      originAirline: "",
      originDeparturePort: "",
      originArrivalPort: "",
      originTravelDate: "",
      originAircraft: "",
    },
    customsDeclaration: {
      carriesOverTenThousand: undefined as boolean | undefined,
      carriesAnimalsOrFood: undefined as boolean | undefined,
      carriesTaxableGoods: undefined as boolean | undefined,
    },
  },
});

// Legacy application form (for compatibility)
export const legacyApplicationFormOptions = formOptions({
  defaultValues: {
    // Trip type (nested object)
    travelType: {
      tripDirection: "" as "entry" | "exit" | "",
      transportMethod: "air" as "air" | "sea" | "land" | "",
      travelingAlone: "" as "alone" | "with-others" | "",
      groupType: "" as "friends" | "coworkers" | "family" | "couple" | "",
    },
    // Travel information (flight and journey details)
    flightInfo: {
      flightNumber: "",
      travelDate: "",
      // Auto-filled fields from FlightRadar24 API (matching ERD structure)
      airline: "",
      aircraft: "",
      departurePort: "", // Origin airport IATA code
      arrivalPort: "", // Destination airport IATA code
      estimatedArrival: "",
    },
    // Migratory information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Passport details
    passportNumber: "",
    nationality: "" as "dominican" | "other" | "",
    // Additional fields from existing form
    preferredName: "",
    countryCode: "+1",
    dateOfBirth: "",
    radioOption: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    countryOfBirth: "",
    additionalInfo: "",
  },
});

// ===== TYPE EXPORTS =====

export type ApplicationData = typeof applicationFormOptions.defaultValues;
export type LegacyApplicationData =
  typeof legacyApplicationFormOptions.defaultValues;
