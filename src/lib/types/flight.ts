export interface FlightRadar24Response {
  data: FlightData[];
}

export interface FlightData {
  fr24_id: string;
  flight: string;
  callsign: string;
  lat: number;
  lon: number;
  track: number;
  alt: number;
  gspeed: number;
  vspeed: number;
  squawk: string;
  timestamp: string;
  source: string;
  hex: string;
  type: string;
  reg: string;
  painted_as: string;
  operating_as: string;
  orig_iata: string;
  orig_icao: string;
  dest_iata: string;
  dest_icao: string;
  eta: string;
}

export interface FlightLookupResult {
  success: boolean;
  flight?: {
    flightNumber: string;
    airline: string;
    aircraft: string;
    origin: {
      iata: string;
      icao: string;
    };
    destination: {
      iata: string;
      icao: string;
    };
    estimatedArrival: string;
  };
  error?: string;
}

export interface AirlineInfo {
  name: string;
  iata: string;
  icao: string;
}
