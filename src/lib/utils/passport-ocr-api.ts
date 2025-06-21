import { format, parse, isValid } from "date-fns";

import { devLog } from "@/lib/utils";
import { convertNationalityToCountryName } from "@/lib/utils/country-utils";

import type { MrzResult, OcrError } from "@/lib/types/passport";

interface OcrSpaceResult {
  ParsedResults: Array<{
    TextOverlay: {
      Lines: Array<{
        LineText: string;
        MaxHeight: number;
        MinTop: number;
      }>;
    };
    ParsedText: string;
    ErrorMessage?: string;
    ErrorDetails?: string;
  }>;
  OCRExitCode: number;
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string;
  ProcessingTimeInMilliseconds: string;
}

// ==========================================
// MAIN API FUNCTIONS
// ==========================================

/**
 * Extracts passport MRZ data from image or PDF using OCR.space API
 *
 * Cost Impact: Minimize API usage - validate inputs locally first
 * Performance: <30s timeout required for government compliance
 *
 * @param file - Image or PDF file containing passport MRZ
 * @param options - Processing options with timeout and abort signal
 * @returns Parsed MRZ data with passport number, nationality, and dates
 *
 * @example
 * const result = await extractMrzFromPassport(file, { timeout: 30000 });
 * console.log(result.passportNumber, result.nationality);
 */
export async function extractMrzFromPassport(
  file: File,
  options: { timeout?: number; signal?: AbortSignal } = {}
): Promise<MrzResult> {
  const { timeout = 30000, signal } = options;

  devLog("🌐 Starting OCR.space API processing", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    timeout,
  });

  // Validate input file
  validatePassportFile(file, signal);

  const apiKey = process.env.NEXT_PUBLIC_OCR_SPACE_API_KEY || "helloworld";

  try {
    // Make API call and get text
    const parsedText = await callOcrSpaceApi(file, apiKey, timeout, signal);

    // Parse MRZ from extracted text
    devLog("🔍 Starting MRZ parsing from OCR.space text");
    return await parseMrzFromOcrSpace(parsedText);
  } catch (error) {
    return handleOcrError(error, timeout, signal);
  }
}

// ==========================================
// FILE VALIDATION FUNCTIONS
// ==========================================

/**
 * Validates passport file input and checks for cancellation
 */
