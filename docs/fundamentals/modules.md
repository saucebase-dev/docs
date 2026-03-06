---
sidebar_position: 1
title: Module Management
description: Learn how to install, enable, disable, and remove Saucebase modules
---

# Module Management

Modules are self-contained feature packages that you install directly into your repository. Module code becomes part of your codebase, giving you complete ownership and customization freedom. For the architectural details, see [Module System Architecture](/architecture/module-system).

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

Some modules include patch files that integrate the module into core files like `User.php`, `App.vue`, and `index.d.ts`. These patches add things like model interfaces, Vue component registrations, and TypeScript type definitions that the module requires.

Patch files live at `modules/{ModuleName}/patches/*.patch`.

Apply a single patch with `git apply` from the repo root:

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
