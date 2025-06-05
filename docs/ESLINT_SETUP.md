# ESLint Configuration for E-Ticket Project

## Overview

This document describes the comprehensive ESLint configuration implemented for the Dominican Republic E-Ticket project. The configuration is designed to ensure high code quality, accessibility compliance, and security standards suitable for government applications.

## Configuration Features

### 🔧 **Core Technologies Supported**
- **Next.js 15+** with App Router
- **TypeScript 5+** with strict type checking
- **React 19** with modern hooks
- **JSX/TSX** with accessibility rules

### 🛡️ **Code Quality Standards**
- **TypeScript-first** approach with strict type checking
- **Accessibility compliance** (WCAG guidelines)
- **Security best practices** for government applications
- **Import organization** and dependency management
- **React best practices** and hooks compliance

## ESLint Scripts

The following npm scripts are available for code quality management:

```bash
# Standard linting with auto-fix
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Strict linting (fails on warnings)
npm run lint:strict

# TypeScript type checking
npm run type-check
```

## Configuration Structure

### 1. **Base Configuration**
- JavaScript ES2022+ standards
- Next.js core web vitals
- TypeScript integration

### 2. **TypeScript Rules**
```javascript
// Key TypeScript rules enforced:
"@typescript-eslint/no-unused-vars": "error"
"@typescript-eslint/no-explicit-any": "warn"
"@typescript-eslint/consistent-type-imports": "error"
"@typescript-eslint/no-non-null-assertion": "warn"
```

### 3. **React & JSX Rules**
```javascript
// React-specific optimizations:
"react/react-in-jsx-scope": "off" // Not needed in Next.js
"react/prop-types": "off" // Using TypeScript
"react/jsx-key": "error"
"react/self-closing-comp": "error"
```

### 4. **Accessibility Rules (Critical for Government)**
```javascript
// WCAG compliance rules:
"jsx-a11y/alt-text": "error"
"jsx-a11y/aria-props": "error"
"jsx-a11y/heading-has-content": "error"
"jsx-a11y/lang": "error"
"jsx-a11y/anchor-is-valid": "error"
```

### 5. **Import Organization**
```javascript
// Enforced import order:
1. Node.js built-ins
2. External packages
3. Internal modules
4. Parent directories
5. Sibling files
6. Index files
7. Object imports
8. Type imports
```

### 6. **Security Rules**
```javascript
// Security best practices:
"no-eval": "error"
"no-implied-eval": "error"
"no-new-func": "error"
"no-script-url": "error"
```

## File-Specific Configurations

### **TypeScript Files** (`*.ts`, `*.tsx`)
- Full TypeScript rule enforcement
- Type import consistency
- Strict variable usage

### **React Components** (`*.jsx`, `*.tsx`)
- React hooks compliance
- JSX accessibility rules
- Component best practices

### **Configuration Files** (`*.config.*`)
- Relaxed rules for build configs
- Allow CommonJS requires
- Disable anonymous exports warnings

### **Test Files** (`*.test.*`, `*.spec.*`)
- Allow `any` types for testing
- Permit console usage
- Relaxed import rules

## Ignored Files and Directories

The configuration automatically ignores:
```
node_modules/     # Dependencies
.next/           # Next.js build output
out/             # Export output
dist/            # Distribution files
build/           # Build artifacts
.turbo/          # Turbo cache
public/          # Static assets
**/*.d.ts        # Type definitions
```

## Integration with Development Workflow

### **Pre-commit Hooks** (Recommended)
```bash
# Install Husky for pre-commit hooks
npm install --save-dev husky lint-staged

# Add to package.json:
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "git add"
  ]
}
```

### **VS Code Integration**
Add to `.vscode/settings.json`:
```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### **CI/CD Integration**
```yaml
# GitHub Actions example
- name: Lint code
  run: |
    npm run lint:strict
    npm run type-check
```

## Customization Guidelines

### **Adding New Rules**
1. Add rules to the appropriate file pattern section
2. Test with `npm run lint:strict`
3. Document the reasoning for the rule
4. Consider impact on existing code

### **Disabling Rules**
```javascript
// For specific lines:
// eslint-disable-next-line rule-name

// For entire files:
/* eslint-disable rule-name */

// For specific functions:
/* eslint-disable-next-line rule-name */
function myFunction() { }
```

### **Project-Specific Rules**
For government compliance, these rules are **non-negotiable**:
- All accessibility rules (`jsx-a11y/*`)
- Security rules (`no-eval`, `no-script-url`, etc.)
- TypeScript strict rules
- Import organization

## Troubleshooting

### **Common Issues**

1. **"Cannot resolve dependency" errors**
   ```bash
   npm install --save-dev eslint-import-resolver-typescript
   ```

2. **TypeScript parser errors**
   ```bash
   npm install --save-dev @typescript-eslint/parser
   ```

3. **React version detection**
   - Ensure React is in dependencies
   - Check `settings.react.version` in config

### **Performance Optimization**
- Use `.eslintcache` for faster subsequent runs
- Configure IDE to run ESLint on save only
- Use `--max-warnings 0` in CI for strict enforcement

## Contributing

When contributing to this project:

1. **Always run** `npm run lint:strict` before committing
2. **Fix all warnings** - warnings become errors in CI
3. **Add tests** for new ESLint rules if applicable
4. **Document** any rule changes in this file

## Dependencies

The ESLint configuration requires these packages:

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.33.1",
    "@typescript-eslint/parser": "^8.33.1",
    "eslint": "^9.28.0",
    "eslint-config-next": "15.3.3",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^5.2.0"
  }
}
```

## Government Compliance Notes

This ESLint configuration is specifically designed for Dominican Republic government applications and includes:

- **WCAG 2.1 AA compliance** through jsx-a11y rules
- **Security hardening** for public-facing applications
- **Code consistency** for multi-developer teams
- **Maintainability** standards for long-term projects
- **Performance optimization** rules for better user experience

---

**Last Updated**: June 2025  
**Compatible with**: Next.js 15+, TypeScript 5+, React 19+ 