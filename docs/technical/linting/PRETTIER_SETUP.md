# Prettier Formatting Setup

This document explains the Prettier configuration for the e-ticket-rd project.

## Overview

Prettier is configured to automatically format code according to consistent rules, ensuring all
contributors follow the same code style standards.

## Configuration Files

### `.prettierrc.json`

Main Prettier configuration with the following key settings:

- **Semi-colons**: Required (`"semi": true`)
- **Quotes**: Double quotes for consistency (`"singleQuote": false`)
- **Print Width**: 80 characters for readability
- **Tab Width**: 2 spaces for indentation
- **Trailing Commas**: ES5 compatible
- **Line Endings**: LF (Unix-style)

### `.prettierignore`

Excludes files that shouldn't be formatted:

- Node modules and build artifacts
- Auto-generated files
- Static assets
- Package manager lock files

## Available Scripts

| Script                 | Description                                   |
| ---------------------- | --------------------------------------------- |
| `npm run format`       | Format all files in the project               |
| `npm run format:check` | Check if files are formatted (CI/CD friendly) |
| `npm run format:fix`   | Format files and show which ones were changed |
| `npm run check-all`    | Run TypeScript, ESLint, and Prettier checks   |

## IDE Integration

### VS Code

The project includes VS Code settings (`.vscode/settings.json`) that:

- Sets Prettier as the default formatter
- Enables format on save
- Integrates with ESLint for code quality
- Includes Tailwind CSS support

### Recommended Extensions

Install these VS Code extensions (see `.vscode/extensions.json`):

- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)

## ESLint Integration

Prettier is integrated with ESLint to:

- Prevent conflicts between formatting rules
- Show Prettier issues as ESLint errors
- Enable one-command code quality checking

## File Type Support

Prettier formats these file types:

- JavaScript/TypeScript (`.js`, `.jsx`, `.ts`, `.tsx`)
- JSON files (`.json`)
- Markdown files (`.md`)
- YAML files (`.yml`, `.yaml`)
- CSS files (`.css`)

## Special Overrides

- **JSON files**: Extended print width (200 characters)
- **Markdown files**: Print width 100, prose wrap enabled
- **YAML files**: Single quotes for consistency

## Contributing

Before submitting code:

1. Run `npm run format` to format your changes
2. Run `npm run check-all` to verify code quality
3. Ensure your IDE is configured to format on save

## Troubleshooting

### Format on Save Not Working

1. Ensure Prettier extension is installed
2. Check VS Code settings are applied
3. Verify `.prettierrc.json` exists
4. Restart VS Code

### ESLint/Prettier Conflicts

If you see formatting conflicts:

1. Run `npm run format` first
2. Then run `npm run lint`
3. The configuration should prevent conflicts

### CI/CD Integration

The `format:check` script is perfect for CI/CD:

```bash
npm run check-all  # Runs all quality checks
```

This ensures all code is properly formatted before merging.
