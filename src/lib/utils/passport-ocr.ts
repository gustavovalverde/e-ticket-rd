import { format, parse, isValid } from "date-fns";

import { devLog } from "@/lib/utils";
import {
  convertNationalityToCountryName,
  isValidCountryCode,
} from "@/lib/utils/country-utils";

import type {
  MrzResult,
  OcrError,
  ProgressCallback,
} from "@/lib/types/passport";

export type {
  MrzResult,
  OcrError,
  ProgressCallback,
} from "@/lib/types/passport";

/**
 * Standardized error codes for Tesseract.js OCR processing
 * Provides consistent error handling across the application
 */
export const TesseractErrorCodes = {
  TESSERACT_LOAD_FAILED: "TESSERACT_LOAD_FAILED",
  NO_MRZ_DETECTED: "NO_MRZ_DETECTED",
  INVALID_CHECKSUM: "INVALID_CHECKSUM",
  PROCESSING_FAILED: "PROCESSING_FAILED",
  INVALID_INPUT: "INVALID_INPUT",
  PROCESSING_TIMEOUT: "PROCESSING_TIMEOUT",
  POOR_IMAGE_QUALITY: "POOR_IMAGE_QUALITY",
} as const;

export type TesseractErrorCode =
  (typeof TesseractErrorCodes)[keyof typeof TesseractErrorCodes];

// Tesseract.js dynamic import types - using 'any' is justified due to complex typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TesseractWorkerFactory = any;

let workerFactory: TesseractWorkerFactory | null = null;

/**
 * Initialize Tesseract.js worker factory
 * Lazy loads the Tesseract.js library to reduce initial bundle size
 */
async function initializeTesseract(): Promise<TesseractWorkerFactory> {
  if (!workerFactory) {
    const { createWorker } = await import("tesseract.js");
    workerFactory = createWorker;
  }
  return workerFactory;
}

// Processing cache and configuration
const processedCache = new Map<string, MrzResult>();
const CACHE_MAX_SIZE = 50;
const VALID_IMAGE_URL_PATTERN = /^(data:image\/|blob:|https?:\/\/)/;

const PROCESSING_TIMEOUT = 30000; // 30 seconds max processing time
const MIN_PASSPORT_NUMBER_LENGTH = 6;
const MAX_PASSPORT_NUMBER_LENGTH = 12;

const SUSPICIOUS_PATTERNS = [
  /^[A-Z]{3,}$/, // All letters (like "LST", "XXX")
  /^[0-9]{3,}$/, // All numbers
  /^[<]{3,}$/, // All angle brackets
  /^.{1,3}$/, // Too short
];

/**
 * Validate image input URL
 * Ensures the image URL is valid and supported
 */
function validateImageInput(imageUrl: string): void {
  if (!imageUrl || typeof imageUrl !== "string") {
    throw createError(TesseractErrorCodes.INVALID_INPUT, "Image URL required");
  }
  if (!VALID_IMAGE_URL_PATTERN.test(imageUrl)) {
    throw createError(
      TesseractErrorCodes.INVALID_INPUT,
      "Invalid image URL format"
    );
  }
}

/**
 * Generate a hash for image caching
 * Creates a unique identifier for processed images
 */
