---
title: Taskfile
description: Run common development tasks with a single command using Taskfile
---

# Taskfile

Saucebase includes a `Taskfile.yml` at the project root — a single entrypoint for all common development tasks. It's powered by [Task](https://taskfile.dev) and comes ready to use after `npm install`.

## Basic Usage

```bash
# List all available tasks
task --list

# Run any task
task <name>

# Example
task dev
```

If you don't have Task installed globally, use the npm alias:

```bash
npm run saucebase <task>
# e.g. npm run saucebase dev
```

## Task Reference

### Installation

```bash
task install:docker   # Fresh install — Docker + Node required
task install:local    # Fresh install — native PHP, Composer, Node required
```

### Development

```bash
task dev              # Start Vite dev server with HMR
task serve            # Start full dev server (app, queue, logs, Vite)
task build            # Production build (includes SSR)
```

### Code Quality

```bash
task lint             # Run all linters (PHP + JS)
task format           # Prettier write
task analyse          # PHPStan static analysis (level 5)
```

### Testing

```bash
task test:php         # Run PHPUnit tests
task test:e2e         # Run Playwright E2E tests
```

### Helpers

```bash
task db:reset         # Reset database — migrate:fresh + re-seed (prompts for confirmation)
task check            # Full pipeline: lint → analyse → test
```

## Module Tasks

Each module ships with its own `Taskfile.yml`. The root Taskfile includes them under a namespace matching the module name, so you can run module tasks directly:

```bash
task auth:test:php           # PHPUnit tests for the Auth module only
task auth:test:e2e           # E2E tests for the Auth module only
task auth:types:generate     # Generate TypeScript types for Auth

task billing:test:php
task billing:webhook:stripe:listen   # Module-specific tasks also appear
```

Run `task --list` to see all tasks across all included modules at once.

:::tip
Module tasks use the same `:` separator as root tasks — `<module>:<task>`. This makes it easy to scope test runs to a single module during development.
:::

## Adding a New Module

When you create a module with `php artisan saucebase:recipe`, it's automatically registered in the root Taskfile under its namespace. See [Creating Modules](/fundamentals/modules#creating-modules) for details.

## Next Steps

- **[Commands](/development/commands)** — Full artisan and npm command reference
- **[Testing Guide](/development/testing-guide)** — Testing strategy and conventions
