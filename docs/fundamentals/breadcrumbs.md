---
sidebar_position: 6
title: Breadcrumbs
description: Implement breadcrumb navigation in your Saucebase application for better user experience and hierarchical page navigation
---

# Breadcrumbs

Breadcrumbs provide hierarchical navigation that shows users where they are in your application. They improve user experience by making it easy to navigate back through parent pages.

## Why Use Breadcrumbs?

- **Better UX**: Users can quickly navigate to parent pages
- **Context**: Shows the current page's position in the site hierarchy
- **Accessibility**: Screen readers can understand page relationships
- **SEO**: Search engines use breadcrumbs to understand site structure

## Basic Breadcrumb Component

Create a reusable breadcrumb component:

```html title="resources/js/Components/Breadcrumbs.vue"
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface Props {
  items: Breadcrumb[];
}

defineProps<Props>();
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm">
    <Link
      :href="route('dashboard')"
      class="text-gray-500 hover:text-gray-700"
    >
      Home
    </Link>

    <template v-for="(item, index) in items" :key="index">
      <svg
        class="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>

      <Link
        v-if="item.href"
        :href="item.href"
        class="text-gray-500 hover:text-gray-700"
      >
        {{ item.label }}
      </Link>

      <span
        v-else
        class="text-gray-900 font-medium"
        aria-current="page"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
```

## Using Breadcrumbs in Pages

Pass breadcrumb data from your Laravel controller and display it in your Vue pages:

### Backend - Laravel Controller

```php title="app/Http/Controllers/ProjectController.php"
<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;

class ProjectController extends Controller
{
    public function show(Project $project)
    {
        return Inertia::render('Projects/Show', [
            'project' => $project,
            'breadcrumbs' => [
                ['label' => 'Projects', 'href' => route('projects.index')],
                ['label' => $project->name],
            ],
        ]);
    }

    public function edit(Project $project)
    {
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'breadcrumbs' => [
                ['label' => 'Projects', 'href' => route('projects.index')],
                ['label' => $project->name, 'href' => route('projects.show', $project)],
                ['label' => 'Edit'],
            ],
        ]);
    }
}
```

### Frontend - Vue Page

```html title="resources/js/Pages/Projects/Show.vue"
<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import Breadcrumbs, { type Breadcrumb } from '@/Components/Breadcrumbs.vue';

interface Props {
  project: {
    id: number;
    name: string;
    description: string;
  };
  breadcrumbs: Breadcrumb[];
}

defineProps<Props>();
</script>

<template>
  <AppLayout>
    <div class="py-6">
      <Breadcrumbs :items="breadcrumbs" />

      <h1 class="mt-4 text-3xl font-bold">
        {{ project.name }}
      </h1>

      <p class="mt-2 text-gray-600">
        {{ project.description }}
      </p>
    </div>
  </AppLayout>
</template>
```

## Automatic Breadcrumbs

Generate breadcrumbs automatically based on the current route:

```html title="resources/js/Components/AutoBreadcrumbs.vue"
<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import { route } from 'ziggy-js';

const page = usePage();

const breadcrumbs = computed(() => {
  const segments = page.url.split('/').filter(Boolean);
  const items = [];

  let path = '';
  for (const segment of segments) {
    path += `/${segment}`;

    // Capitalize and format the segment
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    items.push({
      label,
      href: path,
    });
  }

  // Last item should not be a link (current page)
  if (items.length > 0) {
    items[items.length - 1].href = undefined;
  }

  return items;
});
</script>

<template>
  <nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm">
    <Link
      :href="route('dashboard')"
      class="text-gray-500 hover:text-gray-700"
    >
      Home
    </Link>

    <template v-for="(item, index) in breadcrumbs" :key="index">
      <svg
        class="w-4 h-4 text-gray-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>

      <Link
        v-if="item.href"
        :href="item.href"
        class="text-gray-500 hover:text-gray-700"
      >
        {{ item.label }}
      </Link>

      <span
        v-else
        class="text-gray-900 font-medium"
        aria-current="page"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
```

## Styled Breadcrumbs

Create a more visually appealing breadcrumb component:

