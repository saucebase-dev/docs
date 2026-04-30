# Translations (i18n)

Saucebase provides full internationalization (i18n) support using Laravel's translation system on the backend and `laravel-vue-i18n` on the frontend. This guide covers how to manage translations across your application and modules.

## Overview

Saucebase supports multiple languages out of the box:

- **Default languages**: English (`en`), Portuguese Brazil (`pt_BR`)
- **Backend**: Laravel translation system
- **Frontend**: `laravel-vue-i18n` (loads Laravel translation files in Vue)
- **Module support**: Each module can have its own translations
- **Dynamic loading**: Translations loaded asynchronously on demand

## Architecture

```mermaid
graph LR
    A[Laravel Translations] -->|JSON Files| B[lang/en.json]
    A -->|JSON Files| C[lang/pt_BR.json]
    A -->|Module Translations| D[modules/*/lang/]

    E[Vue Frontend] -->|laravel-vue-i18n| F[Load Translations]
    F -->|Fetch| B
    F -->|Fetch| C
    F -->|Fetch| D

    E -->|trans helper| G[Display Translated Text]
```

## Translation Files

### Core Application Translations

```
lang/
├── en.json                 # English translations
│   {
│       "welcome": "Welcome",
│       "logout": "Logout",
│       "dashboard": "Dashboard"
│   }
└── pt_BR.json              # Portuguese (Brazil) translations
    {
        "welcome": "Bem-vindo",
        "logout": "Sair",
        "dashboard": "Painel"
    }
```

### Module Translations

Modules have their own translation directories:

```
modules/Auth/lang/
├── en/
│   └── auth.php
│       return [
│           'failed' => 'These credentials do not match our records.',
│           'throttle' => 'Too many login attempts.',
│       ];
└── pt_BR/
    └── auth.php
        return [
            'failed' => 'Estas credenciais não correspondem aos nossos registos.',
            'throttle' => 'Muitas tentativas de login.',
        ];
```

## Backend Usage

### Translation Strings

```php
// Simple translation
__('welcome');  // "Welcome"

// Namespaced (from PHP files)
__('auth.failed');  // "These credentials do not match our records."

// Module translations
trans('auth::auth.failed');  // From modules/Auth/lang/en/auth.php

// With replacements
__('Hello, :name', ['name' => 'John']);  // "Hello, John"

// Pluralization
trans_choice('There is one apple|There are many apples', $count);

// Check if translation exists
Lang::has('welcome');  // true/false
```

## Frontend Usage

### Translation Helper

The `trans()` helper is available globally in Vue components:

```html
<script setup lang="ts">
import { trans } from 'laravel-vue-i18n';

// In script
const welcomeMessage = trans('welcome');
const greeting = trans('Hello, :name', { name: 'John' });
</script>

<template>
    <!-- Direct usage in template -->
    <h1>{{ trans('welcome') }}</h1>

    <!-- With replacements -->
    <p>{{ trans('Hello, :name', { name: user.name }) }}</p>

    <!-- Pluralization -->
    <p>{{ transChoice('There is one apple|There are many apples', count) }}</p>
</template>
```

### Translation Methods

```typescript
import { trans, transChoice, loadLanguageAsync } from 'laravel-vue-i18n';

// Simple translation
trans('welcome');  // "Welcome"

// With replacements
trans('Hello, :name', { name: 'John' });  // "Hello, John"

// Pluralization
transChoice('There is one apple|There are many apples', 1);  // "There is one apple"
transChoice('There is one apple|There are many apples', 5);  // "There are many apples"

// Check if translation key exists
isLoaded('welcome');  // true/false

// Get current locale
getActiveLanguage();  // "en"

// Load language asynchronously
await loadLanguageAsync('pt_BR');
```

## Language Selector Component

Saucebase includes a built-in `LanguageSelector` component:

```html
<script setup lang="ts">
import LanguageSelector from '@/components/LanguageSelector.vue';
</script>

<template>
    <header>
        <nav>
            <LanguageSelector />
        </nav>
    </header>
</template>
```

### Customizing LanguageSelector

```html
<!-- resources/js/components/LanguageSelector.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { usePage, router } from '@inertiajs/vue3';
import { loadLanguageAsync } from 'laravel-vue-i18n';
import type { PageProps } from '@/types/global';

const page = usePage<PageProps>();
const locale = computed(() => page.props.locale);

const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt_BR', name: 'Português (BR)' },
];

const changeLanguage = async (newLocale: string) => {
    await loadLanguageAsync(newLocale);

    router.visit(route('locale', { locale: newLocale }), {
        preserveState: true,
        preserveScroll: true,
    });
};
</script>

<template>
    <select
        :value="locale"
        @change="changeLanguage($event.target.value)"
        class="language-selector"
    >
        <option
            v-for="lang in languages"
            :key="lang.code"
            :value="lang.code"
        >
            {{ lang.name }}
        </option>
    </select>
</template>
```

