---
sidebar_position: 2
title: Routing
description: How routing works in Saucebase with Laravel, Inertia.js, and Ziggy
---

# Routing

Saucebase uses Laravel routes with Inertia.js for SPA navigation and Ziggy to access named routes from TypeScript. Module routes are loaded automatically when a module is enabled.

## Module Routes

Each module defines its own routes in `modules/<ModuleName>/routes/web.php`:

```php title="modules/Auth/routes/web.php"
use Modules\Auth\app\Http\Controllers\AuthController;

Route::prefix('auth')->name('auth.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
```

## Inertia Page Resolution

Saucebase extends Inertia's page resolution to support modular architecture with **namespace syntax**.

### Core Pages

Render pages from `resources/js/pages/`:

```php
// Renders: resources/js/pages/Dashboard.vue
return Inertia::render('Dashboard');

// Renders: resources/js/pages/Settings/Profile.vue
return Inertia::render('Settings/Profile');
```

### Module Pages

Use namespace syntax to render pages from `modules/<ModuleName>/resources/js/pages/`:

```php
// Renders: modules/Auth/resources/js/pages/Login.vue
return Inertia::render('Auth::Login');

// Renders: modules/Settings/resources/js/pages/Index.vue
return Inertia::render('Settings::Index');

// Renders: modules/Settings/resources/js/pages/Profile/Edit.vue
return Inertia::render('Settings::Profile/Edit');
```

**Namespace format**: `ModuleName::PagePath`

### How It Works

The `resolveModularPageComponent()` function in `resources/js/lib/utils.ts` handles page resolution:

1. Checks if the page name contains `::`
2. If yes, extracts module name and page path
3. Resolves to: `modules/<Module>/resources/js/pages/<Page>.vue`
4. If no, resolves to: `resources/js/pages/<Page>.vue`

## Ziggy

Ziggy is pre-configured — use the global `route()` function anywhere in your TypeScript:

```typescript
route('dashboard')                              // /dashboard
route('user.show', { id: 1 })                  // /users/1
route('post.comments.show', { post: 1, comment: 5 }) // /posts/1/comments/5
```

Use it with Inertia's `<Link>` component for SPA navigation:

```html
<template>
    <Link :href="route('dashboard')">Dashboard</Link>
</template>
```

## Locale Routing

Saucebase includes a `POST /locale/{locale}` route handled by `LocalizationController`. It validates the locale against `config('app.available_locales')`, sets it via `App::setLocale()`, stores it in the session, and returns a JSON response.

```html
<script setup lang="ts">
import axios from 'axios';

const changeLocale = async (locale: string) => {
    await axios.post(route('locale', { locale }));
};
</script>

<template>
    <button @click="changeLocale('en')">English</button>
    <button @click="changeLocale('pt_BR')">Português</button>
</template>
```

## Next Steps

- [Translations](/fundamentals/translations) — Learn about multi-language support
- [SSR](/fundamentals/ssr) — Understand server-side rendering
- [Modules](/fundamentals/modules) — Learn about the module system
