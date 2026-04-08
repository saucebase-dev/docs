---
sidebar_position: 2
slug: /
title: Installation
description: Install Saucebase locally using Docker — get running in three commands.
---

import ModuleGrid from '@site/src/components/ModuleGrid';

# Installation

Get Saucebase running locally in three commands.

## Prerequisites

- **Docker Desktop 20+** — runs all services (PHP, MySQL, Redis, Nginx)
- **Node.js 22+** — for building frontend assets on the host

## Quick Start

```bash
git clone https://github.com/saucebase-dev/saucebase.git my-app
cd my-app
bash bin/setup-env
```

`bin/setup-env` starts the Docker containers, installs PHP dependencies, runs the Saucebase installer with all modules, and builds frontend assets. Visit **https://localhost** when it completes.

## Alternatives

### [Laravel Herd](https://herd.laravel.com)

If you have [Laravel Herd](https://herd.laravel.com) installed, you can follow the steps below instead.

```bash
git clone https://github.com/saucebase-dev/saucebase.git my-app
cd my-app
composer install
cp .env.example .env
# Set APP_URL to your Herd site URL (e.g. http://my-app.test) in .env
# Configure DB_* credentials in .env
php artisan saucebase:install
npm install && npm run dev
```

### [Laravel Sail](https://laravel.com/docs/sail)

If you prefer [Laravel Sail](https://laravel.com/docs/sail), you can follow the steps below instead.

```bash
git clone https://github.com/saucebase-dev/saucebase.git my-app
cd my-app
cp .env.example .env
# Configure .env for Sail (DB_HOST=mysql, REDIS_HOST=redis, etc.)
sail up -d
sail composer install
sail artisan saucebase:install
npm install && npm run dev
```

### Native PHP

If you'd prefer to run Saucebase without Docker, you can install it natively with PHP and Composer.

```bash
git clone https://github.com/saucebase-dev/saucebase.git my-app
cd my-app
composer install
cp .env.example .env
# Configure APP_URL, DB_*, REDIS_* in .env
php artisan saucebase:install
npm install && npm run dev
```

<ModuleGrid
  title="Explore the Modules"
  subtitle="Your foundation is ready. Browse the available modules and install the ones that fit your product — each one copies directly into your codebase, ready to customize."
/>
