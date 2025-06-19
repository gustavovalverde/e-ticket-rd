import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // ! FIXME: If Tesseract.js build fails with WASM/ESM errors, uncomment below:
  // experimental: { esmExternals: 'loose' },
  // webpack: (config) => {
  //   config.resolve.alias.canvas = false;
  //   config.resolve.alias.encoding = false;
  //   return config;
  // }
};

export default nextConfig;
