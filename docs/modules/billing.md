---
title: Billing
description: Subscriptions, checkout sessions, and payment processing
---

# Billing Module

The Billing module handles subscription management and payment processing. Users go through a checkout session to subscribe, can manage their billing via a hosted portal, and can cancel or resume their subscription at any time. The module uses a gateway driver pattern with Stripe as the default.

## What you get

- **Checkout flow** — create a session with a configurable expiration window; billing address is collected at checkout
- **Subscription management** — cancel at period end (not immediately) and resume before the period expires
- **Billing portal** — redirect authenticated users to the Stripe-hosted portal for self-service (update card, download invoices)
- **Invoice list** — displayed on the `/settings/billing` page with status (Paid, Posted, Unpaid) and a link to the portal
- **Stored payment methods** — card type, last 4 digits, and expiry date
- **Webhook processing** — idempotent via a `webhook_events` table that deduplicates by provider event ID
- **Gateway drivers** — Stripe by default; Paddle and LemonSqueezy are configurable via `BILLING_GATEWAY`

## Installation

```bash
composer require saucebase/billing
composer dump-autoload
php artisan module:enable Billing
php artisan module:migrate Billing --seed
npm run build
```

**Docker:**
```bash
composer require saucebase/billing && composer dump-autoload
docker compose exec workspace php artisan module:enable Billing
docker compose exec workspace php artisan module:migrate Billing --seed
npm run build
```

### Add the Billable trait to your User model

This step is required. Without it, `$user->billingCustomer` and all subscription checks will fail. Apply the provided patch:

```bash
git apply modules/Billing/patches/user.patch
```

<details>
<summary>Manual alternative</summary>

In `app/Models/User.php`, add the import and the trait:

```php title="app/Models/User.php"
use Modules\Billing\Traits\Billable;

class User extends Authenticatable
{
    use Billable;
}
```

</details>

## Configuration

### Stripe credentials

Add to `.env`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Get these from your [Stripe dashboard](https://dashboard.stripe.com/apikeys).

### Webhook endpoint

Register the following URL in your Stripe dashboard under **Developers → Webhooks**:

```
https://your-app.com/billing/webhooks/stripe
```

Stripe will give you a webhook signing secret (`whsec_...`) — set that as `STRIPE_WEBHOOK_SECRET` in `.env`.

For local development, use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward events:

```bash
stripe listen --forward-to localhost/billing/webhooks/stripe
```

### Setting up your plans

Checkout requires at least one Product and Price record in the database. The seeder (`--seed`) populates sample data so you can test immediately, but for a real app you manage your plans via the Filament admin panel:

**`/admin` → Billing → Products**

Create your products and their prices there. The checkout flow will use these records to build Stripe checkout sessions.

### Optional settings

```env
BILLING_GATEWAY=stripe                  # stripe | paddle | lemonsqueezy
BILLING_DEFAULT_CURRENCY=EUR            # ISO 4217 currency code
BILLING_CHECKOUT_ABANDON_MINUTES=60     # Mark session abandoned after N idle minutes
BILLING_CHECKOUT_EXPIRE_MINUTES=1440    # Hard-expire session after N minutes (default: 24h)
```

## Subscriber role

The module automatically manages a `subscriber` role based on subscription status:

- **Role assigned** — when a subscription becomes Active or PastDue
- **Role removed** — when a subscription is Cancelled and the user has no other active subscriptions

This means you can gate features behind a subscription without any custom logic:

```php
// Middleware
Route::middleware('role:subscriber')->group(function () { ... });

// In code
if ($user->hasRole('subscriber')) { ... }
```

The `subscriber` role is seeded automatically when you run `php artisan module:migrate Billing --seed`.

## Displaying pricing on the landing page

The core app ships with commented-out code in `IndexController` and `Index.vue` that wires the `ProductSection` component into the public landing page. Uncommenting it displays a full pricing section on the homepage when the Billing module is installed.

**Controller** — add the import and pass `products` to the Inertia response:

```php title="app/Http/Controllers/IndexController.php"
use Modules\Billing\Models\Product;
// ...
'products' => Product::displayable()->get(),
```

**Vue page** — add the imports, prop, and template tag:

```ts title="resources/js/pages/Index.vue"
import ProductSection from '@modules/Billing/resources/js/components/ProductSection.vue';
import type { Product } from '@modules/Billing/resources/js/types';
// ...
defineProps<{ products?: Product[] }>();
```

```html
<ProductSection v-if="products?.length" :products="products" />
```

### The `displayable()` scope

A product appears on the landing page only when **all** of these are true:

- `is_active = true`
- `is_visible = true`
- At least one active price exists

Toggle these flags in the Filament admin panel at **`/admin` → Billing → Products**.

### What `ProductSection` renders

Pricing cards with a billing interval toggle (monthly/yearly/etc.), a feature checklist per plan, and a CTA button. The component automatically filters cards by the selected interval and adapts its grid layout to the number of products.

### Highlighting a plan

Set `is_highlighted = true` on a product to mark it as **"Most popular"** — it renders with a colored ring and badge. Only one product should be highlighted at a time.

## Testing

```bash
php artisan test --testsuite=Modules --filter=Billing
npx playwright test --project="@Billing*"
```
