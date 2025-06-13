import { z } from "zod";

/**
 * Determines if a field is required based on its Zod schema
 * This is the single source of truth for field requirements
 */
export function isFieldRequired(fieldSchema: z.ZodTypeAny): boolean {
  // Check if the field schema is optional
  return !(
    fieldSchema instanceof z.ZodOptional ||
    fieldSchema instanceof z.ZodNullable ||
    fieldSchema instanceof z.ZodDefault ||
    (fieldSchema instanceof z.ZodUnion &&
      fieldSchema.options.some(
        (option: z.ZodTypeAny) =>
          option instanceof z.ZodUndefined || option instanceof z.ZodLiteral
      ))
  );
}

/**
 * Field requirement configuration type
 */
export interface FieldRequirement {
  required: boolean;
  fieldName: string;
}

/**
 * Static field requirements based on our validation schemas
 * This provides a centralized source of truth for all form fields
 */
export const FIELD_REQUIREMENTS = new Map<string, boolean>([
  // Contact Information - Email required for e-ticket delivery
  ["contactInfo.preferredName", false],
  ["contactInfo.email", true], // Required for e-ticket confirmation
  ["contactInfo.phone.number", true], // Required for travel notifications
  ["contactInfo.phone.countryCode", true], // Required when phone is provided

  // Personal Information - All required
  ["personalInfo.firstName", true],
  ["personalInfo.lastName", true],
  ["personalInfo.birthDate", true], // Simplified to string
  ["personalInfo.gender", true],
  ["personalInfo.birthCountry", true],
  ["personalInfo.maritalStatus", true],
  ["personalInfo.occupation", true],
  ["personalInfo.passport.number", true],
  ["personalInfo.passport.confirmNumber", true],
  ["personalInfo.passport.nationality", true],
  ["personalInfo.passport.expiryDate", true],

  // Flight Information - Required fields
  ["flightInfo.travelDirection", true],
  ["flightInfo.travelDate", true], // Simplified to string
  ["flightInfo.flightNumber", true],
  ["flightInfo.airline", true],
  ["flightInfo.aircraft", false], // Optional
  ["flightInfo.departurePort", true],
  ["flightInfo.arrivalPort", true],
  ["flightInfo.hasStops", true],
  ["flightInfo.confirmationNumber", false], // Optional

  // General Information - Required fields
  ["generalInfo.permanentAddress", true],
  ["generalInfo.residenceCountry", true],
  ["generalInfo.city", true],
  ["generalInfo.state", false], // Optional
  ["generalInfo.postalCode", false], // Optional

  // Group Travel - Conditional requirements
  ["groupTravel.isGroupTravel", true],
  ["groupTravel.numberOfCompanions", false], // Required only if group travel
  ["groupTravel.groupNature", false], // Required only if group travel

  // Customs Declaration - All required
  ["customsDeclaration.carriesOverTenThousand", true],
  ["customsDeclaration.carriesAnimalsOrFood", true],
  ["customsDeclaration.carriesTaxableGoods", true],
]);

/**
 * Helper function to check if a field is required
 */
export function getFieldRequirement(fieldPath: string): boolean {
  return FIELD_REQUIREMENTS.get(fieldPath) ?? false;
}
