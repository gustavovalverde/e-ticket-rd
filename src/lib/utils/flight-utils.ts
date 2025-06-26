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
  firstFlightDestination: string,
  secondFlightOrigin: string,
  firstFlightArrival?: string,
  secondFlightDeparture?: string
): {
  isValid: boolean;
  error?: string;
  warning?: string;
} {
  // Check if airports match for connection
  if (
    firstFlightDestination.toUpperCase() !== secondFlightOrigin.toUpperCase()
  ) {
    return {
      isValid: false,
      error: `Connection mismatch: First flight arrives at ${firstFlightDestination} but second flight departs from ${secondFlightOrigin}`,
    };
  }

  // Check connection time if both times are provided
  if (firstFlightArrival && secondFlightDeparture) {
    try {
      const arrivalTime = new Date(firstFlightArrival);
      const departureTime = new Date(secondFlightDeparture);
      const connectionMinutes =
        (departureTime.getTime() - arrivalTime.getTime()) / (1000 * 60);

      // Less than 45 minutes is too short for international connections
      if (connectionMinutes < 45) {
        return {
          isValid: true,
          warning: `Connection time is very short (${Math.round(connectionMinutes)} minutes). Ensure this is sufficient for international transfer.`,
        };
      }

      // More than 24 hours might be intentional layover
      if (connectionMinutes > 1440) {
        return {
          isValid: true,
          warning: `Long layover detected (${Math.round(connectionMinutes / 60)} hours). Confirm this is intentional.`,
        };
      }
    } catch {
      // If we can't parse times, just validate airports
      return { isValid: true };
    }
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
 */
export function suggestNationalityFromBirthCountry(
  birthCountry: string
): string | null {
  // If born in Dominican Republic, suggest Dominican nationality
  if (
    birthCountry.toLowerCase().includes("dominican") ||
    birthCountry === "DO"
  ) {
    return "Dominican Republic";
  }

  // For other countries, return the birth country as likely nationality
  return birthCountry;
}
