# VS Code Setup Guide

This guide ensures your VS Code environment is properly aligned with our CI/CD pipeline and prevents formatting conflicts.

## Quick Setup

1. **Install recommended extensions**:

   ```bash
   # VS Code will prompt you to install workspace recommendations
   # Or install manually from the Extensions tab
   ```

2. **Verify settings are applied**:

   - Open VS Code settings (Cmd/Ctrl + ,)
   - Check that Prettier is set as default formatter
   - Verify "Format On Save" is enabled

3. **Test the setup**:

   ```bash
   # This should match exactly what happens on save in VS Code
   pnpm run check-all
   ```

## Key Configuration Alignments

### Import Organization

- **❌ VS Code built-in**: Disabled (`source.organizeImports": "never"`)
- **✅ ESLint rules**: Handles import organization with strict rules
- **Why**: Ensures consistency with CI/CD pipeline

### Format Order (VS Code on Save)

1. ESLint auto-fix (`source.fixAll.eslint`)
2. Prettier formatting (`editor.formatOnSave`)

### Format Order (Pre-commit Hooks)

1. ESLint --fix
2. Prettier --write
3. TypeScript type check

> **✅ These orders are now identical**

## Recommended Extensions

| Extension                               | Purpose                     |
| --------------------------------------- | --------------------------- |
| `esbenp.prettier-vscode`                | Code formatting             |
| `dbaeumer.vscode-eslint`                | Linting & code quality      |
| `bradlc.vscode-tailwindcss`             | Tailwind CSS IntelliSense   |
| `ms-vscode.vscode-typescript-next`      | Enhanced TypeScript support |
| `streetsidesoftware.code-spell-checker` | Spell checking              |
| `ms-vscode.vscode-json`                 | JSON language support       |
| `redhat.vscode-yaml`                    | YAML language support       |
| `davidanson.vscode-markdownlint`        | Markdown linting & quality  |

## Settings Explained

### Core Formatting

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.requireConfig": true
}
```

### Disabled Features (Prevent Conflicts)

```json
{
  "source.organizeImports": "never",
  "typescript.format.enable": false,
  "javascript.format.enable": false,
  "prettier.useEditorConfig": false
}
```

### File Consistency

```json
{
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true
}
```

### Markdown Configuration

```json
{
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
      "source.fixAll.markdownlint": "explicit"
    }
  }
}
```

> **Note**: Markdownlint handles linting rules (headers, lists, etc.) while Prettier handles formatting (line wrapping, spacing). Both work together seamlessly.

## Troubleshooting

### "Format on Save Not Working"

1. Check Prettier extension is installed and enabled
2. Verify `.prettierrc.json` exists in project root
3. Restart VS Code

### "ESLint/Prettier Conflicts"

1. Run `pnpm run format` first
2. Then run `pnpm run lint`
3. If conflicts persist, check ESLint config includes `prettier` at the end

### "Import Organization Issues"

- **Don't use** Cmd/Ctrl + Shift + O (Organize Imports)
- **Instead**: Save file (Cmd/Ctrl + S) - ESLint will handle imports
- **Or run**: `pnpm run lint` manually

### "Markdown Linting Issues"

- **Markdownlint errors**: Run `pnpm run lint:md` to auto-fix common issues
- **Format conflicts**: Markdownlint fixes structure, Prettier handles formatting
- **Line length**: Set to 200 chars to match project standards

### "Husky Pre-commit Failures"

If pre-commit hooks fail but VS Code formatting works:

1. **Check file encoding**: Should be UTF-8 with LF line endings
2. **Run the same commands**:

   ```bash
   npx eslint --fix src/**/*.{ts,tsx}
   npx prettier --write src/**/*.{ts,tsx}
   ```

3. **Verify no staged changes conflict** with the formatting

## CI/CD Integration

The VS Code settings now match the GitHub Actions workflow:

### Local (VS Code)

```text
Save file → ESLint fix → Prettier format (TS/JS)
Save file → Markdownlint fix → Prettier format (MD)
```

### Pre-commit (Husky)

```text
git commit → ESLint fix → Prettier write (TS/JS)
git commit → Markdownlint fix → Prettier write (MD)
git commit → TypeScript check
```

### CI/CD (GitHub Actions)

```text
Push/PR → Type check → Lint strict → Markdown lint → Format check → Security audit
```

## Team Onboarding Checklist

- [ ] Install all recommended extensions
- [ ] Verify VS Code settings are applied (reload if needed)
- [ ] Test save functionality on a sample file
- [ ] Run `pnpm run check-all` successfully
- [ ] Make a test commit to verify pre-commit hooks work

## Need Help?

If you're still experiencing formatting conflicts:

1. **Reset your setup**:

   ```bash
   # Clear ESLint cache
   rm -f .eslintcache

   # Reinstall dependencies
   pnpm install

   # Restart VS Code
   ```

2. **Check your extensions**:

   - Disable any other formatting extensions
   - Ensure only Prettier is handling formatting

3. **Verify project integrity**:

   ```bash
   pnpm run check-all
   ```
