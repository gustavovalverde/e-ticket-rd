// Dominican Republic airport codes as specified in the requirements
export const DOMINICAN_REPUBLIC_AIRPORTS = [
  "PUJ", // Punta Cana
  "SDQ", // Santo Domingo
  "STI", // Santiago
  "POP", // Puerto Plata
  "LRM", // La Romana
  "JBQ", // La Isabela
  "AZS", // Samaná
] as const;

export type DominicanAirportCode = (typeof DOMINICAN_REPUBLIC_AIRPORTS)[number];

/**
 * Determines if an airport code is a Dominican Republic airport
 */
export function isDominicanAirport(airportCode: string): boolean {
  return DOMINICAN_REPUBLIC_AIRPORTS.includes(
    airportCode.toUpperCase() as DominicanAirportCode
  );
}

/**
 * Auto-detects travel direction based on flight origin and destination
 * Returns "ENTRY" for flights arriving in DR, "EXIT" for flights departing DR
 */
export function autoDetectTravelDirection(
  originCode: string,
  destinationCode: string
): "ENTRY" | "EXIT" | null {
  const isOriginDR = isDominicanAirport(originCode);
  const isDestinationDR = isDominicanAirport(destinationCode);

  // Flight departing from DR to non-DR destination = EXIT
  if (isOriginDR && !isDestinationDR) {
    return "EXIT";
  }

  // Flight arriving from non-DR origin to DR destination = ENTRY
  if (!isOriginDR && isDestinationDR) {
    return "ENTRY";
  }

  // Domestic flights or unclear cases
  return null;
}

/**
 * Validates if flight connection makes logical sense
 */
export function validateFlightConnection(
  arrivalAirport: string,
  departureAirport: string
): { isValid: boolean; error?: string } | null {
  // Validate airports match
  if (arrivalAirport !== departureAirport) {
    return {
      isValid: false,
      error: `Airport mismatch: Your first flight arrives in ${arrivalAirport}, but your connecting flight departs from ${departureAirport}.`,
    };
  }

  return { isValid: true };
}

/**
 * Gets airport name/description for Dominican Republic airports
 */
export function getDominicanAirportName(code: string): string | null {
  const airportNames: Record<DominicanAirportCode, string> = {
    PUJ: "Punta Cana International Airport",
    SDQ: "Las Américas International Airport (Santo Domingo)",
    STI: "Cibao International Airport (Santiago)",
    POP: "Gregorio Luperón International Airport (Puerto Plata)",
    LRM: "Casa de Campo International Airport (La Romana)",
    JBQ: "Dr. Joaquín Balaguer International Airport (La Isabela)",
    AZS: "El Catey International Airport (Samaná)",
  };

  return airportNames[code.toUpperCase() as DominicanAirportCode] || null;
}

/**
 * Determines if travelers should share nationality based on relationship
 */
export function shouldShareNationality(
  groupNature: string | undefined,
  travelerRelation: "lead" | "spouse" | "child" | "other"
): boolean {
  if (!groupNature) return false;

  switch (groupNature) {
    case "Family":
      // Children often share nationality with parents
      // Spouses may share nationality but not always
      return travelerRelation === "child";

    case "Partner":
      // Partners may share nationality but not guaranteed
      return false;

    default:
      return false;
  }
}

/**
 * Gets suggested nationality based on birth country
 * Returns country name in the same format as CountrySelect (full country names)
 *
 * Note: This is a simple heuristic. In reality, nationality can differ from birth country
 * due to citizenship laws (jus soli vs jus sanguinis), naturalization, etc.
 */
export function suggestNationalityFromBirthCountry(
  birthCountry: string
): string | null {
  if (!birthCountry || birthCountry.trim() === "") {
    return null;
  }

  const normalized = birthCountry.toLowerCase().trim();

  // Handle Dominican Republic variations
  if (
    normalized === "dominican republic" ||
    normalized.includes("dominican republic") ||
    normalized === "do" ||
    normalized === "república dominicana"
  ) {
    return "Dominican Republic";
  }

  // For most countries, nationality follows the birth country
  // (assuming jus soli - right of soil citizenship)
  // CountrySelect uses full country names, so we return as-is
  return birthCountry;
}
