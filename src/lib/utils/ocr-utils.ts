import type { MrzResult, OcrError } from "@/lib/types/passport";

// Constants
const OPERATION_CANCELLED = "Operation cancelled";

/**
 * Creates a standardized OCR error object.
 */
const createOcrError = (code: OcrError["code"], message: string): OcrError => ({
  code,
  message,
});

/**
 * Crops image to focus on the MRZ region (bottom 25% of passport).
 */
const cropToMrzRegion = (file: File): Promise<HTMLCanvasElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context not available"));

        const cropHeight = Math.floor(img.height * 0.25);
        canvas.width = img.width;
        canvas.height = cropHeight;
        ctx.drawImage(
          img,
          0,
          img.height - cropHeight,
          img.width,
          cropHeight,
          0,
          0,
          img.width,
          cropHeight
        );
        resolve(canvas);
      } catch (error) {
        reject(
          new Error(
            `Failed to crop image: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });

/**
 * Parses OCR text and extracts MRZ data using the mrz library.
 */
const parseMrzText = async (text: string): Promise<MrzResult> => {
  const { parse } = await import("mrz");
  const lines = text
    .replace(/[^A-Z0-9<\n]/g, "")
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) throw new Error("Insufficient MRZ lines detected");

  const result = parse(lines.slice(-2).join("\n"), { autocorrect: true });
  if (!result.valid) {
    const errors =
      result.details
        ?.filter((d) => !d.valid)
        .map((d) => d.error)
        .join(", ") || "Invalid checksum";
    throw new Error(`MRZ validation failed: ${errors}`);
  }

  const { fields } = result;
  return {
    passportNumber: fields.documentNumber || "",
    nationality: fields.nationality || "",
    birthDate: fields.birthDate || "",
    expiryDate: fields.expirationDate || "",
  };
};

/**
 * Performs OCR on canvas using Tesseract.js with optimized settings.
 */
const performOcr = async (
  canvas: HTMLCanvasElement,
  signal?: AbortSignal
): Promise<string> => {
  const { createWorker, PSM } = await import("tesseract.js");
  if (signal?.aborted) throw new Error(OPERATION_CANCELLED);

  const worker = await createWorker("ocrb_fast", 1, {
    langPath: "https://tessdata.projectnaptha.com/4.0.0_fast/",
  });
  try {
    await worker.setParameters({
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<",
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    });
    if (signal?.aborted) throw new Error(OPERATION_CANCELLED);

    const {
      data: { text, confidence },
    } = await worker.recognize(canvas);
    if (confidence < 60)
      throw createOcrError(
        "IMAGE_TOO_BLURRY",
        `OCR confidence too low: ${confidence}%`
      );
    if (!text?.trim())
      throw createOcrError("NO_MRZ_DETECTED", "No text detected in MRZ region");
    return text;
  } finally {
    await worker.terminate();
  }
};

/**
 * Executes the complete OCR pipeline: crop → OCR → parse.
 */
const performOcrPipeline = async (
  file: File,
  signal?: AbortSignal
): Promise<MrzResult> => {
  let canvas: HTMLCanvasElement | null = null;
  try {
    canvas = await cropToMrzRegion(file);
    if (signal?.aborted) throw new Error(OPERATION_CANCELLED);
    const ocrText = await performOcr(canvas, signal);
    if (signal?.aborted) throw new Error(OPERATION_CANCELLED);
    return await parseMrzText(ocrText);
  } finally {
    canvas?.remove();
  }
};

// Helper functions
const validateInput = (file: File, signal?: AbortSignal): void => {
  if (typeof window === "undefined")
    throw createOcrError(
      "PROCESSING_FAILED",
      "OCR processing is only available in browser environment"
    );
  if (signal?.aborted) throw createOcrError("TIMEOUT", OPERATION_CANCELLED);
  if (!file?.type.startsWith("image/"))
    throw createOcrError(
      "PROCESSING_FAILED",
      "Invalid file type. Please provide an image file."
    );
};

const createTimeoutPromise = (
  timeout: number,
  signal?: AbortSignal
): Promise<never> => {
  return new Promise<never>((_, reject) => {
    const timeoutId = setTimeout(
      () =>
        reject(
          createOcrError(
            "TIMEOUT",
            `OCR operation timed out after ${timeout}ms`
          )
        ),
      timeout
    );
    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(createOcrError("TIMEOUT", OPERATION_CANCELLED));
    });
  });
};

const handleOcrError = (error: unknown): never => {
  if (error && typeof error === "object" && "code" in error) throw error;

  if (error instanceof Error) {
    if (
      error.message.includes("checksum") ||
      error.message.includes("validation")
    ) {
      throw createOcrError(
        "INVALID_CHECKSUM",
        "MRZ checksum validation failed"
      );
    }
    if (
      error.message.includes("Insufficient MRZ lines") ||
      error.message.includes("No text detected")
    ) {
      throw createOcrError(
        "NO_MRZ_DETECTED",
        "Could not detect valid MRZ in image"
      );
    }
    if (
      error.message.includes("blurry") ||
      error.message.includes("quality") ||
      error.message.includes("confidence")
    ) {
      throw createOcrError(
        "IMAGE_TOO_BLURRY",
        "Image quality too poor for OCR"
      );
    }
  }

  throw createOcrError(
    "PROCESSING_FAILED",
    error instanceof Error ? error.message : "OCR processing failed"
  );
};

/**
 * Extracts MRZ data from passport image using client-side OCR.
 *
 * Performance: Local processing reduces server load and API costs.
 * Cost Impact: Zero external API calls - uses browser-based Tesseract.js processing.
 * Security: All processing happens client-side, no sensitive data transmitted.
 *
 * @param file - Image file containing passport MRZ
 * @param options - Configuration options
 * @param options.timeout - Operation timeout in milliseconds (default: 15000)
 * @param options.signal - AbortSignal for cancellation
 * @returns Parsed MRZ data including passport number, nationality, birth date, and expiry date
 * @throws {OcrError} When OCR processing fails with specific error codes
 *
 * @example
 * ```typescript
 * const file = new File([imageBlob], 'passport.jpg', { type: 'image/jpeg' });
 * try {
 *   const mrzData = await extractMrzFromImage(file);
 *   console.log(mrzData.passportNumber);
 * } catch (error) {
 *   if (error.code === 'IMAGE_TOO_BLURRY') {
 *     // Handle blurry image - suggest retaking photo
 *   }
 * }
 * ```
 */
export const extractMrzFromImage = async (
  file: File,
  options: { timeout?: number; signal?: AbortSignal } = {}
): Promise<MrzResult> => {
  const { timeout = 15000, signal } = options;

  validateInput(file, signal);
  const timeoutPromise = createTimeoutPromise(timeout, signal);

  try {
    return await Promise.race([
      performOcrPipeline(file, signal),
      timeoutPromise,
    ]);
  } catch (error) {
    return handleOcrError(error);
  }
};

/**
 * Checks if OCR functionality is supported in the current environment.
 *
 * @returns true if browser environment supports OCR operations
 */
export const isOcrSupported = (): boolean =>
  typeof window !== "undefined" && typeof HTMLCanvasElement !== "undefined";