async function generateImageHash(imageUrl: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(imageUrl);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

/**
 * Process passport image and extract MRZ data using Tesseract.js
 *
 * @param imageUrl Data URL or blob URL of the passport image
 * @param progressCallback Optional callback for progress updates
 * @returns Promise resolving to extracted passport data
 */
export async function processPassport(
  imageUrl: string,
  progressCallback?: ProgressCallback
): Promise<MrzResult> {
  const startTime = performance.now();
  devLog("🚀 Starting passport OCR processing");

  // Add timeout protection
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        createError(
          TesseractErrorCodes.PROCESSING_TIMEOUT,
          `OCR processing exceeded ${PROCESSING_TIMEOUT / 1000} seconds`,
          "Processing is taking too long. Please try taking a clearer, well-lit photo of your passport."
        )
      );
    }, PROCESSING_TIMEOUT);
  });

  try {
    validateImageInput(imageUrl);

    // Check cache first
    const imageHash = await generateImageHash(imageUrl);
    if (processedCache.has(imageHash)) {
      devLog("✅ Cache hit - returning cached result");
      const cachedResult = processedCache.get(imageHash);
      if (cachedResult) return cachedResult;
    }

    // Race between actual processing and timeout
    const processingPromise = (async () => {
      progressCallback?.({ status: "loading", percentage: 10 });
      await initializeTesseract();

      progressCallback?.({ status: "preprocessing", percentage: 20 });
      const mrzCanvas = await preprocessImage(imageUrl);

      progressCallback?.({ status: "recognizing", percentage: 60 });
      const rawText = await recognizeMrzText(mrzCanvas, progressCallback);

      progressCallback?.({ status: "parsing", percentage: 90 });

      // Basic validation will happen in parseMrzText -> createMrzResult
      return await parseMrzText(rawText);
    })();

    const result = await Promise.race([processingPromise, timeoutPromise]);

    // Cache result with size management
    if (processedCache.size >= CACHE_MAX_SIZE) {
      const firstKey = processedCache.keys().next().value;
      if (firstKey) processedCache.delete(firstKey);
    }
    processedCache.set(imageHash, result);

    devLog("📊 OCR completed", {
      totalTime: `${(performance.now() - startTime).toFixed(1)}ms`,
      cacheSize: processedCache.size,
    });

    progressCallback?.({ status: "complete", percentage: 100 });
    return result;
  } catch (error) {
    devLog("💥 OCR processing failed", error);
    throw handleError(error);
  }
}

function convertToGrayscale(data: Uint8ClampedArray): void {
  const pixelCount = data.length / 4;

  // ESLint disable is justified here because:
  // 1. This is performance-critical image processing
  // 2. Indices are mathematically calculated (pixel * 4, +1, +2) - always safe
  // 3. Uint8ClampedArray has built-in bounds checking
  // 4. No user input is involved in index calculation
  /* eslint-disable security/detect-object-injection */
  for (let pixel = 0; pixel < pixelCount; pixel++) {
    const redIndex = pixel * 4;
    const greenIndex = redIndex + 1;
    const blueIndex = redIndex + 2;

    const gray = Math.round(
      0.299 * data[redIndex] +
        0.587 * data[greenIndex] +
        0.114 * data[blueIndex]
    );

    data[redIndex] = gray;
    data[greenIndex] = gray;
    data[blueIndex] = gray;
  }
  /* eslint-enable security/detect-object-injection */
}

async function preprocessImage(imageUrl: string): Promise<HTMLCanvasElement> {
  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // Crop to MRZ area (bottom 25%)
  const mrzCanvas = document.createElement("canvas");
  const mrzCtx = mrzCanvas.getContext("2d");
  if (!mrzCtx) throw new Error("Could not get MRZ canvas context");

  const mrzHeight = Math.floor(canvas.height * 0.25);
  const mrzY = canvas.height - mrzHeight;

  mrzCanvas.width = canvas.width;
  mrzCanvas.height = mrzHeight;
  mrzCtx.drawImage(
    canvas,
    0,
    mrzY,
    canvas.width,
    mrzHeight,
    0,
    0,
    canvas.width,
    mrzHeight
  );

  const imageData = mrzCtx.getImageData(
    0,
    0,
    mrzCanvas.width,
    mrzCanvas.height
  );
  convertToGrayscale(imageData.data);

  mrzCtx.putImageData(imageData, 0, 0);
  return mrzCanvas;
}

async function recognizeMrzText(
  mrzCanvas: HTMLCanvasElement,
  progressCallback?: ProgressCallback
): Promise<string> {
  try {
    return await recognizeWithModel("ocrb", mrzCanvas, progressCallback);
  } catch {
    devLog("⚠️ OCR-B failed, trying English fallback");
    return await recognizeWithModel("eng", mrzCanvas, progressCallback);
  }
}

async function recognizeWithModel(
  model: "ocrb" | "eng",
  mrzCanvas: HTMLCanvasElement,
  progressCallback?: ProgressCallback
): Promise<string> {
  const createWorker = await initializeTesseract();
  const worker = await createWorker(model, 1, {
    langPath: "/tessdata",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logger: (m: any) => {
      if (m.status === "recognizing text" && m.progress) {
        const percentage = 60 + m.progress * 30;
        progressCallback?.({ status: "recognizing", percentage });
      }
    },
  });

  try {
    await worker.setParameters({
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<",
      tessedit_pageseg_mode: 6,
    });

    const {
      data: { text },
    } = await worker.recognize(mrzCanvas);
    await worker.terminate();

    if (!text || text.trim().length < 20) {
      throw createError(
        TesseractErrorCodes.NO_MRZ_DETECTED,
        `Insufficient text detected with ${model.toUpperCase()} model`
      );
    }

    return text;
  } catch (error) {
    await worker.terminate();
    throw error;
  }
}

