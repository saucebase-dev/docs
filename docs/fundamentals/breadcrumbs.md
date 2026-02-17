---
sidebar_position: 6
title: Breadcrumbs
description: How breadcrumb navigation works in Saucebase
---

# Breadcrumbs

Saucebase provides a backend-driven breadcrumb system. Breadcrumbs are registered in PHP via the `BreadcrumbServiceProvider` and shared automatically to all Vue pages through Inertia props.

## How It Works

1. **Register** breadcrumbs in `BreadcrumbServiceProvider` for each route
2. **Share** automatically via `HandleInertiaRequests` middleware (`$this->getBreadcrumbs()`)
3. **Access** in Vue components via `usePage().props.breadcrumbs`

## Registering Breadcrumbs

Define breadcrumbs for your routes in the service provider:

```php title="app/Providers/BreadcrumbServiceProvider.php"
use Diglactic\Breadcrumbs\Breadcrumbs;
use Diglactic\Breadcrumbs\Generator as BreadcrumbTrail;

// Dashboard
Breadcrumbs::for('dashboard', function (BreadcrumbTrail $trail) {
    $trail->push('Dashboard', route('dashboard'));
});

// Settings > Profile
Breadcrumbs::for('settings.profile', function (BreadcrumbTrail $trail) {
    $trail->parent('dashboard');
    $trail->push('Settings', route('settings.index'));
    $trail->push('Profile', route('settings.profile'));
});
```

Modules can register their own breadcrumbs in their service providers following the same pattern.

## Frontend Usage

Breadcrumbs are available as an Inertia shared prop on every page:

```html
<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';

const breadcrumbs = computed(() => usePage().props.breadcrumbs ?? []);
</script>

<template>
  <nav v-if="breadcrumbs.length" aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm">
    <template v-for="(item, index) in breadcrumbs" :key="index">
      <span v-if="index > 0" class="text-gray-400">/</span>
      <Link
        v-if="item.url && index < breadcrumbs.length - 1"
        :href="item.url"
        class="text-gray-500 hover:text-gray-700"
      >
        {{ item.title }}
      </Link>
      <span v-else class="text-gray-900 font-medium" aria-current="page">
        {{ item.title }}
      </span>
    </template>
  </nav>
</template>
```

## What's Next?

- [Navigation](./navigation.md) — Primary site navigation system
- [Routing](./routing.md) — Laravel and Inertia routing patterns
