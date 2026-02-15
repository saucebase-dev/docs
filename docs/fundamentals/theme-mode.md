---
sidebar_position: 7
title: Dark & Light Mode
description: Implement dark and light theme switching in your Saucebase application using Tailwind CSS and Vue 3
---

# Dark & Light Mode

Saucebase comes with built-in support for dark and light themes using Tailwind CSS 4. Users can toggle between themes, and their preference is saved to local storage.

## Why Dark Mode?

- **User preference**: Many users prefer dark mode for reduced eye strain
- **Battery saving**: Dark mode can save battery on OLED screens
- **Modern UX**: Dark mode is expected in modern applications
- **Accessibility**: Provides options for users with light sensitivity

## How It Works

Tailwind CSS 4 provides a `dark:` variant that applies styles when dark mode is active. Dark mode is enabled by adding a `dark` class to the `<html>` element.

## Basic Implementation

### Toggle Component

Create a theme toggle component:

```html title="resources/js/Components/ThemeToggle.vue"
<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(false);

// Load saved theme preference
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

<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    aria-label="Toggle theme"
  >
    <!-- Sun icon (light mode) -->
    <svg
      v-if="isDark"
      class="w-5 h-5 text-gray-700 dark:text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>

    <!-- Moon icon (dark mode) -->
    <svg
      v-else
      class="w-5 h-5 text-gray-700 dark:text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>
```

### Add to Navigation

Include the theme toggle in your navigation:

```html title="resources/js/Components/Navigation/AppNav.vue"
<script setup lang="ts">
import ThemeToggle from '@/Components/ThemeToggle.vue';
</script>

<template>
  <nav class="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900">
    <div class="flex items-center gap-6">
      <!-- Logo and navigation links -->
    </div>

    <div class="flex items-center gap-4">
      <!-- Other nav items -->
      <ThemeToggle />
    </div>
  </nav>
</template>
```

## Using Dark Mode Classes

Apply dark mode styles using Tailwind's `dark:` variant:

```html title="resources/js/Components/Card.vue"
<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-gray-900 dark:text-white font-semibold">
      Card Title
    </h3>

    <p class="text-gray-600 dark:text-gray-400 mt-2">
      Card content with proper dark mode colors.
    </p>

    <button class="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg">
      Action Button
    </button>
  </div>
</template>
```

## Advanced Theme Toggle

Create a dropdown with multiple theme options (light, dark, system):

```html title="resources/js/Components/ThemeSelector.vue"
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

type Theme = 'light' | 'dark' | 'system';

const selectedTheme = ref<Theme>('system');
const isOpen = ref(false);

const currentIcon = computed(() => {
  if (selectedTheme.value === 'system') {
    return 'computer';
  }
  return selectedTheme.value;
});

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  selectedTheme.value = savedTheme || 'system';
  applyTheme(selectedTheme.value);
});

function selectTheme(theme: Theme) {
  selectedTheme.value = theme;
  isOpen.value = false;
  applyTheme(theme);
  localStorage.setItem('theme', theme);
}

function applyTheme(theme: Theme) {
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  } else {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}

// Listen for system theme changes
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  mediaQuery.addEventListener('change', (e) => {
    if (selectedTheme.value === 'system') {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });
});
</script>

<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      aria-label="Select theme"
    >
      <!-- Current theme icon -->
      <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <!-- Icon changes based on current theme -->
        <path
          v-if="currentIcon === 'light'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
        <path
          v-else-if="currentIcon === 'dark'"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2"
    >
      <button
        @click="selectTheme('light')"
        class="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-100 dark:bg-gray-700': selectedTheme === 'light' }"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        Light
      </button>

      <button
        @click="selectTheme('dark')"
        class="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-100 dark:bg-gray-700': selectedTheme === 'dark' }"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>
        Dark
      </button>

      <button
        @click="selectTheme('system')"
        class="w-full flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{ 'bg-gray-100 dark:bg-gray-700': selectedTheme === 'system' }"
      >
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
        System
      </button>
    </div>
  </div>
</template>
```

## Composable for Theme Management

Create a reusable composable for theme management:

```typescript title="resources/js/composables/useTheme.ts"
import { ref, onMounted } from 'vue';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const currentTheme = ref<Theme>('system');
  const isDark = ref(false);

  function setTheme(theme: Theme) {
    currentTheme.value = theme;
    localStorage.setItem('theme', theme);
    applyTheme();
  }

  function applyTheme() {
    if (currentTheme.value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDark.value = prefersDark;
    } else {
      isDark.value = currentTheme.value === 'dark';
    }

    document.documentElement.classList.toggle('dark', isDark.value);
  }

  function toggleTheme() {
    const newTheme = isDark.value ? 'light' : 'dark';
    setTheme(newTheme);
  }

  onMounted(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    currentTheme.value = savedTheme || 'system';

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (currentTheme.value === 'system') {
        applyTheme();
      }
    });

    applyTheme();
  });

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
  };
}
```

**Usage:**

```html
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

const { currentTheme, isDark, setTheme, toggleTheme } = useTheme();
</script>

<template>
  <button @click="toggleTheme">
    Toggle Theme (Currently: {{ isDark ? 'Dark' : 'Light' }})
  </button>
</template>
```

## Theme Colors

Define your color palette in `tailwind.config.js`:

```javascript title="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Your primary purple
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
    },
  },
  plugins: [],
};
```

## Preventing Flash on Load

Prevent a flash of light mode when loading in dark mode:

```html title="resources/views/app.blade.php"
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Saucebase') }}</title>

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
  <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
    @inertia
  </body>
</html>
```

:::tip Prevent Flashing
Always add the theme-loading script before any other scripts or styles to prevent the flash of unstyled content (FOUC).
:::

## Common Color Patterns

Use these common color patterns for dark mode:

```html
<template>
  <div>
    <!-- Backgrounds -->
    <div class="bg-white dark:bg-gray-900">Main background</div>
    <div class="bg-gray-50 dark:bg-gray-800">Secondary background</div>
    <div class="bg-gray-100 dark:bg-gray-700">Tertiary background</div>

    <!-- Text colors -->
    <p class="text-gray-900 dark:text-white">Primary text</p>
    <p class="text-gray-700 dark:text-gray-200">Secondary text</p>
    <p class="text-gray-500 dark:text-gray-400">Muted text</p>

    <!-- Borders -->
    <div class="border border-gray-200 dark:border-gray-700">
      Content with border
    </div>

    <!-- Interactive elements -->
    <button class="bg-purple-600 hover:bg-purple-700 text-white">
      Button (works in both modes)
    </button>

    <button class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
      Secondary button
    </button>
  </div>
</template>
```

## Best Practices

1. **Test both themes**: Always test your components in both light and dark mode
2. **Respect system preference**: Default to the system theme when no preference is saved
3. **Consistent colors**: Use your design system's color palette consistently
4. **Accessible contrast**: Ensure sufficient contrast in both themes (WCAG AA minimum)
5. **Smooth transitions**: Add `transition-colors duration-200` for smooth theme changes
6. **Save preference**: Store the user's theme choice in local storage

## What's Next?

- Learn about [Navigation](/fundamentals/navigation) to add theme toggles to your navigation
- Explore [Translations](/fundamentals/translations) for multi-language support
- Read about [Modules](/fundamentals/modules) to add theme-aware modules
