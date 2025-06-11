# FlightRadar24 API Integration

This document explains the FlightRadar24 API integration for auto-filling flight information in the Dominican Republic E-Ticket system.

## Overview

The integration allows users to:

- Enter a flight number and automatically retrieve flight details
- Auto-fill airline, aircraft, origin/destination airports, and arrival times
- Reduce manual data entry and improve accuracy
- Server-side API calls for security and performance

## Setup Instructions

### 1. Get FlightRadar24 API Access

1. Visit [FlightRadar24 API Portal](https://fr24api.flightradar24.com/)
2. Create an account or log in with existing credentials
3. Navigate to Key Management section
4. Create an **API key** for production use

### 2. Configure Environment Variables

1. Add your API key to `.env.local`:

   ```bash
   FLIGHTRADAR24_API_KEY=your_actual_api_key_here
   ```

   **Note**: For testing purposes, FlightRadar24 offers a sandbox environment with static data. To use sandbox mode, you would need a sandbox key and modify the API endpoint to include "sandbox" (e.g., `/api/sandbox/live/flight-positions/full`).

### 3. Test the Integration

1. Start the development server:

   ```bash
   pnpm dev
   ```

2. Navigate to `/form`
3. Select "Arriving" or "Departing" travel direction
4. Select "Air Travel" as transport method
5. Choose a travel date (enables flight search)
6. Enter a flight number (e.g., "AA1234")
7. Click "Search" button or press Enter
8. Observe auto-filled flight details or manual entry option

## How It Works

### API Route (`src/app/api/flight-lookup/route.ts`)

The Next.js API route handles:

- **Server-side API calls**: Secure FlightRadar24 API integration using `/api/live/flight-positions/full` endpoint
- **Authentication**: Bearer token authentication with required `Accept-Version: v1` header
- **Error Handling**: User-friendly error messages without exposing internals
- **Data Transformation**: Converts API responses to form-friendly format
- **Rate limiting protection**: Server-side calls prevent client API key exposure
- **Performance**: Typical response times <1 second (per FR24 specifications)

### React Hook (`src/lib/hooks/use-flight-lookup.ts`)

The `useFlightLookup` hook provides:

- **SWR integration**: Caching and request deduplication
- **Loading States**: Shows spinner during API calls
- **Error Handling**: Displays user-friendly error messages
- **Success States**: Shows confirmation when data is found
- **Reset Functionality**: Clears state and cache when needed

### Form Integration (`src/components/forms/travel-info-form.tsx`)

The travel form integration includes:

- **Progressive disclosure**: Flight search enabled after date selection
- **Smart Search Button**: Triggers API lookup on click or Enter key
- **Auto-fill Logic**: Populates form fields with API data
- **Visual Feedback**: Loading, success, and error indicators
- **Clear functionality**: Reset search and return to manual entry

## API Response Handling

### Live Flight Data

The FlightRadar24 API `/api/live/flight-positions/full` endpoint returns real-time flight data when queried with the `flights` parameter:

**Request**: `GET /api/live/flight-positions/full?flights=AA1234`

**Response**:

```json
{
  "data": [
    {
      "fr24_id": "333ca4a2",
      "flight": "AA1234",
      "callsign": "AAL1234",
      "orig_iata": "MIA",
      "orig_icao": "KMIA",
      "dest_iata": "SDQ",
      "dest_icao": "MDSD",
      "painted_as": "American Airlines",
      "type": "A320",
      "eta": "2024-03-15T14:47:28Z"
    }
  ]
}
```

### Form Field Mapping

API data is mapped to form fields as follows:

| API Field    | Form Field                    | Description            |
| ------------ | ----------------------------- | ---------------------- |
| `painted_as` | `flightInfo.airline`          | Airline name           |
| `type`       | `flightInfo.aircraft`         | Aircraft type          |
| `orig_iata`  | `flightInfo.departurePort`    | Departure airport code |
| `dest_iata`  | `flightInfo.arrivalPort`      | Arrival airport code   |
| `eta`        | `flightInfo.estimatedArrival` | Estimated arrival time |

## User Experience

### Before Integration

- Users manually entered all flight details
- High chance of errors and typos
- Time-consuming data entry
- No validation of flight information

### After Integration

- **Progressive disclosure**: Travel date → flight search enabled
- **Smart search**: Enter flight number → click search → details auto-filled
- **Flexible fallback**: Flight not found → manual entry available
- **Real-time feedback**: Loading, success, and error states
- **Clear functionality**: Reset search to try different flight
- Reduced data entry by ~60% for successful lookups

## Production Considerations

### Current Setup

The system is already configured for production use:

1. Server-side API calls protect the API key
2. Environment variable: `FLIGHTRADAR24_API_KEY`
3. Production FlightRadar24 API endpoint

```typescript
const FLIGHTRADAR24_CONFIG = {
  baseUrl: "https://fr24api.flightradar24.com",
  apiKey: process.env.FLIGHTRADAR24_API_KEY,
};

// API call with required headers
const response = await fetch(
  `${baseUrl}/api/live/flight-positions/full?flights=${flightNumber}`,
  {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Accept-Version": "v1", // Required by FR24 API
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }
);
```

### Rate Limiting

- Production API has usage limits
- Implement request throttling if needed
- Monitor API usage in FlightRadar24 dashboard

### Data Storage Compliance

- **30-day rule**: All data from FR24 API must be permanently deleted after 30 days
- **Data updates**: FlightRadar24 updates position data approximately every 3 seconds per aircraft
- **Real-time data**: No interpolated positions provided for flights within coverage area

### Error Handling

- API errors are handled gracefully with user-friendly messages
- Fallback to manual entry when flight lookup fails
- No sensitive error details exposed to users

## Troubleshooting

### Common Issues

#### Authentication failed" Error

- Verify API key is correct
- Check that `FLIGHTRADAR24_API_KEY` environment variable is set
- Ensure API key has not expired

#### "Service temporarily unavailable" Error

- API key not configured (check environment variable)
- FlightRadar24 service downtime
- Network connectivity issues

#### "No flight found for this number" Error

- Normal for invalid or outdated flight numbers
- Some flights may not be in the FlightRadar24 database
- User can manually enter flight details

**"Too many requests" Error** (HTTP 429)

- API rate limit exceeded
- Wait before making another request
- Consider implementing request throttling

**"Unauthenticated" Error** (HTTP 401)

- Invalid or missing API key
- Incorrect `Accept-Version` header
- For sandbox testing, ensure endpoint includes "sandbox" prefix

### Testing Tips

1. **Use valid flight format**: AA1234, DL567, etc. (IATA airline code + 1-4 digits)
2. **Check server logs**: API errors logged on server side
3. **Monitor network tab**: Verify API calls to `/api/flight-lookup` (should respond <1 second)
4. **Test edge cases**: Empty input, invalid format, non-existent flights
5. **Test progressive disclosure**: Ensure date selection enables flight search
6. **Sandbox testing**: For development, consider using FR24 sandbox endpoints to avoid credit usage
7. **Flight data freshness**: Remember that live data updates approximately every 3 seconds

## API Compliance & Technical Details

### Required Headers

All requests to FlightRadar24 API must include:

```typescript
headers: {
  "Authorization": "Bearer YOUR_API_KEY",
  "Accept-Version": "v1",        // Required by FR24
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

### Endpoint Details

- **Base URL**: `https://fr24api.flightradar24.com`
- **Endpoint Used**: `/api/live/flight-positions/full`
- **Query Parameter**: `flights=FLIGHT_NUMBER` (e.g., `flights=AA1234`)
- **Alternative Light Endpoint**: `/api/live/flight-positions/light` (returns less data)

### Performance Expectations

- **Response Time**: Typically <1 second
- **Data Freshness**: Updates every ~3 seconds per aircraft
- **Rate Limits**: Depends on subscription tier

## Future Enhancements

### Planned Features

- **Debounced Search**: Auto-search as user types
- **Flight History**: Remember recently searched flights
- **Multiple Results**: Handle flights with multiple segments
- **Schedule Integration**: Show flight schedules and delays
- **Airport Autocomplete**: Search airports by name/code

### Advanced Integration

- **Real-time Updates**: Live flight status updates
- **Push Notifications**: Flight delay/gate change alerts
- **Offline Support**: Cache frequently searched flights
- **Airline APIs**: Direct integration with airline systems

## Support

For technical support:

1. Check FlightRadar24 API documentation
2. Review integration logs and error messages
3. Test with sandbox environment first
4. Contact FlightRadar24 support for API issues
