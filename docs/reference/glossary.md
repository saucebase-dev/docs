---
sidebar_position: 2
title: Glossary
description: Technical terms and concepts used throughout Saucebase documentation
---

# Glossary

This page explains technical terms and concepts you'll encounter in Saucebase documentation.

## A

### Artisan
Laravel's command-line interface (CLI) tool. You use it to run commands like `php artisan migrate` or `php artisan serve`. Think of it as Laravel's Swiss Army knife for development tasks.

**Official documentation**: [Laravel Artisan Console](https://laravel.com/docs/artisan)

## C

### Composer
A dependency manager for PHP. It downloads and manages PHP packages your project needs. Similar to npm for Node.js or pip for Python.

**Official website**: [getcomposer.org](https://getcomposer.org/)
**Documentation**: [Composer Documentation](https://getcomposer.org/doc/)

### Copy-and-Own Philosophy
The approach where code installs directly into your repository instead of staying in external packages. You own the code completely and can modify it without maintaining patches or worrying about upstream changes.

This concept has existed in various forms (vendoring, code generators, boilerplates), but was popularized in the modern frontend ecosystem by [shadcn/ui](https://ui.shadcn.com), which pioneered the "copy-paste components" approach. Saucebase applies this same philosophy to Laravel backend modules.

**Example**: When you install the Auth module, the code copies into your `Modules/Auth` directory. It's now yours to customize.

**Read more**: [shadcn/ui Introduction](https://ui.shadcn.com/docs)
**Related concept**: [Vendoring dependencies](https://stackoverflow.blog/2020/05/20/good-coders-borrow-great-coders-steal/)

## D

### Docker
A tool that packages applications and their dependencies into containers. Saucebase uses Docker to run MySQL, Redis, and other services without installing them directly on your machine.

**Official website**: [docker.com](https://www.docker.com/)
**Documentation**: [Docker Documentation](https://docs.docker.com/)
**Get Started**: [Docker Get Started Guide](https://docs.docker.com/get-started/)

### Docusaurus
The static site generator that powers this documentation. Built by Meta (Facebook) for creating documentation websites.

**Official website**: [docusaurus.io](https://docusaurus.io/)
**Documentation**: [Docusaurus Documentation](https://docusaurus.io/docs)
**GitHub**: [facebook/docusaurus](https://github.com/facebook/docusaurus)

## F

### Filament
A Laravel admin panel builder. Saucebase includes Filament 5 for creating admin interfaces quickly.

**Official website**: [filamentphp.com](https://filamentphp.com/)
**Documentation**: [Filament Documentation](https://filamentphp.com/docs)
**GitHub**: [filamentphp/filament](https://github.com/filamentphp/filament)

## H

### HMR (Hot Module Replacement)
A feature that updates your code in the browser instantly without refreshing the page. When you save a Vue component, you see the changes immediately while keeping your application state.

**Documentation**: [Vite HMR API](https://vitejs.dev/guide/api-hmr.html)
**Concept explanation**: [Webpack HMR Concepts](https://webpack.js.org/concepts/hot-module-replacement/)

### Horizon
Laravel's dashboard and configuration system for Redis queues. It gives you a beautiful UI to monitor your background jobs.

**Official documentation**: [Laravel Horizon](https://laravel.com/docs/horizon)
**GitHub**: [laravel/horizon](https://github.com/laravel/horizon)

## I

### Inertia.js
A framework that connects Laravel (backend) and Vue (frontend) without building a traditional API. Your Laravel routes render Vue components directly. Version 2.0 brings improved TypeScript support and better performance.

**Official website**: [inertiajs.com](https://inertiajs.com/)
**Documentation**: [Inertia.js Documentation](https://inertiajs.com/manual)
**GitHub**: [inertiajs/inertia](https://github.com/inertiajs/inertia)

## L

### Laravel
A PHP web application framework. Saucebase is built on Laravel 12 with PHP 8.4+.

**Official website**: [laravel.com](https://laravel.com/)
**Documentation**: [Laravel Documentation](https://laravel.com/docs)
**GitHub**: [laravel/laravel](https://github.com/laravel/laravel)

### Laravel Pint
Laravel's opinionated PHP code formatter. It automatically formats your PHP code to follow Laravel's style guide.

**Official documentation**: [Laravel Pint](https://laravel.com/docs/pint)
**GitHub**: [laravel/pint](https://github.com/laravel/pint)

## M

### Mailpit
A local email testing tool. It captures all emails your application sends during development, so you can view them in a web interface instead of actually sending them.

**Official website**: [mailpit.axllent.org](https://mailpit.axllent.org/)
**GitHub**: [axllent/mailpit](https://github.com/axllent/mailpit)
**Documentation**: [Mailpit Documentation](https://mailpit.axllent.org/docs/)

### Migration
A database version control system in Laravel. Each migration file describes changes to your database structure (creating tables, adding columns, etc.). You run them with `php artisan migrate`.

**Official documentation**: [Laravel Migrations](https://laravel.com/docs/migrations)

### Module
A self-contained feature package in Saucebase. Modules install directly into your `Modules/` directory and include everything needed: controllers, models, views, migrations, tests, and assets.

**Available modules:**
- [Auth](https://github.com/sauce-base/auth) - Authentication with social login
- [Settings](https://github.com/sauce-base/settings) - Settings management

**Learn more**: [Saucebase Modules Documentation](/fundamentals/modules)

## N

### npm (Node Package Manager)
The package manager for JavaScript. You use it to install frontend dependencies and run build scripts like `npm run dev` or `npm run build`.

**Official website**: [npmjs.com](https://www.npmjs.com/)
**Documentation**: [npm Documentation](https://docs.npmjs.com/)
**GitHub**: [npm/cli](https://github.com/npm/cli)

## P

### PHPStan
A static analysis tool that finds bugs in your PHP code without running it. Saucebase uses level 5 to ensure code quality.

**Official website**: [phpstan.org](https://phpstan.org/)
**Documentation**: [PHPStan Documentation](https://phpstan.org/user-guide/getting-started)
**GitHub**: [phpstan/phpstan](https://github.com/phpstan/phpstan)

### Playwright
An end-to-end (E2E) testing framework. It automates browser testing by simulating real user interactions with your application.

**Official website**: [playwright.dev](https://playwright.dev/)
**Documentation**: [Playwright Documentation](https://playwright.dev/docs/intro)
**GitHub**: [microsoft/playwright](https://github.com/microsoft/playwright)

### Pnpm
An alternative package manager to npm. It's faster and uses less disk space by sharing packages between projects.

**Official website**: [pnpm.io](https://pnpm.io/)
**Documentation**: [pnpm Documentation](https://pnpm.io/motivation)
**GitHub**: [pnpm/pnpm](https://github.com/pnpm/pnpm)

## S

### Seeder
A Laravel class that populates your database with test or default data. Useful for development and testing.

**Official documentation**: [Laravel Database Seeding](https://laravel.com/docs/seeding)

### shadcn-vue
A collection of reusable Vue components that you can copy into your project. Like the copy-and-own philosophy, these components become part of your codebase. Saucebase includes shadcn-vue components for UI elements.

**Official website**: [shadcn-vue.com](https://www.shadcn-vue.com/)
**Documentation**: [shadcn-vue Documentation](https://www.shadcn-vue.com/docs/introduction.html)
**GitHub**: [radix-vue/shadcn-vue](https://github.com/radix-vue/shadcn-vue)

### Spatie
A company that creates high-quality Laravel packages. Saucebase uses several Spatie packages:
- **laravel-permission**: Role and permission management
- **laravel-navigation**: Menu building
- **laravel-settings**: Application settings

**Official website**: [spatie.be](https://spatie.be/)
**Open source packages**: [Spatie Packages](https://spatie.be/open-source)
**GitHub**: [spatie](https://github.com/spatie)

### SSR (Server-Side Rendering)
Rendering Vue components on the server before sending HTML to the browser. This improves SEO (search engines see your content) and perceived performance (users see content faster).

**When to use**: Enable SSR for public pages that need good SEO, like landing pages or blog posts.

**When to skip**: Admin dashboards or authenticated pages don't need SSR.

**Documentation**: [Inertia.js SSR](https://inertiajs.com/server-side-rendering)
**Concept guide**: [Vue SSR Guide](https://vuejs.org/guide/scaling-up/ssr.html)

## T

### Tailwind CSS
A utility-first CSS framework. Instead of writing custom CSS, you use classes like `bg-blue-500` or `text-center` directly in your HTML. Saucebase uses Tailwind CSS 4.

**Official website**: [tailwindcss.com](https://tailwindcss.com/)
**Documentation**: [Tailwind CSS Documentation](https://tailwindcss.com/docs)
**GitHub**: [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)

### TypeScript
JavaScript with type checking. It helps catch bugs before running your code and provides better IDE autocomplete. Saucebase uses TypeScript 5.8 for all frontend code.

**Official website**: [typescriptlang.org](https://www.typescriptlang.org/)
**Documentation**: [TypeScript Documentation](https://www.typescriptlang.org/docs/)
**GitHub**: [microsoft/TypeScript](https://github.com/microsoft/TypeScript)

## V

### VILT Stack
**V**ue + **I**nertia + **L**aravel + **T**ailwind. The technology stack that Saucebase is built on.

**Component documentation:**
- [Vue.js](https://vuejs.org/)
- [Inertia.js](https://inertiajs.com/)
- [Laravel](https://laravel.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Vite
A modern build tool for frontend assets. It provides fast hot reload during development and optimized builds for production. Saucebase uses Vite to bundle Vue, TypeScript, and CSS.

**Official website**: [vitejs.dev](https://vitejs.dev/)
**Documentation**: [Vite Documentation](https://vitejs.dev/guide/)
**GitHub**: [vitejs/vite](https://github.com/vitejs/vite)

### Vue 3
A progressive JavaScript framework for building user interfaces. Saucebase uses Vue 3 with the Composition API and `<script setup>` syntax.

**Official website**: [vuejs.org](https://vuejs.org/)
**Documentation**: [Vue 3 Documentation](https://vuejs.org/guide/introduction.html)
**GitHub**: [vuejs/core](https://github.com/vuejs/core)

## Z

### Ziggy
A Laravel package that generates TypeScript route helpers from your Laravel routes. Instead of hardcoding URLs, you use `route('dashboard')` in your Vue components.

**Example:**
```typescript
// Without Ziggy
<a href="/admin/users/123">View User</a>

// With Ziggy
<a :href="route('admin.users.show', { id: 123 })">View User</a>
```

This ensures your frontend routes stay in sync with your backend routes.

**Documentation**: [Ziggy Documentation](https://github.com/tighten/ziggy)
**GitHub**: [tighten/ziggy](https://github.com/tighten/ziggy)

---

## Don't See a Term?

If you encounter a term not listed here, please [open an issue](https://github.com/sauce-base/docs/issues) so we can add it!