async function parseMrzText(text: string): Promise<MrzResult> {
  try {
    const { parse } = await import("mrz");
    const mrzLines = cleanAndFormatMrzText(text);
    const mrzText = mrzLines.join("\n");
    const parsed = parse(mrzText, { autocorrect: true });
    const enhancedInfo = extractBasicPassportInfo(text);
    return createMrzResult(parsed, enhancedInfo);
  } catch (error) {
    devLog("❌ MRZ parsing failed", error);
    throw createError(
      TesseractErrorCodes.NO_MRZ_DETECTED,
      "Failed to parse MRZ data"
    );
  }
}

function cleanAndFormatMrzText(text: string): string[] {
  const cleanText = text
    .replace(/[^A-Z0-9<\n\r\s]/g, "")
    .replace(/\r/g, "\n")
    .trim();

  const lines = cleanText
    .split("\n")
    .map((line) => line.replace(/\s/g, ""))
    .filter((line) => line.length >= 20 && /[A-Z0-9<]/.test(line));

  if (lines.length === 0) {
    throw createError(
      TesseractErrorCodes.NO_MRZ_DETECTED,
      "No valid MRZ lines found"
    );
  }

  let mrzLines: string[];

  if (lines.length === 1 && lines.length > 0 && lines[0].length >= 88) {
    const firstLine = lines[0];
    mrzLines = [firstLine.substring(0, 44), firstLine.substring(44, 88)];
  } else if (lines.length >= 2) {
    mrzLines = lines.slice(0, 2);
  } else if (lines.length > 0) {
    const basicFirstLine = "P<XXXUNKNOWN<<UNKNOWN<<<<<<<<<<<<<<<<<<<<<<<";
    mrzLines = [basicFirstLine, lines[0]];
  } else {
    const basicFirstLine = "P<XXXUNKNOWN<<UNKNOWN<<<<<<<<<<<<<<<<<<<<<<<";
    const basicSecondLine = "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<";
    mrzLines = [basicFirstLine, basicSecondLine];
  }

  return mrzLines.map((line) => {
    if (line.length === 44) return line;
    if (line.length < 44) return line.padEnd(44, "<");

    // Smart truncation for 45-char lines
    if (line.length === 45) {
      const endPaddingMatch = line.match(/(<{2,})(\d*)$/);
      if (
        endPaddingMatch &&
        endPaddingMatch.length >= 3 &&
        endPaddingMatch[1].length > 1
      ) {
        const newPadding = endPaddingMatch[1].slice(1);
        const checkDigits = endPaddingMatch[2] || "";
        const fullMatch = endPaddingMatch[0];
        return line.slice(0, -fullMatch.length) + newPadding + checkDigits;
      }
    }

    return line.substring(0, 44);
  });
}

function extractFromMrzLine(lines: string[]): string {
  if (lines.length < 2) return "";

  const secondLine = lines[1];
  if (secondLine.length < 10) return "";

  const passportField =
    secondLine.charAt(0) === "<"
      ? secondLine.substring(1, 10)
      : secondLine.substring(0, 9);

  const passportNumber = passportField.replace(/<+$/g, "");

  return passportNumber.length >= 6 &&
    /[A-Z]/.test(passportNumber) &&
    /[0-9]/.test(passportNumber)
    ? passportNumber
    : "";
}

function extractFromPatterns(cleanText: string): string {
  const passportMatches = cleanText.match(/([A-Z]{1,3}[0-9]{6,9})/g);
  if (passportMatches) {
    for (const match of passportMatches) {
      if (
        match.length >= 6 &&
        match.length <= 9 &&
        /[A-Z]/.test(match) &&
        /[0-9]/.test(match)
      ) {
        return match;
      }
    }
  }

  const contextMatch = cleanText.match(/([A-Z0-9]{6,9})[A-Z]{3}/);
  if (contextMatch && contextMatch.length > 1) {
    const candidate = contextMatch[1];
    if (/\d/.test(candidate) && /[A-Z]/.test(candidate)) {
      return candidate.trim();
    }
  }

  return "";
}

