---
sidebar_position: 8
title: User Impersonation
description: Learn how to use the impersonation feature to view the application as another user for support and testing
---

# User Impersonation

User impersonation allows administrators to temporarily authenticate as another user without knowing their password. This is useful for customer support, debugging user-specific issues, and testing permissions.

## How It Works

Impersonation is a session-based feature that stores your admin credentials while you're viewing the application as another user. You can exit impersonation at any time to return to your admin account.

**The process:**
1. Admin clicks "Impersonate" on a user in Filament
2. Session stores original admin credentials
3. Admin is authenticated as the target user
4. Visual indicator appears showing who you're impersonating
5. Click "Stop Impersonation" to return to your admin account

:::tip Available in Auth Module
This feature is included in the **Auth module**. Make sure you have it installed and enabled.
:::

## Starting Impersonation

Navigate to the Filament admin panel at `/admin` and access the Users section.

**Impersonation is available from three locations:**

1. **Users Table** - Action button in the row actions menu
2. **Edit User Page** - Header action button
3. **View User Page** - Header action button

![Filament Users table with impersonate action button](</screenshot/impersonation/user-list-impersonation-button.jpeg>)

![User edit page with impersonate button in header](</screenshot/impersonation/user-edit-impersonation-button.jpeg>)

![User view page with impersonate action menu](</screenshot/impersonation/user-view-impersonation-menu.jpeg>)

Click the "Impersonate" button to start viewing the application as that user. You'll be redirected to the dashboard and see an impersonation alert.

## Impersonation Alert

When actively impersonating a user, a visual indicator appears in the **bottom-right corner** of every page.

### Collapsed State

A small avatar badge with an orange ring and drama icon overlay.

![Collapsed impersonation badge showing avatar with orange ring](</screenshot/impersonation/impersonation-closed-alert.jpeg>)

**Features:**
- Shows the impersonated user's avatar (or initials if no avatar)
- Orange ring indicates active impersonation
- Drama icon badge for visual distinction
- Hover tooltip displays user's name
- Click to expand and see full details

### Expanded State

Click the badge to expand into a full card showing user information and controls.

![Expanded impersonation card with user details and stop button](</screenshot/impersonation/impersonation-alert.jpeg>)

**Features:**
- User's avatar/initials
- Full name and email address
- Role badge (admin/user)
- "Stop Impersonation" button
- Click outside or press Escape to collapse
- Close button (X) to collapse

**Recent History:**
- Shows last 3 impersonated users below the Stop button
- Click any user to instantly switch to impersonating them
- Displays avatar, name, email, and role badge
- Automatically filters deleted users and current user
- History clears on logout

![Expanded card showing recent history section](</screenshot/impersonation/impersonation-alert-open.jpeg>)

## Stopping Impersonation

To exit impersonation and return to your admin account:

1. Click the impersonation badge to expand it
2. Click the **"Stop Impersonation"** button
3. You'll be returned to the dashboard as your admin user

Alternatively, navigate directly to the leave impersonation route from any page.

:::tip Automatic Notifications
When you start impersonating a user, a toast notification confirms: "You are now impersonating another user"
:::

## Recent History

The impersonation alert keeps track of your last 3 impersonated users, making it easy to switch between users during support or testing sessions.

### How It Works

- **Session-based storage** - History persists only for your current session
- **Automatic filtering** - Deleted users are removed automatically
- **Chronological order** - Most recently impersonated users appear first
- **Role visibility** - See user roles at a glance with colored badges

![Recent history showing admin and user role badges](</screenshot/impersonation/impersonation-alert.jpeg>)

### Switching Between Users

1. Expand the impersonation alert by clicking the avatar badge
2. Scroll to the "Recent impersonated users" section
3. Click any user in the list to instantly switch to impersonating them
4. No need to stop impersonation first - switching is seamless

The alert will collapse automatically after switching.

### Role Badges

Users in the recent history display role badges for quick identification:

- **Red badge** - Admin users
- **Blue badge** - Regular users

This helps you quickly identify user types when switching between test accounts or debugging permission issues.

### Use Cases

**Rapid Testing:**
Quickly switch between admin and user accounts to test permission-based features without repeatedly navigating back to the admin panel.

**Support Workflows:**
Cycle through multiple customer accounts efficiently when investigating related support tickets.

**Quality Assurance:**
Test user journeys across different account types by maintaining quick access to test users.

### Technical Details

- **Storage:** Session key `impersonation.recent_history`
- **Limit:** 4 user IDs stored, 3 displayed (excluding current)
- **Route:** `POST /auth/impersonate/{userId}`
- **Permissions:** Requires access to Filament admin panel

## Security

:::warning Important Security Considerations

- **Admin-only feature** - Only accessible from Filament admin panel
- **Session-based** - Impersonation ends when the browser session closes
- **Guard protection** - Prevents cross-panel impersonation issues
- **No password exposure** - Users' passwords are never revealed or compromised

:::

## Technical Details

### Packages Used

The impersonation feature is powered by two Laravel packages:

- **lab404/laravel-impersonate** - Core session-based impersonation logic
- **stechstudio/filament-impersonate** - Filament admin panel integration

### How Data is Shared

Impersonation data is shared globally via Inertia.js, making it available to all frontend pages. The `ImpersonationAlert` component lives in the Auth module (`modules/Auth/resources/js/components/ImpersonationAlert.vue`) and is registered automatically when the module loads — no changes to core files needed.

### Event System

When impersonation starts, a `TakeImpersonation` event is dispatched. The Auth module listens to this event to:

- Display a toast notification confirming impersonation
- Track the user ID in session history for recent history feature

When impersonation ends, a `LeaveImpersonation` event is dispatched, clearing authentication hashes from the session.

## Troubleshooting

### Impersonation Button Not Visible

Make sure the Auth module is installed and enabled:

```bash
php artisan module:list
```

Check that your admin user has the necessary permissions in Filament.

### Alert Not Appearing

The impersonation alert is registered automatically by the Auth module. If it isn't showing up, make sure the module is enabled and assets are up to date:

```bash
php artisan module:list
php artisan optimize:clear
npm run build
```

### Session Issues

Impersonation stores data in the session. If you're experiencing issues:

- Verify your session driver is working correctly
- Check session configuration in `config/session.php`
- Ensure cookies are enabled in your browser

### Recent History Not Showing

The recent history section appears only after you've impersonated at least one user. If you've impersonated users but the section is missing:

- Verify you're viewing the expanded alert state (click the avatar badge)
- Check that you've impersonated multiple users (needs 1+ previous users)
- Clear browser cache and refresh if you recently updated the Auth module
- Ensure your session is active and not expired

## Next Steps

- **[Modules](/fundamentals/modules)** - Learn about installing and managing modules
- **[Routing](/fundamentals/routing)** - Understand routing in Saucebase
- **[Testing Guide](/development/testing-guide)** - Test impersonation functionality

---

Impersonation is a powerful tool for support and debugging. Use it responsibly to provide better service to your users.
