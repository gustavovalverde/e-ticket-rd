"use client";

import { AlertCircle, CheckCircle, Cpu, Info } from "lucide-react";
import { useEffect } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileInput } from "@/components/ui/file-input";
import { Progress } from "@/components/ui/progress";
import { usePassportOcr } from "@/lib/hooks/use-passport-ocr";

import type { MrzResult } from "@/lib/types/passport";

interface PassportOcrUploadProps {
  onSuccess: (result: MrzResult) => void;
}

/**
 * Passport OCR Upload Component - Client-side Tesseract.js processing
 *
 * Provides interface for uploading and processing passport images using
 * client-side Tesseract.js OCR. Fully offline processing.
 *
 * @param onSuccess Callback executed when OCR successfully extracts passport data
 *
 * @example
 * ```tsx
 * <PassportOcrUpload onSuccess={handleOcrSuccess} />
 * ```
 */
export function PassportOcrUpload({ onSuccess }: PassportOcrUploadProps) {
  const { processImage, status, isProcessing, result, error, progress } =
    usePassportOcr();

  useEffect(() => {
    if (status === "success" && result) {
      onSuccess(result);
    }
  }, [status, result, onSuccess]);

  /**
   * Get user-friendly status text from progress
   */
  const getProgressText = () => {
    switch (progress.status) {
      case "loading":
        return "Initializing scanner...";
      case "preprocessing":
        return "Analyzing passport image...";
      case "recognizing":
        return "Reading passport data...";
      case "parsing":
        return "Validating information...";
      case "complete":
        return "Processing complete!";
      default:
        return "Processing passport document...";
    }
  };

  return (
    <div className="w-full space-y-3">
      <FileInput
        accept="image/png, image/jpeg, image/webp"
        placeholder="Upload passport image (processed on device)"
        onFileChange={(file) => file && processImage(file)}
        disabled={isProcessing}
      />

      {isProcessing && (
        <div className="bg-muted rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Cpu className="text-primary h-4 w-4 animate-pulse" />
            <span className="text-foreground text-sm font-medium">
              {getProgressText()}
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
        </div>
      )}

      {error && status === "error" && (
        <>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Local Scan Failed:</strong> {error}
            </AlertDescription>
          </Alert>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>No problem!</strong> You can manually enter your passport
              information in the fields below. This is just as secure and
              reliable as scanning.
            </AlertDescription>
          </Alert>
        </>
      )}

      {status === "success" && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Success!</strong> Passport data auto-filled from local
            processing.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-muted-foreground max-w-full pt-2 text-sm">
        <strong>Tips for best results:</strong> Ensure the passport is well-lit,
        flat, and the machine-readable zone (bottom lines) is clearly visible.
        Works entirely on your device - no data is sent to servers.
      </div>
    </div>
  );
}
