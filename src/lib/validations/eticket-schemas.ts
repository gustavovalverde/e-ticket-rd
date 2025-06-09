import { z } from "zod";

// Base schemas for reusable validation patterns
const phoneSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  number: z.string().min(7, "Phone number must be at least 7 digits"),
});

const passportSchema = z
  .object({
    number: z
      .string()
      .min(6, "Passport number must be at least 6 characters")
      .max(20, "Passport number is too long")
      .regex(
        /^[A-Z0-9]+$/,
        "Passport number must contain only letters and numbers"
      ),
    confirmNumber: z.string().min(6, "Please confirm your passport number"),
    nationality: z.string().min(1, "Nationality is required"),
    isDifferentNationality: z.boolean().default(false),
    additionalNationality: z.string().optional(),
  })
  .refine((data) => data.number === data.confirmNumber, {
    message: "Passport numbers must match",
    path: ["confirmNumber"],
  });

// Individual field schemas for group travel
export const isGroupTravelSchema = z.boolean();
export const numberOfCompanionsSchema = z
  .number()
  .min(1, "At least 1 companion is required")
  .max(20, "Maximum 20 companions allowed")
  .optional();
export const groupNatureSchema = z
  .enum(["Familia", "Amigos", "Compañeros de trabajo", "Pareja"])
  .optional();

// Group travel schema
export const groupTravelSchema = z
  .object({
    isGroupTravel: isGroupTravelSchema.default(false),
    numberOfCompanions: numberOfCompanionsSchema,
    groupNature: groupNatureSchema,
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

// Individual field schemas for general info
export const permanentAddressSchema = z
  .string()
  .min(10, "Please provide a complete address")
  .max(200, "Address is too long");
export const residenceCountrySchema = z
  .string()
  .min(1, "Country of residence is required");
export const citySchema = z.string().min(1, "City is required");
export const stateSchema = z.string().optional();
export const postalCodeSchema = z.string().optional();
export const hasStopsSchema = z.boolean().default(false);
export const entryOrExitSchema = z.enum(["ENTRADA", "SALIDA"], {
  required_error: "Please select entry or exit",
});
export const purposeOfTravelSchema = z
  .string()
  .min(1, "Purpose of travel is required");
export const lengthOfStaySchema = z
  .number()
  .min(1, "Length of stay must be at least 1 day")
  .max(365, "Length of stay cannot exceed 365 days");
export const arrivalDateSchema = z.string().min(1, "Arrival date is required");
export const departureDateSchema = z
  .string()
  .min(1, "Departure date is required");
export const addressInDRSchema = z
  .string()
  .min(10, "Please provide a complete address in Dominican Republic");
export const phoneNumberSchema = z
  .string()
  .min(10, "Please provide a valid phone number");

// General information schema (Step 1)
export const generalInfoSchema = z.object({
  permanentAddress: permanentAddressSchema,
  residenceCountry: residenceCountrySchema,
  city: citySchema,
  state: stateSchema,
  postalCode: postalCodeSchema,
  hasStops: hasStopsSchema,
  entryOrExit: entryOrExitSchema,
});

// Individual field schemas for personal info
export const firstNameSchema = z
  .string()
  .min(2, "First name must be at least 2 characters")
  .max(50, "First name is too long")
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "First name must contain only letters");
export const lastNameSchema = z
  .string()
  .min(2, "Last name must be at least 2 characters")
  .max(50, "Last name is too long")
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Last name must contain only letters");
export const genderSchema = z.enum(["MASCULINO", "FEMENINO", "OTRO"], {
  required_error: "Gender is required",
});
export const passportNumberSchema = z
  .string()
  .min(6, "Passport number must be at least 6 characters")
  .max(20, "Passport number is too long")
  .regex(
    /^[A-Z0-9]+$/,
    "Passport number must contain only letters and numbers"
  );
export const nationalitySchema = z.string().min(1, "Nationality is required");
export const dateOfBirthSchema = z.string().min(1, "Date of birth is required");
export const passportExpiryDateSchema = z
  .string()
  .min(1, "Passport expiry date is required");

// Personal information schema (Step 2)
export const personalInfoSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  birthDate: z.object({
    year: z.number().min(1900).max(new Date().getFullYear()),
    month: z.number().min(1).max(12),
    day: z.number().min(1).max(31),
  }),
  gender: genderSchema,
  birthCountry: z.string().min(1, "Country of birth is required"),
  maritalStatus: z.enum(
    ["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO", "UNION_LIBRE"],
    {
      required_error: "Marital status is required",
    }
  ),
  occupation: z.string().min(1, "Occupation is required"),
  passport: passportSchema,
  isForeignResident: z.boolean().default(false),
});

// Individual field schemas for contact info
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .optional()
  .or(z.literal(""));

// Contact information schema
export const contactInfoSchema = z.object({
  email: emailSchema,
  phone: phoneSchema.optional(),
});

// Individual field schemas for flight info
export const flightNumberSchema = z
  .string()
  .min(2, "Flight number is required")
  .max(10, "Flight number is too long")
  .regex(/^[A-Z0-9]+$/, "Flight number must contain only letters and numbers");
export const airlineSchema = z.string().min(1, "Airline is required");
export const departurePortSchema = z
  .string()
  .min(1, "Departure port is required");
export const arrivalPortSchema = z.string().min(1, "Arrival port is required");

// Flight information schema (Step 3)
export const flightInfoSchema = z.object({
  departurePort: departurePortSchema,
  arrivalPort: arrivalPortSchema,
  airline: airlineSchema,
  flightDate: z.object({
    year: z.number().min(new Date().getFullYear()),
    month: z.number().min(1).max(12),
    day: z.number().min(1).max(31),
  }),
  flightNumber: flightNumberSchema,
  confirmationNumber: z.string().optional(),
});

// Individual field schemas for customs declaration
export const carriesOverTenThousandSchema = z.boolean().default(false);
export const carriesAnimalsOrFoodSchema = z.boolean().default(false);
export const carriesTaxableGoodsSchema = z.boolean().default(false);

// Customs declaration schema (Step 4)
export const customsDeclarationSchema = z.object({
  carriesOverTenThousand: carriesOverTenThousandSchema,
  carriesAnimalsOrFood: carriesAnimalsOrFoodSchema,
  carriesTaxableGoods: carriesTaxableGoodsSchema,
});

// Complete form schema
export const eTicketFormSchema = z.object({
  groupTravel: groupTravelSchema,
  generalInfo: generalInfoSchema,
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  flightInfo: flightInfoSchema,
  customsDeclaration: customsDeclarationSchema,
});

// Form step configuration
export interface FormStep {
  id: string;
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition?: (data: any) => boolean;
}

// Type exports for TypeScript
export type GroupTravelData = z.infer<typeof groupTravelSchema>;
export type GeneralInfoData = z.infer<typeof generalInfoSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type ContactInfoData = z.infer<typeof contactInfoSchema>;
export type FlightInfoData = z.infer<typeof flightInfoSchema>;
export type CustomsDeclarationData = z.infer<typeof customsDeclarationSchema>;
export type ETicketFormData = z.infer<typeof eTicketFormSchema>;
