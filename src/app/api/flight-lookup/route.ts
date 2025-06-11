import { NextResponse, type NextRequest } from "next/server";

const FLIGHTRADAR24_CONFIG = {
  baseUrl: "https://fr24api.flightradar24.com",
  apiKey: process.env.FLIGHTRADAR24_API_KEY,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const flightNumber = searchParams.get("flightNumber");

    if (!flightNumber || !flightNumber.trim()) {
      return NextResponse.json(
        { success: false, error: "Flight number is required" },
        { status: 400 }
      );
    }

    const cleanFlightNumber = flightNumber.trim().toUpperCase();

    if (!FLIGHTRADAR24_CONFIG.apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Service temporarily unavailable",
        },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      flights: cleanFlightNumber,
    });

    const apiUrl = `${FLIGHTRADAR24_CONFIG.baseUrl}/api/live/flight-positions/full?${params.toString()}`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${FLIGHTRADAR24_CONFIG.apiKey}`,
        "Content-Type": "application/json",
        "Accept-Version": "v1",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      let userMessage = "Service temporarily unavailable";

      if (response.status === 401) {
        userMessage = "Authentication failed";
      } else if (response.status === 403) {
        userMessage = "Access denied";
      } else if (response.status === 429) {
        userMessage = "Too many requests. Please wait a moment and try again.";
      }

      return NextResponse.json(
        { success: false, error: userMessage },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data?.data?.length > 0) {
      const flight = data.data[0];

      return NextResponse.json({
        success: true,
        flight: {
          flightNumber: flight.flight || cleanFlightNumber,
          airline: flight.painted_as || "Unknown Airline",
          aircraft: flight.type || "Unknown",
          origin: {
            iata: flight.orig_iata || "",
            icao: flight.orig_icao || "",
          },
          destination: {
            iata: flight.dest_iata || "",
            icao: flight.dest_icao || "",
          },
          estimatedArrival: flight.eta || "",
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: "No flight found for this number",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
