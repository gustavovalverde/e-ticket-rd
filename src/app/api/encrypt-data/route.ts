import { createCipheriv, randomBytes, pbkdf2Sync } from "crypto";

import { NextResponse, type NextRequest } from "next/server";

import type { ApplicationData } from "@/lib/schemas/forms";

// Server secret key - must match the decryption endpoint
const SERVER_SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;

interface EncryptionRequest {
  formData: ApplicationData;
  flightNumber: string;
  passportNumber: string;
}

interface EncryptionResponse {
  encryptedData: string;
  iv: string;
  salt: string;
  authTag: string;
  timestamp: string;
  version: string;
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

function encrypt(
  data: string,
  key: Buffer
): {
  encryptedData: string;
  iv: string;
  authTag: string;
} {
  const iv = randomBytes(16); // 16 bytes for AES-256 GCM IV
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
  };
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

    const body = (await request.json()) as EncryptionRequest;
    const { formData, flightNumber, passportNumber } = body;

    // Validate required inputs
    if (!formData || !flightNumber || !passportNumber) {
      return NextResponse.json(
        {
          error:
            "Missing required data: formData, flightNumber, and passportNumber are required",
        },
        { status: 400 }
      );
    }

    // Validate that the flight number and passport match the form data
    const leadTraveler = formData.travelers?.[0];
    if (!leadTraveler) {
      return NextResponse.json(
        { error: "No traveler data found in form" },
        { status: 400 }
      );
    }

    // Normalize inputs for comparison
    const normalizedFormFlight = formData.flightInfo?.flightNumber
      ?.trim()
      .toUpperCase();
    const normalizedInputFlight = flightNumber.trim().toUpperCase();
    const normalizedFormPassport = leadTraveler.personalInfo?.passport?.number
      ?.trim()
      .toUpperCase();
    const normalizedInputPassport = passportNumber.trim().toUpperCase();

    if (normalizedFormFlight !== normalizedInputFlight) {
      return NextResponse.json(
        { error: "Flight number does not match the form data" },
        { status: 400 }
      );
    }

    if (normalizedFormPassport !== normalizedInputPassport) {
      return NextResponse.json(
        { error: "Passport number does not match the form data" },
        { status: 400 }
      );
    }

    // Create data to encrypt
    const dataToEncrypt = JSON.stringify({
      formData,
      exportedAt: new Date().toISOString(),
      exportVersion: "1.0.0",
    });

    // Generate salt
    const salt = randomBytes(16);

    // Combine user inputs
    const userInputsCombined = normalizedInputFlight + normalizedInputPassport;

    // Derive encryption key
    const encryptionKey = deriveKey(
      userInputsCombined,
      salt,
      SERVER_SECRET_KEY
    );

    // Encrypt data
    const encryptionResult = encrypt(dataToEncrypt, encryptionKey);

    // Prepare response
    const response: EncryptionResponse = {
      encryptedData: encryptionResult.encryptedData,
      iv: encryptionResult.iv,
      salt: salt.toString("hex"),
      authTag: encryptionResult.authTag,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error encrypting data:", error);
    return NextResponse.json(
      {
        error: "Failed to encrypt data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to encrypt data." },
    { status: 405 }
  );
}
