import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

// ===== FLIGHT NUMBER VALIDATION UTILITIES =====

/**
 * Flight Number Validation
 * Validates flight numbers according to IATA and ICAO standards
 *
 * Rules:
 * - IATA codes (2 chars): letter-letter, letter-digit, or digit-letter
 * - ICAO codes (3 chars): letter-letter-letter
 * - Flight number: 1-4 digits, with optional letter suffix and optional space
 *
 * Examples of valid flight numbers:
 * - AA1234 (IATA 2-letter + 4 digits)
 * - DL567 (IATA 2-letter + 3 digits)
 * - U22621 (IATA letter-digit + 4 digits)
 * - 4M513 (IATA digit-letter + 3 digits)
 * - AAL8 (ICAO 3-letter + 1 digit)
 * - JBU 604 (ICAO 3-letter + space + 3 digits)
 * - AA1234A (with letter suffix)
 * - dl567b (lowercase accepted)
 *
 * Examples of invalid flight numbers:
 * - A1234 (only 1 char code)
 * - 12AB (digit-digit code not allowed)
 * - AA12345 (5 digits)
 * - AA-1234 (special character)
 */
export function validateFlightNumber(flightNumber: string): {
  isValid: boolean;
  error?: string;
} {
  if (!flightNumber || typeof flightNumber !== "string") {
    return { isValid: false, error: "Flight number is required" };
  }

  const trimmed = flightNumber.trim();

  const flightNumberPattern =
    /^((?:[A-Z]{2}|[A-Z]\d|\d[A-Z])|[A-Z]{3})\s?(\d{1,4}[A-Z]?)$/i;

  if (!flightNumberPattern.test(trimmed)) {
    return {
      isValid: false,
      error:
        "Invalid format. Use 2-3 letter airline code and 1-4 digits with optional letter suffix (e.g., AA1234, U22621A, AAL8).",
    };
  }

  return { isValid: true };
}

/**
 * Normalizes flight number for API usage
 * Removes spaces and converts to uppercase
 * Input: "B6 869" or "dl 567b" → Output: "B6869" or "DL567B"
 */
export function normalizeFlightNumber(flightNumber: string): string {
  return flightNumber.trim().replace(/\s+/g, "").toUpperCase();
}

/**
 * Formats flight number for display purposes
 * Ensures consistent uppercase formatting while preserving spaces
 * Input: "b6 869" → Output: "B6 869"
 */
export function formatFlightNumber(flightNumber: string): string {
  return flightNumber.trim().toUpperCase();
}

// ===== BASE VALIDATION SCHEMAS =====

// Enhanced phone schema with better international validation
const phoneSchema = z.string().refine(
  (value) => {
    if (!value || value.trim() === "") {
      return false; // Required field, so empty is invalid
    }
    return isValidPhoneNumber(value);
  },
  {
    message: "Please enter a valid phone number",
  }
);

// Enhanced passport schema with better validation
const passportSchema = z
  .object({
    number: z
      .string()
      .min(6, "Passport number must be at least 6 characters")
      .max(20, "Passport number must be less than 20 characters")
      .regex(
        /^[A-Z0-9]+$/,
        "Passport number must contain only uppercase letters and numbers"
      ),
    confirmNumber: z.string().min(6, "Please confirm your passport number"),
    isDifferentNationality: z.boolean(),
    nationality: z.string().optional(),
    expiryDate: z
      .string()
      .min(1, "Passport expiry date is required")
      .refine((date) => {
        const expiryDate = new Date(date);
        // Passport should be valid for at least 3 months from today
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return expiryDate >= threeMonthsFromNow;
      }, "Passport must be valid for at least 3 months"),
    additionalNationality: z.string().optional(),
  })
  .refine((data) => data.number === data.confirmNumber, {
    message: "Passport numbers must match",
    path: ["confirmNumber"],
  })
  .refine(
    (data) => {
      // If different nationality is true, nationality must be provided
      return (
        !data.isDifferentNationality ||
        (data.nationality && data.nationality.trim() !== "")
      );
    },
    {
      message:
        "Nationality is required when passport nationality is different from country of birth",
      path: ["nationality"],
    }
  );

// ===== INDIVIDUAL FIELD VALIDATION RULES =====

// Group travel field rules
export const validateIsGroupTravel = z.boolean();
export const validateNumberOfCompanions = z
  .number()
  .min(1, "At least 1 companion is required")
  .max(20, "Maximum 20 companions allowed")
  .optional();
export const validateGroupNature = z
  .enum(["Family", "Friends", "Work_Colleagues", "Partner"])
  .optional();

// General info field rules
export const validatePermanentAddress = z
  .string()
  .min(10, "Please provide a complete address")
  .max(200, "Address is too long");
export const validateResidenceCountry = z
  .string()
  .min(1, "Country of residence is required");
export const validateCity = z.string().min(1, "City is required");
export const validateState = z.string().optional();
export const validatePostalCode = z.string().optional();
export const validateHasStops = z.boolean();
export const validateTravelDirection = z.enum(["ENTRY", "EXIT"], {
  required_error: "Please select entry or exit",
});

// Personal info field rules with enhanced patterns
export const validateFirstName = z
  .string()
  .min(1, "First name is required")
  .max(50, "First name must be less than 50 characters")
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    "First name can only contain letters, spaces, apostrophes, and hyphens"
  );
export const validateLastName = z
  .string()
  .min(1, "Last name is required")
  .max(50, "Last name must be less than 50 characters")
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    "Last name can only contain letters, spaces, apostrophes, and hyphens"
  );
export const validateSex = z.enum(["MALE", "FEMALE"], {
  required_error: "Sex is required",
});

