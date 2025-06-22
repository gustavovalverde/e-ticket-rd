# Tesseract.js Language Data Files

This directory contains the trained data files required for Tesseract.js OCR processing in the Dominican Republic E-Ticket system.

## Files

### `eng.traineddata.gz`

- **Purpose**: General English text recognition
- **Size**: ~1.8MB compressed
- **Language**: English
- **Usage**: Fallback OCR model for general text recognition

### `ocrb.traineddata.gz`

- **Purpose**: Specialized OCR-B font recognition
- **Size**: ~45KB compressed
- **Font**: OCR-B (Machine Readable Zone standard)
- **Usage**: Primary model for passport MRZ processing

## Machine Readable Zone (MRZ) Processing

The OCR-B model is specifically optimized for reading passport MRZ sections, which use the standardized OCR-B font. This provides:

- **Higher accuracy** for passport number extraction
- **Better date recognition** in YYMMDD format
- **Improved nationality code parsing**
- **Enhanced document number validation**

## Automatic Download

These files are automatically downloaded and cached by Tesseract.js when:

1. The user first attempts to use passport OCR functionality
2. The files are not already cached in the browser
3. The user has an active internet connection

## Offline Support

Once downloaded, these files are cached locally enabling:

- **Offline OCR processing** without internet connection
- **Faster subsequent processing** (no re-download required)
- **Reduced bandwidth usage** for return users

## Government Deployment Benefits

This local caching approach provides several advantages for government-scale deployment:

- **Cost efficiency**: No per-request API charges
- **Privacy compliance**: Passport data never leaves user's device
- **Reliability**: Works during internet outages
- **Scalability**: Performance doesn't degrade with user volume

## Technical Details

- **Format**: Compressed trained data files (.gz)
- **Loading**: Asynchronous loading with progress feedback
- **Storage**: Browser cache and IndexedDB
- **Fallback**: Graceful degradation to manual entry if loading fails

## File Maintenance

These files are:

- **Version controlled** as part of the project
- **Automatically served** by Next.js static file serving
- **Cached by browsers** with appropriate cache headers
- **Validated** before use to ensure integrity

---

**Note**: These files are essential for the passport OCR functionality. Do not remove or modify them unless updating to newer Tesseract.js versions.
