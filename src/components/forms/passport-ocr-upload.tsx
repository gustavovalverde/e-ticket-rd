"use client";

import { AlertCircle, Camera, CheckCircle, Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileInput } from "@/components/ui/file-input";
import { Progress } from "@/components/ui/progress";

interface PassportOcrUploadProps {
  onFileSelect: (file: File | null) => void;
  isProcessing: boolean;
  error?: { message: string } | null;
  result?: object | null;
  status: "idle" | "processing" | "success" | "error";
}

/**
 * Passport OCR Upload Component
 * Handles file upload UI and status display for passport scanning
 */
export function PassportOcrUpload({
  onFileSelect,
  isProcessing,
  error,
  result,
  status,
}: PassportOcrUploadProps) {
  return (
    <div className="w-full space-y-3 pt-4">
      <FileInput
        accept="image/*,application/pdf"
        placeholder="Upload passport image or PDF to auto-fill information"
        onFileChange={onFileSelect}
        disabled={isProcessing}
      />

      {isProcessing && (
        <div className="bg-muted rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Camera className="text-primary h-4 w-4" />
            <span className="text-foreground text-sm font-medium">
              Processing passport document...
            </span>
          </div>
          <Progress value={status === "success" ? 100 : 60} className="h-2" />
        </div>
      )}

      {error && status === "error" && (
        <>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>OCR failed:</strong> {error.message}
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

      {result && status === "success" && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Success!</strong> Passport data extracted and auto-filled.
          </AlertDescription>
        </Alert>
      )}

      <div className="text-muted-foreground max-w-full pt-2 text-sm">
        <strong>Tips for best results:</strong> Ensure the passport is well-lit,
        flat, and the machine-readable zone (bottom lines) is clearly visible.
        PDFs work great for scanned passports.
      </div>
    </div>
  );
}
