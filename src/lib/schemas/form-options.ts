import { formOptions } from "@tanstack/react-form";

// Define form shape using TanStack Form's formOptions pattern
export const applicationFormOptions = formOptions({
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
    // Flight information
    flightNumber: "",
    arrivalDate: "",
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

// Export the inferred type from TanStack Form
export type ApplicationFormData = typeof applicationFormOptions.defaultValues;
