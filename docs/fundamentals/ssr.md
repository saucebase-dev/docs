---
sidebar_position: 3
title: Server-Side Rendering (SSR)
description: Learn how to use server-side rendering in Saucebase for better SEO and performance
---

# Server-Side Rendering (SSR)

Saucebase supports optional server-side rendering (SSR) with Inertia.js, allowing you to control SSR on a per-page basis. Use SSR for public pages that need SEO, and skip it for authenticated pages for better performance.

## How SSR Works in Saucebase

SSR is **disabled by default** for every request via middleware. Controllers opt in with `->withSSR()` on any `Inertia::render()` response. Use it on public pages that need SEO; leave it off for authenticated pages.

## Configuration

```php title="config/inertia.php"
'ssr' => [
    'enabled' => (bool) env('INERTIA_SSR_ENABLED', true),
    'url' => env('INERTIA_SSR_URL', 'http://127.0.0.1:13714'),
],
```

```env title=".env"
INERTIA_SSR_ENABLED=true
INERTIA_SSR_URL=http://127.0.0.1:13714
```

## Using SSR in Controllers

Add `->withSSR()` to any `Inertia::render()` call to enable SSR for that page:

```php
class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Index')
            ->with('products', Product::featured()->get())
            ->withSSR();
    }
}
```

:::tip Default behavior
SSR is off by default — you only need `->withSSR()` to opt in. Use `->withoutSSR()` if you ever need to be explicit about disabling it.
:::

## Starting the SSR Server

:::tip
`composer dev` starts the SSR server automatically.
:::

To start it manually:

```bash
php artisan inertia:start-ssr
```

## Technical Implementation

Saucebase-specific files:

- **`resources/js/app.ts`** — client-side entry point
- **`resources/js/ssr.ts`** — server-side entry point
- **`app/Providers/MacroServiceProvider.php`** — registers the `->withSSR()` and `->withoutSSR()` macros
- **`app/Http/Middleware/HandleInertiaRequests.php`** — disables SSR by default for every request

## Next Steps

- **[Routing](/fundamentals/routing)** — Learn about routing with Ziggy
- **[Modules](/fundamentals/modules)** — Module page resolution with namespace syntax
- **[Dark & Light Mode](/fundamentals/theme-mode)** — Theme customization and switching
- **[Testing Guide](/development/testing-guide)** — Test SSR with Playwright helpers
