---
title: Auth
description: Authentication, social login, email verification, and admin impersonation
---

# Auth Module

The Auth module handles everything related to user identity: email/password login, registration, password reset, email verification, OAuth via Google and GitHub, and admin impersonation. It is the foundation that all other modules depend on.

## What you get

- **Login and registration** — standard email/password flows with rate limiting (5 attempts before a temporary lockout)
- **Magic link login** — passwordless login via a secure, one-time email link (15-minute expiry, single-use, hashed token)
- **Password reset** — token-based email reset flow
- **Email verification** — signed links; users can request a resend from the prompt page
- **Social login (OAuth)** — Google and GitHub via Laravel Socialite. Guests can log in or register; authenticated users can link additional providers to their account
- **Provider disconnect protection** — a user cannot disconnect their only login method (no password + one social account)
- **Admin panel** — Filament resource at `/admin` to list, create, view, and edit users
- **User impersonation** — admins can impersonate any user from the admin panel; up to 3 recently impersonated users are shown for quick switching

## Installation

```bash
composer require saucebase/auth
php artisan migrate
php artisan modules:seed --module=auth
npm run build
```

:::warning
This module requires a EmailService configured in your app to send the magic link, password reset, and email verification emails. You can use services like Mailgun, SendGrid, or even SMTP for development. Make sure to set up your mail configuration in `.env` before testing these features. For development, you can use [Mailpit](https://mailpit.axllent.org/docs/install/) or [MailHog](https://github.com/mailhog/MailHog). If you are using docker you don't need to worry about this as the default configuration uses MailPit.
:::

**Docker:**
```bash
composer require saucebase/auth
docker compose exec workspace php artisan migrate
docker compose exec workspace php artisan modules:seed --module=auth
npm run build
```

### Add the Sociable trait to your User model

This step is required for social login and the Settings module's provider display to work. Apply the provided patch:

```bash
git apply modules/Auth/patches/user.patch
```

<details>
<summary>Manual alternative</summary>

In `app/Models/User.php`, add the import and the trait:

```php title="app/Models/User.php"
use Modules\Auth\Traits\Sociable;

class User extends Authenticatable
{
    use Sociable;
}
```

</details>

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

## Magic Link login

Users can log in without a password by requesting a one-time link sent to their email. The link expires after a configurable period (15 minutes by default) and is single-use. If no account exists for the email, the response is identical to a successful send — no information is revealed about registered emails.

**Flow:**
1. User visits `/auth/magic-link` and enters their email
2. If the email matches a user, the old token (if any) is deleted, a new hashed token is created, and a `MagicLinkNotification` is sent
3. User clicks the link in their email (`/auth/magic-link/{token}`)
4. Token is validated (exists, not expired, not used), user is logged in, token is marked as used
5. User is redirected to the intended URL or dashboard

**Security:**
- Tokens are stored as SHA-256 hashes; the plain token only ever lives in the email
- Configurable expiry (default 15 min) with single-use enforcement
- Rate limited to 5 requests per minute per IP
- Silent fail on unknown emails (no enumeration)

Magic link login is enabled by default. To disable it, set in `.env`:

```env
AUTH_MAGIC_LINK_ENABLED=false
AUTH_MAGIC_LINK_EXPIRY=15
```

When disabled, the `/auth/magic-link` routes return 404 and the link is hidden on the login page.

## Admin panel

The Filament admin panel at `/admin` provides a Users resource to list, create, view, and edit users.

**Single role per user:** The role selector in the admin panel is limited to one selection per user. While the underlying Spatie permission system supports multiple roles, the admin UI enforces a single role at a time when editing a user.

## Impersonation

Start impersonation from the Users table in the Filament admin panel (`/admin`). A floating alert appears on screen with a "Stop impersonating" button and links to recently impersonated users. The session remembers the last 4 users; up to 3 are shown.

See the [Impersonation guide](../fundamentals/impersonation) for full details.

## Testing

```bash
php artisan test --testsuite=Modules --filter=Auth
npx playwright test --project="@Auth*"
```
