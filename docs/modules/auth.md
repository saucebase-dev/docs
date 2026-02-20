---
title: Auth
description: Authentication, social login, email verification, and admin impersonation
---

# Auth Module

The Auth module handles everything related to user identity: email/password login, registration, password reset, email verification, OAuth via Google and GitHub, and admin impersonation. It is the foundation that all other modules depend on.

## What you get

- **Login and registration** — standard email/password flows with rate limiting (5 attempts before a temporary lockout)
- **Password reset** — token-based email reset flow
- **Email verification** — signed links; users can request a resend from the prompt page
- **Social login (OAuth)** — Google and GitHub via Laravel Socialite. Guests can log in or register; authenticated users can link additional providers to their account
- **Provider disconnect protection** — a user cannot disconnect their only login method (no password + one social account)
- **Admin panel** — Filament resource at `/admin` to list, create, view, and edit users
- **User impersonation** — admins can impersonate any user from the admin panel; up to 3 recently impersonated users are shown for quick switching

## Installation

```bash
composer require saucebase/auth
composer dump-autoload
php artisan module:enable Auth
php artisan module:migrate Auth --seed
npm run build
```

**Docker:**
```bash
composer require saucebase/auth && composer dump-autoload
docker compose exec workspace php artisan module:enable Auth
docker compose exec workspace php artisan module:migrate Auth --seed
npm run build
```

### Add the Sociable trait to your User model

This step is required for social login and the Settings module's provider display to work:

```php title="app/Models/User.php"
use Modules\Auth\Traits\Sociable;

class User extends Authenticatable
{
    use Sociable;
}
```

The trait adds `socialAccounts()`, `connected_providers`, and the disconnect helper to your User model.

## Configuration

### Default admin credentials

The seeder creates a default admin account:

- **Email:** `chef@saucebase.dev`
- **Password:** `secretsauce`

:::warning
Change these before going to production.
:::

### OAuth (optional)

Social login works out of the box once you set the credentials. Add to `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CLIENT_REDIRECT_URI=/auth/socialite/google/callback

GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_CLIENT_REDIRECT_URI=/auth/socialite/github/callback
```

Create OAuth apps here:
- **Google** — [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
- **GitHub** — [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps

The redirect URI to register in each provider's dashboard is `/auth/socialite/{provider}/callback` (relative to your app URL).

:::note OAuth account behavior
When a user registers via OAuth (Google or GitHub), their email is automatically marked as verified and a random password is assigned. This means they have no usable password — if they ever want to switch to email/password login, they must go through **Forgot password** to set one. Keep this in mind when handling support requests from social-login users.
:::

## Admin panel

The Filament admin panel at `/admin` provides a Users resource to list, create, view, and edit users.

**Single role per user:** The role selector in the admin panel is limited to one selection per user. While the underlying Spatie permission system supports multiple roles, the admin UI enforces a single role at a time when editing a user.

## Impersonation

Start impersonation from the Users table in the Filament admin panel (`/admin`). A floating alert appears on screen with a "Stop impersonating" button and links to recently impersonated users. The session remembers the last 4 users; up to 3 are shown.

See the [Impersonation guide](../fundamentals/impersonation) for full details.

## Testing

```bash
php artisan test --testsuite=Modules --filter=Auth
npx playwright test --project="@Auth [Desktop Chrome]"
```
