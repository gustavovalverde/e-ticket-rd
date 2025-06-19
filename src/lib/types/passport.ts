export interface MrzResult {
  passportNumber: string;
  nationality: string;
  birthDate: string;
  expiryDate: string;
}

export interface PassportOcrData extends MrzResult {
  /** Confidence score from OCR processing (0-100) */
  confidence?: number;
  /** Raw OCR text extracted from image */
  rawText?: string;
}

export interface OcrError {
  code:
    | "NO_MRZ_DETECTED"
    | "IMAGE_TOO_BLURRY"
    | "PROCESSING_FAILED"
    | "INVALID_CHECKSUM"
    | "TIMEOUT";
  message: string;
}
