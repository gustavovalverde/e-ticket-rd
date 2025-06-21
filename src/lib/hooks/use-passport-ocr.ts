"use client";

import { useState, useCallback, useRef, useMemo } from "react";

import { devLog } from "@/lib/utils";
import { extractMrzFromPassport } from "@/lib/utils/passport-ocr-api";

import type { MrzResult, OcrError } from "@/lib/types/passport";

type OcrStatus = "idle" | "processing" | "success" | "error";

/**
 * React hook for passport OCR processing with SWR-style caching
 *
 * State machine: idle → processing → success | error
 * @returns Hook state and processing functions
 */
export function usePassportOcr() {
  const [status, setStatus] = useState<OcrStatus>("idle");
  const [result, setResult] = useState<MrzResult | null>(null);
  const [error, setError] = useState<OcrError | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cache to prevent duplicate API calls for the same image
  const cacheRef = useRef<Map<string, Promise<MrzResult>>>(new Map());

  // Generate cache key from file content
  const generateCacheKey = useCallback(async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }, []);

  const processImage = useCallback(
    async (file: File): Promise<MrzResult> => {
      devLog("🎯 usePassportOcr: Starting image processing", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // Generate cache key for deduplication
      const cacheKey = await generateCacheKey(file);

      // Check if we're already processing this image
      const existingRequest = cacheRef.current.get(cacheKey);
      if (existingRequest) {
        devLog("🔄 Returning cached OCR request for identical image");
        try {
          const cachedResult = await existingRequest;
          setResult(cachedResult);
          setStatus("success");
          return cachedResult;
        } catch {
          // If cached request failed, proceed with new request
          devLog("⚠️ Cached request failed, processing new request");
          cacheRef.current.delete(cacheKey);
        }
      }

      if (abortControllerRef.current) {
        devLog("🛑 Aborting previous passport OCR operation");
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      devLog("🔄 Setting passport OCR state to processing");
      setStatus("processing");
      setError(null);
      setResult(null);

      // Create and cache the processing promise
      const processingPromise = extractMrzFromPassport(file, {
        signal: abortController.signal,
        timeout: 30000,
      });

      // Cache the promise to prevent duplicate requests
      cacheRef.current.set(cacheKey, processingPromise);

      try {
        devLog("📞 Calling passport OCR processing");
        const mrzResult = await processingPromise;

        if (!abortController.signal.aborted) {
          devLog("✅ Passport OCR processing successful", mrzResult);
          devLog("💾 Setting passport OCR success state");
          setResult(mrzResult);
          setStatus("success");
          return mrzResult;
        } else {
          devLog("🛑 Passport OCR operation was cancelled");
          throw new Error("Operation cancelled");
        }
      } catch (err) {
        devLog("❌ Passport OCR processing failed", err);

        // Remove failed request from cache
        cacheRef.current.delete(cacheKey);

        if (!abortController.signal.aborted) {
          const ocrError = err as OcrError;
          devLog("💾 Setting passport OCR error state", ocrError);
          setError(ocrError);
          setStatus("error");
          throw ocrError;
        } else {
          devLog("🛑 Passport OCR error ignored due to cancellation");
          throw new Error("Operation cancelled");
        }
      } finally {
        devLog("🧹 Cleaning up passport OCR abort controller");
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      }
    },
    [generateCacheKey]
  );

  const reset = useCallback(() => {
    devLog("🔄 Resetting passport OCR hook state");

    if (abortControllerRef.current) {
      devLog("🛑 Aborting current passport OCR operation");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Clear cache on reset
    cacheRef.current.clear();

    setStatus("idle");
    setResult(null);
    setError(null);
    devLog("✅ Passport OCR hook state reset complete");
  }, []);

  // Memoize return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      processImage,
      result,
      error,
      status,
      reset,
      isProcessing: status === "processing",
    }),
    [processImage, result, error, status, reset]
  );
}
