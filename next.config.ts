import type { NextConfig } from "next";

// Tesseract.js compatibility: Empty module stub for server-side modules
const EMPTY_MODULE_PATH = './src/lib/utils/empty-module.js';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Tesseract.js tries to import these server-side modules in browser
      canvas: EMPTY_MODULE_PATH,
      encoding: EMPTY_MODULE_PATH,
      fs: {
        // Node.js fs module doesn't exist in browser - stub it out
        browser: EMPTY_MODULE_PATH,
      },
    },
  },
};

export default nextConfig;
