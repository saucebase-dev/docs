---
sidebar_position: 4
title: Navigation
description: Learn how to implement navigation in Saucebase using Inertia.js and the Navigation service
---

# Navigation

Saucebase provides two complementary approaches to navigation:

1. **Frontend Navigation** - Static links using Inertia's Link component
2. **Backend Navigation System** - Dynamic, file-based menu registration with automatic frontend sharing

## Frontend Navigation

For simple static navigation, use Inertia's Link component with Ziggy route helpers:

```vue title="resources/js/Components/Navigation/SimpleNav.vue"
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
</script>

<template>
  <nav class="flex gap-4">
    <Link
      :href="route('dashboard')"
      class="px-4 py-2 text-gray-600 hover:text-gray-900"
    >
      Dashboard
    </Link>

    <Link
      :href="route('profile.show')"
      class="px-4 py-2 text-gray-600 hover:text-gray-900"
    >
      Profile
    </Link>

    <a
      href="https://docs.example.com"
      target="_blank"
      rel="noopener noreferrer"
      class="px-4 py-2 text-gray-600 hover:text-gray-900"
    >
      Documentation
    </a>
  </nav>
</template>
```

**Key points:**
- Use `Link` component for internal navigation
- Use Ziggy's `route()` helper for type-safe Laravel routes
- Use regular `<a>` tags for external links
- Inertia automatically handles client-side navigation without page reloads

---

## Backend Navigation System

For dynamic menus that need to be shared across your application, Saucebase provides a file-based Navigation system that automatically loads and shares navigation items with your frontend.

### Overview

