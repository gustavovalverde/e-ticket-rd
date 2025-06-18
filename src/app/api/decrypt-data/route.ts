import { createDecipheriv, pbkdf2Sync } from "crypto";

import { NextResponse, type NextRequest } from "next/server";

import type { ApplicationData } from "@/lib/schemas/forms";

// Server secret key - must match the encryption endpoint
const SERVER_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;

interface DecryptionRequest {
  encryptedData: string;
  iv: string;
  salt: string;
  authTag: string;
  flightNumber: string;
  passportNumber: string;
}

interface DecryptedData {
  formData: ApplicationData;
  exportedAt: string;
  exportVersion: string;
}

function deriveKey(
  userInputsCombined: string,
  salt: Buffer,
  serverSecretKey: string,
  iterations = 100000,
  keylen = 32,
  digest = "sha512"
): Buffer {
  const combinedSecret = Buffer.from(
    userInputsCombined + serverSecretKey,
    "utf8"
  );
  return pbkdf2Sync(combinedSecret, salt, iterations, keylen, digest);
}

function decrypt(
  encryptedDataObj: {
    encryptedData: string;
    iv: string;
    authTag: string;
  },
  key: Buffer
): string {
  const iv = Buffer.from(encryptedDataObj.iv, "hex");
  const authTag = Buffer.from(encryptedDataObj.authTag, "hex");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(
    encryptedDataObj.encryptedData,
    "hex",
    "utf8"
  );
  decrypted += decipher.final("utf8");

  return decrypted;
}

export async function POST(request: NextRequest) {
  try {
    // Check if server secret key is available
    if (!SERVER_SECRET_KEY) {
      return NextResponse.json(
        {
          error: "Server configuration error: encryption key not available",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as DecryptionRequest;
    const { encryptedData, iv, salt, authTag, flightNumber, passportNumber } =
      body;

    // Validate required inputs
    if (
      !encryptedData ||
      !iv ||
      !salt ||
      !authTag ||
      !flightNumber ||
      !passportNumber
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required data: all encryption fields, flightNumber, and passportNumber are required",
        },
        { status: 400 }
      );
    }

    // Normalize user inputs
    const normalizedFlight = flightNumber.trim().toUpperCase();
    const normalizedPassport = passportNumber.trim().toUpperCase();
    const userInputsCombined = normalizedFlight + normalizedPassport;

    // Re-derive the decryption key
    const saltBuffer = Buffer.from(salt, "hex");
    const decryptionKey = deriveKey(
      userInputsCombined,
      saltBuffer,
      SERVER_SECRET_KEY
    );

    // Attempt to decrypt
    try {
      const decryptedString = decrypt(
        {
          encryptedData,
          iv,
          authTag,
        },
        decryptionKey
      );

      // Parse the decrypted data
      const decryptedData: DecryptedData = JSON.parse(decryptedString);

      // Validate the decrypted data structure
      if (!decryptedData.formData || !decryptedData.exportedAt) {
        return NextResponse.json(
          { error: "Invalid or corrupted data format" },
          { status: 400 }
        );
      }

      // Additional validation: check if the decrypted data matches the provided keys
      const leadTraveler = decryptedData.formData.travelers?.[0];
      if (!leadTraveler) {
        return NextResponse.json(
          { error: "No traveler data found in decrypted form" },
          { status: 400 }
        );
      }

      const decryptedFlight = decryptedData.formData.flightInfo?.flightNumber
        ?.trim()
        .toUpperCase();
      const decryptedPassport = leadTraveler.personalInfo?.passport?.number
        ?.trim()
        .toUpperCase();

      if (
        decryptedFlight !== normalizedFlight ||
        decryptedPassport !== normalizedPassport
      ) {
        return NextResponse.json(
          { error: "Invalid flight number or passport number" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          formData: decryptedData.formData,
          exportedAt: decryptedData.exportedAt,
          exportVersion: decryptedData.exportVersion || "1.0.0",
        },
      });
    } catch (decryptError) {
      // This could be due to wrong key (incorrect flight/passport) or corrupted data
      // eslint-disable-next-line no-console
      console.error("Decryption failed:", decryptError);
      return NextResponse.json(
        { error: "Invalid flight number, passport number, or corrupted file" },
        { status: 400 }
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error decrypting data:", error);
    return NextResponse.json(
      {
        error: "Failed to decrypt data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to decrypt data." },
    { status: 405 }
  );
}
