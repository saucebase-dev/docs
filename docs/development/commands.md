---
sidebar_position: 1
title: Commands
description: Complete reference of development commands for Saucebase
---

# Development Commands

This page lists all commonly used commands for developing with Saucebase, organized by category.

## Development Workflow

### Starting Development Environment

The quickest way to start development:

```bash
composer dev
```

This runs all development services in parallel:
- Laravel dev server (`php artisan serve`)
- Queue worker (`php artisan queue:listen`)
- Pail logs (`php artisan pail`)
- Vite dev server (`npm run dev`)

:::tip Recommended
Use `composer dev` for the best development experience with automatic log monitoring and hot reload.
:::

### Alternative: Individual Services

If you prefer to run services separately:

```bash
# Terminal 1: Laravel dev server
php artisan serve

# Terminal 2: Vite dev server (hot reload)
npm run dev

# Terminal 3: Queue worker
php artisan queue:listen --tries=1

# Terminal 4: Monitor logs
php artisan pail --timeout=0
```

## Docker Operations

### Starting Services

```bash
# Start all services
docker compose up -d

# Start and wait for health checks
docker compose up -d --wait

# View logs while starting
docker compose up
```

### Executing Commands

```bash
# General syntax
docker compose exec app <command>

# Examples
docker compose exec app php artisan migrate
docker compose exec app composer install
docker compose exec app php artisan tinker
```

### Service Management

```bash
# Restart specific service
docker compose restart app

# Restart all services
docker compose restart

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v
```

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f mysql

# Last 100 lines
docker compose logs --tail=100 app
```

### Service Status

```bash
# Check running services
docker compose ps

# Check specific service health
docker compose ps mysql
```

## Installation & Setup

### Automated Installation

The recommended way to install — only Docker and Node.js required:

```bash
# First-time installation
bash bin/setup-env

# With flags
bash bin/setup-env --no-ssl
bash bin/setup-env --force
bash bin/setup-env --no-docker

# After first install, Task is available via npm:
npm run saucebase install
```

The bootstrap script handles Docker, PHP dependencies, runs the artisan installer inside the container, then builds frontend assets.

### Artisan Installer (runs inside container)

When called directly (e.g. in CI or inside Docker):

```bash
# Standard installation
php artisan saucebase:install

# Skip SSL detection
php artisan saucebase:install --no-ssl

# Force reinstallation
php artisan saucebase:install --force

# Manual mode (instructions only)
php artisan saucebase:install --no-docker

# CI/CD mode (non-interactive)
php artisan saucebase:install --no-interaction
```

## Module Management

### Creating a Module

```bash
# Scaffold a new module from stubs
php artisan saucebase:recipe BlogPost

# After scaffolding, activate and build
composer require saucebase/blogpost
npm run dev
```

### Installing Modules

```bash
# 1. Install the module via Composer
composer require saucebase/auth

# 2. Run migrations
php artisan migrate

# 3. Seed module data (if the module has seeders)
php artisan modules:seed --module=auth

# 4. Build frontend assets
npm run build
```

### Managing Modules

```bash
# List all discovered modules
php artisan modules:list

# Sync PHPUnit test suite config (run after adding/removing modules)
php artisan modules:sync

# Cache module discovery (production)
php artisan modules:cache

# Clear module cache
php artisan modules:clear
```

### Removing Modules

```bash
# 1. Remove the module via Composer
composer remove saucebase/auth

# 2. Rebuild frontend assets
npm run build
```

### Module Database Operations

```bash
# Run all migrations (includes module migrations)
php artisan migrate

# Rollback last migration batch
php artisan migrate:rollback

# Refresh all migrations (CAUTION: destroys data)
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status
```

## Frontend Assets

### Development

```bash
# Start Vite dev server with HMR
npm run dev

# Start and expose to network
npm run host
```

### Production Builds

```bash
# Build for production
npm run build

# Build with SSR
npm run build:ssr

# Preview production build
npm run preview
```

### Screenshots & Videos

```bash
# Capture screenshots
npm run screenshots

# Capture videos
npm run videos
```

## Testing

### Backend Tests (PHPUnit)

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/AuthTest.php

# Run specific test method
php artisan test --filter test_user_can_login

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit
php artisan test --testsuite=Modules

# Run with coverage
php artisan test --coverage

# Parallel testing
php artisan test --parallel
```

### Frontend Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Open Playwright UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

## Code Quality

### PHP

```bash
# Run PHPStan static analysis
composer analyse

# Alternative
vendor/bin/phpstan analyse --memory-limit=2G

# Format code with Laravel Pint
composer lint

# Alternative
vendor/bin/pint

# Check specific directory
vendor/bin/pint app/
```

### JavaScript/TypeScript

```bash
# Lint and auto-fix
npm run lint

# Format with Prettier
npm run format

# Check formatting only
npm run format:check
```

### Pre-commit Hooks

```bash
# Run pre-commit hooks manually
npx husky run pre-commit
```

## Cache Management

### Clearing Caches

```bash
# Clear all caches
php artisan optimize:clear

# Clear specific caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
php artisan event:clear

# Clear compiled classes
php artisan clear-compiled
```

### Optimizing for Production

```bash
# Cache everything
php artisan optimize

# Cache specific items
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Cache Inspection

```bash
# Show cached config
php artisan config:show

# Show specific config
php artisan config:show app
php artisan config:show database
```

## Logging

### Monitor Logs

```bash
# Real-time log monitoring
php artisan pail

# With no timeout
php artisan pail --timeout=0

# Filter by level
php artisan pail --level=error

# Filter by message
php artisan pail --message="User created"
```

## Server-Side Rendering (SSR)

### Managing SSR Server

```bash
# Start SSR server
php artisan inertia:start-ssr

# Start in background
php artisan inertia:start-ssr &

# Stop SSR server
php artisan inertia:stop-ssr

# Check SSR server status
curl http://127.0.0.1:13714
```

## Next Steps

- **[Guidelines](/guidelines)** - Code quality guidelines and best practices
- **[Git Workflow](/development/git-workflow)** - Branch strategy and commit conventions

---

Bookmark this page for quick reference during development!
