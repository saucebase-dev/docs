---
sidebar_position: 1
slug: /what-is-saucebase
title: What is Saucebase
description: A modular Laravel SaaS starter kit with copy-and-own philosophy - build faster with code you fully control
---

import ModuleGrid from '@site/src/components/ModuleGrid';

# What is Saucebase?

Saucebase is a modular Laravel SaaS starter kit built on the [VILT stack](/reference/glossary#vilt-stack) (Vue 3, Inertia.js, Laravel 12, Tailwind CSS 4). Unlike traditional starter kits that trap you in vendor packages, Saucebase gives you complete ownership of the code.

When you install Saucebase modules, they copy directly into your repository - not as external dependencies. You own every line of code and can modify, refactor, or rebuild features to match your exact needs. It's a foundation you control, not a framework you're locked into.

Saucebase provides everything you need to build production-ready SaaS applications: authentication, team management, subscriptions, admin panels, and more - all with modern tooling and best practices built in.

## Why Saucebase?

Most Laravel starter kits trap you in a vendor package. You fight their architecture, maintain patches, and pray updates don't break your customizations.

**Saucebase solves this with a copy-and-own philosophy.**

### Copy-and-Own Philosophy

Like [shadcn/ui](https://ui.shadcn.com), modules install **directly into your repository**, not as external packages.

**Traditional vs Saucebase approach:**

```bash
composer require vendor/auth-package   # → Stuck in vendor/, can't modify
composer require saucebase/auth        # → Copied to modules/Auth/, you own it
```

**What this means for you:**

- **No vendor controlling your roadmap**: The code is in YOUR repository. You decide what changes, when, and how.
- **Change anything without asking permission**: Need a custom field? Edit the file. Want different validation? Modify the rules. It's your code.
- **No 3am emergencies from upstream changes**: Package updates can't break your code because you control the code.
- **Complete freedom to refactor**: Rebuild features to match your exact architecture. You're not fighting against package assumptions.

:::tip You Are The Vendor
When you install a Saucebase module, you're not adding a dependency. You're acquiring source code. From day one, you control the roadmap, the updates, and the architecture.
:::

## Key Features

Saucebase combines modular architecture with modern tooling to help you build faster while maintaining complete control.

### Modular Architecture

[Modules](/reference/glossary#module) are self-contained features that install into your codebase. Each module includes everything it needs - models, migrations, controllers, views, tests - and lives in your `modules/` directory where you can modify it freely.

### Modern Development Experience

We've optimized the development experience so you can build faster:

- **One-command setup**: Run `php artisan saucebase:install` and Saucebase starts [Docker](/reference/glossary#docker) containers, configures your database, and generates SSL certificates automatically
- **Instant hot reload**: See your changes immediately in the browser with [HMR](/reference/glossary#hmr-hot-module-replacement) (no page refresh needed)
- **Type-safe routes**: [Ziggy](/reference/glossary#ziggy) generates TypeScript helpers from your Laravel routes, so you get autocomplete and type checking
- **SSR when you need it**: Enable [server-side rendering](/reference/glossary#ssr-server-side-rendering) for specific pages to improve SEO and performance

### Production Ready

Saucebase includes everything you need for production deployments:

- **Code quality tools**: [PHPStan](/reference/glossary#phpstan) level 5, [Laravel Pint](/reference/glossary#laravel-pint), ESLint, and commitlint ensure clean, consistent code
- **Comprehensive testing**: [Playwright](/reference/glossary#playwright) for E2E testing, PHPUnit for backend tests, all pre-configured
- **Admin panel**: [Filament 5](/reference/glossary#filament) admin panel included with beautiful UI and powerful tools

## Technology Stack

Saucebase uses cutting-edge tools that make development enjoyable:

<table>
<thead>
<tr>
<th>Category</th>
<th>Technologies</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Backend</strong></td>
<td>
<a href="/reference/glossary#laravel">Laravel 12</a> with PHP 8.4+ •
<a href="/reference/glossary#filament">Filament 5</a> admin panel
</td>
</tr>
<tr>
<td><strong>Frontend</strong></td>
<td>
<a href="/reference/glossary#vue-3">Vue 3</a> Composition API •
<a href="/reference/glossary#typescript">TypeScript 5.8</a> •
<a href="/reference/glossary#inertiajs">Inertia.js 2.0</a> •
<a href="/reference/glossary#tailwind-css">Tailwind CSS 4</a> •
<a href="/reference/glossary#shadcn-vue">shadcn-vue</a> components
</td>
</tr>
<tr>
<td><strong>Dev Tools</strong></td>
<td>
<a href="/reference/glossary#phpstan">PHPStan</a> level 5 •
<a href="/reference/glossary#laravel-pint">Laravel Pint</a> & ESLint •
<a href="/reference/glossary#playwright">Playwright</a> E2E testing •
Commitlint for conventional commits
</td>
</tr>
</tbody>
</table>

## Quick Start

You can get Saucebase running in just a few minutes:

```bash
# Create a new project
composer create-project saucebase/saucebase my-app
cd my-app

# Install and configure everything
php artisan saucebase:install

# Start the development server
npm run dev        # Docker users
composer dev       # Native installation
```

Open `https://localhost` in your browser (Docker) or `http://localhost:8000` (native) and you're ready to build!

:::tip What does saucebase:install do?
This command starts Docker containers (MySQL, Redis, Mailpit), generates SSL certificates, runs migrations, and seeds your database. Everything you need to start developing.
:::

## Available Modules

[Modules](/reference/glossary#module) are self-contained features that install into your codebase. You can use the pre-built ones or create your own.

**Installing a module is simple:**

```bash
# Install the Auth module
composer require saucebase/auth
php artisan module:enable Auth
php artisan module:migrate Auth --seed
```

The code now lives in your `modules/Auth` directory. You can open the files and modify them however you want.

<ModuleGrid modules={[
  {
    title: 'Auth',
    description: 'Complete authentication system with login, registration, password reset, email verification, and OAuth integration (Google, GitHub). Production-ready security with rate limiting and CSRF protection.',
    href: 'https://github.com/sauce-base/auth',
    icon: '',
    status: 'available'
  },
  {
    title: 'Settings',
    description: 'Flexible settings management for both user preferences and system-wide configuration. Supports multiple data types, validation, and caching for optimal performance.',
    href: 'https://github.com/sauce-base/settings',
    icon: '',
    status: 'available'
  },
  {
    title: 'Subscriptions',
    description: 'Stripe-powered subscription management with multiple plans, metered billing, usage tracking, and webhooks. Handle trials, upgrades, and cancellations with ease.',
    href: '#',
    icon: '',
    status: 'coming-soon'
  },
  {
    title: 'Teams',
    description: 'Multi-user team collaboration with role-based permissions, invitations, and team switching. Perfect for B2B SaaS applications with organizational structures.',
    href: '#',
    icon: '',
    status: 'coming-soon'
  }
]} />

:::tip Want to create your own?
Check out our [module creation guide](/fundamentals/modules) to learn how to build custom modules for your specific needs.
:::

## What's Next?

Ready to dive deeper? Here are the key resources to explore:

- **[Get Started](/)** - Complete installation and configuration guide
- **[Architecture](/architecture/overview)** - Understand how Saucebase works under the hood
- **[Modules](/fundamentals/modules)** - Learn to work with and create modules
- **[Development](/development/commands)** - Daily development workflow and commands
- **[Reference](/reference/glossary)** - Glossary and troubleshooting guides

## Need Help?

We're here to help you succeed with Saucebase:

- **Documentation**: You're already here! Use the search bar above to find what you need
- **Found a bug?**: [Report it on GitHub Issues](https://github.com/sauce-base/saucebase/issues)
- **Have questions?**: [Ask the community on GitHub Discussions](https://github.com/sauce-base/saucebase/discussions)
- **Browse the code**: [Main Repository](https://github.com/sauce-base/saucebase)

:::tip Check the Troubleshooting Guide
Many common issues are already solved in our [troubleshooting guide](/reference/troubleshooting). Check there first!
:::

## License

Saucebase is open-source software licensed under the [MIT license](https://opensource.org/licenses/MIT). You can use it freely in your projects, modify it, and even use it commercially.

---

**Ready to own your SaaS foundation?** Head to [Getting Started](/) →
