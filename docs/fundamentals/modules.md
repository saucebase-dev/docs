---
sidebar_position: 1
title: Module Management
description: Learn how to install, enable, disable, and remove Saucebase modules
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

The command generates a ready-to-use structure under `Modules/{Name}/`:

```
Modules/BlogPost/
├── app/
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
├── module.json
└── vite.config.js
```

After generation, activate the module:

```bash
composer dump-autoload
php artisan module:enable BlogPost
npm run dev
```

### Alternative: `module:make`

The underlying `nwidart/laravel-modules` package also provides a generator:

```bash
php artisan module:make BlogPost
```

This works but produces generic stubs — it won't include the Filament plugin, Vite config, Taskfile entry, or navigation route that `saucebase:recipe` sets up.

## Installing Modules

### Installation Steps

Follow these steps in order to install any module:

```bash
# 1. Install the module via Composer
composer require saucebase/auth

# 2. Regenerate autoload files
composer dump-autoload

# 3. Enable the module
php artisan module:enable Auth

# 4. Run migrations and seeders
php artisan module:migrate Auth --seed

# 5. Build frontend assets
npm run build
```

**What each command does:**

1. `composer require` - Downloads the module and adds it to `composer.json`
2. `composer dump-autoload` - Regenerates autoloader to include new module classes
3. `module:enable` - Marks the module as enabled in `modules_statuses.json`
4. `module:migrate --seed` - Runs database migrations and seeds sample data
5. `npm run build` - Rebuilds frontend assets to include module JavaScript/CSS

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
composer dump-autoload

# Enable and migrate (inside Docker container)
docker compose exec app php artisan module:enable Auth
docker compose exec app php artisan module:migrate Auth --seed

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

### Enable/Disable Modules

```bash
# Enable a module
php artisan module:enable Auth

# Disable a module
php artisan module:disable Auth

# List all modules
php artisan module:list
```

When you enable/disable modules, **always rebuild frontend assets**:

```bash
npm run build
# OR restart dev server
npm run dev
```

### Module Status

Check which modules are enabled:

```bash
php artisan module:list
```

Or view `modules_statuses.json`:

```json title="modules_statuses.json"
{
  "Auth": true,
  "Billing": true,
  "Settings": true
}
```

Only modules with `true` are loaded.

### Database Operations

```bash
# Run migrations
php artisan module:migrate Auth

# Rollback migrations
php artisan module:migrate-rollback Auth

# Refresh migrations (drop + re-run)
php artisan module:migrate-refresh Auth

# Seed data
php artisan module:seed Auth

# Migrate and seed together
php artisan module:migrate Auth --seed
```

## Removing Modules

To completely remove a module:

```bash
# 1. Disable the module
php artisan module:disable Auth

# 2. Rollback migrations (if desired)
php artisan module:migrate-rollback Auth

# 3. Remove from Composer
composer remove saucebase/auth

# 4. Delete the directory
rm -rf modules/Auth

# 5. Rebuild assets
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
1. Module is enabled: `php artisan module:list`
2. Routes are registered: `php artisan route:list --name=auth`
3. Service provider is loaded

**Fix:**

```bash
php artisan module:enable Auth
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
php artisan module:migrate Auth
# Check status
php artisan module:migrate-status Auth
```

## Next Steps

- **[Auth Module](../modules/auth)** — Authentication, OAuth, and user impersonation
- **[Settings Module](../modules/settings)** — User profile and avatar management
- **[Billing Module](../modules/billing)** — Subscriptions and payment processing

---

Modules are the heart of Saucebase. Install what you need, customize freely, and own your code.
