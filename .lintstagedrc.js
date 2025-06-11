module.exports = {
  // JavaScript, TypeScript, and related files
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],

  // Markdown files (lint then format)
  "*.md": ["markdownlint --fix", "prettier --write"],

  // CSS files (lint then format)
  "*.{css,scss}": ["stylelint --fix", "prettier --write"],

  // All other formats
  "*.{json,yml,yaml}": ["prettier --write"],

  // TypeScript type checking (runs after formatting)
  "*.{ts,tsx}": () => "tsc --noEmit",
};
