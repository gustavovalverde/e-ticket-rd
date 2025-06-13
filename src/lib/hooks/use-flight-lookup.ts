import { useState } from "react";
import useSWR from "swr";

import { normalizeFlightNumber } from "@/lib/schemas/validation";

import type { FlightLookupResult } from "@/lib/types/flight";

const fetcher = async (url: string): Promise<FlightLookupResult> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

export function useFlightLookup() {
  const [searchKey, setSearchKey] = useState<string | null>(null);

  const { data, error, isLoading, mutate } = useSWR(searchKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000, // 5 seconds to avoid API rate limiting
    errorRetryCount: 1,
  });

  const lookupFlight = async (flightNumber: string, forceRefresh = false) => {
    if (!flightNumber || !flightNumber.trim()) {
      setSearchKey(null);
      return;
    }

    // Normalize the flight number for consistent API calls
    const normalizedFlightNumber = normalizeFlightNumber(flightNumber);
    const key = `/api/flight-lookup?flightNumber=${encodeURIComponent(normalizedFlightNumber)}`;

    if (forceRefresh) {
      mutate(undefined, { revalidate: false });
    }

    setSearchKey(key);

    if (forceRefresh) {
      mutate();
    }
  };

  const reset = () => {
    setSearchKey(null);
    mutate(undefined, { revalidate: false });
  };

  return {
    result: data || null,
    error: error?.message || null,
    isLoading,
    lookupFlight,
    reset,
  };
}