function validatePassportFile(file: File, signal?: AbortSignal): void {
  // Input validation
  if (!file || file.size === 0) {
    throw createOcrError(
      "PROCESSING_FAILED",
      "Invalid file",
      "Please select a valid file."
    );
  }

  // Dynamic file size validation based on API key tier
  const apiKey = process.env.NEXT_PUBLIC_OCR_SPACE_API_KEY || "helloworld";
  const maxFileSize = getMaxFileSizeForApiKey(apiKey);

  if (file.size > maxFileSize) {
    const errorMessage = getFileSizeErrorMessage(
      file.size,
      maxFileSize,
      apiKey
    );
    throw createOcrError(
      "PROCESSING_FAILED",
      errorMessage,
      "File is too large. Please use a smaller file or compress it."
    );
  }

  // File type validation
  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw createOcrError(
      "PROCESSING_FAILED",
      `Unsupported file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
      "Please upload a JPEG, PNG, WebP image, or PDF file."
    );
  }

  if (signal?.aborted) {
    devLog("🛑 Operation cancelled before starting");
    throw createOcrError(
      "TIMEOUT",
      "Operation cancelled",
      "Upload was cancelled."
    );
  }
}

// ==========================================
// OCR API INTERACTION FUNCTIONS
// ==========================================

/**
 * Makes API call to OCR.space and returns extracted text
 */
async function callOcrSpaceApi(
  file: File,
  apiKey: string,
  timeout: number,
  signal?: AbortSignal
): Promise<string> {
  const formData = createOcrFormData(file, apiKey);
  const response = await makeOcrRequest(formData, timeout, signal);
  const result = await parseOcrResponse(response);
  return validateOcrResult(result);
}

/**
 * Creates FormData for OCR.space API request
 */
function createOcrFormData(file: File, apiKey: string): FormData {
  devLog("📋 Preparing FormData for OCR.space API");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("apikey", apiKey);

  // OCR.space API parameters optimized for passport MRZ recognition
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "true");
  formData.append("detectOrientation", "true");
  formData.append("isCreateSearchablePdf", "false");
  formData.append("isSearchablePdfHideTextLayer", "false");
  formData.append("scale", "true");
  formData.append("isTable", "false");
  formData.append("OCREngine", "2"); // Latest engine for best accuracy

  devLog("⚙️ OCR.space API parameters configured", {
    apiKey: apiKey === "helloworld" ? "demo-key" : "custom-key",
    language: "eng",
    ocrEngine: "2",
    isOverlayRequired: true,
    detectOrientation: true,
    expectedCost: apiKey === "helloworld" ? "$0 (free)" : "$0.0001/request",
  });

  return formData;
}

/**
 * Makes the actual HTTP request to OCR.space API
 */
async function makeOcrRequest(
  formData: FormData,
  timeout: number,
  signal?: AbortSignal
): Promise<Response> {
  devLog("🚀 Sending request to OCR.space API", {
    url: "https://api.ocr.space/parse/image",
    method: "POST",
    timeout,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Combine external abort signal with internal timeout
  if (signal) {
    signal.addEventListener("abort", () => controller.abort());
  }

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData,
    signal: controller.signal,
    headers: {},
    cache: "no-store", // Each passport image is unique
  }).finally(() => {
    clearTimeout(timeoutId);
  });

  devLog("📡 OCR.space API response received", {
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    headers: {
      "content-type": response.headers.get("content-type"),
      "content-length": response.headers.get("content-length"),
    },
  });

  return response;
}

/**
 * Parses OCR.space API response and handles errors
 */
async function parseOcrResponse(response: Response): Promise<OcrSpaceResult> {
  // Enhanced error handling with specific status codes and upgrade guidance
  if (!response.ok) {
    const apiKey = process.env.NEXT_PUBLIC_OCR_SPACE_API_KEY || "helloworld";
    const maxFileSize = getMaxFileSizeForApiKey(apiKey);
    await handleOcrApiError(response, apiKey, maxFileSize);
  }

  devLog("📦 Parsing OCR.space API response");
  let result: OcrSpaceResult;

  try {
    result = await response.json();
  } catch (parseError) {
    devLog("❌ Failed to parse OCR.space response", parseError);
    throw createOcrError(
      "PROCESSING_FAILED",
      "Invalid response from OCR service",
      "Service error. Please try again."
    );
  }

  devLog("📊 OCR.space API result received", {
    ocrExitCode: result.OCRExitCode,
    isErroredOnProcessing: result.IsErroredOnProcessing,
    processingTime: result.ProcessingTimeInMilliseconds,
    hasResults: !!result.ParsedResults && result.ParsedResults.length > 0,
    errorMessage: result.ErrorMessage,
  });

  return result;
}

/**
 * Validates OCR result and extracts text
 */
function validateOcrResult(result: OcrSpaceResult): string {
  if (result.IsErroredOnProcessing || result.OCRExitCode !== 1) {
    devLog("❌ OCR.space processing failed", {
      isErroredOnProcessing: result.IsErroredOnProcessing,
      ocrExitCode: result.OCRExitCode,
      errorMessage: result.ErrorMessage,
    });
    throw createOcrError(
      "PROCESSING_FAILED",
      result.ErrorMessage || "OCR processing failed",
      "Unable to process the image. Please ensure the passport is clearly visible and try again."
    );
  }

  const parsedText = result.ParsedResults?.[0]?.ParsedText || "";

  devLog("📝 OCR.space text extraction completed", {
    textLength: parsedText.length,
    textPreview: parsedText.substring(0, 100),
    hasText: !!parsedText,
    processingTime: result.ProcessingTimeInMilliseconds,
  });

  if (!parsedText || parsedText.length < 20) {
    devLog("⚠️ Insufficient text detected", {
      textLength: parsedText.length,
      minRequired: 20,
    });
    throw createOcrError(
      "NO_MRZ_DETECTED",
      "No text detected in image",
      "No passport information found. Please ensure the bottom of the passport (machine-readable zone) is clearly visible."
    );
  }

  return parsedText;
}

// ==========================================
// MRZ PROCESSING FUNCTIONS
// ==========================================

async function parseMrzFromOcrSpace(text: string): Promise<MrzResult> {
  devLog("🔍 Starting MRZ parsing from OCR.space text", {
    rawTextLength: text.length,
    rawTextPreview: text.substring(0, 200),
  });

  try {
    const { parse } = await import("mrz");
    devLog("📦 MRZ library imported successfully");

    // Clean and filter text into potential MRZ lines
    const allLines = cleanAndFilterMrzText(text);

    // Detect and reconstruct MRZ lines
    let mrzLines = detectMrzLines(allLines);
    mrzLines = reconstructMrzLines(mrzLines, text);

    // Format lines to TD3 standard and parse
    const mrzText = formatMrzLinesToTD3(mrzLines);
    const parsed = parse(mrzText, { autocorrect: true });

    // Extract and format result
    return extractMrzResult({
      valid: parsed.valid,
      fields: parsed.fields
        ? {
            documentNumber: parsed.fields.documentNumber || undefined,
            nationality: parsed.fields.nationality || undefined,
            birthDate: parsed.fields.birthDate || undefined,
            expirationDate: parsed.fields.expirationDate || undefined,
            lastName: parsed.fields.lastName || undefined,
          }
        : undefined,
      format: parsed.format,
    });
  } catch (error) {
    devLog("❌ MRZ parsing failed from OCR.space", error);

    if (error && typeof error === "object" && "code" in error) {
      throw error;
    }
    throw createOcrError(
      "NO_MRZ_DETECTED",
      "Failed to parse MRZ data",
      "Unable to read passport information. Please try again with a clearer image."
    );
  }
}

/**
 * Cleans OCR text and filters into potential MRZ lines
 */
function cleanAndFilterMrzText(text: string): string[] {
  // Clean text for MRZ parsing
  const cleanedText = text
    .replace(/[^A-Z0-9<\n\r]/g, "") // Remove invalid chars
    .replace(/\r/g, "\n") // Normalize line breaks
    .trim();

  devLog("🧽 Text cleaned for MRZ parsing", {
    originalLength: text.length,
    cleanedLength: cleanedText.length,
    cleanedPreview: cleanedText.substring(0, 150),
  });

  // Split into lines and filter potential MRZ lines
  const allLines = cleanedText
    .split("\n")
    .filter((line) => line.length >= 20 && /[A-Z0-9<]/.test(line));

  devLog("📋 All lines after initial filtering", {
    totalLines: allLines.length,
    allLines: allLines.map(
      (line: string, i: number) => `${i}: ${line} (${line.length} chars)`
    ),
  });

  if (allLines.length < 1) {
    devLog("⚠️ No valid text lines found from OCR.space", {
      linesFound: allLines.length,
      minRequired: 1,
    });
    throw createOcrError(
      "NO_MRZ_DETECTED",
      "Could not find valid text lines",
      "No passport information found. Please ensure the machine-readable zone (bottom lines) of the passport is clearly visible."
    );
  }

  return allLines;
}

/**
 * Detects MRZ lines from filtered OCR text using multiple strategies
 */
function detectMrzLines(allLines: string[]): string[] {
  let mrzLines: string[] = [];

  // Strategy 1: Look for lines that start with 'P<' (passport indicator)
  const passportLines = allLines.filter(
    (line) => line.startsWith("P<") || line.match(/^P[A-Z]{3}/)
  );

  if (passportLines.length > 0) {
    devLog("🔍 Found passport indicator lines", passportLines);
    mrzLines.push(passportLines[0]);

    // Find the corresponding second line (usually has numbers and passport data)
    const dataLine = allLines.find(
      (line) =>
        line !== passportLines[0] &&
        line.length >= 20 &&
        (line.match(/\d/g) || []).length >= 4 // Has at least 4 digits
    );

    if (dataLine) {
      mrzLines.push(dataLine);
    }
  }

  // Strategy 2: If no passport indicator, look for long lines with MRZ characteristics
  if (mrzLines.length < 2) {
    devLog("🔍 Using MRZ characteristics strategy");
    const mrzCandidates = allLines.filter(
      (line) =>
        line.length >= 30 && // Longer lines likely to be MRZ
        /^[A-Z0-9<]+$/.test(line) && // Only valid MRZ characters
        ((line.match(/\d/g) || []).length >= 6 || line.includes("<")) // Has digits or < characters
    );

    if (mrzCandidates.length >= 1) {
      mrzLines = mrzCandidates.slice(0, 2); // Take up to 2 best candidates
    }
  }

  // Strategy 3: If still no luck, take the two longest lines
  if (mrzLines.length < 1) {
    devLog("🔍 Using longest lines strategy");
    mrzLines = allLines.sort((a, b) => b.length - a.length).slice(0, 2);
  }

  return mrzLines;
}

/**
 * Reconstructs MRZ lines for single-line cases and handles splitting
 */
function reconstructMrzLines(
  mrzLines: string[],
  originalText: string
): string[] {
  devLog("📋 MRZ candidate lines selected", {
    totalCandidates: mrzLines.length,
    candidateLines: mrzLines.map(
      (line: string, i: number) => `${i}: ${line} (${line.length} chars)`
    ),
  });

  // For single line MRZ (some passports), try to reconstruct proper TD3 format
  if (mrzLines.length === 1) {
    return handleSingleLineMrz(mrzLines[0], originalText);
  }

  return mrzLines;
}

/**
 * Handles single-line MRZ reconstruction with multiple strategies
 */
function handleSingleLineMrz(
  singleLine: string,
  originalText: string
): string[] {
  // If line is very long (88+ chars), it might be two lines concatenated
  if (singleLine.length >= 88) {
    devLog("🔧 Splitting long single line into two MRZ lines");
    const midPoint = Math.floor(singleLine.length / 2);
    return [singleLine.substring(0, midPoint), singleLine.substring(midPoint)];
  }

  // Try multiple MRZ line splitting approaches for single lines
  devLog("🔧 Trying multiple approaches for single MRZ line", {
    singleLine,
    length: singleLine.length,
  });

  return splitSingleMrzLine(singleLine, originalText);
}

/**
 * Splits a single MRZ line using various strategies
 */
function splitSingleMrzLine(
  singleLine: string,
  originalText: string
): string[] {
  // Approach 1: Split at specific points if line is long enough
  if (singleLine.length >= 88) {
    // Might be two TD3 lines concatenated (44 + 44)
    devLog("📐 Splitting 88+ char line into two TD3 lines");
    return [singleLine.substring(0, 44), singleLine.substring(44, 88)];
  }

  if (singleLine.length >= 72) {
    // Might be two TD2 lines concatenated (36 + 36)
    devLog("📐 Splitting 72+ char line into two TD2 lines");
    return [
      singleLine.substring(0, 36).padEnd(44, "<"),
      singleLine.substring(36).padEnd(44, "<"),
    ];
  }

  // Extract passport info and create proper first line
  devLog("🔧 Reconstructing TD3 format from passport text data");
  const passportInfo = extractPassportInfoFromText(originalText);
  const reconstructedFirstLine = constructTD3FirstLine(passportInfo);

  if (reconstructedFirstLine) {
    devLog("✨ Successfully reconstructed TD3 first line from passport data", {
      originalMrz: singleLine,
      reconstructedFirstLine,
      passportInfo,
    });
    return [
      reconstructedFirstLine,
      singleLine.padEnd(44, "<").substring(0, 44),
    ];
  }

  // Final fallback: basic TD3 format
  devLog("🔧 Creating basic TD3 format for single-line MRZ");
  const basicFirstLine = `P<${passportInfo.nationality || "XXX"}${passportInfo.surname || "UNKNOWN"}<<${passportInfo.givenName || "UNKNOWN"}`;
  return [
    basicFirstLine.padEnd(44, "<").substring(0, 44),
    singleLine.padEnd(44, "<").substring(0, 44),
  ];
}

/**
 * Formats MRZ lines to TD3 standard (44 characters each)
 */
function formatMrzLinesToTD3(mrzLines: string[]): string {
  // Try to pad/truncate lines to TD3 format (44 characters each)
  const reconstructedLines = mrzLines.map((line: string, index: number) => {
    let reconstructed = line;

    // Pad with < characters if too short
    if (reconstructed.length < 44) {
      reconstructed = reconstructed.padEnd(44, "<");
      devLog(
        `🔧 Padded line ${index + 1} from ${line.length} to ${reconstructed.length} chars`
      );
    }

    // Truncate if too long
    if (reconstructed.length > 44) {
      reconstructed = reconstructed.substring(0, 44);
      devLog(
        `✂️ Truncated line ${index + 1} from ${line.length} to ${reconstructed.length} chars`
      );
    }

    return reconstructed;
  });

  const mrzText = reconstructedLines.join("\n");
  devLog("🔧 Final MRZ text prepared for parsing", {
    originalLines: mrzLines,
    reconstructedLines: reconstructedLines,
    finalMrzText: mrzText,
    lineCount: reconstructedLines.length,
  });

  return mrzText;
}

/**
 * Extracts and formats MRZ result from parsed data
 */
function extractMrzResult(parsed: {
  valid: boolean;
  fields?: {
    documentNumber?: string;
    nationality?: string;
    birthDate?: string;
    expirationDate?: string;
    lastName?: string;
  };
  format?: string;
}): MrzResult {
  devLog("📊 MRZ parse result from OCR.space", {
    valid: parsed.valid,
    format: parsed.format,
    hasFields: !!parsed.fields,
  });

  if (!parsed.valid) {
    devLog(
      "⚠️ MRZ validation failed from OCR.space, attempting data extraction anyway",
      {
        valid: parsed.valid,
        hasDocumentNumber: !!parsed.fields?.documentNumber,
        hasFields: !!parsed.fields,
      }
    );

    // Try to extract data even if checksum fails
    const { fields } = parsed;
    if (fields && (fields.documentNumber || fields.lastName)) {
      return createMrzResultFromFields(
        {
          documentNumber: fields.documentNumber || undefined,
          nationality: fields.nationality || undefined,
          birthDate: fields.birthDate || undefined,
          expirationDate: fields.expirationDate || undefined,
          lastName: fields.lastName || undefined,
        },
        false
      );
    }

    devLog("❌ Could not extract any valid data from OCR.space MRZ");
    throw createOcrError(
      "INVALID_CHECKSUM",
      "Could not parse valid passport data from the image. The image may be too blurry or the MRZ may not be fully visible.",
      "Unable to read passport details. Please ensure the image is clear and the bottom section of the passport is fully visible."
    );
  }

  // Valid MRZ parsing
  const { fields } = parsed;
  if (!fields) {
    throw createOcrError(
      "NO_MRZ_DETECTED",
      "No fields found in parsed MRZ",
      "Unable to read passport information."
    );
  }

  return createMrzResultFromFields(
    {
      documentNumber: fields.documentNumber || undefined,
      nationality: fields.nationality || undefined,
      birthDate: fields.birthDate || undefined,
      expirationDate: fields.expirationDate || undefined,
      lastName: fields.lastName || undefined,
    },
    true
  );
}

/**
 * Creates MRZ result from parsed fields
 */
function createMrzResultFromFields(
  fields: {
    documentNumber?: string;
    nationality?: string;
    birthDate?: string;
    expirationDate?: string;
    lastName?: string;
  },
  isValid: boolean
): MrzResult {
  // Parse the raw MRZ dates into proper ISO format
  const birthDateFormatted = parseMrzDate(fields.birthDate || "", "birth");
  const expiryDateFormatted = parseMrzDate(
    fields.expirationDate || "",
    "expiry"
  );

  const mrzResult: MrzResult = {
    passportNumber: fields.documentNumber || "",
    nationality:
      convertNationalityToCountryName(fields.nationality || undefined) || "",
    birthDate: birthDateFormatted || fields.birthDate || "",
    expiryDate: expiryDateFormatted || fields.expirationDate || "",
  };

  const logMessage = isValid
    ? "✅ MRZ parsed successfully from OCR.space"
    : "✅ Extracted partial MRZ data from OCR.space despite validation errors";

  devLog(logMessage, {
    raw: {
      birthDate: fields.birthDate,
      expiryDate: fields.expirationDate,
    },
    formatted: {
      birthDate: birthDateFormatted,
      expiryDate: expiryDateFormatted,
    },
    final: mrzResult,
  });

  return mrzResult;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Returns max file size based on API key tier: demo/free=1MB, PRO=5MB
 * Get your API key at https://ocr.space/OCRAPI
 */
function getMaxFileSizeForApiKey(apiKey: string): number {
  // Demo/free tier: 1MB limit
  if (apiKey === "helloworld" || !apiKey || apiKey.length < 10) {
    return 1 * 1024 * 1024; // 1 MB
  }

  // Custom API keys: assume PRO tier (5MB)
  return 5 * 1024 * 1024; // 5 MB
}

/**
 * Returns file size error message with upgrade guidance
 */
function getFileSizeErrorMessage(
  currentSize: number,
  maxSize: number,
  apiKey: string
): string {
  const currentSizeMB = (currentSize / 1024 / 1024).toFixed(1);
  const maxSizeMB = (maxSize / 1024 / 1024).toFixed(0);

  // hello world is the default api key for the demo tier
  // eslint-disable-next-line security/detect-possible-timing-attacks
  if (apiKey === "helloworld") {
    return `File too large (${currentSizeMB}MB). Demo key supports up to ${maxSizeMB}MB. Get a free API key at ocr.space for 25,000 requests/month.`;
  }

  if (maxSize <= 1024 * 1024) {
    // 1MB = Free tier
    return `File too large (${currentSizeMB}MB). Free tier supports up to ${maxSizeMB}MB for images/PDFs. Upgrade to PRO ($30/month) for 5MB files.`;
  }

  if (maxSize <= 5 * 1024 * 1024) {
    // 5MB = PRO tier
    return `File too large (${currentSizeMB}MB). PRO tier supports up to ${maxSizeMB}MB. Upgrade to PRO PDF ($60/month) for 100MB+ PDFs.`;
  }

  return `File too large (${currentSizeMB}MB). Maximum supported size is ${maxSizeMB}MB.`;
}

/**
 * Parses MRZ date format (YYMMDD) to ISO date string
 *
 * MRZ date century logic:
 * - Birth dates: 00-29 = 2000-2029, 30-99 = 1930-1999
 * - Expiry dates: 00-99 = 2000-2099 (always future)
 *
 * @param mrzDate - Date in YYMMDD format (e.g., "900801", "330114")
 * @param dateType - Type of date for century calculation
 * @returns ISO date string (YYYY-MM-DD) or empty string if invalid
 */
function parseMrzDate(mrzDate: string, type: "birth" | "expiry"): string {
  if (!mrzDate || mrzDate.length !== 6) {
    devLog("⚠️ Invalid MRZ date format", { mrzDate, expectedLength: 6 });
    return "";
  }

  const year = parseInt(mrzDate.substring(0, 2), 10);
  const month = parseInt(mrzDate.substring(2, 4), 10);
  const day = parseInt(mrzDate.substring(4, 6), 10);

  let fullYear: number;
  if (type === "birth") {
    fullYear = year <= 29 ? 2000 + year : 1900 + year;
  } else {
    fullYear = 2000 + year;
  }

  try {
    const dateString = `${fullYear}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const parsedDate = parse(dateString, "yyyy-MM-dd", new Date());

    if (!isValid(parsedDate)) {
      devLog("⚠️ Invalid date components", { mrzDate, fullYear, month, day });
      return "";
    }

    const isoDate = format(parsedDate, "yyyy-MM-dd");
    devLog("✅ MRZ date parsed successfully", {
      mrzDate,
      dateType: type,
      fullYear,
      month,
      day,
      isoDate,
    });

    return isoDate;
  } catch (error) {
    devLog("❌ Error parsing MRZ date", { mrzDate, dateType: type, error });
    return "";
  }
}

