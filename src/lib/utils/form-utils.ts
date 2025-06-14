import type { AnyFieldApi } from "@tanstack/react-form";

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

  // Travel Companions - Conditional requirements
  ["travelCompanions.isGroupTravel", true],
  ["travelCompanions.numberOfCompanions", false], // Required only if group travel
  ["travelCompanions.groupNature", false], // Required only if group travel

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

/**
 * Standardized boolean field adapter for RadioGroup components
 * Converts boolean field values to "yes"/"no" strings for consistent UI
 */
export function booleanFieldAdapter(field: AnyFieldApi): AnyFieldApi {
  // Handle different value states properly
  let currentValue: string;

  if (field.state.value === true) {
    currentValue = "yes";
  } else if (field.state.value === false) {
    currentValue = "no";
  } else {
    // undefined or null - no selection
    currentValue = "";
  }

  const handleValueChange = (value: string) => {
    field.handleChange(value === "yes");
  };

  return {
    ...field,
    state: { ...field.state, value: currentValue },
    handleChange: handleValueChange,
  } as AnyFieldApi;
}
