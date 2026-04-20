---
title: Blog
description: Public blog with categories, cover images, scheduling, and SEO
---

# Blog Module

The Blog module adds a public-facing blog to your app. Admins create and manage posts in the Filament panel; published posts appear at `/blog` with full SEO support and server-side rendering.

## What you get

- **Blog index** — paginated list of published posts at `/blog`, 12 per page, ordered by publish date
- **Post detail** — full post at `/blog/{slug}` or `/blog/{category}/{slug}`; includes cover image, author, publish date, and formatted content
- **Cover image** — single image upload per post via Spatie Media Library
- **Categories** — optional; posts can be assigned to a category with an auto-generated slug
- **Draft / Published status** — posts default to Draft and are never shown publicly until explicitly published
- **Post scheduling** — set a `Publish date` to hold a post back until a future date, even when status is Published
- **Related posts** — 3 random published posts shown at the bottom of every detail page
- **SEO** — JSON-LD structured data and Open Graph meta tags on detail pages; both index and detail pages are SSR-enabled
- **Filament CRUD** — create, edit, and delete posts and categories from the admin panel

## Installation

```bash
composer require saucebase/blog
composer dump-autoload
php artisan module:enable Blog
php artisan module:migrate Blog --seed
npm run build
```

## Admin panel

Navigate to `/admin` → **Blog** in the left navigation to manage posts.

The post form includes:

| Field | Notes |
|---|---|
| Title | Required. Slug is auto-generated from the title |
| Slug | Auto-generated; editable if you need a custom URL |
| Cover | Optional image upload (public, single file) |
| Content | Rich text editor |
| Excerpt | Optional short summary, max 500 characters |
| Status | Draft (default) or Published |
| Publish date | Optional; leave blank to publish immediately when status is Published |
| Category | Optional; searchable dropdown |
| Author | Optional; defaults to the creating admin |

Categories are managed from the **Categories** tab inside the Blog section (not in the main navigation). Each category gets a name and an auto-generated slug.

## Frontend

The blog is public and requires no authentication.

| Route | Page |
|---|---|
| `GET /blog` | Paginated post listing |
| `GET /blog/{slug}` | Single post (no category) |
| `GET /blog/{category}/{slug}` | Single post under a category |

Both URL patterns point to the same detail page. The `PostData` DTO picks the correct URL based on whether a post has a category assigned — links in the listing and related posts stay consistent automatically.

## Post scheduling

A post is visible on the frontend only when **both** conditions are met:

1. `status` is `Published`
2. `published_at` is `null` **or** in the past

Setting a future `published_at` with status Published acts as a scheduled publish — the post stays hidden until that date arrives. No cron job is needed; the check runs on every request.

## Testing

```bash
php artisan test --testsuite=Modules --filter=Blog
npx playwright test --project="@Blog*"
```
