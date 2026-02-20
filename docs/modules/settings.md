---
title: Settings
description: User profile management, avatar uploads, and password changes
---

# Settings Module

The Settings module gives users a profile page where they can update their name and email, upload an avatar, change their password, and manage connected social providers.

It has no own database tables or models — everything operates on the core `User` model.

**Requires:** [Auth module](./auth)

## What you get

- **Profile page** — shows name, email, last login time, and connected OAuth providers
- **Edit profile** — update name and email
- **Avatar upload** — upload a photo (JPEG, PNG, GIF, or WebP, max 2 MB); stored via Spatie Media Library
- **Avatar fallback** — if no upload exists, the user's social provider avatar is shown; if neither exists, a default avatar is used
- **Password change** — users receive a confirmation email (`PasswordChangedNotification`) after a successful change
- **Social connect/disconnect** — connect new providers or disconnect existing ones directly from the profile page (delegates to Auth module routes)

## Installation

```bash
composer require saucebase/settings
composer dump-autoload
php artisan module:enable Settings
npm run build
```

No migrations are needed — this module adds no tables of its own.

**Docker:**
```bash
composer require saucebase/settings && composer dump-autoload
docker compose exec workspace php artisan module:enable Settings
npm run build
```

## Configuration

No environment variables are required. Social provider buttons on the profile page use Auth module routes and are automatically shown if the Auth module is enabled.

All settings routes require email verification. Users who haven't verified their email are redirected to the verification prompt.

### Password change notification

After a user successfully changes their password, a `PasswordChangedNotification` email is sent. This notification lives in the **core app**, not inside the Settings module:

```
app/Notifications/PasswordChangedNotification.php
```

Customize the email content there.

## Extending the settings sidebar

The Settings module owns the `settings` navigation group. You can add your own pages to the settings sidebar by registering navigation items in that group from a `routes/navigation.php` file in your module (or in `app/Providers/NavigationServiceProvider.php` for core additions).

This is the same pattern the Billing module uses to add its `/settings/billing` page:

```php title="modules/YourModule/routes/navigation.php"
use Spatie\Navigation\Facades\Navigation;

Navigation::addRoute('settings', 'Your Section', 'your-module.settings.index');
```

The item will appear in the sidebar on all settings pages automatically.

## Testing

```bash
php artisan test --testsuite=Modules --filter=Settings
npx playwright test --project="@Settings [Desktop Chrome]"
```
