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

- **[Docker Desktop](https://docs.docker.com/desktop/)** 20.0.0+
- **[Node.js](https://nodejs.org/)** 22.0.0+ and **npm** 10.5.1+
- **[mkcert](https://github.com/FiloSottile/mkcert)** (optional, for local HTTPS)

:::info No Local PHP Required
The Docker flow handles PHP and Composer inside the container. You only need Docker and Node.js on your machine.
:::

## Quick Start

The fastest way to get started:

```bash
git clone https://github.com/sauce-base/saucebase.git my-app
cd my-app
bash bin/setup-env
```

That's it! Visit **https://localhost** to see your application.

:::tip What Does This Do?
The bootstrap script starts Docker, installs PHP dependencies, runs `php artisan saucebase:install` inside the container (migrations, modules, caches), then builds frontend assets on the host. Everything in one command.
:::

After initial setup, [Task](https://taskfile.dev) is available as an npm devDependency. You can re-run the installer or use other tasks via:

```bash
npm run saucebase install
```

### Alternative: Composer Create-Project

If you have local PHP and Composer installed:

```bash
composer create-project saucebase/saucebase my-app
cd my-app
bash bin/setup-env
```

## Installer Options

You can pass flags through the bootstrap script to the artisan installer:

```bash
# Standard installation (recommended)
bash bin/setup-env

# Skip SSL certificate generation
bash bin/setup-env --no-ssl

# Force reinstallation (overwrites existing data)
bash bin/setup-env --force

# Skip Docker, use manual database/Redis (requires local PHP + Composer)
bash bin/setup-env --no-docker
```

After the first install, you can also use `npm run saucebase install` (which uses the bundled Task runner).

### CI/CD Mode

For automated deployments where the artisan command runs directly:

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

### Step 6: Run Artisan Installer

```bash
docker compose exec -T app php artisan saucebase:install
```

This generates the application key, runs migrations, enables modules, creates the storage link, and clears caches.

### Step 7: Install Frontend Dependencies

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

### Step 8: Verify Installation

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
