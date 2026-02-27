---
sidebar_position: 4
title: Testing Guide
description: Learn how to write and run tests in Saucebase with PHPUnit and Playwright
---

# Testing Guide

Saucebase includes comprehensive testing support with PHPUnit for backend tests and Playwright for end-to-end (E2E) tests. The testing architecture is modular, allowing both core and module-specific tests to coexist.

## Testing Philosophy

Saucebase follows these testing principles:

- **Feature tests for user-facing workflows** - Test complete user journeys
- **Unit tests for complex business logic** - Test individual components in isolation
- **E2E tests for critical paths** - Test authentication, checkout, and key user flows
- **DRY principle in tests** - Extract repeated logic into helpers and page objects
- **Test what matters** - Focus on behavior, not implementation details

## PHPUnit Testing

### Configuration

Saucebase uses PHPUnit for backend testing with three test suites configured in `phpunit.xml`:

```xml title="phpunit.xml"
<testsuites>
    <testsuite name="Unit">
        <directory>tests/Unit</directory>
    </testsuite>
    <testsuite name="Feature">
        <directory>tests/Feature</directory>
    </testsuite>
    <testsuite name="Modules">
        <directory>modules/*/tests/Feature</directory>
        <directory>modules/*/tests/Unit</directory>
    </testsuite>
</testsuites>
```

**Environment (from `phpunit.xml`):**
- `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:` — in-memory SQLite, no teardown needed
- `QUEUE_CONNECTION=sync` — jobs run inline
- `BCRYPT_ROUNDS=4` — faster password hashing in tests
- `TELESCOPE_ENABLED=false`, `PULSE_ENABLED=false` — observability tools disabled

The base `TestCase` seeds the database before each test class (`$seed = true`) and provides a `createUser()` helper that creates a factory user and assigns the `user` role.

### Running PHPUnit Tests

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
php artisan test --testsuite=Modules

# Run specific test file
php artisan test tests/Feature/ExampleTest.php

# Run specific test method
php artisan test --filter test_user_can_access_dashboard

# Run tests in parallel
php artisan test --parallel

# Run with coverage (requires Xdebug)
php artisan test --coverage
```

### Writing Feature Tests

Feature tests verify complete user workflows using the database:

```php title="tests/Feature/DashboardTest.php"
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function authenticated_user_can_access_dashboard(): void
    {
        $user = $this->createUser();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('Dashboard')
        );
    }

    /** @test */
    public function guest_is_redirected_from_dashboard(): void
    {
        $response = $this->get('/dashboard');

        $response->assertRedirect();
    }
}
```

### Module Tests

Modules include their own PHPUnit tests under `modules/<ModuleName>/tests/`:

```
modules/Auth/
└── tests/
    ├── Feature/
    │   ├── LoginTest.php
    │   └── RegistrationTest.php
    └── Unit/
        └── LoginRequestTest.php
```

Module test classes follow the `Modules\<Name>\Tests` namespace:

```php title="modules/Auth/tests/Feature/LoginTest.php"
<?php

namespace Modules\Auth\Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_view_login_page(): void
    {
        $response = $this->get('/auth/login');

        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('Auth::Login')
        );
    }
}
```

**Run module tests:**
```bash
# All module tests
php artisan test --testsuite=Modules

# Specific module
php artisan test modules/Auth/tests
```

### Test Organization Best Practices

**Use Arrange-Act-Assert (AAA) pattern:**
```php
/** @test */
public function it_does_something(): void
{
    // Arrange - Set up test data and conditions
    $user = $this->createUser();

    // Act - Perform the action being tested
    $response = $this->actingAs($user)->get('/some-route');

    // Assert - Verify the expected outcome
    $response->assertOk();
}
```

**Use descriptive test names:**
```php
// ✅ Good: Clear and descriptive
public function it_sends_welcome_email_after_registration(): void

// ❌ Bad: Vague and unclear
public function test_email(): void
```

## Playwright E2E Testing

### How It Works

E2E tests use the [`@saucebase/laravel-playwright`](https://github.com/saucebase/laravel-playwright) package, which provides a `laravel` fixture available in all tests. The fixture exposes two methods:

- **`laravel.artisan(command)`** — Runs an Artisan command on the running app (e.g., `migrate:fresh --seed`)
- **`laravel.callFunction(fqn)`** — Calls a static PHP method and returns its result as JSON (used to fetch credentials, run seeders, etc.)

Both methods communicate with the app over a secret endpoint (`APP_URL/playwright`), protected by `PLAYWRIGHT_SECRET`.

### Setup Chain

Before test projects run, setup projects seed the database. The dependency chain is:

```
database.setup
├── @Core [Desktop Chrome]
├── @Auth [Desktop Chrome]
├── @Settings [Desktop Chrome]
└── billing.setup
    └── @Billing [Desktop Chrome]
