import { z } from "zod";

import { validateFlightNumber } from "./flight-validation";

// Travel Type Validation
export const travelTypeSchema = z.object({
  tripDirection: z.enum(["entry", "exit"], {
    required_error: "Please select your travel direction",
  }),
  transportMethod: z.enum(["air", "sea", "land"], {
    required_error: "Please select your transport method",
  }),
  travelingAlone: z.enum(["alone", "with-others"], {
    required_error: "Please specify if you're traveling alone",
  }),
  groupType: z.enum(["friends", "coworkers", "family", "couple"]).optional(),
});

// Flight Information Validation
export const flightInfoSchema = z.object({
  flightNumber: z
    .string()
    .min(1, "Flight number is required")
    .refine(
      (value) => {
        const validation = validateFlightNumber(value);
        return validation.isValid;
      },
      {
        message: "Please enter a valid flight number (e.g., AA1234, DL567)",
      }
    ),
  travelDate: z
    .string()
    .min(1, "Travel date is required")
    .refine((date) => {
      const travelDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return travelDate >= today;
    }, "Travel date must be today or in the future"),
  airline: z.string().optional(),
  aircraft: z.string().optional(),
  departurePort: z.string().optional(),
  arrivalPort: z.string().optional(),
  estimatedArrival: z.string().optional(),
});

// Personal Information Validation
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, apostrophes, and hyphens"
    ),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, apostrophes, and hyphens"
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
});

// Passport Information Validation
export const passportInfoSchema = z.object({
  passportNumber: z
    .string()
    .min(6, "Passport number must be at least 6 characters")
    .max(20, "Passport number must be less than 20 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Passport number must contain only uppercase letters and numbers"
    ),
  nationality: z.enum(["dominican", "other"], {
    required_error: "Please select your nationality",
  }),
  passportIssueDate: z
    .string()
    .min(1, "Passport issue date is required")
    .refine((date) => {
      const issueDate = new Date(date);
      return issueDate <= new Date();
    }, "Passport issue date cannot be in the future"),
  passportExpiryDate: z
    .string()
    .min(1, "Passport expiry date is required")
    .refine((date) => {
      const expiryDate = new Date(date);
      // Passport should be valid for at least 6 months from today
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      return expiryDate >= sixMonthsFromNow;
    }, "Passport must be valid for at least 6 months"),
  countryOfBirth: z.string().min(1, "Country of birth is required"),
});

// Combined Application Schema
export const applicationSchema = z.object({
  travelType: travelTypeSchema,
  flightInfo: flightInfoSchema,
  personalInfo: personalInfoSchema,
  passportInfo: passportInfoSchema,
});

// Conditional validation based on travel type
export const applicationSchemaWithConditionals = applicationSchema
  .refine(
    (data) => {
      // If traveling with others, group type is required
      if (data.travelType.travelingAlone === "with-others") {
        return data.travelType.groupType !== undefined;
      }
      return true;
    },
    {
      message: "Please select your group type",
      path: ["travelType", "groupType"],
    }
  )
  .refine(
    (data) => {
      // If using air transport, flight info is required
      if (data.travelType.transportMethod === "air") {
        return (
          data.flightInfo.flightNumber.length > 0 &&
          data.flightInfo.travelDate.length > 0
        );
      }
      return true;
    },
    {
      message: "Flight information is required for air travel",
      path: ["flightInfo"],
    }
  );

// Type inference
export type TravelTypeData = z.infer<typeof travelTypeSchema>;
export type FlightInfoData = z.infer<typeof flightInfoSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type PassportInfoData = z.infer<typeof passportInfoSchema>;
export type ApplicationData = z.infer<typeof applicationSchema>;

// Validation functions for individual steps
export const validateTravelType = (data: Partial<TravelTypeData>) => {
  try {
    travelTypeSchema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, errors: error.errors };
    }
    return { isValid: false, errors: [{ message: "Validation failed" }] };
  }
};

export const validateFlightInfo = (data: Partial<FlightInfoData>) => {
  try {
    flightInfoSchema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, errors: error.errors };
    }
    return { isValid: false, errors: [{ message: "Validation failed" }] };
  }
};
