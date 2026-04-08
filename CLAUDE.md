# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Docusaurus-based documentation site for **Saucebase** — a modular Laravel SaaS starter kit built on the VILT stack (Vue, Inertia.js, Laravel, Tailwind CSS). The documentation is deployed to GitHub Pages at https://saucebase-dev.github.io/docs/.

## Commands

- `npm install` — Install dependencies
- `npm start` — Start dev server at http://localhost:3000/docs/
- `npm run build` — Build production static files to `build/`
- `npm run serve` — Serve production build locally
- `npm run clear` — Clear Docusaurus cache
- `npm run swizzle` — Customize Docusaurus components
- `npm run write-translations` — Generate translation files
- `npm run write-heading-ids` — Auto-generate heading IDs

## Architecture

- **docusaurus.config.ts** — Main config: navigation, theme, plugins, deployment settings
- **sidebars.ts** — Sidebar structure
- **tsconfig.json** — Extends `@docusaurus/tsconfig` with `@site/*` alias
- **Base URL**: `/docs/` — Docs served at site root (`routeBasePath: '/'`)
- **Search**: `@easyops-cn/docusaurus-search-local` (no Algolia)
- **Edit links**: point to `https://github.com/saucebase-dev/docs/tree/main/`

## Documentation Structure

```
docs/
├── index.md                    # Landing page (slug: /)
├── getting-started/            # Installation, configuration, directory structure
├── fundamentals/               # Features: modules, SSR, routing, dialogs, etc.
├── modules/                    # Individual module docs: auth, settings, billing, etc.
├── architecture/               # Philosophy, module system, frontend, backend
├── development/                # Commands, git workflow, testing guide
├── guidelines/                 # Coding guidelines: Laravel, JavaScript
└── reference/                  # Troubleshooting, glossary
```

### Sidebar categories (sidebars.ts)

Getting Started → Features → Modules → Architecture → Development → Guidelines → Reference

## Writing Documentation

### Tone

- Write to "you" — conversational, not formal ("you'll need to", "Saucebase makes this easy")
- Use active voice
- Simple words; avoid idioms ("start quickly" not "hit the ground running")
- Readers have basic Laravel/Vue knowledge but may not be native English speakers
- Every sentence should earn its place — clear and concise, not terse

### Saucebase Philosophy

When writing about *why* Saucebase or its value proposition:

- **Lead with what you gain**, not what others lack. Never frame competitors or traditional approaches negatively.
- **Core message**: The foundation is built. Focus on your product.
- **Four pillars**: (1) Full code ownership from day one, (2) months of pre-built production work, (3) enterprise-grade architecture and tooling, (4) DX that gets out of your way.
- **Avoid**: "No 3am emergencies", "trapped", "pray updates don't break", "fighting architecture" — these are negative framings we've moved away from.
- **Use**: "you own", "yours from day one", "production-ready", "skip straight to building your product", "months already built".

### Page Structure

1. **Overview** — One paragraph: what this feature is
2. **How to use** — Steps or examples, simple to complete
3. **Next Steps** — Links to related pages

### Admonitions

- `:::tip` — helpful shortcuts or best practices
- `:::note` — prerequisites or context
- `:::warning` — actions with side effects (e.g. migrations)
- `:::danger` — security or data-loss risks

### Code Blocks

Always include the file path via the title attribute:

~~~
```php title="app/Models/User.php"
```
~~~

### Frontmatter

```yaml
---
sidebar_position: 1
title: Page Title
description: Clear, concise description (50-160 characters)
---
```

## Related Repositories

- **Main Repository**: [saucebase-dev/saucebase](https://github.com/saucebase-dev/saucebase) — The Laravel SaaS starter kit
- **Auth Module**: [saucebase-dev/auth](https://github.com/saucebase-dev/auth)
- **Settings Module**: [saucebase-dev/settings](https://github.com/saucebase-dev/settings)

## Deployment

Pushes to `main` trigger automatic deployment via GitHub Actions (`.github/workflows/deploy.yml`). The workflow runs `npm ci && npm run build` and deploys `build/` to GitHub Pages at https://saucebase-dev.github.io/docs/.
