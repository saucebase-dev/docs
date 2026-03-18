---
sidebar_position: 4
title: Navigation
description: Add and organize navigation items in your Saucebase application using the Navigation service
---

# Navigation

Saucebase provides a backend-driven navigation system built on [Spatie Navigation](https://github.com/spatie/laravel-navigation). You register menu items in PHP, organize them into groups, and they're automatically shared to your Vue frontend via Inertia props.

## How It Works

- **Register** items in `routes/navigation.php` (or a module's `routes/navigation.php`)
- **Group** items by purpose — `main`, `secondary`, `user`, `settings`, `landing`
- **Access** them in Vue via `usePage().props.navigation`

The Navigation service loads all files automatically — no manual registration or event listeners needed.

## Adding Navigation Items

Use `Navigation::add()` to register items:

```php title="routes/navigation.php"
use App\Facades\Navigation;
use App\Navigation\Section;

Navigation::add('Dashboard', route('dashboard'), function (Section $section) {
    $section->attributes([
        'group' => 'main',
        'slug' => 'dashboard',
        'order' => 0,
    ]);
});
```

### Attributes Reference

| Attribute  | Type   | Description                                                          |
| ---------- | ------ | -------------------------------------------------------------------- |
| `group`    | string | Navigation group (`main`, `secondary`, `user`, `settings`, `landing`) |
| `slug`     | string | Unique identifier for the item (used in testids and as the key)     |
| `icon`     | string | Icon identifier — must be registered via `registerIcon()` in your module's `app.ts` |
| `order`    | int    | Sort order within the group (lower = first)                          |
| `action`   | string | JavaScript action to trigger (e.g., `'logout'`)                     |
| `external` | bool   | Render as `<a>` instead of Inertia `<Link>`                         |
| `newPage`  | bool   | Open in a new tab (`target="_blank"`)                                |
| `class`    | string | Custom CSS classes                                                   |
| `badge`    | array  | Badge config: `['content' => '3', 'variant' => 'destructive']`      |

## Examples

```php title="routes/navigation.php"
use App\Facades\Navigation;
use App\Navigation\Section;

// External link — opens in new tab
Navigation::add('Documentation', 'https://docs.example.com', function (Section $section) {
    $section->attributes([
        'group' => 'secondary',
        'slug' => 'docs',
        'external' => true,
        'newPage' => true,
        'order' => 0,
    ]);
});

// Badge — show a notification count
Navigation::add('Notifications', route('notifications.index'), function (Section $section) {
    $section->attributes([
        'group' => 'main',
        'slug' => 'notifications',
        'order' => 10,
        'badge' => [
            'content' => '3',
            'variant' => 'destructive',
        ],
    ]);
});

// Action-based — triggers JavaScript instead of navigating
Navigation::add('Log out', '#', function (Section $section) {
    $section->attributes([
        'group' => 'user',
        'action' => 'logout',
        'slug' => 'logout',
        'icon' => 'logout',
        'order' => 100,
    ]);
});

// Custom styling
Navigation::add('Admin', route('filament.admin.pages.dashboard'), function (Section $section) {
    $section->attributes([
        'group' => 'secondary',
        'slug' => 'admin',
        'order' => 10,
        'class' => 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20',
    ]);
});
```

### Conditional Items

Two methods for conditional navigation:

- **`addWhen(fn, ...)`** — Evaluates the callback at render time (every request). Use for conditions that change per-request like auth state.
- **`addIf(bool, ...)`** — Checks the condition once at registration time. Use for static conditions like feature flags or database counts.

```php
// addWhen — re-evaluated every request
Navigation::addWhen(
    fn () => Auth::check() && Auth::user()->isAdmin(),
    'Admin', route('filament.admin.pages.dashboard'),
    function (Section $section) { /* ... */ }
);

// addIf — checked once when navigation loads
Navigation::addIf(
    Product::displayable()->count() > 0,
    'Pricing', route('pricing'),
    function (Section $section) { /* ... */ }
);
```

## Module Navigation

Modules register navigation in their own `routes/navigation.php`. The file is loaded automatically when the module is enabled in `modules_statuses.json`.

```php title="modules/Settings/routes/navigation.php"
use App\Facades\Navigation;
use App\Navigation\Section;

Navigation::add('Settings', route('settings.index'), function (Section $section) {
    $section->attributes([
        'group' => 'user',
        'slug' => 'settings',
        'icon' => 'settings',
        'order' => 10,
    ]);
});
```

No additional registration is needed — just create the file and enable the module.

## Navigation Groups

Groups organize items by where they appear in the UI. Use the `group` attribute to assign items:

| Group       | Purpose                                   |
| ----------- | ----------------------------------------- |
| `main`      | Primary sidebar/header navigation         |
| `secondary` | Lower sidebar items (docs, admin links)   |
| `user`      | User dropdown menu (settings, logout)     |
| `settings`  | Settings page sidebar                     |
| `landing`   | Public landing page navigation            |

You can create custom groups by using any string as the group name. They'll appear in `usePage().props.navigation` under that key.

## Icons

Icons are decoupled from PHP — the backend only names them, the frontend decides which component to render.

**In PHP**, set the `icon` attribute to a string identifier:

```php
$section->attributes([
    'slug' => 'roadmap',
    'icon' => 'roadmap',
]);
```

**In your module's `app.ts`**, register the matching component via `registerIcon()`:

```typescript title="modules/Roadmap/resources/js/app.ts"
import { registerIcon } from '@/lib/navigation';
import IconMap from '~icons/heroicons/map';

export function setup() {
    registerIcon('roadmap', IconMap);
}
```

`registerIcon()` is called during app initialization (before Vue mounts), so icons are available by the time any navigation component renders. The `NavIcon` component resolves the string to a component via `resolveIcon()` and logs a warning in development if no match is found.

Core icons (`dashboard`, `github`, `admin`, `documentation`) are pre-registered in `lib/navigation.ts`. Modules register their own icons in their `app.ts` — no changes to core files are needed.

## Frontend Usage

Navigation is shared via Inertia props, grouped by name:

```html
<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';

const { main, secondary, user } = usePage().props.navigation;
</script>

<template>
  <nav>
    <template v-for="item in main" :key="item.slug">
      <a
        v-if="item.external"
        :href="item.url"
        :target="item.newPage ? '_blank' : undefined"
        :class="item.class"
      >
        {{ item.title }}
      </a>
      <Link v-else :href="item.url" :class="[item.class, { 'font-bold': item.active }]">
        {{ item.title }}
        <span v-if="item.badge">{{ item.badge.content }}</span>
      </Link>
    </template>
  </nav>
</template>
```

### MenuItem Interface

```typescript
interface MenuBadge {
  content?: string | number;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  class?: string;
}

interface MenuItem {
  title: string;
  url?: string;
  slug?: string;
  icon?: string | null;
  active?: boolean;
  action?: string;
  external?: boolean;
  newPage?: boolean;
  class?: string;
  badge?: MenuBadge | boolean;
  children?: MenuItem[];
}
```

## What's Next?

- [Breadcrumbs](./breadcrumbs.md) — Hierarchical navigation trails
- [Modules](./modules.md) — Creating and managing modules
- [Routing](./routing.md) — Laravel and Inertia routing patterns