## Locale Switching

### Backend Route

```php
// routes/web.php
Route::get('/locale/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'pt_BR'])) {
        session(['locale' => $locale]);
        app()->setLocale($locale);
    }

    return redirect()->back();
})->name('locale');
```

### Middleware

Set locale from session:

```php
// app/Http/Middleware/SetLocale.php
class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = session('locale', config('app.locale'));

        if (in_array($locale, config('app.available_locales'))) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}

// Register in bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        SetLocale::class,
    ]);
})
```

### Configuration

```php
// config/app.php
'locale' => env('APP_LOCALE', 'en'),
'fallback_locale' => 'en',
'available_locales' => ['en', 'pt_BR'],
```

## Module Translations

### Module Translation Structure

```
modules/Auth/lang/
├── en/
│   ├── auth.php           # Authentication strings
│   ├── validation.php     # Validation messages
│   └── passwords.php      # Password reset strings
└── pt_BR/
    ├── auth.php
    ├── validation.php
    └── passwords.php
```

### Module Translation Loading

Module translations are automatically loaded by the `ModuleServiceProvider`:

```php
abstract class ModuleServiceProvider extends ServiceProvider
{
    protected function registerTranslations(): void
    {
        $langPath = module_path($this->name, 'lang');

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->nameLower);
        }
    }
}
```

### Using Module Translations

```php
// Backend: Use module namespace
trans('auth::auth.failed');
trans('auth::passwords.reset');

// Frontend: Same key structure
trans('auth::auth.failed');
```

### Frontend Module Translation Loading

Module translations are automatically discovered by the `module-loader.js`:

```javascript
// module-loader.js
export function collectModuleLangPaths() {
    const enabledModules = getEnabledModules();
    const langPaths = [];

    enabledModules.forEach((moduleName) => {
        const langPath = `./modules/${moduleName}/lang`;
        if (fs.existsSync(langPath)) {
            langPaths.push(langPath);
        }
    });

    return langPaths;
}
```

Vite configuration automatically includes module translations:

```javascript
// vite.config.js
import { collectModuleLangPaths } from './module-loader.js';

i18nVue({
    resolve: async (lang) => {
        const paths = [
            `../../lang/${lang}.json`,
            ...collectModuleLangPaths().map(p => `${p}/${lang}.json`)
        ];

        // Load and merge all translation files
    },
});
```

## Adding New Languages

### 1. Create Translation Files

```bash
# Core translations
touch lang/es.json

# Module translations
mkdir -p modules/Auth/lang/es
touch modules/Auth/lang/es/auth.php
```

### 2. Add Translations

```json
// lang/es.json
{
    "welcome": "Bienvenido",
    "logout": "Cerrar sesión",
    "dashboard": "Panel de control"
}
```

```php
// modules/Auth/lang/es/auth.php
return [
    'failed' => 'Estas credenciales no coinciden con nuestros registros.',
    'throttle' => 'Demasiados intentos de inicio de sesión.',
];
```

### 3. Update Configuration

```php
// config/app.php
'available_locales' => ['en', 'pt_BR', 'es'],
```

### 4. Add to Language Selector

```typescript
const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt_BR', name: 'Português (BR)' },
    { code: 'es', name: 'Español' },
];
```

## Troubleshooting

### Translations Not Loading

```bash
# Clear Laravel caches
php artisan config:clear
php artisan cache:clear

# Rebuild frontend assets
npm run build

# Restart dev server
npm run dev
```

### Missing Translations

```typescript
// Check if translation exists
import { isLoaded } from 'laravel-vue-i18n';

if (!isLoaded('my.key')) {
    console.warn('Translation key not found: my.key');
}
```

### Module Translations Not Working

1. Check module is installed: `php artisan modules:list`
2. Verify language files exist: `ls modules/Auth/lang/en/`
3. Rebuild assets: `npm run build`
4. Clear caches: `php artisan optimize:clear`

## Next Steps

- [Dark & Light Mode](/fundamentals/theme-mode) - Learn about theme switching
- [Routing](/fundamentals/routing) - Understand routing system
- [SSR](/fundamentals/ssr) - Server-side rendering configuration