// Civil status constants - single source of truth
export const CIVIL_STATUS_OPTIONS = [
  "SINGLE",
  "MARRIED",
  "CONCUBINAGE",
  "FREE_UNION",
  "OTHERS",
] as const;

export const validatePassportNumber = z
  .string()
  .min(6, "Passport number must be at least 6 characters")
  .max(20, "Passport number must be less than 20 characters")
  .regex(
    /^[A-Z0-9]+$/,
    "Passport number must contain only uppercase letters and numbers"
  );
export const validateNationality = z.string().min(1, "Nationality is required");
export const validateDateOfBirth = z
  .string()
  .min(1, "Date of birth is required");

// Occupation constants - single source of truth
export const OCCUPATION_OPTIONS = [
  "UNEMPLOYED",
  "CREW_MEMBER",
  "DIPLOMATIC",
  "RETIRED",
  "STUDENT",
  "FREELANCER",
  "PRIVATE_EMPLOYEE",
  "PUBLIC_EMPLOYEE",
  "ENTREPRENEUR",
] as const;

export const validateOccupation = z.enum(OCCUPATION_OPTIONS, {
  required_error: "Occupation is required",
});

// Contact info field rules
export const validatePreferredName = z
  .string()
  .max(50, "Preferred name is too long")
  .optional()
  .or(z.literal(""));
export const validateEmail = z
  .string()
  .min(1, "Email address is required")
  .email("Please enter a valid email address");

// Flight info field rules with enhanced validation
export const validateFlightNumberInput = z
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
  );
export const validateAirline = z.string().min(1, "Airline is required");
export const validateDeparturePort = z
  .string()
  .min(1, "Departure port is required");
export const validateArrivalPort = z
  .string()
  .min(1, "Arrival port is required");

// Travel date rule with future validation
export const validateTravelDate = z
  .string()
  .min(1, "Travel date is required")
  .refine((date) => {
    const travelDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return travelDate >= today;
  }, "Travel date must be today or in the future");

// Customs declaration field rules
export const validateCarriesOverTenThousand = z.boolean();
export const validateCarriesAnimalsOrFood = z.boolean();
export const validateCarriesTaxableGoods = z.boolean();

// ===== COMPOSITE SCHEMAS =====

// Enhanced travel companions validation rules with conditional logic
export const validateTravelCompanionsData = z
  .object({
    isGroupTravel: validateIsGroupTravel,
    numberOfCompanions: validateNumberOfCompanions,
    groupNature: validateGroupNature,
  })
  .refine(
    (data) => {
      if (data.isGroupTravel) {
        return data.numberOfCompanions && data.groupNature;
      }
      return true;
    },
    {
      message: "Group details are required when traveling with others",
      path: ["numberOfCompanions"],
    }
  );

// General information validation rules (Step 1)
export const validateGeneralInfoData = z.object({
  permanentAddress: validatePermanentAddress,
  residenceCountry: validateResidenceCountry,
  city: validateCity,
  state: validateState,
  postalCode: validatePostalCode,
});

// Enhanced migratory information validation rules (Step 2)
export const validatePersonalInfoData = z.object({
  firstName: validateFirstName,
  lastName: validateLastName,
  birthDate: validateDateOfBirth, // Simplified to string format
  sex: validateSex,
  birthCountry: z.string().min(1, "Country of birth is required"),
  civilStatus: z.enum(CIVIL_STATUS_OPTIONS, {
    required_error: "Civil status is required",
  }),
  occupation: validateOccupation,
  passport: passportSchema,
  isForeignResident: z.boolean(),
});

// Contact information validation rules
export const validateContactInfoData = z.object({
  preferredName: validatePreferredName,
  email: validateEmail,
  phone: phoneSchema, // Required for travel notifications
});

// Enhanced travel information validation rules (Step 3)
export const validateFlightInfoData = z.object({
  travelDirection: validateTravelDirection,
  travelDate: validateTravelDate, // Enhanced with future date validation
  departurePort: validateDeparturePort,
  arrivalPort: validateArrivalPort,
  airline: validateAirline,
  aircraft: z.string().optional(), // Optional aircraft field
  flightNumber: validateFlightNumberInput, // Enhanced with proper flight validation
  confirmationNumber: z.string().optional(),
  hasStops: validateHasStops,
});

// Customs declaration validation rules (Step 4)
export const validateCustomsDeclarationData = z.object({
  carriesOverTenThousand: validateCarriesOverTenThousand,
  carriesAnimalsOrFood: validateCarriesAnimalsOrFood,
  carriesTaxableGoods: validateCarriesTaxableGoods,
});

// Complete application validation rules with conditional validations
export const validateApplicationData = z.object({
  travelCompanions: validateTravelCompanionsData,
  generalInfo: validateGeneralInfoData,
  personalInfo: validatePersonalInfoData,
  contactInfo: validateContactInfoData,
  flightInfo: validateFlightInfoData,
  customsDeclaration: validateCustomsDeclarationData,
});

// ===== TYPE EXPORTS =====

export type TravelCompanionsData = z.infer<typeof validateTravelCompanionsData>;
export type GeneralInfoData = z.infer<typeof validateGeneralInfoData>;
export type PersonalInfoData = z.infer<typeof validatePersonalInfoData>;
export type ContactInfoData = z.infer<typeof validateContactInfoData>;
export type FlightInfoData = z.infer<typeof validateFlightInfoData>;
export type CustomsDeclarationData = z.infer<
  typeof validateCustomsDeclarationData
>;
export type ApplicationData = z.infer<typeof validateApplicationData>;
