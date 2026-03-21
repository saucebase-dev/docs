---
sidebar_position: 2
title: Module System
description: How Saucebase's modular architecture works
---

# Module System Architecture

This guide explains how Saucebase's module system works architecturally. For the module directory layout, see [Directory Structure](/getting-started/directory-structure). For practical usage (installing, customizing, removing modules), see the [Modules Guide](/fundamentals/modules).

## Module Metadata

Each module has a `module.json` file describing its identity:

```json
{
    "name": "Auth",
    "alias": "auth",
    "description": "Authentication with social login support",
    "keywords": ["authentication", "oauth", "login"],
    "priority": 0,
    "providers": [
        "Modules\\Auth\\Providers\\AuthServiceProvider"
    ],
    "files": []
}
```

The `providers` array tells Laravel which service provider to load when the module is enabled.

## Module Lifecycle

Understanding how modules are discovered, loaded, and integrated helps you understand the system's behavior.

### 1. Installation

When you run `composer require saucebase/auth`, Composer downloads the module and places it in `modules/Auth/`. At this point, the module exists but isn't active.

### 2. Enable/Disable

The `modules_statuses.json` file tracks which modules are enabled:

```json
{
    "Auth": true,
    "Settings": true,
    "Analytics": false
}
```

Only enabled modules are loaded by the application. This file is the source of truth for module activation.

### 3. Discovery

At application boot time, Laravel reads `modules_statuses.json` and loads service providers for enabled modules. This happens automatically—you don't need to register providers manually.

During the build process, `module-loader.js` scans the same file to determine which module assets to include in the frontend bundle.

### 4. Registration

Each module's service provider registers its components:
- Routes are loaded from `routes/web.php` and `routes/api.php`
- Migrations are discovered from `database/migrations/`
- Translations are loaded from `lang/`
- Configuration is registered from `config/`
- Assets are collected from `vite.config.js`

### 5. Boot

After registration, service providers boot. This is where modules can:
- Share data with Inertia (global props available in all pages)
- Set up event listeners
- Extend framework classes
- Initialize third-party integrations

### 6. Runtime

Once booted, modules behave like any other part of the application. Their routes respond to requests, their models interact with the database, and their pages render in the frontend.

## Module Integration Points

Modules integrate with the core application through well-defined touch points.

### Service Provider Pattern

Every module extends `App\Providers\ModuleServiceProvider`, which handles common module concerns:

- **Translation loading**: Automatically loads language files from `lang/`
- **Config registration**: Merges module config with application config
- **Migration discovery**: Makes migrations available to Laravel
- **Inertia data sharing**: Shares module config with the frontend

The base service provider eliminates boilerplate, so module authors can focus on module-specific setup.

### Route Registration

Module routes are automatically loaded based on convention:
- `routes/web.php` → Web routes (sessions, CSRF protection)
- `routes/api.php` → API routes (stateless, token auth)

Routes are prefixed with the module name by default, preventing collisions. The Auth module's routes live under `/auth/*`, Settings under `/settings/*`, etc.

### Asset Discovery

At build time, `module-loader.js` discovers module assets:

1. Reads `modules_statuses.json` for enabled modules
2. Finds each module's `vite.config.js`
3. Extracts the `paths` array from each config
4. Adds those paths to Vite's input

This means modules automatically participate in the build process when enabled, and are excluded when disabled.

### Page Resolution

Frontend page resolution works through namespace syntax:

- `Auth::Login` → `modules/Auth/resources/js/pages/Login.vue`
- `Dashboard` → `resources/js/pages/Dashboard.vue`

The `resolveModularPageComponent()` function checks for the `::` separator and resolves paths accordingly. This keeps module pages isolated while maintaining a simple, readable syntax.

### Database Integration

Modules share the same database as the core application. When migrations run, module migrations execute alongside core migrations. This creates a unified database schema.

Module models can reference core models (like `User`) and vice versa. There's no enforced isolation—modules are part of your application, not separate microservices.

## Module Isolation vs Sharing

Modules strike a balance between isolation and integration.

### What's Isolated

**Routes**: Module routes are discovered separately, preventing accidental overrides. Each module controls its own URL space.

**Migrations**: Module migrations live in the module directory. Rolling back or refreshing migrations can be done per-module.

**Assets**: Module JavaScript and CSS are separate files during development. Vite can hot-reload module code independently.

**Tests**: Module tests are in `modules/<Name>/tests/`. You can run tests for a single module without running the entire test suite.

**Translations**: Module translations don't conflict with core or other module translations. Each module has its own namespace.

### What's Shared

**Database**: All modules use the same database. Tables from different modules can have foreign key relationships.

**Cache**: Redis cache is shared. Modules should prefix cache keys to avoid collisions.

**Queue**: Background jobs from all modules use the same queue system.

**Authentication**: Modules use the core application's authentication system. The `User` model is shared.

**Configuration**: While modules can have their own config files, they're merged into the global config array.

This design reflects Saucebase's philosophy: modules are organizational units, not separate applications. They're tightly integrated where it makes sense (database, auth) and loosely coupled where it doesn't (routes, assets).

## Module Communication

Modules can communicate with each other and the core application through Laravel's built-in patterns.

### Events

Modules can dispatch events that other modules (or the core app) listen to. This creates loose coupling—modules don't need to know about each other directly.

Example: The Auth module dispatches a `UserLoggedIn` event. An Analytics module listens to that event and tracks the login. Neither module needs to know about the other's implementation.

### Service Container

Modules can register services in Laravel's container that other modules can inject. This is useful for sharing functionality without tight coupling.

### Shared Data

Modules can share data with the frontend through Inertia. The base `ModuleServiceProvider` makes module config available to all Vue components.

### Database Relationships

Module models can reference each other through Eloquent relationships. An Order module might reference the User model from the Auth module.

This communication happens through Laravel's standard patterns. Modules aren't isolated applications—they're part of the same Laravel app, with all the tools Laravel provides.

## TypeScript Page Props {#typescript-page-props}

Modules can contribute to the shared Inertia `PageProps` type without touching any core file.

Create `resources/js/types/page-props.d.ts` in your module and augment `@inertiajs/vue3`'s `PageProps` interface:

```typescript title="modules/MyModule/resources/js/types/page-props.d.ts"
declare module '@inertiajs/vue3' {
  interface PageProps {
    my_shared_prop?: MyType;
  }
}

export {}; // required — makes this file a module
```

Because `modules/**/resources/js/**/*.ts` is included in `tsconfig.json`, augmentations are picked up automatically the moment the module is enabled. No patches, no edits to core files.

Use this for any data your module shares on every Inertia response via `shareInertiaData()` in your service provider.

## Next Steps

- **[Modules Guide](/fundamentals/modules)** - Install, customize, and manage modules in practice
- **[Frontend Architecture](/architecture/frontend)** - How module pages integrate with Vue
- **[Backend Architecture](/architecture/backend)** - Module service providers in depth