```

- **`database.setup`** (`tests/e2e/database.setup.ts`) — runs `migrate:fresh --seed` then `module:migrate-refresh --all --seed`. All test projects depend on it.
- **`billing.setup`** (`modules/Billing/tests/e2e/billing.setup.ts`) — calls `BillingTestHelper::createSubscriberFixtures()` to set up subscription fixtures. Only `@Billing` depends on it.

Only modules that export a `playwright.config.ts` get a setup step. Currently only Billing does.

### Configuration

The root `playwright.config.ts` collects module configs via `module-loader.js` and appends the active device suffix to every project name:

```typescript title="playwright.config.ts (simplified)"
import { defineConfig, devices } from '@playwright/test';
import type { LaravelOptions } from '@saucebase/laravel-playwright';
import { collectModulePlaywrightConfigs } from './module-loader.js';

const { projects: moduleProjects, setups: moduleSetups } =
    await collectModulePlaywrightConfigs();

export default defineConfig<LaravelOptions>({
    projects: [
        { name: 'database.setup', testMatch: /database\.setup\.ts/ },
        ...moduleSetups,                    // e.g. billing.setup
        {
            name: '@Core [Desktop Chrome]',
            testDir: './tests/e2e',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['database.setup'],
        },
        // @Auth [Desktop Chrome], @Billing [Desktop Chrome], etc.
        ...moduleProjects,
    ],
    use: {
        baseURL: process.env.APP_URL ?? 'http://localhost',
        laravelBaseUrl: `${BASE_URL}/playwright`,
        laravelSecret: process.env.PLAYWRIGHT_SECRET,
        ignoreHTTPSErrors: true,
    },
});
```

**How module discovery works:**
1. `module-loader.js` reads `modules_statuses.json` to find enabled modules
2. For each enabled module, it checks for a `playwright.config.ts` in the module directory
3. Modules without a `playwright.config.ts` still get a test project (prefixed `@ModuleName`), but no setup step
4. Each project name gets the active device appended: `@Auth [Desktop Chrome]`

### Running Playwright Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific project
npm run test:e2e -- --project="@Core [Desktop Chrome]"
npm run test:e2e -- --project="@Auth [Desktop Chrome]"

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Run tests matching a pattern
npm run test:e2e -- --grep "login"
```

### Test Structure

Module E2E tests are organized by feature into subdirectories. The Auth module is the reference example:

```
modules/Auth/tests/e2e/
├── pages/
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── ForgotPasswordPage.ts
│   └── VerifyEmailPage.ts
└── tests/
    ├── login/
    │   ├── login.basic.spec.ts
    │   ├── login.errors.spec.ts
    │   ├── login.security.spec.ts
    │   ├── login.social.spec.ts
    │   └── logout.basic.spec.ts
    ├── register/
    │   ├── register.basic.spec.ts
    │   └── register.errors.spec.ts
    ├── forgot-password/
    │   ├── forgot-password.basic.spec.ts
    │   └── forgot-password.errors.spec.ts
    └── verify-email/
        └── verify-email.basic.spec.ts
```

The shared credentials fixture lives in `tests/e2e/fixtures/index.ts` (core), not inside any module. Any module spec that needs credentials imports from there.

Core E2E tests live in `tests/e2e/` (no subdirectory nesting required).

### Page Objects

All module E2E tests use page object classes to encapsulate locators and interactions. Locators use `getByTestId` rather than raw CSS selectors:

```typescript title="modules/Auth/tests/e2e/pages/LoginPage.ts"
import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByTestId('email');
        this.passwordInput = page.getByTestId('password');
        this.loginButton = page.getByTestId('login-button');
    }

    async goto() {
        await this.page.goto('/auth/login');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async expectToBeVisible() {
        await expect(this.page.getByTestId('login-form')).toBeVisible();
    }
}
```

**Using a page object in a spec:**
```typescript title="modules/Auth/tests/e2e/tests/login/login.basic.spec.ts"
import { test, expect } from '../../fixtures';
import { LoginPage } from '../../pages/LoginPage';

test('logs in with valid credentials', async ({ page, credentials }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.admin.email, credentials.admin.password);

    await expect(page).toHaveURL('/dashboard');
});
```

