---
sidebar_position: 7
title: Dark & Light Mode
description: How dark and light theme switching works in Saucebase
---

# Dark & Light Mode

Saucebase comes with built-in support for dark and light themes using Tailwind CSS 4. Users can toggle between themes, and their preference is saved to local storage.

## How It Works

Tailwind CSS 4 provides a `dark:` variant that applies styles when dark mode is active. Dark mode is enabled by adding a `dark` class to the `<html>` element.

## Theme Toggle Component

Saucebase includes a `ThemeToggle` component that handles switching between light, dark, and system themes:

```html title="resources/js/Components/ThemeToggle.vue"
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});

function toggleTheme() {
  isDark.value = !isDark.value;
  updateTheme();
}

function updateTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}
</script>
```

Add it to your navigation:

```html
<script setup lang="ts">
import ThemeToggle from '@/Components/ThemeToggle.vue';
</script>

<template>
  <nav class="flex items-center">
    <!-- Other nav items -->
    <ThemeToggle />
  </nav>
</template>
```

## Preventing Flash on Load

To prevent a flash of light mode when a user has dark mode saved, a script runs before any styles load:

```html title="resources/views/app.blade.php"
<head>
    <!-- Prevent flash of light mode -->
    <script>
      (function() {
        const theme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (theme === 'dark' || (!theme && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.ts'])
    @inertiaHead
</head>
```

:::tip
Always add the theme-loading script before any other scripts or styles to prevent the flash of unstyled content (FOUC).
:::

## What's Next?

- Learn about [Navigation](/fundamentals/navigation) to add theme toggles to your navigation
- Explore [Translations](/fundamentals/translations) for multi-language support