/**
 * Extracts passport information from the OCR text for TD3 reconstruction
 */
function extractPassportInfoFromText(text: string) {
  let passportNumber = "";
  let nationality = "";
  let surname = "";
  let givenName = "";

  // Extract passport number (usually follows "Passport No." or similar)
  const passportMatch = text.match(/(?:Passport\s+No\.?\s*|ZZ)(\w+)/i);
  if (passportMatch) {
    passportNumber = passportMatch[1];
  }

  // Extract nationality (look for country codes like JPN, JAPAN)
  const nationalityMatch = text.match(
    /\b(JPN|JAPAN|USA|GBR|DEU|FRA|ITA|ESP|CAN|AUS)\b/
  );
  if (nationalityMatch) {
    nationality = nationalityMatch[1].substring(0, 3); // Ensure 3 chars
  }

  // Extract surname (usually after "Surname" label)
  const surnameMatch = text.match(/Surname[:\s]*([A-Z]+)/i);
  if (surnameMatch) {
    surname = surnameMatch[1];
  }

  // Extract given name (usually after "Given name" label)
  const givenNameMatch = text.match(/Given\s+name[:\s]*([A-Z]+)/i);
  if (givenNameMatch) {
    givenName = givenNameMatch[1];
  }

  devLog("📊 Extracted passport info from OCR text", {
    passportNumber,
    nationality,
    surname,
    givenName,
  });

  return {
    passportNumber,
    nationality,
    surname,
    givenName,
  };
}

