---
sidebar_position: 1
slug: /what-is-saucebase
title: What is Saucebase
description: A modular Laravel SaaS starter kit with copy-and-own philosophy - build faster with code you fully control
---

import ModuleGrid from '@site/src/components/ModuleGrid';
import FeatureOverview from '@site/src/components/FeatureOverview';

# What is Saucebase?

![Installation Screenshot](</img/preview.gif>)

Saucebase is a modular Laravel SaaS starter kit built on the [VILT stack](/reference/glossary#vilt-stack) (Vue, Inertia.js, Laravel, Tailwind CSS). Unlike traditional starter kits that trap you in vendor packages, Saucebase gives you complete ownership of the code.

When you install Saucebase modules, they copy directly into your repository - not as external dependencies. You own every line of code and can modify, refactor, or rebuild features to match your exact needs. It's a foundation you control, not a framework you're locked into.

Saucebase provides everything you need to build production-ready SaaS applications: authentication, user management, subscriptions, admin panels, and more - all with modern tooling and best practices built in.

<FeatureOverview />

## Why Saucebase?

Building a SaaS means solving the same problems every time: authentication, billing, admin panels, code quality, deployment pipelines. Saucebase solves all of that before you write a single line of your own logic — giving you months back and a production-ready foundation to build on.

**The result: you focus entirely on what makes your product unique.**

### Copy-and-Own Philosophy

Like [shadcn/ui](https://ui.shadcn.com), modules install **directly into your repository**, not as external packages.

**Traditional vs Saucebase approach:**

```bash
composer require vendor/auth-package   # → Stuck in vendor/, can't modify
composer require saucebase/auth        # → Copied to modules/Auth/, you own it
```

**What this means for you:**

- **Yours from day one** — every file, class, and migration lives in your repository. Read it, understand it, adapt it.
- **Change anything, any time** — custom fields, different validation, new relationships: just edit the file. No workarounds, no override ceremonies.
- **You decide when to update** — upstream improvements are always available to pull in. You choose what fits your product and when.
- **Full visibility into your codebase** — no black-box dependencies to trace. When something needs fixing, you know exactly where to look.

:::tip You Are The Vendor
When you install a Saucebase module, you're not adding a dependency. You're acquiring source code. From day one, you control the roadmap, the updates, and the architecture.
:::

## Key Features

Saucebase gives you a production-ready SaaS architecture — scalable, secure, extensible, and high-performance — with the tooling and automation to ship fast and stay confident as you grow.

### Modular Architecture

[Modules](/reference/glossary#module) are self-contained features that install into your codebase. Each module includes everything it needs - models, migrations, controllers, views, tests - and lives in your `modules/` directory where you can modify it freely.

### Modern Development Experience

Saucebase ships a complete development environment so your team is productive from day one:

- **One-command setup** — `bash bin/setup-env` starts everything: Docker containers, SSL certificates, database, assets. Be running in minutes, not hours.
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
<a href="/reference/glossary#laravel">Laravel 13</a> with PHP 8.4+ •
<a href="/reference/glossary#filament">Filament 5</a> admin panel
</td>
</tr>
<tr>
<td><strong>Frontend</strong></td>
<td>
<a href="/reference/glossary#vue-3">Vue 3</a> Composition API •
<a href="/reference/glossary#typescript">TypeScript 5.8</a> •
<a href="/reference/glossary#inertiajs">Inertia.js 3.0</a> •
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

You can get Saucebase running in just a few minutes. Only **[Docker](https://www.docker.com)** and **[Node.js](https://nodejs.org)** are required:

```bash
git clone https://github.com/saucebase-dev/saucebase.git my-app
cd my-app
bash bin/setup-env
```

Open `https://localhost` in your browser and you're ready to build!

:::tip What does this do?
The bootstrap script starts Docker containers (MySQL, Redis, Mailpit), generates SSL certificates, installs dependencies, runs migrations, enables modules, and builds frontend assets. No local PHP required.
:::

[Modules](/reference/glossary#module) are self-contained features that install into your codebase. You can use the pre-built ones or create your own.

**Installing a module is simple:**

```bash
php artisan saucebase:install
```

The interactive installer prompts you to choose modules, runs `composer require`, enables them, and runs migrations. The code lands in your `modules/` directory — open the files and modify them however you want.

If you prefer to install a single module manually:

```bash
composer require saucebase/auth
php artisan module:enable Auth
php artisan module:migrate Auth --seed
```

<ModuleGrid />

:::tip Want to create your own?
Check out our [module creation guide](/fundamentals/modules) to learn how to build custom modules for your specific needs.
:::

## What's Next?

Ready to dive deeper? Here are the key resources to explore:

- **[Installation](/)** - Complete installation and configuration guide
- **[Architecture](/architecture/overview)** - Understand how Saucebase works under the hood
- **[Modules](/fundamentals/modules)** - Learn to work with and create modules
- **[Development](/development/commands)** - Daily development workflow and commands
- **[Reference](/reference/glossary)** - Glossary and troubleshooting guides

**Ready to own your SaaS foundation?** Head to [Getting Started](/) →