The Navigation Service extends [Spatie Navigation](https://github.com/spatie/laravel-navigation) with:

- **File-based registration** - Define navigation in `routes/navigation.php`
- **Module-aware loading** - Automatically loads navigation from enabled modules
- **Runtime conditions** - Show/hide items based on user permissions
- **Grouped navigation** - Organize items (main, secondary, user, settings)
- **Automatic frontend sharing** - Available in Vue via Inertia props

### Quick Start

Create navigation items in `routes/navigation.php`:

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

### Navigation Attributes

Configure navigation items using the `attributes()` method:

| Attribute  | Type   | Description                                      |
| ---------- | ------ | ------------------------------------------------ |
| `group`    | string | Navigation group (main, secondary, user, etc.)   |
| `slug`     | string | Unique identifier                                 |
| `order`    | int    | Sort order (lower = higher priority)              |
| `action`   | string | JavaScript action (e.g., 'logout')                |
| `external` | bool   | External link flag                                |
| `newPage`  | bool   | Open in new tab                                   |
| `class`    | string | Custom CSS classes                                |
| `badge`    | array  | Badge: `['content' => '1', 'variant' => 'destructive']` |

**Examples:**

```php title="routes/navigation.php"
// External link
Navigation::add('GitHub', 'https://github.com/username/repo', function (Section $section) {
    $section->attributes([
        'group' => 'secondary',
        'slug' => 'github',
        'external' => true,
        'newPage' => true,
        'order' => 0,
    ]);
});

// With badge
Navigation::add('Settings', route('settings.index'), function (Section $section) {
    $section->attributes([
        'group' => 'secondary',
        'slug' => 'settings',
        'order' => 10,
        'badge' => [
            'content' => '1',
            'variant' => 'destructive',
        ],
    ]);
});

// Action-based (no URL navigation)
Navigation::add('Log out', '#', function (Section $section) {
    $section->attributes([
        'group' => 'user',
        'action' => 'logout',
        'slug' => 'logout',
        'order' => 100,
    ]);
});

// With custom styling
Navigation::add('Admin', route('filament.admin.pages.dashboard'), function (Section $section) {
    $section->attributes([
        'group' => 'secondary',
        'slug' => 'admin',
        'order' => 10,
        'external' => true,
        'newPage' => true,
        'class' => 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20',
    ]);
});
```

### Runtime Conditions

Use `addWhen()` to show items conditionally based on runtime state:

```php title="routes/navigation.php"
use Illuminate\Support\Facades\Auth;

Navigation::addWhen(
    fn () => Auth::check() && Auth::user()->isAdmin(),
    'Admin',
    route('filament.admin.pages.dashboard'),
    function (Section $section) {
        $section->attributes([
            'group' => 'secondary',
            'slug' => 'admin',
            'order' => 10,
        ]);
    }
);
```

The condition is evaluated at render time, allowing dynamic visibility based on:
- User permissions
- Session data
- Feature flags
- Database state

### Module Navigation

Modules can register navigation by creating `routes/navigation.php`:

```php title="modules/Auth/routes/navigation.php"
use App\Facades\Navigation;
use App\Navigation\Section;

Navigation::add('Log out', '#', function (Section $section) {
    $section->attributes([
        'group' => 'user',
        'action' => 'logout',
        'slug' => 'logout',
        'order' => 100,
    ]);
});
```

**Example from Settings module:**

```php title="modules/Settings/routes/navigation.php"
// User menu
Navigation::add('Settings', route('settings.index'), function (Section $section) {
    $section->attributes([
        'group' => 'user',
        'slug' => 'settings',
        'order' => 10,
    ]);
});

// Settings sidebar
Navigation::add('General', route('settings.index'), function (Section $section) {
    $section->attributes([
        'group' => 'settings',
        'slug' => 'general',
        'order' => 10,
    ]);
});

Navigation::add('Profile', route('settings.profile'), function (Section $section) {
    $section->attributes([
        'group' => 'settings',
        'slug' => 'profile',
        'order' => 20,
    ]);
});
```

Navigation is automatically loaded when the module is enabled in `modules_statuses.json`.

### Frontend Integration

Navigation is automatically shared with Vue via Inertia props. Access it in any component:

```vue
<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';

const page = usePage();
const navigation = page.props.navigation;

// Access specific groups
const mainNav = navigation.main;
const secondaryNav = navigation.secondary;
const userNav = navigation.user;
</script>

<template>
  <nav>
    <!-- Main navigation -->
    <div v-for="item in mainNav" :key="item.slug">
      <Link
        :href="item.url"
        :class="{ 'active': item.active, [item.class]: item.class }"
      >
        {{ item.title }}
        <span v-if="item.badge" class="badge">
          {{ item.badge.content }}
        </span>
      </Link>
    </div>
  </nav>
</template>
```

#### MenuItem Structure

Each navigation item has the following structure:

```typescript
interface MenuItem {
  title: string;           // Display text
  url: string | null;      // Link URL
  active: boolean;         // Current page match
  slug: string;            // Unique identifier
  action?: string;         // JavaScript action
  external?: boolean;      // External link flag
  newPage?: boolean;       // Open in new tab
  class?: string;          // Custom CSS classes
  badge?: {
    content: string;
    variant: string;
  };
  children?: MenuItem[];   // Nested items
}
```

### How the System Works

The Navigation system follows this flow:

#### 1. Registration

**NavigationServiceProvider** registers the custom Navigation service and automatically calls `load()`:

```php title="app/Providers/NavigationServiceProvider.php"
public function register(): void
{
    // Bind our custom Navigation class as scoped (fresh per request)
    $this->app->scoped(Navigation::class, function ($app) {
        return new Navigation($app->make(ActiveUrlChecker::class));
    });

    // Also bind Spatie's class to our implementation so existing DI still works
    $this->app->alias(Navigation::class, \Spatie\Navigation\Navigation::class);

    // Register global alias for the facade
    AliasLoader::getInstance(['Navigation' => NavigationFacade::class]);

    // Auto-load navigation files when the Navigation instance is resolved
    $this->app->resolving(Navigation::class, function (Navigation $navigation): Navigation {
        return $navigation->load();
    });
}
```

#### 2. File Discovery

The `load()` method automatically discovers and loads navigation files:

```php title="app/Services/Navigation.php (excerpt)"
public function load(): self
{
    // Load core navigation
    $coreNavigationPath = base_path('routes/navigation.php');
    if (file_exists($coreNavigationPath)) {
        require_once $coreNavigationPath;
    }

    // Load module navigation
    $modulesStatusPath = base_path('modules_statuses.json');
    if (file_exists($modulesStatusPath)) {
        $modulesStatus = json_decode(file_get_contents($modulesStatusPath), true);

        foreach ($modulesStatus as $moduleName => $enabled) {
            if ($enabled) {
                $moduleNavigationPath = base_path("modules/{$moduleName}/routes/navigation.php");
                if (file_exists($moduleNavigationPath)) {
                    require_once $moduleNavigationPath;
                }
            }
        }
    }

    return $this;
}
```

**Key behaviors:**
- Checks `modules_statuses.json` to determine which modules are enabled
- Only loads navigation files from enabled modules
- No event listeners or manual registration needed
- Files are loaded once when the Navigation service is first resolved

#### 3. Transformation & Grouping

**HandleInertiaRequests** middleware calls `treeGrouped()` to process navigation:

```php title="app/Http/Middleware/HandleInertiaRequests.php (excerpt)"
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'locale' => app()->getLocale(),
        'modules' => fn () => collect(Module::allEnabled())
            ->mapWithKeys(fn ($module, $key) => [$key => $module->getName()])
            ->all(),
        'navigation' => fn () => app(Navigation::class)->treeGrouped(),
        'breadcrumbs' => $this->getBreadcrumbs(),
        'toast' => fn () => $request->session()->pull('toast'),
        'ziggy' => fn () => [
            ...(new Ziggy)->toArray(),
            'location' => $request->url(),
        ],
    ]);
}
```

The `treeGrouped()` method:
1. Groups items by their `group` attribute
2. Filters items based on `when` callables (runtime conditions)
3. Transforms to MenuItem format (removes internal attributes)
4. Calculates active state by comparing URLs
5. Sorts by `order` attribute within each group

#### 4. Frontend Access

Vue components receive navigation via Inertia props:

```vue
<script setup lang="ts">
const navigation = usePage().props.navigation;
// navigation = {
//   main: [...MenuItem[]],
//   secondary: [...MenuItem[]],
//   user: [...MenuItem[]],
//   settings: [...MenuItem[]],
// }
</script>
```

### Complete Example

Here's a full `routes/navigation.php` demonstrating various features:

```php title="routes/navigation.php"
use Illuminate\Support\Facades\Auth;
use App\Facades\Navigation;
use App\Navigation\Section;

// Main navigation
Navigation::add('Dashboard', route('dashboard'), function (Section $section) {
    $section->attributes([
        'group' => 'main',
        'slug' => 'dashboard',
        'order' => 0,
    ]);
});

// Secondary navigation - External links
Navigation::add('Star us on Github', 'https://github.com/sauce-base/saucebase', function (Section $section) {
    $section->attributes([
        'group' => 'secondary',
        'slug' => 'github',
        'external' => true,
        'newPage' => true,
        'order' => 0,
    ]);
});

Navigation::add('Documentation', 'https://sauce-base.github.io/docs', function (Section $section) {
    $section->attributes([
        'group' => 'secondary',
        'slug' => 'documentation',
        'external' => true,
        'newPage' => true,
        'order' => 10,
    ]);
});

// Conditional navigation - Admin only
Navigation::addWhen(
    fn () => Auth::check() && Auth::user()->isAdmin(),
    'Admin',
    route('filament.admin.pages.dashboard'),
    function (Section $section) {
        $section->attributes([
            'group' => 'secondary',
            'slug' => 'admin',
            'order' => 20,
            'external' => true,
            'newPage' => true,
            'class' => 'bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 hover:text-yellow-400',
        ]);
    }
);
```

## What's Next?

- [Breadcrumbs](./breadcrumbs.md) - Implement breadcrumb trails for hierarchical navigation
- [Modules](./modules.md) - Learn about creating and managing modules
- [Routing](./routing.md) - Understand Laravel and Inertia routing patterns
