# Git Workflow

Saucebase follows conventional commit standards and enforces code quality checks using Husky hooks. This guide covers the git workflow, commit conventions, and best practices.

## Overview

Every commit in Saucebase follows the **Conventional Commits** specification:

- ✅ Automatic code formatting before commit
- ✅ Single-line commits only
- ✅ Lowercase type and subject
- ✅ Pre-configured hooks with Husky

## Commit Message Format

All commits must follow this format:

```
type(scope): subject
```

or without scope:

```
type: subject
```

### Rules

- **Single-line only** - No body or footer
- **Maximum length**: 150 characters
- **Type**: Required, must be lowercase
- **Scope**: Optional, must be lowercase
- **Subject**: Required, must be lowercase (cannot start with capital letter)

### Valid Examples

```bash
✅ feat: add user authentication module
✅ fix(api): resolve timeout issue in user endpoint
✅ docs: update readme with docker instructions
✅ refactor: simplify module loader logic
✅ test(e2e): add playwright tests for login flow
✅ chore(deps): upgrade laravel to 12.0
✅ style: format components with prettier
✅ perf(queries): optimize database queries
```

### Invalid Examples

```bash
❌ Feat: add new feature
   (Type must be lowercase)

❌ feat: Add new feature
   (Subject cannot start with capital letter)

❌ feature: add new feature
   (Invalid type - must be one of the allowed types)

❌ add new feature
   (Type is required)
```

## Commit Types

| Type       | Description                                               | Example                                         |
| ---------- | --------------------------------------------------------- | ----------------------------------------------- |
| `feat`     | A new feature                                             | `feat(auth): add social login support`          |
| `fix`      | A bug fix                                                 | `fix(dashboard): resolve chart rendering issue` |
| `docs`     | Documentation only changes                                | `docs: update installation guide`               |
| `style`    | Code style changes (formatting, missing semicolons, etc.) | `style: format components with prettier`        |
| `refactor` | Code changes that neither fix bugs nor add features       | `refactor(api): simplify error handling logic`  |
| `perf`     | Performance improvements                                  | `perf(queries): optimize database queries`      |
| `test`     | Adding or correcting tests                                | `test(auth): add login validation tests`        |
| `chore`    | Build process or tooling changes                          | `chore: update dependencies`                    |
| `ci`       | CI configuration changes                                  | `ci: add playwright workflow`                   |
| `build`    | Build system or external dependency changes               | `build: upgrade vite to 6.4`                    |
| `revert`   | Reverts a previous commit                                 | `revert: revert feat(auth): add social login`   |

## Pre-commit Hooks

Husky automatically runs these checks **before each commit**:

### 1. PHP Formatting

```bash
composer lint
```

- Runs **Laravel Pint** to auto-format PHP code
- Uses PSR-12 coding standard
- Formats all staged PHP files

### 2. JavaScript/TypeScript/Vue Formatting

```bash
npx lint-staged
```

- Runs **ESLint** and **Prettier** on staged files
- Affected files: `**/*.{js,ts,vue}`
- Auto-fixes and formats code

## Workflow Steps

### 1. Make Your Changes

```bash
vim app/Models/User.php
vim resources/js/pages/Dashboard.vue
```

### 2. Stage Files

```bash
# Stage specific files
git add app/Models/User.php

# Stage all changes
git add .
```

### 3. Commit (Hooks Run Automatically)

```bash
git commit -m "feat(auth): add email verification"
```

**What happens:**
1. Pre-commit hook runs → `composer lint` formats PHP files
2. Pre-commit hook runs → `lint-staged` formats JS/TS/Vue files
3. If all pass → Commit succeeds
4. If any fail → Commit rejected, fix issues and try again

### 4. Push to Remote

```bash
# Push to current branch
git push

# Push new branch
git push -u origin feature/my-feature
```

## Handling Pre-commit Hook Failures

### Scenario: PHP Formatting Issues

```bash
$ git commit -m "feat: add new feature"
> Running composer lint...
> Formatted 3 files

# Files were auto-formatted, stage them and commit again
git add .
git commit -m "feat: add new feature"
```

### Scenario: Linting Errors

```bash
$ git commit -m "feat: add feature"
> Running lint-staged...
✖ ESLint found errors in Dashboard.vue

# Fix errors manually
vim resources/js/pages/Dashboard.vue

# Or auto-fix if possible
npm run lint

# Stage fixed files and commit
git add .
git commit -m "feat: add feature"
```

## Manual Validation

Run linters manually:

```bash
# PHP formatting
composer lint

# PHP static analysis
composer analyse

# JavaScript/TypeScript linting
npm run lint

# Format all files
npm run format

# Check formatting without changing
npm run format:check
```

## Troubleshooting

### Hooks Not Running

```bash
# Reinstall Husky hooks
npm run prepare

# Verify hooks are installed
ls -la .git/hooks/
# Should show: pre-commit
```

### Linter Errors in Module Code

```bash
# Run linter on specific module
vendor/bin/pint modules/Auth
```

### Permission Denied on Hooks

```bash
# Make hooks executable
chmod +x .git/hooks/pre-commit
```

## Next Steps

- [Guidelines](/guidelines) - Understand code quality standards
- [Commands](/development/commands) - Useful development commands
