import { formOptions } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

// Define form shape using TanStack Form's formOptions pattern
export const applicationFormOptions = formOptions({
  defaultValues: {
    // Trip type (nested object)
    travelType: {
      tripDirection: "" as "entry" | "exit" | "",
      transportMethod: "" as "air" | "sea" | "land" | "",
      groupType: "" as "individual" | "family" | "group" | "",
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
  validatorAdapter: zodValidator(),
});

// Export the inferred type from TanStack Form
export type ApplicationFormData = typeof applicationFormOptions.defaultValues;
