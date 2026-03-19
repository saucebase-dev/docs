---
sidebar_position: 4
title: Directory Structure
description: Understand Saucebase's unique modular architecture and file organization
---

# Directory Structure

Saucebase follows Laravel conventions but adds a powerful modular architecture. This guide focuses on **what's unique to Saucebase** vs standard Laravel.

:::tip Standard Laravel Patterns
Saucebase uses standard Laravel directory structure (`app/`, `config/`, `routes/`, `storage/`, etc.). See the [Laravel Documentation](https://laravel.com/docs/12.x/structure) for general Laravel patterns. This guide covers only Saucebase-specific architecture.
:::

## Root Directory Overview

```
saucebase/
├── app/                    # Core application (standard Laravel)
├── modules/                # ⭐ Feature modules (unique to Saucebase)
├── resources/              # Frontend code with module support
├── module-loader.js        # ⭐ Module asset discovery system
├── modules_statuses.json   # ⭐ Module registry (enabled/disabled)
├── vite.config.js          # ⭐ Module-aware Vite configuration
├── playwright.config.ts    # ⭐ Module-aware E2E testing
└── ...                     # Standard Laravel files
```

## Module Directory Structure

Each module is a self-contained feature package with its own routes, migrations, tests, and frontend assets.

```
modules/
└── <ModuleName>/
    ├── app/
    │   ├── Http/Controllers/
    │   ├── Models/
    │   ├── Providers/
    │   │   └── <ModuleName>ServiceProvider.php  # Extends ModuleServiceProvider
    │   └── Services/
    ├── config/
    │   └── config.php           # Module configuration
    ├── database/
    │   ├── migrations/          # Module-specific migrations
    │   ├── seeders/
    │   └── factories/
    ├── lang/
    │   └── en/                  # Module translations
    ├── resources/
    │   ├── css/
    │   │   └── app.css          # Module styles
    │   └── js/
    │       ├── app.ts           # ⭐ Module lifecycle hooks (setup, afterMount)
    │       ├── components/      # Module Vue components
    │       ├── layouts/
    │       ├── pages/           # Module Inertia pages
    │       └── types/
    ├── routes/
    │   ├── web.php              # Auto-loaded when module enabled
    │   ├── api.php
    │   └── navigation.php       # Module navigation items
    ├── tests/
    │   ├── Feature/
    │   ├── Unit/
    │   └── e2e/                 # Module E2E tests (auto-discovered)
    ├── vite.config.js           # ⭐ Exports asset paths for collection
    ├── composer.json
    └── module.json              # Module metadata
```

## Module Registry (`modules_statuses.json`)

Tracks which modules are enabled. Only enabled modules are loaded and built.

```json title="modules_statuses.json"
{
  "Auth": true,
  "Settings": true
}
```

Managed automatically via `php artisan module:enable` and `php artisan module:disable` commands. Saucebase's module system is built on [nWidart/laravel-modules](https://github.com/nWidart/laravel-modules) — see that package for the full module API.

## Want to go deeper?

The structure above reflects how Saucebase ties modules together at the framework level. To understand how it all works:

- **[Module System](/fundamentals/modules)** — How modules are loaded, enabled, and how lifecycle hooks work
- **[SSR Setup](/fundamentals/ssr)** — Server-side rendering entry point and the `withSSR()` macro
- **[Architecture Overview](/architecture/overview)** — How the module system, build pipeline, and frontend fit together
