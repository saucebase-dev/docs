---
sidebar_position: 2
slug: /
title: Installation
description: Complete installation guide for Saucebase - quick start and manual installation options
---

# Installation

Get Saucebase up and running in minutes with the automated installer, or follow the manual installation steps for more control.

## Prerequisites

Before installing Saucebase, ensure you have:

- **[Composer](https://getcomposer.org/)** 2.0.0+
- **[Docker Desktop](https://docs.docker.com/desktop/)** 20.0.0+
- **[Node.js](https://nodejs.org/)** 22.0.0+ and **npm** 10.5.1+
- **[mkcert](https://github.com/FiloSottile/mkcert)** (optional, for local HTTPS)

## Quick Start

The fastest way to get started:

```bash
# Create new project
composer create-project saucebase/saucebase my-app
cd my-app

# Run automated installer
php artisan saucebase:install

# Start development server
npm run dev
```

That's it! Visit **https://localhost** to see your application.

:::tip Automated Installer
The `saucebase:install` command handles everything: Docker setup, SSL certificates, migrations, module installation, and asset building. Perfect for getting started quickly.
:::

## Installer Options

The installer supports several options for different scenarios:

### Basic Usage

```bash
# Standard installation (recommended)
php artisan saucebase:install

# Skip Docker setup (use manual database/Redis)
php artisan saucebase:install --no-docker

# Skip SSL certificate generation
php artisan saucebase:install --no-ssl

# Force reinstallation (overwrites existing data)
php artisan saucebase:install --force
```

### CI/CD Mode

For automated deployments:

```bash
php artisan saucebase:install --no-interaction
```

This automatically detects CI environments and runs minimal setup without prompts.

## Manual Installation

For step-by-step control, follow these detailed instructions.

### Step 1: Clone the Repository

```bash
git clone https://github.com/sauce-base/saucebase.git my-app
cd my-app
```

Or use Composer:

```bash
composer create-project saucebase/saucebase my-app
cd my-app
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Review and update these Saucebase-specific variables in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_HOST` | `localhost` | Application hostname |
| `APP_URL` | `https://localhost` | Full URL (must match APP_HOST) |
| `APP_SLUG` | `saucebase` | Project slug for storage keys |

Standard Laravel variables (DB_\*, APP_KEY, etc.) have sensible defaults.

### Step 3: Generate SSL Certificates (Optional)

For HTTPS support with wildcard domains (multi-tenancy ready):

```bash
# Install mkcert if not already installed
mkcert -install

# Generate certificates
mkdir -p docker/ssl
cd docker/ssl
mkcert -key-file app.key.pem -cert-file app.pem "*.localhost" localhost 127.0.0.1 ::1
cd ../..
```

:::info Wildcard Support
Certificates include `*.localhost` for multi-tenant applications. You can access your app at `https://localhost`, `https://tenant1.localhost`, etc.
:::

### Step 4: Start Docker Services

```bash
docker compose up -d --wait
```

This launches:

| Service | Purpose | Ports |
|---------|---------|-------|
| **nginx** | Web server | 80, 443 |
| **app** | PHP-FPM + CLI | - |
| **mysql** | Database | 3306 |
| **redis** | Cache/Queue/Session | 6379 |
| **mailpit** | Email testing | 1025 (SMTP), 8025 (Web UI) |

:::tip Service Health
The `--wait` flag ensures all services are healthy before returning. MySQL typically takes 10-30 seconds to initialize on first run.
:::

### Step 5: Install Backend Dependencies

```bash
docker compose exec app composer install
```

This installs Laravel and all PHP dependencies inside the Docker container.

### Step 6: Generate Application Key

```bash
docker compose exec app php artisan key:generate
```

Then restart the container to load the new key:

```bash
docker compose restart app
```

### Step 7: Setup Database

```bash
# Ensure services are ready
docker compose up -d --wait

# Run migrations and seed data
docker compose exec app php artisan migrate:fresh --seed

# Create storage link
docker compose exec app php artisan storage:link
```

This creates database tables and seeds default data including admin user.

### Step 8: Install Modules

Install the Auth and Settings modules:

```bash
# Auth Module
composer require saucebase/auth
composer dump-autoload
docker compose exec app php artisan module:enable Auth
docker compose exec app php artisan module:migrate Auth --seed

# Settings Module
composer require saucebase/settings
composer dump-autoload
docker compose exec app php artisan module:enable Settings
docker compose exec app php artisan module:migrate Settings --seed
```

To enable social login (Google, GitHub), see the [OAuth configuration guide](/getting-started/configuration#oauth-auth-module).

### Step 9: Install Frontend Dependencies

```bash
# Install packages
npm install

# Build assets (production)
npm run build

# OR start dev server with HMR (recommended)
npm run dev
```

:::tip Development Mode
Use `npm run dev` for hot module replacement during development. The Vite dev server will automatically reload when you change Vue/TypeScript/CSS files.
:::

### Step 10: Verify Installation

**Access the application:**
- Main site: https://localhost
- Admin panel: https://localhost/admin (requires Auth module)
- Email testing: http://localhost:8025 (Mailpit)

**Health checks:**

```bash
# Check database connection
docker compose exec app php artisan migrate:status

# Check web server
curl -sk https://localhost/health
```

## Default Credentials

After installing the Auth module, you can access the admin panel:

- **Email**: `chef@saucebase.dev`
- **Password**: `secretsauce`

:::warning Change Credentials
Make sure to change these credentials in production environments!
:::

:::tip Having issues?
Check the [Troubleshooting guide](/reference/troubleshooting) for common installation problems (port conflicts, Docker issues, SSL warnings, etc.).
:::

## Next Steps

Now that Saucebase is installed:

1. **[Configure Environment](/getting-started/configuration)** - Set up environment variables
2. **[Understand Directory Structure](/getting-started/directory-structure)** - Learn the codebase organization
3. **[Explore Modules](/fundamentals/modules)** - Install and manage modules
4. **[Development Commands](/development/commands)** - Learn common development tasks

---

Need help? Check the [Troubleshooting Reference](/reference/troubleshooting) or [open an issue](https://github.com/sauce-base/saucebase/issues).
