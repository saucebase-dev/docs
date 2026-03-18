# Git Workflow

Saucebase enforces strict commit message standards and code quality checks using Commitlint and Husky hooks. This guide covers the git workflow, commit conventions, and best practices.

## Overview

Every commit in Saucebase follows the **Conventional Commits** specification with strict enforcement:

- ✅ Automatic code formatting before commit
- ✅ Commit message validation
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

- **Single-line only** - No body or footer allowed
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

❌ feat: add new feature

   This adds a new feature for users
   (Body/footer not allowed - single-line only)
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

### 3. Commit Message Validation

```bash
npx commitlint --edit $1
```

- Validates commit message format
- Runs on `commit-msg` hook
- Rejects invalid commit messages

## Workflow Steps

### 1. Make Your Changes

Edit files as needed:

```bash
# Edit files
vim app/Models/User.php
vim resources/js/pages/Dashboard.vue
```

### 2. Stage Files

```bash
# Stage specific files
git add app/Models/User.php

# Stage all changes
git add .

# Stage interactively
git add -p
```

### 3. Commit (Hooks Run Automatically)

```bash
git commit -m "feat(auth): add email verification"
```

**What happens:**
1. Pre-commit hook runs → `composer lint` formats PHP files
2. Pre-commit hook runs → `lint-staged` formats JS/TS/Vue files
3. Commit-msg hook runs → `commitlint` validates message
4. If all pass → Commit succeeds
5. If any fail → Commit rejected, fix issues and try again

### 4. Push to Remote

```bash
# Push to current branch
git push

# Push new branch
git push -u origin feature/my-feature
```

## Handling Pre-commit Hook Failures

### Scenario 1: PHP Formatting Issues

```bash
$ git commit -m "feat: add new feature"
> Running composer lint...
> Formatted 3 files

# Files were auto-formatted, stage them and commit again
git add .
git commit -m "feat: add new feature"
```

### Scenario 2: Commit Message Invalid

```bash
$ git commit -m "Add new feature"
⧗   input: Add new feature
✖   type must be one of [feat, fix, docs, ...] [type-enum]
✖   found 1 problems, 0 warnings

# Fix commit message
git commit -m "feat: add new feature"
```

### Scenario 3: Linting Errors

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

Test commit messages before committing:

```bash
# Test commit message format
echo "feat: test commit" | npx commitlint

# Expected output:
# ✔   found 0 problems, 0 warnings

# Test invalid message
echo "Add feature" | npx commitlint

# Expected output:
# ✖   type must be one of [feat, fix, ...] [type-enum]
```

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

## Bypassing Hooks (Not Recommended)

In rare cases, you can bypass hooks:

```bash
# Skip pre-commit hooks (NOT RECOMMENDED)
git commit -m "feat: urgent fix" --no-verify

# Skip commit message validation (NOT RECOMMENDED)
git commit -m "WIP" --no-verify
```

:::danger Use with Caution
Bypassing hooks should only be done in emergency situations. Your commit may be rejected during code review or cause CI/CD failures.
:::

## Troubleshooting

### Hooks Not Running

```bash
# Reinstall Husky hooks
npm run prepare

# Verify hooks are installed
ls -la .git/hooks/
# Should show: pre-commit, commit-msg
```

### Commitlint Not Found

```bash
# Reinstall dependencies
npm install

# Verify commitlint is installed
npx commitlint --version
```

### Linter Errors in Module Code

```bash
# Run linter on specific module
cd modules/Auth
composer lint

# Or from project root
vendor/bin/pint modules/Auth
```

### Permission Denied on Hooks

```bash
# Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg
```

## Next Steps

- [Guidelines](/guidelines) - Understand code quality standards
- [Commands](/development/commands) - Useful development commands
