import { formOptions } from "@tanstack/react-form";

import type {
  OCCUPATION_OPTIONS,
  CIVIL_STATUS_OPTIONS,
} from "@/lib/schemas/validation";

// ===== APPLICATION FORM OPTIONS =====

// TravelerData interface for array items
interface TravelerData {
  isLeadTraveler: boolean;
  personalInfo: {
    firstName: string;
    lastName: string;
    birthDate: string; // YYYY-MM-DD format
    sex: "MALE" | "FEMALE" | "";
    birthCountry: string;
    civilStatus: (typeof CIVIL_STATUS_OPTIONS)[number] | "";
    occupation: (typeof OCCUPATION_OPTIONS)[number] | "";
    passport: {
      number: string;
      confirmNumber: string;
      isDifferentNationality: boolean | undefined;
      nationality: string;
      expiryDate: string; // YYYY-MM-DD format
      additionalNationality: string;
    };
    isForeignResident: boolean | undefined;
  };
  addressInheritance: {
    usesSharedAddress: boolean;
    individualAddress?: {
      permanentAddress: string;
      residenceCountry: string;
      city: string;
      state: string;
      postalCode: string;
    };
  };
}

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
    // TanStack Form array for travelers (always used, even for solo travel)
    travelers: [] as TravelerData[],
    contactInfo: {
      email: "",
      phone: "",
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
      hasStops: undefined as boolean | undefined,
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
export type { TravelerData };

// ===== UTILITY FUNCTIONS =====

/**
 * Create a new traveler with default values
 */
export function createDefaultTraveler(isLeadTraveler = false): TravelerData {
  return {
    isLeadTraveler,
    personalInfo: {
      firstName: "",
      lastName: "",
      birthDate: "",
      sex: "",
      birthCountry: "",
      civilStatus: "",
      occupation: "",
      passport: {
        number: "",
        confirmNumber: "",
        isDifferentNationality: undefined,
        nationality: "",
        expiryDate: "",
        additionalNationality: "",
      },
      isForeignResident: undefined,
    },
    addressInheritance: {
      usesSharedAddress: false, // Will be calculated based on group type
      individualAddress: {
        permanentAddress: "",
        residenceCountry: "",
        city: "",
        state: "",
        postalCode: "",
      },
    },
  };
}

/**
 * Calculate if a traveler should use shared address based on group type
 */
export function shouldUseSharedAddress(
  groupNature: string | undefined,
  isLeadTraveler: boolean
): boolean {
  // Lead traveler never uses shared address (they define it)
  if (isLeadTraveler) return false;

  // Family and Partner groups automatically share addresses
  return groupNature === "Family" || groupNature === "Partner";
}

/**
 * Update address inheritance for all travelers based on group type
 */
export function updateTravelersAddressInheritance(
  travelers: TravelerData[],
  groupNature: string | undefined
): TravelerData[] {
  return travelers.map((traveler) => ({
    ...traveler,
    addressInheritance: {
      ...traveler.addressInheritance,
      usesSharedAddress: shouldUseSharedAddress(
        groupNature,
        traveler.isLeadTraveler
      ),
      // Keep address structure for validation, but mark as shared
      individualAddress: traveler.addressInheritance.individualAddress || {
        permanentAddress: "",
        residenceCountry: "",
        city: "",
        state: "",
        postalCode: "",
      },
    },
  }));
}
