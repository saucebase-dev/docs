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
    │   ├── en/                  # Module translations
    │   └── pt_BR/
    ├── resources/
    │   ├── css/
    │   │   └── app.css          # Module styles
    │   └── js/
    │       ├── app.ts           # ⭐ Module lifecycle hooks (setup, afterMount)
    │       ├── components/      # Module Vue components
    │       └── pages/           # Module Inertia pages
    ├── routes/
    │   ├── web.php              # Auto-loaded when module enabled
    │   ├── api.php
    │   └── navigation.php       # Module navigation items
    ├── tests/
    │   ├── Feature/
    │   ├── Unit/
    │   └── e2e/                 # Module E2E tests (auto-discovered)
    ├── vite.config.js           # ⭐ Exports asset paths for collection
    ├── playwright.config.ts     # Optional custom E2E config
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

Managed automatically via `php artisan module:enable` and `php artisan module:disable` commands.

## Unique Saucebase Files

These files are specific to Saucebase's modular architecture:

### Backend Files
- **`app/Providers/ModuleServiceProvider.php`** - Base class for module providers. All module service providers extend this class to automatically handle migrations, translations, config, and Inertia data sharing. [Learn more →](/fundamentals/modules)
- **`app/Providers/MacroServiceProvider.php`** - Centralized macro registration for framework extensions (e.g., `->withSSR()`, `->withoutSSR()`). [Learn more →](/fundamentals/ssr#technical-implementation)

### Frontend Files
- **`resources/js/lib/moduleSetup.ts`** - Module lifecycle management system. Executes module `setup()` and `afterMount()` hooks. [Learn more →](/fundamentals/modules)
- **`resources/js/lib/utils.ts`** - Contains `resolveModularPageComponent()` for module page resolution with namespace syntax (`Auth::Login`). [Learn more →](/fundamentals/modules)
- **`resources/js/app.ts`** - Client-side rendering entry point
- **`resources/js/ssr.ts`** - Server-side rendering entry point. [Learn more →](/fundamentals/ssr#technical-implementation)

### Build System Files
- **`module-loader.js`** - Module discovery engine that collects assets, translations, and E2E test configs from enabled modules at build time. [Learn more →](/architecture/overview)
- **`modules_statuses.json`** - Module registry tracking enabled/disabled state
- **`vite.config.js`** - Module-aware Vite configuration that uses `module-loader.js` to build module assets
- **`playwright.config.ts`** - Module-aware E2E testing configuration. [Learn more →](/development/testing-guide)

## Key Concepts

### Module System
Modules are self-contained feature packages that install directly into your repository. Each module has its own service provider extending `ModuleServiceProvider`, which automatically handles migrations, translations, and configuration. [Learn more →](/fundamentals/modules)

### Server-Side Rendering
Saucebase uses a two-level SSR control system with opt-in macros (`->withSSR()`, `->withoutSSR()`). SSR is disabled by default via middleware, and controllers explicitly enable it for pages needing SEO. [Learn more →](/fundamentals/ssr)

### Module Asset Discovery
The `module-loader.js` reads `modules_statuses.json` to discover enabled modules, then collects their assets, translations, and test configs. Modules export asset paths via `vite.config.js` which are automatically included in the build. [Learn more →](/architecture/overview)

### Module Page Resolution
Pages can be rendered from core (`Dashboard`) or modules (`Auth::Login`) using namespace syntax. The `resolveModularPageComponent()` function handles resolution automatically. [Learn more →](/fundamentals/modules)

### Module Lifecycle Hooks
Modules can export `setup()` and `afterMount()` hooks in `resources/js/app.ts` to run code before/after Vue app mounts. Used for registering components, plugins, or initializing services. [Learn more →](/fundamentals/modules)

### Testing Architecture
PHPUnit tests are organized into Unit, Feature, and Modules suites. Playwright E2E tests are auto-discovered from enabled modules, with each module getting its own test project (`@ModuleName`). [Learn more →](/development/testing-guide)

## What Makes Saucebase Different?

Unlike traditional Laravel applications with packages, Saucebase uses a **copy-and-own philosophy**. Modules install directly into your repository, giving you complete control without vendor lock-in. The module system provides:

- **Auto-discovery** - Enabled modules are automatically discovered at build time
- **Isolated structure** - Each module has its own routes, migrations, tests, and frontend assets
- **Namespace syntax** - Render module pages with `Inertia::render('Auth::Login')`
- **Lifecycle hooks** - Modules can run setup code before/after Vue app mounts
- **Test isolation** - Each module gets its own PHPUnit suite and Playwright project
- **SSR control** - Per-page SSR control with simple macros (`->withSSR()`)

## Next Steps

- **[Module System Guide](/fundamentals/modules)** - Learn to install and manage modules
- **[Architecture Overview](/architecture/overview)** - Deep dive into how everything works together
- **[Development Commands](/development/commands)** - Common development workflows
- **[Testing Guide](/development/testing-guide)** - Learn about PHPUnit and Playwright testing
