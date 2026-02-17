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

### VITE_LOCAL_STORAGE_KEY

Frontend local storage prefix (defaults to `${APP_SLUG}`).

```env
VITE_LOCAL_STORAGE_KEY=saucebase
```

This prevents localStorage conflicts when running multiple applications on localhost.

## Docker vs Local Defaults

When using Docker, `docker-compose.yml` provides fallback values that differ from `.env.example`:

| Component | Docker (default) | Local (default) | Config Variable |
|-----------|-----------------|-----------------|-----------------|
| Cache | `redis` | `database` | `CACHE_STORE` |
| Sessions | `redis` | `database` | `SESSION_DRIVER` |
| Queues | `redis` | `database` | `QUEUE_CONNECTION` |

**Docker** automatically uses Redis with no configuration needed. **Local** uses database drivers to avoid requiring a Redis installation.

To override Docker defaults, explicitly set the variables in `.env`:

```env
CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

## OAuth (Auth Module)

If you've installed the Auth module, configure social login providers.

:::info Configuration Location
OAuth credentials are configured in `modules/Auth/config/services.php`, not `config/services.php`.
:::

### Google OAuth

1. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/)
2. Set authorized redirect URI: `https://localhost/auth/google/callback`

```env title=".env"
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### GitHub OAuth

1. Create OAuth app at [GitHub Developer Settings](https://github.com/settings/developers)
2. Set authorization callback URL: `https://localhost/auth/github/callback`

```env title=".env"
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

:::tip Testing OAuth Locally
OAuth providers typically allow `localhost` for development. Use `https://localhost` as your redirect URL. For production, update the callback URLs to your domain.
:::

## Inertia SSR

Server-side rendering is enabled in `config/inertia.php`, but **disabled by default per-request** via middleware.

**How it works:**

1. **Boot level** (config): SSR server runs when enabled
2. **Request level** (middleware): Disables SSR by default for each request
3. **Response level** (controller): Opt-in with `->withSSR()` or opt-out with `->withoutSSR()`

```php
// Enable SSR for SEO-critical pages
return Inertia::render('Index')->withSSR();

// Default - SSR disabled by middleware
return Inertia::render('Dashboard');
```

Learn more in the [SSR Guide](/fundamentals/ssr).

## Port Conflicts

If default ports are in use, change them in `.env`:

```env
APP_PORT=8080
APP_HTTPS_PORT=8443
FORWARD_DB_PORT=33060
FORWARD_REDIS_PORT=63790
FORWARD_MAILPIT_PORT=8026
```

Then restart:

```bash
docker compose down
docker compose up -d
```

Access your app at `https://localhost:8443` (using your custom HTTPS port).

## Troubleshooting

If configuration changes aren't taking effect:

```bash
php artisan optimize:clear

# In Docker:
docker compose exec app php artisan optimize:clear
docker compose restart app
```

## Next Steps

- **[Explore Directory Structure](/getting-started/directory-structure)** - Understand the codebase layout
- **[Install Modules](/fundamentals/modules)** - Add authentication, settings, and more
- **[Development Commands](/development/commands)** - Learn common development tasks
