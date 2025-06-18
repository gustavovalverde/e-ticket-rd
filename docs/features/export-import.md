# E-Ticket Export/Import Feature

## Overview

The E-Ticket system now supports exporting and importing form data, allowing users to:

1. **Export** their completed form data as an encrypted backup file
2. **Import** their previously exported data to prefill a new application

This feature is useful for:

- Creating backups of form data
- Sharing form templates within families/groups
- Recovering from browser crashes or session timeouts
- Transferring applications between devices

## Security Model

### Encryption

- **Algorithm**: AES-256-GCM (industry standard)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Authentication**: Built-in GCM authentication tag prevents tampering

### Key Components

1. **Server Secret Key**: Stored securely on the server (environment variable)
2. **User Inputs**: Flight number + Passport number (not stored on server)
3. **Unique Salt**: Generated per export for additional security
4. **Initialization Vector**: Unique per encryption operation

### Why This Is Secure

- The server never stores the flight number or passport number
- Data can only be decrypted with the exact same flight number and passport number used during export
- Even if the encrypted file is compromised, it cannot be decrypted without these user inputs
- PBKDF2 with 100,000 iterations makes brute force attacks computationally expensive

## How It Works

### Export Process

1. User completes the e-ticket form and reaches the success page
2. User clicks "Export Data" button
3. System prompts for flight number and passport number confirmation
4. Server encrypts the form data using these inputs + server secret
5. Encrypted file is downloaded to user's device

### Import Process

1. User goes to the landing page and clicks "Import Previous Application"
2. User selects their encrypted backup file
3. User enters the same flight number and passport number used during export
4. Server decrypts the data and validates the inputs match
5. User is redirected to the form with data pre-filled

## Setup Instructions

### Environment Variable

Add the encryption secret key to your environment variables:

```bash
# .env.local (for development)
ENCRYPTION_SECRET_KEY=your-very-secure-secret-key-here

# For production, use a strong randomly generated key
ENCRYPTION_SECRET_KEY=base64-encoded-256-bit-key
```

**Important**: Use a strong, randomly generated key in production. You can generate one using:

```bash
openssl rand -base64 32
```

### API Endpoints

The feature uses two API endpoints:

- `POST /api/encrypt-data` - Encrypts form data for export
- `POST /api/decrypt-data` - Decrypts imported data

Both endpoints validate that the flight number and passport number match the form data before processing.

## User Experience

### Export Flow

1. Complete e-ticket form
2. Reach success page with QR code
3. Click "Export Data" in secondary actions
4. Enter flight number and passport number (pre-filled from form)
5. Click "Export & Download"
6. File downloads as `eticket-backup-[code]-[date].json`

### Import Flow

1. Visit landing page
2. Click "Import Previous Application"
3. Upload previously exported `.json` file
4. Enter flight number and passport number
5. Click "Import & Continue"
6. Form opens with all data pre-filled
7. Green notification confirms successful import

## File Format

Exported files contain:

```json
{
  "encryptedData": "hex-encoded-encrypted-data",
  "iv": "hex-encoded-initialization-vector",
  "salt": "hex-encoded-salt",
  "authTag": "hex-encoded-authentication-tag",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "applicationCode": "ABC123",
  "exported": true
}
```

## Error Handling

### Common Errors

- **"Flight number does not match"**: The entered flight number doesn't match the form data
- **"Passport number does not match"**: The entered passport number doesn't match the form data
- **"Invalid file format"**: The selected file is not a valid e-ticket backup
- **"Failed to decrypt data"**: Wrong flight/passport combination or corrupted file

### Validation

- Flight number format validation (IATA standards)
- Passport number format validation
- File size limits (5MB max)
- File type validation (.json only)

## Technical Implementation

### Components

- `FileInput` component for drag-and-drop file uploads
- Dialog components for export/import workflows
- Encryption/decryption utilities using Node.js crypto module

### Architecture

- **Client-side**: File handling, UI components, navigation
- **Server-side**: Encryption/decryption, validation, security
- **Storage**: No persistent storage of sensitive data

### Performance

- Encryption/decryption typically completes in <1 second
- File downloads are immediate (client-side blob creation)
- No impact on normal form submission flow

## Future Enhancements

Potential improvements:

- QR code export/import for mobile devices
- Batch export for multiple applications
- Integration with cloud storage providers
- Enhanced file encryption with additional metadata
- Support for partial data import (specific sections only)

## Troubleshooting

### Development Issues

1. **Missing environment variable**: Ensure `ENCRYPTION_SECRET_KEY` is set
2. **API errors**: Check server logs for detailed error messages
3. **File upload issues**: Verify file size and format constraints

### User Issues

1. **Wrong credentials**: Double-check flight number and passport number
2. **Corrupted files**: Re-export data if file appears damaged
3. **Browser compatibility**: Ensure modern browser with FileReader API support

For technical support, check the browser console for detailed error messages during development.