function extractPassportNumber(cleanText: string, lines: string[]): string {
  return extractFromMrzLine(lines) || extractFromPatterns(cleanText);
}

function extractNationality(cleanText: string): string {
  const nationalityMatch = cleanText.match(/P[A-Z<]([A-Z]{3})/);
  if (
    nationalityMatch &&
    nationalityMatch.length > 1 &&
    nationalityMatch[1] !== "XXX"
  ) {
    return nationalityMatch[1];
  }
  return "";
}

function extractDatesFromMrz(lines: string[]): {
  birthDate: string;
  expiryDate: string;
} {
  if (lines.length < 2 || lines[1].length < 27) {
    return { birthDate: "", expiryDate: "" };
  }

  const secondLine = lines[1];
  const birthCandidate = secondLine.substring(13, 19);
  const expiryCandidate = secondLine.substring(21, 27);

  return {
    birthDate:
      /^[0-9]{6}$/.test(birthCandidate) && isValidMrzDate(birthCandidate)
        ? birthCandidate
        : "",
    expiryDate:
      /^[0-9]{6}$/.test(expiryCandidate) && isValidMrzDate(expiryCandidate)
        ? expiryCandidate
        : "",
  };
}

function extractDatesFromPattern(cleanText: string): {
  birthDate: string;
  expiryDate: string;
} {
  const dateMatch = cleanText.match(
    /([A-Z0-9]{8,12})[0-9][MF<]([0-9]{6})[0-9]([0-9]{6})/
  );
  if (!dateMatch || dateMatch.length < 4) {
    return { birthDate: "", expiryDate: "" };
  }

  return {
    birthDate: isValidMrzDate(dateMatch[2]) ? dateMatch[2] : "",
    expiryDate: isValidMrzDate(dateMatch[3]) ? dateMatch[3] : "",
  };
}

function extractDatesFromMatches(cleanText: string): {
  birthDate: string;
  expiryDate: string;
} {
  const dateMatches = cleanText.match(/([0-9]{6})/g);
  if (!dateMatches || dateMatches.length < 2) {
    return { birthDate: "", expiryDate: "" };
  }

  const validDates = dateMatches.filter(isValidMrzDate);
  if (validDates.length < 2) {
    return { birthDate: "", expiryDate: "" };
  }

  return { birthDate: validDates[0], expiryDate: validDates[1] };
}

function extractDates(
  cleanText: string,
  lines: string[]
): { birthDate: string; expiryDate: string } {
  let result = extractDatesFromMrz(lines);

  if (!result.birthDate || !result.expiryDate) {
    const patternResult = extractDatesFromPattern(cleanText);
    result = {
      birthDate: result.birthDate || patternResult.birthDate,
      expiryDate: result.expiryDate || patternResult.expiryDate,
    };
  }

  if (!result.birthDate || !result.expiryDate) {
    const matchResult = extractDatesFromMatches(cleanText);
    result = {
      birthDate: result.birthDate || matchResult.birthDate,
      expiryDate: result.expiryDate || matchResult.expiryDate,
    };
  }

  return result;
}

function extractBasicPassportInfo(text: string): {
  passportNumber: string;
  nationality: string;
  birthDate: string;
  expiryDate: string;
} {
  const cleanText = text.replace(/[^A-Z0-9<\s]/g, "").toUpperCase();
  const lines = cleanText
    .split("\n")
    .map((line) => line.replace(/\s/g, ""))
    .filter((line) => line.length >= 20 && /[A-Z0-9<]/.test(line));

  const passportNumber = extractPassportNumber(cleanText, lines);
  const nationality = extractNationality(cleanText);
  const { birthDate, expiryDate } = extractDates(cleanText, lines);

  return { passportNumber, nationality, birthDate, expiryDate };
}

function isValidMrzDate(dateStr: string): boolean {
  if (!dateStr || dateStr.length !== 6) return false;

  const year = parseInt(dateStr.substring(0, 2), 10);
  const month = parseInt(dateStr.substring(2, 4), 10);
  const day = parseInt(dateStr.substring(4, 6), 10);

  return (
    year >= 0 &&
    year <= 99 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31
  );
}

