import type { ApplicationData } from "@/lib/schemas/forms";
import type { AnyFieldApi } from "@tanstack/react-form";

/**
 * Utility function to safely extract error message from TanStack Form errors
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  // Handle Zod validation errors
  if (error && typeof error === "object" && "issues" in error) {
    const zodError = error as {
      issues: Array<{ message: string; path: string[] }>;
    };
    // Return the first error message for simplicity
    return zodError.issues[0]?.message || "Validation error";
  }

  // Handle standard Error objects
  if (error && typeof error === "object" && "message" in error) {
    return (error as { message: string }).message;
  }

  return "Validation error";
}

/**
 * Form utilities for e-ticket system
 * Includes field requirements, validation helpers, and error handling
 */

/**
 * Static field requirements based on our validation schemas
 * This provides a centralized source of truth for all form fields
 */
export const FIELD_REQUIREMENTS = new Map<string, boolean>([
  // Contact Information - Email required for e-ticket delivery

  ["contactInfo.email", true], // Required for e-ticket confirmation
  ["contactInfo.phone", true], // Required for travel notifications

  // Migratory Information - All required
  ["personalInfo.firstName", true],
  ["personalInfo.lastName", true],
  ["personalInfo.birthDate", true], // Simplified to string
  ["personalInfo.sex", true],
  ["personalInfo.birthCountry", true],
  ["personalInfo.civilStatus", true],
  ["personalInfo.occupation", true],
  ["personalInfo.passport.number", true],
  ["personalInfo.passport.confirmNumber", true],
  ["personalInfo.passport.isDifferentNationality", true],
  ["personalInfo.passport.nationality", false], // Conditional: only required if isDifferentNationality is true
  ["personalInfo.passport.expiryDate", true],

  // Travel Information - Required fields
  ["flightInfo.travelDirection", true],
  ["flightInfo.travelDate", true], // Simplified to string
  ["flightInfo.flightNumber", true],
  ["flightInfo.airline", true],
  ["flightInfo.aircraft", false], // Optional
  ["flightInfo.departurePort", true],
  ["flightInfo.arrivalPort", true],
  ["flightInfo.hasStops", true],
  ["flightInfo.confirmationNumber", false], // Optional

  // Address Information - Required fields (now in traveler records)
  ["addressInheritance.individualAddress.permanentAddress", true],
  ["addressInheritance.individualAddress.residenceCountry", true],
  ["addressInheritance.individualAddress.city", true],
  ["addressInheritance.individualAddress.state", false], // Optional
  ["addressInheritance.individualAddress.postalCode", false], // Optional

  // Travel Companions - Conditional requirements
  ["travelCompanions.isGroupTravel", true],
  ["travelCompanions.numberOfCompanions", false], // Conditional: only required if isGroupTravel is true
  ["travelCompanions.groupNature", false], // Conditional: only required if isGroupTravel is true

  // Customs Declaration - All required
  ["customsDeclaration.carriesOverTenThousand", true],
  ["customsDeclaration.carriesAnimalsOrFood", true],
  ["customsDeclaration.carriesTaxableGoods", true],

  // Foreign Resident - Conditional requirement
  ["personalInfo.isForeignResident", false], // Conditional: only required for ENTRY
]);

/**
 * Helper function to check if a field is required
 * Supports conditional requirements based on form data
 */
export function getFieldRequirement(
  fieldPath: string,
  formData?: ApplicationData
): boolean {
  // Handle conditional field requirements
  if (fieldPath === "personalInfo.isForeignResident") {
    // Only required when entering Dominican Republic
    return formData?.flightInfo?.travelDirection === "ENTRY";
  }

  return FIELD_REQUIREMENTS.get(fieldPath) ?? false;
}

/**
 * Standardized boolean field adapter for RadioGroup components
 * Converts boolean field values to "yes"/"no" strings for UI display only
 * The actual form state remains boolean for consistency
 */
export function booleanFieldAdapter(field: AnyFieldApi): AnyFieldApi {
  // Convert boolean to string for display only
  let displayValue: string;

  if (field.state.value === true) {
    displayValue = "yes";
  } else if (field.state.value === false) {
    displayValue = "no";
  } else {
    displayValue = "";
  }

  return {
    ...field,
    state: {
      ...field.state,
      value: displayValue, // Display value for UI
    },
    handleChange: (value: string) => {
      // Convert back to boolean and update form state
      field.handleChange(value === "yes");
    },
  } as AnyFieldApi;
}

/**
 * Generate unique IDs for form components to prevent ARIA collisions
 * Combines step context, field context, and option values for uniqueness
 */
export function generateUniqueId(
  stepId: string,
  fieldName: string,
  optionValue: string,
  travelerIndex?: number
): string {
  // Clean field name and step ID for use in DOM IDs
  const cleanStepId = stepId.replace(/[^a-zA-Z0-9]/g, "-");
  const cleanFieldName = fieldName.replace(/[^a-zA-Z0-9]/g, "-");
  const cleanOptionValue = optionValue.replace(/[^a-zA-Z0-9]/g, "-");

  // Build ID components
  const components = [cleanStepId, cleanFieldName, cleanOptionValue];

  // Add traveler index if provided
  if (travelerIndex !== undefined) {
    components.splice(2, 0, `traveler-${travelerIndex}`);
  }

  return components.join("-").toLowerCase();
}

/**
 * Generate step-scoped field IDs for consistent naming
 */
export function generateFieldId(
  stepId: string,
  fieldName: string,
  travelerIndex?: number
): string {
  const cleanStepId = stepId.replace(/[^a-zA-Z0-9]/g, "-");
  const cleanFieldName = fieldName.replace(/[^a-zA-Z0-9]/g, "-");

  if (travelerIndex !== undefined) {
    return `${cleanStepId}-traveler-${travelerIndex}-${cleanFieldName}`.toLowerCase();
  }

  return `${cleanStepId}-${cleanFieldName}`.toLowerCase();
}
