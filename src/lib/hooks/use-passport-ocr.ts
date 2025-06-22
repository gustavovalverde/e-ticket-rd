"use client";

import { useState, useCallback, useMemo, useTransition } from "react";

import { devLog } from "@/lib/utils";

import type { MrzResult } from "@/lib/types/passport";

/**
 * OCR processing progress information
 */
type OcrProgress = {
  status:
    | "idle"
    | "loading"
    | "preprocessing"
    | "recognizing"
    | "parsing"
    | "complete";
  percentage: number;
};

/**
 * OCR processing status states
 */
type TesseractOcrStatus =
  | "idle"
  | "loading"
  | "processing"
  | "success"
  | "error";

/**
 * Return type for usePassportOcr hook
 */
interface UsePassportOcrReturn {
  processImage: (file: File) => void;
  status: TesseractOcrStatus;
  isProcessing: boolean;
  result: MrzResult | null;
  error: string | null;
  progress: OcrProgress;
  reset: () => void;
}

/**
 * Custom hook for passport OCR processing using Tesseract.js
 *
 * Provides a complete interface for processing passport images locally
 * using Tesseract.js OCR engine. Handles loading, processing, error states,
 * and progress updates.
 *
 * @returns Object containing OCR processing functions and state
 *
 * @example
 * ```tsx
 * function PassportUpload() {
 *   const { processImage, status, result, error, progress } = usePassportOcr();
 *
 *   const handleFileChange = (file: File) => {
 *     processImage(file);
 *   };
 *
 *   return (
 *     <div>
 *       <input type="file" accept="image/*" onChange={handleFileChange} />
 *       {status === 'processing' && <Progress value={progress.percentage} />}
 *       {result && <div>Passport: {result.passportNumber}</div>}
 *       {error && <div>Error: {error}</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePassportOcr(): UsePassportOcrReturn {
  const [status, setStatus] = useState<TesseractOcrStatus>("idle");
  const [result, setResult] = useState<MrzResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<OcrProgress>({
    status: "idle",
    percentage: 0,
  });

  const [isPending, startTransition] = useTransition();

  const processImage = useCallback((file: File) => {
    if (!file) return;

    devLog("🚀 Starting passport OCR processing", { fileName: file.name });

    startTransition(async () => {
      setStatus("loading");
      setError(null);
      setResult(null);
      setProgress({ status: "loading", percentage: 5 });

      let imageUrl: string | null = null;

      try {
        imageUrl = URL.createObjectURL(file);

        const { processPassport } = await import("../utils/passport-ocr");

        setStatus("processing");

        const mrzResult = await processPassport(
          imageUrl,
          (progressUpdate: OcrProgress) => setProgress(progressUpdate)
        );

        devLog("✅ OCR processing completed successfully");

        setResult(mrzResult);
        setStatus("success");
        setProgress({ status: "complete", percentage: 100 });
      } catch (err) {
        devLog("❌ OCR processing failed", err);

        let errorMessage = "Processing failed. Please try a clearer image.";
        if (err && typeof err === "object" && "message" in err) {
          errorMessage = (err as { message: string }).message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }

        setError(errorMessage);
        setStatus("error");
        setProgress({ status: "idle", percentage: 0 });
      } finally {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      }
    });
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
    setProgress({ status: "idle", percentage: 0 });
  }, []);

  const isProcessing = useMemo(() => {
    return status === "loading" || status === "processing" || isPending;
  }, [status, isPending]);

  return useMemo(
    () => ({
      processImage,
      status,
      isProcessing,
      result,
      error,
      progress,
      reset,
    }),
    [processImage, status, isProcessing, result, error, progress, reset]
  );
}
