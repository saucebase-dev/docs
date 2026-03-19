---
sidebar_position: 3
title: Configuration
description: Configure Saucebase-specific environment variables and settings for your application
---

# Configuration

After installing Saucebase, configure your application through environment variables in the `.env` file (created automatically from `.env.example`). Most variables follow standard Laravel conventions — this page covers only what's unique to Saucebase.

## Saucebase-Specific Variables

### APP_HOST & APP_URL

**These must match** for the application to work correctly.

```env title=".env"
APP_HOST=localhost
APP_URL=https://localhost
```

For custom domains:

```env
APP_HOST=myapp.local
APP_URL=https://myapp.local
```

:::warning Important
`APP_URL` must include the protocol (http/https) and match `APP_HOST`. Mismatched values will cause routing issues.
:::

### APP_SLUG

Project slug used for database naming and storage keys.

```env
APP_SLUG=saucebase
```

- Use lowercase letters and hyphens only
- Keep it short and memorable
- Don't change after deployment (affects storage paths and database names)

This prevents localStorage conflicts when running multiple applications on localhost.


## Module Configuration

Saucebase modules keep their config files inside the module itself, not in the top-level `config/` directory:

| Module | Config file |
|--------|-------------|
| Auth (OAuth) | `modules/Auth/config/services.php` |
| Billing | `modules/Billing/config/billing.php` |
| *(all modules)* | `modules/[Name]/config/` |

This means you won't find OAuth credentials or billing settings in `config/services.php` — look inside the module folder instead.

For setup details, see the individual docs:

- **[Auth Module](/modules/auth)** — Google and GitHub OAuth setup, redirect URIs, social login
- **[Billing Module](/modules/billing)** — Stripe keys and billing configuration
- **[Inertia SSR](/fundamentals/ssr)** — SSR config, middleware, and per-request opt-in

## Next Steps

- **[Explore Directory Structure](/getting-started/directory-structure)** - Understand the codebase layout
- **[Install Modules](/fundamentals/modules)** - Add authentication, settings, and more
- **[Development Commands](/development/commands)** - Learn common development tasks