```html title="resources/js/Components/StyledBreadcrumbs.vue"
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

export interface Breadcrumb {
  label: string;
  href?: string;
  icon?: string;
}

interface Props {
  items: Breadcrumb[];
}

defineProps<Props>();
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    class="flex items-center space-x-1 bg-white rounded-lg border px-4 py-3 shadow-sm"
  >
    <Link
      :href="route('dashboard')"
      class="flex items-center text-gray-500 hover:text-purple-600 transition"
    >
      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
      </svg>
      Home
    </Link>

    <template v-for="(item, index) in items" :key="index">
      <svg
        class="w-5 h-5 text-gray-300"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>

      <Link
        v-if="item.href"
        :href="item.href"
        class="text-gray-500 hover:text-purple-600 transition"
      >
        {{ item.label }}
      </Link>

      <span
        v-else
        class="text-gray-900 font-semibold"
        aria-current="page"
      >
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
```

**Usage with styled breadcrumbs:**

```html
<StyledBreadcrumbs
  :items="[
    { label: 'Projects', href: route('projects.index') },
    { label: 'Web Application', href: route('projects.show', project.id) },
    { label: 'Settings' },
  ]"
/>
```

## Breadcrumbs in Layouts

Add breadcrumbs to your application layout for consistent navigation:

```html title="resources/js/Layouts/AppLayout.vue"
<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import Breadcrumbs, { type Breadcrumb } from '@/Components/Breadcrumbs.vue';

const page = usePage();

// Check if the current page has breadcrumbs
const breadcrumbs = computed(() => {
  return (page.props.breadcrumbs as Breadcrumb[]) || [];
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav>
      <!-- Your navigation menu -->
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Breadcrumbs -->
      <Breadcrumbs
        v-if="breadcrumbs.length > 0"
        :items="breadcrumbs"
        class="mb-6"
      />

      <!-- Page content -->
      <slot />
    </main>
  </div>
</template>
```

## SEO-Friendly Breadcrumbs

Add structured data for search engines:

```html title="resources/js/Components/SEOBreadcrumbs.vue"
<script setup lang="ts">
import { Link, Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import { route } from 'ziggy-js';

export interface Breadcrumb {
  label: string;
  href?: string;
}

interface Props {
  items: Breadcrumb[];
}

const props = defineProps<Props>();

// Generate JSON-LD structured data for Google
const structuredData = computed(() => {
  const baseUrl = window.location.origin;
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${baseUrl}${route('dashboard')}`,
    },
    ...props.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.label,
      item: item.href ? `${baseUrl}${item.href}` : undefined,
    })),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
});
</script>

<template>
  <div>
    <!-- Structured data for SEO -->
    <Head>
      <script
        type="application/ld+json"
        v-html="JSON.stringify(structuredData)"
      />
    </Head>

    <!-- Visible breadcrumbs -->
    <nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-sm">
      <Link
        :href="route('dashboard')"
        class="text-gray-500 hover:text-gray-700"
      >
        Home
      </Link>

      <template v-for="(item, index) in items" :key="index">
        <svg
          class="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>

        <Link
          v-if="item.href"
          :href="item.href"
          class="text-gray-500 hover:text-gray-700"
        >
          {{ item.label }}
        </Link>

        <span
          v-else
          class="text-gray-900 font-medium"
          aria-current="page"
        >
          {{ item.label }}
        </span>
      </template>
    </nav>
  </div>
</template>
```

:::tip SEO Benefits
Structured data helps search engines understand your site hierarchy and can display rich breadcrumbs in search results.
:::

## Best Practices

1. **Always include Home**: Start breadcrumbs with a link to the homepage or dashboard
2. **Current page is not a link**: The last breadcrumb should not be clickable
3. **Keep it concise**: Use short, descriptive labels
4. **Maintain hierarchy**: Breadcrumbs should reflect the actual site structure
5. **Use aria labels**: Add `aria-label="Breadcrumb"` for screen readers
6. **Responsive design**: Consider hiding breadcrumbs on mobile or using a compact view

## What's Next?

- Learn about [Navigation](/fundamentals/navigation) for primary site navigation
- Explore [Routing](/fundamentals/routing) to understand route structure
- Read about [Dark/Light Mode](/fundamentals/theme-mode) for theme customization