/**
 * Constructs a proper TD3 first line from passport information
 */
function constructTD3FirstLine(passportInfo: {
  nationality?: string;
  surname?: string;
  givenName?: string;
}) {
  const { nationality, surname, givenName } = passportInfo;

  if (!nationality || !surname) {
    devLog("⚠️ Insufficient data to construct TD3 first line", passportInfo);
    return null;
  }

  // TD3 Format: P<ISOSUR<<GIV<NAMES<<<<<<<<<<<<<<<<<<<<<<<<<
  // P< + ISO country (3) + surname + << + given names + padding to 44 chars
  let firstLine = `P<${nationality}${surname}<<${givenName || ""}`;

  // Pad or truncate to exactly 44 characters
  if (firstLine.length > 44) {
    firstLine = firstLine.substring(0, 44);
  } else {
    firstLine = firstLine.padEnd(44, "<");
  }

  devLog("🏗️ Constructed TD3 first line", {
    input: passportInfo,
    output: firstLine,
    length: firstLine.length,
  });

  return firstLine;
}

// ==========================================
// ERROR HANDLING FUNCTIONS
// ==========================================

/**
 * Handles various OCR processing errors
 */
function handleOcrError(
  error: unknown,
  timeout: number,
  signal?: AbortSignal
): never {
  devLog("💥 OCR.space processing failed", error);

  if (
    signal?.aborted ||
    (error instanceof Error && error.name === "AbortError")
  ) {
    devLog("🛑 Operation was cancelled");
    throw createOcrError(
      "TIMEOUT",
      "Operation cancelled",
      "Upload was cancelled."
    );
  }

  if (error instanceof Error && error.message === "Timeout") {
    devLog("⏰ OCR.space timeout occurred", { timeout });
    throw createOcrError(
      "TIMEOUT",
      `OCR timeout after ${timeout}ms`,
      "Processing took too long. Please try again."
    );
  }

  // Re-throw OCR errors as-is
  if (error && typeof error === "object" && "code" in error) {
    throw error;
  }

  devLog("❌ Unknown OCR.space error", {
    errorType: typeof error,
    errorMessage: error instanceof Error ? error.message : "Unknown error",
    errorName: error instanceof Error ? error.name : undefined,
  });

  throw createOcrError(
    "PROCESSING_FAILED",
    error instanceof Error ? error.message : "Unknown error occurred",
    "Something went wrong. Please try again."
  );
}