function extractFieldsSafely(fields: Record<string, unknown>) {
  return {
    documentNumber: Object.prototype.hasOwnProperty.call(
      fields,
      "documentNumber"
    )
      ? (fields.documentNumber as string)
      : undefined,
    nationality: Object.prototype.hasOwnProperty.call(fields, "nationality")
      ? (fields.nationality as string)
      : undefined,
    birthDate: Object.prototype.hasOwnProperty.call(fields, "birthDate")
      ? (fields.birthDate as string)
      : undefined,
    expirationDate: Object.prototype.hasOwnProperty.call(
      fields,
      "expirationDate"
    )
      ? (fields.expirationDate as string)
      : undefined,
  };
}

function resolvePassportNumber(
  documentNumber: string | undefined,
  enhancedPassportNumber: string
): string {
  let passportNumber = documentNumber || enhancedPassportNumber || "";
  passportNumber = passportNumber.trim();

  // Use enhanced extraction if mrz library result is truncated
  if (
    passportNumber.length < 9 &&
    enhancedPassportNumber &&
    enhancedPassportNumber.length > passportNumber.length
  ) {
    return enhancedPassportNumber.trim();
  }

  return passportNumber || enhancedPassportNumber.trim();
}

function resolveDates(
  fieldBirthDate: string | undefined,
  fieldExpirationDate: string | undefined,
  enhancedBirthDate: string,
  enhancedExpiryDate: string
): { birthDate: string; expiryDate: string } {
  let finalBirthDate = fieldBirthDate
    ? parseMrzDate(fieldBirthDate, "birth")
    : "";
  let finalExpiryDate = fieldExpirationDate
    ? parseMrzDate(fieldExpirationDate, "expiry")
    : "";

  if (!finalBirthDate && enhancedBirthDate) {
    finalBirthDate = parseMrzDate(enhancedBirthDate, "birth");
  }
  if (!finalExpiryDate && enhancedExpiryDate) {
    finalExpiryDate = parseMrzDate(enhancedExpiryDate, "expiry");
  }

  return {
    birthDate: finalBirthDate || fieldBirthDate || enhancedBirthDate || "",
    expiryDate:
      finalExpiryDate || fieldExpirationDate || enhancedExpiryDate || "",
  };
}

function createMrzResult(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parsed: any,
  enhancedInfo: {
    passportNumber: string;
    nationality: string;
    birthDate: string;
    expiryDate: string;
  }
): MrzResult {
  if (
    !parsed.valid &&
    (!parsed.fields || Object.keys(parsed.fields).length === 0)
  ) {
    throw createError(
      TesseractErrorCodes.INVALID_CHECKSUM,
      "MRZ validation failed"
    );
  }

  const fields = parsed.fields || {};
  const extractedFields = extractFieldsSafely(fields);

  const passportNumber = resolvePassportNumber(
    extractedFields.documentNumber,
    enhancedInfo.passportNumber
  );

  const originalNationality =
    extractedFields.nationality || enhancedInfo.nationality || "";

  const { birthDate, expiryDate } = resolveDates(
    extractedFields.birthDate,
    extractedFields.expirationDate,
    enhancedInfo.birthDate,
    enhancedInfo.expiryDate
  );

  // Validate data quality before returning
  validateDataQuality(
    {
      passportNumber,
      nationality: convertNationalityToCountryName(originalNationality) || "",
      birthDate,
      expiryDate,
    },
    originalNationality
  );

  return {
    passportNumber,
    nationality: convertNationalityToCountryName(originalNationality) || "",
    birthDate,
    expiryDate,
  };
}

