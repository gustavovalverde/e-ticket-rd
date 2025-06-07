module.exports = {
  // JavaScript, TypeScript, and related files
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],

  // Markdown files (lint then format)
  "*.md": ["markdownlint --fix", "prettier --write"],

  // All other formats
  "*.{json,yml,yaml,css,scss}": ["prettier --write"],

  // TypeScript type checking (runs after formatting)
  "*.{ts,tsx}": () => "tsc --noEmit",
};
