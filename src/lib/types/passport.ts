/**
 * Machine Readable Zone (MRZ) data extracted from passport
 */
export interface MrzResult {
  /** Passport number without formatting characters */
  passportNumber: string;
  /** Nationality as country name (e.g., "United States", not "USA") */
  nationality: string;
  /** Birth date in ISO format (YYYY-MM-DD) */
  birthDate: string;
  /** Passport expiry date in ISO format (YYYY-MM-DD) */
  expiryDate: string;
}

/**
 * Enhanced passport OCR data with additional metadata
 * Extends MrzResult with processing information
 */
export interface PassportOcrData extends MrzResult {
  /** Confidence score from OCR processing (0-100) */
  confidence?: number;
  /** Raw OCR text extracted from image */
  rawText?: string;
}

/**
 * Progress callback type for Tesseract OCR UI updates
 * Used to provide real-time feedback during processing
 */
export type ProgressCallback = (progress: {
  status:
    | "idle"
    | "loading"
    | "preprocessing"
    | "recognizing"
    | "parsing"
    | "complete";
  percentage: number;
}) => void;

/**
 * Standardized error codes for OCR processing
 * Provides consistent error handling across the application
 */
export const TesseractErrorCodes = {
  LOAD_FAILED: "TESSERACT_LOAD_FAILED",
  NO_MRZ_DETECTED: "NO_MRZ_DETECTED",
  INVALID_CHECKSUM: "INVALID_CHECKSUM",
  PROCESSING_FAILED: "PROCESSING_FAILED",
} as const;

/**
 * OCR processing error with user-friendly and technical messages
 * Allows for both user display and debugging information
 */
export interface OcrError {
  code:
    | "NO_MRZ_DETECTED"
    | "IMAGE_TOO_BLURRY"
    | "PROCESSING_FAILED"
    | "INVALID_CHECKSUM"
    | "TIMEOUT"
    | "TESSERACT_LOAD_FAILED";
  message: string;
  technicalMessage?: string;
}