Each module's `pages/` directory holds all its page objects. Follow the same pattern when adding new modules.

### Credentials Fixture

E2E tests never hardcode passwords. The credentials fixture lives in `tests/e2e/fixtures/index.ts` (core), making it available to any module without cross-module imports. It fetches seeded credentials from the backend at runtime via `laravel.callFunction()`:

```typescript title="tests/e2e/fixtures/index.ts"
import { test as base } from '@saucebase/laravel-playwright';
import { expect } from '@playwright/test';

export type UserCredential = { email: string; password: string };

export type TestCredentials = {
    admin: UserCredential;
    user: UserCredential;
    subscriber: UserCredential;
    cancelled: UserCredential;
};

export const test = base.extend<{ credentials: TestCredentials }>({
    credentials: async ({ laravel }, use) => {
        const creds = await laravel.callFunction<TestCredentials>(
            'Tests\\Support\\TestFixtures::credentials',
        );
        await use(creds);
    },
});

export { expect };
```

The credentials themselves are defined in `tests/Support/TestFixtures.php` and correspond to users seeded by `database.setup`:

```php title="tests/Support/TestFixtures.php"
<?php

namespace Tests\Support;

class TestFixtures
{
    public static function credentials(): array
    {
        return [
            'admin'      => ['email' => 'chef@saucebase.dev',       'password' => 'secretsauce'],
            'user'       => ['email' => 'test@example.com',         'password' => 'secretsauce'],
            'subscriber' => ['email' => 'subscriber@example.com',   'password' => 'secretsauce'],
            'cancelled'  => ['email' => 'cancelled@example.com',    'password' => 'secretsauce'],
        ];
    }
}
```

Any spec that needs credentials imports `{ test, expect }` from the core fixtures instead of `@playwright/test`. The relative path from a module spec (`modules/X/tests/e2e/tests/<feature>/`) to the core fixtures is always 6 levels up:

```typescript
// ✅ Import from core fixtures (gives access to credentials)
import { test, expect } from '@e2e/fixtures/index.ts';

// ❌ Do not import directly from @playwright/test in module specs
import { test, expect } from '@playwright/test';

// ❌ Do not import from another module's directory
import { test, expect } from '../../../../../Auth/tests/e2e/fixtures/index.ts';
```

### SSR Helpers

`tests/e2e/helpers/ssr.ts` provides three helpers for verifying server-side rendering behavior:

```typescript
import {
    expectSSREnabled,
    expectSSRDisabled,
    expectInertiaPageDataEmbedded,
} from '../../helpers/ssr';
```

| Helper | What it checks |
|--------|---------------|
| `expectSSREnabled(page, component?)` | Verifies `data-page` script tag is present; optionally checks the Inertia component name |
| `expectSSRDisabled(page)` | Verifies `id="app"` and `data-page` are present (client-rendered, no pre-rendered HTML) |
| `expectInertiaPageDataEmbedded(page)` | Verifies the JSON script tag exists and contains page data |

**Usage:**
```typescript title="tests/e2e/index.spec.ts"
import { test } from '@playwright/test';
import { expectSSREnabled } from './helpers/ssr';

test('home page uses SSR', async ({ page }) => {
    await page.goto('/');
    await expectSSREnabled(page, 'Index');
});
```

## Continuous Integration

```bash
# Set environment to testing
export APP_ENV=testing

# Run backend tests
php artisan test --parallel

# Run E2E tests (headless)
npm run test:e2e -- --reporter=github
```

:::tip
In CI, Playwright runs in headless mode. The `webServer` config is skipped (it only starts locally), so your CI pipeline must build and serve the app separately before running E2E tests.
:::

## Troubleshooting

### PHPUnit Issues

**Database not found:**
```xml
<!-- Ensure these are set in phpunit.xml -->
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

**Tests fail with "Class not found":**
```bash
composer dump-autoload
```

### Playwright Issues

**Module tests not discovered:**
```bash
# Verify the module is enabled
cat modules_statuses.json

# List all discovered projects
npm run test:e2e -- --list
```

**Setup not running:**

Ensure `database.setup` completes before test projects run. If `billing.setup` fails, `@Billing` tests won't start. Run setup projects individually to isolate the issue:
```bash
npm run test:e2e -- --project="database.setup"
```

## Next Steps

- **Module Development:** Learn how to add tests to your modules in the [Module System](/fundamentals/modules) guide
- **Coding Standards:** Review testing standards in the [Coding Standards](/development/coding-standards) guide
- **CI/CD:** Set up automated testing in your deployment pipeline (coming soon)