/**
 * Handles OCR API error responses with specific status codes and upgrade guidance
 */
async function handleOcrApiError(
  response: Response,
  apiKey: string,
  maxFileSize: number
): Promise<never> {
  const errorText = await response
    .text()
    .catch(() => "Unable to read error response");
  devLog("❌ OCR.space API request failed", {
    status: response.status,
    statusText: response.statusText,
    errorText: errorText.substring(0, 200),
  });

  // Map specific HTTP status codes to user-friendly errors with cost guidance
  switch (response.status) {
    case 401:
      throw createOcrError(
        "PROCESSING_FAILED",
        "Invalid API key. Get a free API key at ocr.space for 25,000 requests/month.",
        "Service temporarily unavailable. Please try again later."
      );
    case 413: {
      // File too large - provide tier-specific upgrade guidance
      let upgradeMessage: string;
      // eslint-disable-next-line security/detect-possible-timing-attacks
      if (apiKey === "helloworld") {
        upgradeMessage =
          "File too large for demo key. Get a free API key for 1MB limit, or PRO key ($30/month) for 5MB limit.";
      } else if (maxFileSize <= 1024 * 1024) {
        upgradeMessage =
          "File too large for free tier. Upgrade to PRO ($30/month) for 5MB files.";
      } else {
        upgradeMessage =
          "File too large for PRO tier. Upgrade to PRO PDF ($60/month) for 100MB+ PDFs.";
      }
      throw createOcrError(
        "PROCESSING_FAILED",
        upgradeMessage,
        "File is too large. Please use a smaller file."
      );
    }
    case 429: {
      // Rate limit exceeded - provide upgrade guidance

      const rateLimitMessage =
        apiKey === "helloworld"
          ? "Rate limit exceeded for demo key. Get a free API key for 25,000 requests/month."
          : "Rate limit exceeded. Upgrade to PRO ($30/month) for 300,000 requests/month.";
      throw createOcrError(
        "PROCESSING_FAILED",
        rateLimitMessage,
        "Service is busy. Please wait a moment and try again."
      );
    }
    case 500:
    case 502:
    case 503:
      throw createOcrError(
        "PROCESSING_FAILED",
        "OCR service temporarily unavailable. PRO tier has 100% uptime SLA.",
        "Service temporarily unavailable. Please try again in a few moments."
      );
    default:
      throw createOcrError(
        "PROCESSING_FAILED",
        `OCR.space API error: ${response.statusText}`,
        "Processing failed. Please try again."
      );
  }
}

/**
 * Creates a standardized OCR error object with user-friendly messages
 */
function createOcrError(
  code: OcrError["code"],
  technicalMessage: string,
  userFriendlyMessage?: string
): OcrError {
  // Default user-friendly messages based on error code
  const defaultUserMessages: Record<OcrError["code"], string> = {
    NO_MRZ_DETECTED:
      "Unable to read passport information. Please ensure the passport is clearly visible and try again.",
    IMAGE_TOO_BLURRY:
      "Image quality is too low. Please take a clearer photo and try again.",
    INVALID_CHECKSUM:
      "Unable to verify passport details. Please check the image quality and try again.",
    PROCESSING_FAILED:
      "Image processing failed. Please try again with a different image.",
    TIMEOUT: "Processing took too long. Please try again.",
  };

  const userMessage =
    userFriendlyMessage ||
    // eslint-disable-next-line security/detect-object-injection
    (code in defaultUserMessages ? defaultUserMessages[code] : undefined) ||
    technicalMessage;

  const error = { code, message: userMessage };

  // Keep detailed technical info in devLog for debugging
  devLog("🚨 OCR error details", {
    code,
    userMessage,
    technicalMessage,
    errorObject: error,
  });

  return error;
}
