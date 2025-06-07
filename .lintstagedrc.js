module.exports = {
  // JavaScript, TypeScript, and related files
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],

  // All other formats
  "*.{json,yml,yaml,md,css,scss}": ["prettier --write"],

  // TypeScript type checking
  "*.{ts,tsx}": () => "tsc --noEmit",
};