function parseMrzDate(mrzDate: string, type: "birth" | "expiry"): string {
  if (!mrzDate || mrzDate.length !== 6) return "";

  const year = parseInt(mrzDate.substring(0, 2), 10);
  const month = parseInt(mrzDate.substring(2, 4), 10);
  const day = parseInt(mrzDate.substring(4, 6), 10);

  let fullYear = 2000 + year;
  if (type === "birth" && year > 29) {
    fullYear = 1900 + year;
  }

  try {
    const dateString = `${fullYear}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());

    if (!isValid(parsedDate)) return "";
    return format(parsedDate, "yyyy-MM-dd");
  } catch {
    return "";
  }
}

function handleError(error: unknown): never {
  if (error && typeof error === "object" && "code" in error) {
    throw error;
  }

  const message =
    error instanceof Error ? error.message : "Unknown error occurred";
  throw createError(TesseractErrorCodes.PROCESSING_FAILED, message);
}

function getErrorMessage(code: TesseractErrorCode): string {
  switch (code) {
    case TesseractErrorCodes.TESSERACT_LOAD_FAILED:
      return "We're having trouble loading the passport scanner. Please check your internet connection and try again.";
    case TesseractErrorCodes.NO_MRZ_DETECTED:
      return "We couldn't read your passport. Please make sure the passport page is fully visible, well-lit, and in focus, then try again.";
    case TesseractErrorCodes.INVALID_CHECKSUM:
      return "The passport information doesn't look right. Please take a clearer photo with good lighting and try again.";
    case TesseractErrorCodes.PROCESSING_FAILED:
      return "Something went wrong while processing your passport. Please try taking a new photo or refresh the page.";
    case TesseractErrorCodes.INVALID_INPUT:
      return "Please upload a clear photo of your passport's main page (the one with your photo and details).";
    case TesseractErrorCodes.PROCESSING_TIMEOUT:
      return "Processing is taking too long. Please try taking a clearer, well-lit photo of your passport.";
    case TesseractErrorCodes.POOR_IMAGE_QUALITY:
      return "The image quality is poor. Please take a clearer, well-lit photo of your passport.";
    default:
      return "An error occurred while processing your passport.";
  }
}

function createError(
  code: TesseractErrorCode,
  technicalMessage: string,
  userMessage?: string
): OcrError {
  return {
    code: code as OcrError["code"],
    message: userMessage || getErrorMessage(code),
    technicalMessage,
  };
}

function validateDataQuality(
  result: MrzResult,
  originalCountryCode?: string
): void {
  const errors: string[] = [];

  // Validate passport number
  if (
    result.passportNumber.length < MIN_PASSPORT_NUMBER_LENGTH ||
    result.passportNumber.length > MAX_PASSPORT_NUMBER_LENGTH
  ) {
    errors.push(
      `Passport number length ${result.passportNumber.length} is outside expected range ${MIN_PASSPORT_NUMBER_LENGTH}-${MAX_PASSPORT_NUMBER_LENGTH}`
    );
  }

  // Check for suspicious passport number patterns
  if (
    SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(result.passportNumber))
  ) {
    errors.push(`Passport number "${result.passportNumber}" appears malformed`);
  }

  // Validate passport number has both letters and numbers (most passports do)
  if (
    !/\d/.test(result.passportNumber) ||
    !/[A-Z]/.test(result.passportNumber)
  ) {
    errors.push(
      `Passport number "${result.passportNumber}" should contain both letters and numbers`
    );
  }

  // Validate nationality/country code using original 3-letter code
  if (originalCountryCode && !isValidCountryCode(originalCountryCode)) {
    errors.push(`Invalid country code detected: "${originalCountryCode}"`);
  }

  // Validate dates exist and are reasonable
  if (!result.birthDate || !result.expiryDate) {
    errors.push("Missing required date information");
  }

  // Check if dates are in reasonable range
  if (result.birthDate) {
    const birthYear = parseInt(result.birthDate.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    if (birthYear < 1900 || birthYear > currentYear - 10) {
      errors.push(`Birth year ${birthYear} appears invalid`);
    }
  }

  if (result.expiryDate) {
    const expiryYear = parseInt(result.expiryDate.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    if (expiryYear < currentYear - 20 || expiryYear > currentYear + 20) {
      errors.push(`Expiry year ${expiryYear} appears invalid`);
    }
  }

  // If we have multiple errors, it's likely poor image quality
  if (errors.length >= 2) {
    devLog("🚨 Poor image quality detected", {
      errors,
      result,
      originalCountryCode,
    });
    throw createError(
      TesseractErrorCodes.POOR_IMAGE_QUALITY,
      `Multiple data quality issues detected: ${errors.join("; ")}`,
      "The image quality appears poor and resulted in unreliable data. Please take a clearer, well-lit photo of your passport and try again, or enter the information manually."
    );
  }

  // If we have one error, log it but don't fail (might be a valid edge case)
  if (errors.length === 1) {
    devLog("⚠️ Data quality warning", {
      error: errors[0],
      result,
      originalCountryCode,
    });
  }
}
