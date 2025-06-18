/*
 * Date utilities for safe timezone handling.
 * All functions work with local timezone values.
 */

export type IsoDateString = `${number}-${number}-${number}`; // YYYY-MM-DD

/**
 * Parse ISO date string (YYYY-MM-DD) in local timezone.
 * @param value - ISO date string to parse
 * @returns Date object or null if invalid
 */
export function parseISO(value: string | undefined | null): Date | null {
  if (!value) return null;

  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  // Create date at noon to avoid DST issues
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);

  // Validate date didn't overflow (e.g. Feb 31 -> Mar 3)
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}

/**
 * Format Date to ISO date string (YYYY-MM-DD).
 * @param date - Date to format
 * @returns ISO date string or empty string if invalid
 */
export function toISODate(date: Date | undefined | null): IsoDateString | "" {
  if (!date || !isValid(date)) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}` as IsoDateString;
}

/**
 * Check if Date object is valid.
 * @param date - Date to validate
 * @returns true if date is valid, false otherwise
 */
export function isValid(date: Date | undefined | null): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime());
}
