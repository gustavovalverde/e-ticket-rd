/**
 * Application utilities for e-ticket system
 * Includes UUID generation, application formatting, and QR code utilities
 */

/**
 * Generate a unique application UUID
 * Uses crypto.randomUUID() for secure UUID generation
 */
export function generateApplicationUUID(): string {
  // Use browser's crypto API for secure UUID generation
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for environments without crypto.randomUUID()
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a deterministic UUID based on application data
 * This ensures the same data always generates the same UUID
 */
export function createApplicationUUID(
  applicationCode: string,
  timestamp?: string
): string {
  const baseString = `${applicationCode}-${timestamp || Date.now()}`;

  // Simple hash function to create deterministic UUID
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert hash to UUID format
  const hashStr = Math.abs(hash).toString(16).padStart(8, "0");
  return `${hashStr.slice(0, 8)}-${hashStr.slice(0, 4)}-4${hashStr.slice(1, 4)}-8${hashStr.slice(4, 7)}-${hashStr.slice(0, 12)}`;
}

/**
 * Format application code for display
 */
export function formatApplicationCode(code: string): string {
  return code.toUpperCase();
}

// ===== QR CODE UTILITIES =====

/**
 * Generate QR code as PNG blob for PDF inclusion
 * This function can be used when generating PDFs that include QR codes
 */
export async function generateQRCodePNG(
  applicationId: string,
  size: number = 200
): Promise<Blob | null> {
  try {
    // Create a canvas with the QR code and return as blob
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Get the QR code SVG element
    const qrElement = document.querySelector("#qr-code-svg") as SVGElement;
    if (!qrElement || !ctx) return null;

    const svgData = new XMLSerializer().serializeToString(qrElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(svgUrl);
          resolve(blob);
        }, "image/png");
      };
      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        resolve(null);
      };
      img.src = svgUrl;
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating QR code PNG:", error);
    return null;
  }
}

/**
 * Download QR code as PNG file
 * This function can be used for standalone QR code downloads if needed
 */
export async function downloadQRCode(
  applicationId: string,
  size: number = 200
): Promise<void> {
  try {
    const blob = await generateQRCodePNG(applicationId, size);
    if (!blob) {
      throw new Error("Failed to generate QR code");
    }

    // Create download link
    const link = document.createElement("a");
    link.download = `eticket-qr-${applicationId}.png`;
    link.href = URL.createObjectURL(blob);
    link.click();

    // Clean up
    URL.revokeObjectURL(link.href);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error downloading QR code:", error);
  }
}

/**
 * Get QR code as data URL for embedding in PDFs
 * This function returns a data URL that can be directly embedded in PDF generation
 */
export async function getQRCodeDataURL(
  applicationId: string,
  size: number = 200
): Promise<string | null> {
  try {
    const blob = await generateQRCodePNG(applicationId, size);
    if (!blob) return null;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting QR code data URL:", error);
    return null;
  }
}
