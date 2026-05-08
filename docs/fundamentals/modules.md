---
sidebar_position: 1
title: Module Management
description: Learn how to install and remove Saucebase modules
---

# Module Management

Modules are self-contained feature packages that you install directly into your repository. Module code becomes part of your codebase, giving you complete ownership and customization freedom. For the architectural details, see [Module System Architecture](/architecture/module-system).

## Creating Modules

Use the `saucebase:recipe` command to scaffold a new module from a recipe template. It renames files, replaces placeholders, and registers the module in your Taskfile automatically.

```bash
# Interactive — prompts for name and recipe
php artisan saucebase:recipe

# Non-interactive
php artisan saucebase:recipe BlogPost "Basic Recipe"
```

:::note
Module names must be StudlyCase with no spaces or hyphens (e.g. `BlogPost`, `UserReports`).
:::

The command generates a ready-to-use structure under `modules/{name}/`:

```
modules/blogpost/
├── src/
│   ├── Filament/           # Admin panel plugin
│   ├── Http/Controllers/
│   └── Providers/          # Service + Route providers
├── config/config.php
├── resources/js/
│   └── pages/Index.vue     # First Inertia page
├── routes/
│   ├── web.php
│   ├── api.php
│   └── navigation.php      # Sidebar nav entries
├── tests/e2e/
├── composer.json
└── vite.config.js
```

After generation, activate the module:

```bash
composer require saucebase/blogpost
npm run dev
```

## Installing Modules

### Installation Steps

Follow these steps in order to install any module:

```bash
# 1. Install the module via Composer
composer require saucebase/auth

# 2. Run migrations
php artisan migrate

# 3. Seed module data
php artisan modules:seed --module=auth

# 4. Build frontend assets
npm run build
```

**What each command does:**

1. `composer require` - Downloads the module, registers its service provider, and makes its classes available
2. `php artisan migrate` - Runs all pending migrations, including the module's
3. `php artisan modules:seed --module=auth` - Seeds the module's initial data (roles, demo records, etc.)
4. `npm run build` - Rebuilds frontend assets to include module JavaScript/CSS

### Applying Patches

Some modules include patch files that add things to core files. The most common example is adding a trait to your `User` model.

Patch files live at `modules/{ModuleName}/patches/*.patch`.

Apply a patch with `git apply` from the repo root:

```bash
git apply modules/Auth/patches/user.patch
```

To preview what a patch will change without modifying files:

```bash
git apply --check modules/Auth/patches/user.patch
```

### Docker Environment

If using Docker:

```bash
# Install via Composer (on host machine)
composer require saucebase/auth

# Run migrations and seed (inside Docker container)
docker compose exec app php artisan migrate
docker compose exec app php artisan modules:seed --module=auth

# Build assets (on host machine)
npm run build
```

## Adding Global Components

If your module needs to render a component on every page — like a notification banner, a floating widget, or a panel overlay — you can register it from your module's `setup()` hook instead of editing `App.vue`.

In `modules/YourModule/resources/js/app.ts`, import your component and register it:

```typescript
import { registerGlobalComponent } from '@/lib/globalComponents';
import MyBanner from './components/MyBanner.vue';

export function setup() {
    registerGlobalComponent('top', MyBanner);
}
```

Use `'top'` to render the component **before** the page content, or `'bottom'` to render it **after**. The component will appear on every page automatically — no changes to core files needed.

Your component is responsible for deciding when to render itself (for example, by checking an Inertia shared prop). If the prop isn't set, just return nothing from the template.

## Managing Modules

### Module Status

List all discovered modules:

```bash
php artisan modules:list
```

After adding or removing modules, sync the PHPUnit test suite config:

```bash
php artisan modules:sync
```

### Database Operations

```bash
# Run all migrations (includes module migrations)
php artisan migrate

# Rollback last batch
php artisan migrate:rollback

# Refresh all migrations (CAUTION: destroys data)
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status
```

## Removing Modules

To completely remove a module:

```bash
# 1. Remove from Composer
composer remove saucebase/auth

# 2. Rebuild assets
npm run build
```

## Troubleshooting

### Module Not Found

**Symptoms:** `Class 'Modules\Auth\...' not found`

**Solution:**

```bash
composer dump-autoload
php artisan optimize:clear
```

### Module Routes Not Working

**Check:**
1. Module is installed: `php artisan modules:list`
2. Routes are registered: `php artisan route:list --name=auth`
3. Service provider is loaded

**Fix:**

```bash
php artisan optimize:clear
```

### Frontend Assets Not Loading

**Symptoms:** Module pages show blank or 404

**Solution:**

```bash
npm run build
# OR restart dev server
npm run dev
```

### Migrations Not Running

**Symptoms:** Tables don't exist

**Solution:**

```bash
php artisan migrate
# Check status
php artisan migrate:status
```

## Next Steps

- **[Auth Module](../modules/auth)** — Authentication, OAuth, and user impersonation
- **[Settings Module](../modules/settings)** — User profile and avatar management
- **[Billing Module](../modules/billing)** — Subscriptions and payment processing

---

Modules are the heart of Saucebase. Install what you need, customize freely, and own your code.
