import { z } from "zod";

/**
 * Flight Number Validation
 * Validates flight numbers according to IATA and ICAO standards
 */

/**
 * Validates flight number format using regex.
 * Rules:
 * - IATA codes (2 chars): letter-letter, letter-digit, or digit-letter.
 * - ICAO codes (3 chars): letter-letter-letter.
 * - Flight number: 1-4 digits, with optional letter suffix and optional space.
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

/**
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

export const flightDetailsSchema = z.object({
  flightNumber: z
    .string()
    .min(3, "Flight number must be at least 3 characters")
    .max(8, "Flight number must be no more than 8 characters")
    .refine(
      (value: string) => {
        const flightNumberPattern =
          /^((?:[A-Z]{2}|[A-Z]\d|\d[A-Z])|[A-Z]{3})\s?(\d{1,4}[A-Z]?)$/i;
        return flightNumberPattern.test(value);
      },
      {
        message:
          "Invalid format. Use 2-3 letter code and 1-4 digits with optional letter suffix (e.g., AA1234, U22621A, AAL8).",
      }
    )
    .transform(normalizeFlightNumber),
});
