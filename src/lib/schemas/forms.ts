import { formOptions } from "@tanstack/react-form";

// ===== APPLICATION FORM OPTIONS =====

// Main application form configuration
export const applicationFormOptions = formOptions({
  defaultValues: {
    groupTravel: {
      isGroupTravel: false,
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
      birthDate: {
        year: 1990,
        month: 1,
        day: 1,
      },
      gender: "MALE" as const,
      birthCountry: "",
      maritalStatus: "SINGLE" as const,
      occupation: "",
      passport: {
        number: "",
        confirmNumber: "",
        nationality: "",
        isDifferentNationality: false,
        additionalNationality: "",
      },
      isForeignResident: false,
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
      travelDirection: "ENTRY" as const,
      departurePort: "",
      arrivalPort: "",
      airline: "",
      flightDate: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      },
      flightNumber: "",
      confirmationNumber: "",
      hasStops: false,
    },
    customsDeclaration: {
      carriesOverTenThousand: false,
      carriesAnimalsOrFood: false,
      carriesTaxableGoods: false,
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
    // Flight information (now part of travel info step)
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
    // Personal information
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
