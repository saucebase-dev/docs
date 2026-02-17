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
- **DRY principle in tests** - Extract repeated logic into helper functions
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

**Database Configuration:**
- Tests run with **SQLite in-memory database** by default
- Each test runs in a transaction and is rolled back
- No need to manually reset the database between tests

### Running PHPUnit Tests

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
php artisan test --testsuite=Modules

# Run specific test file
php artisan test tests/Feature/AuthTest.php

# Run specific test method
php artisan test --filter test_user_can_login

# Run tests in a directory
php artisan test tests/Feature
php artisan test tests/Unit

# Run with coverage (requires Xdebug)
php artisan test --coverage

# Run in parallel
php artisan test --parallel
```

### Writing Unit Tests

Unit tests verify individual components in isolation:

```php title="tests/Unit/UserTest.php"
<?php

namespace Tests\Unit;

use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    /** @test */
    public function it_generates_full_name_correctly(): void
    {
        // Arrange
        $user = new User([
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        // Act
        $fullName = $user->getFullNameAttribute();

        // Assert
        $this->assertEquals('John Doe', $fullName);
    }
}
```

### Writing Feature Tests

Feature tests verify complete user workflows using the database:

```php title="tests/Feature/AuthenticationTest.php"
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_user_with_valid_data(): void
    {
        // Arrange
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ];

        // Act
        $response = $this->post('/register', $data);

        // Assert
        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
        $response->assertRedirect('/dashboard');
    }

    /** @test */
    public function authenticated_user_can_access_dashboard(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->get('/dashboard');

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('Dashboard')
        );
    }
}
```

### Module Testing Patterns

Modules should include their own tests in `modules/<ModuleName>/tests/`:

```
modules/Auth/
├── tests/
│   ├── Feature/
│   │   ├── LoginTest.php
│   │   └── RegistrationTest.php
│   └── Unit/
│       └── AuthServiceTest.php
```

**Run module tests:**
```bash
# Run all module tests
php artisan test --testsuite=Modules

# Run specific module's tests
php artisan test modules/Auth/tests

# Run specific module test file
php artisan test modules/Auth/tests/Feature/LoginTest.php
```

**Example module test:**
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
    public function user_can_login_with_valid_credentials(): void
    {
        // Arrange
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Act
        $response = $this->post('/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        // Assert
        $this->assertAuthenticatedAs($user);
        $response->assertRedirect('/dashboard');
    }
}
```

### Test Organization Best Practices

**Use Arrange-Act-Assert (AAA) pattern:**
```php
/** @test */
public function it_does_something(): void
{
    // Arrange - Set up test data and conditions
    $user = User::factory()->create();

    // Act - Perform the action being tested
    $result = $user->performAction();

    // Assert - Verify the expected outcome
    $this->assertTrue($result);
}
```

**Use descriptive test names:**
```php
// ✅ Good: Clear and descriptive
public function it_sends_welcome_email_after_registration(): void

// ❌ Bad: Vague and unclear
public function test_email(): void
```

**Extract test helpers:**
```php title="tests/TestCase.php"
<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Create an authenticated user and return the user instance.
     */
    protected function createAuthenticatedUser(array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        $this->actingAs($user);

        return $user;
    }
}
```

## Playwright E2E Testing

### Configuration

Playwright tests are configured in `playwright.config.ts` with automatic module discovery:

```typescript title="playwright.config.ts"
import { defineConfig } from '@playwright/test';
import { collectModulePlaywrightConfigs } from './module-loader.js';

const moduleProjects = await collectModulePlaywrightConfigs();

export default defineConfig({
    projects: [
        {
            name: '@Core',
            testDir: './tests/e2e',
        },
        ...moduleProjects, // [@Auth, @Settings, ...]
    ],
    // ... other config
});
```

**How module discovery works:**
1. `module-loader.js` reads `modules_statuses.json` to find enabled modules
2. For each enabled module, it checks for `playwright.config.ts` in the module directory
3. Module test projects are prefixed with `@ModuleName` (e.g., `@Auth`, `@Settings`)

### Running Playwright Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific project
npm run test:e2e -- --project=@Core
npm run test:e2e -- --project=@Auth

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Run specific test file
npm run test:e2e tests/e2e/index.spec.ts

# Run tests matching a pattern
npm run test:e2e -- --grep "login"
```

### Writing E2E Tests

**Core tests** go in `tests/e2e/`:

```typescript title="tests/e2e/home.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
    test('displays welcome message', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('h1')).toContainText('Welcome to Saucebase');
    });

    test('navigates to dashboard when logged in', async ({ page }) => {
        // Login first
        await page.goto('/auth/login');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="password"]', 'password');
        await page.click('button[type="submit"]');

        // Visit home
        await page.goto('/');
        await page.click('text=Go to Dashboard');

        // Verify navigation
        await expect(page).toHaveURL('/dashboard');
    });
});
```

**Module tests** go in `modules/<ModuleName>/tests/e2e/`:

```typescript title="modules/Auth/tests/e2e/login.spec.ts"
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
    test('user can login with valid credentials', async ({ page }) => {
        await page.goto('/auth/login');

        await page.fill('input[name="email"]', 'chef@saucebase.dev');
        await page.fill('input[name="password"]', 'secretsauce');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/dashboard');
        await expect(page.locator('text=Dashboard')).toBeVisible();
    });

    test('shows error for invalid credentials', async ({ page }) => {
        await page.goto('/auth/login');

        await page.fill('input[name="email"]', 'wrong@example.com');
        await page.fill('input[name="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });
});
```

### Module Test Structure

```
modules/Auth/
├── tests/
│   └── e2e/
│       ├── login.spec.ts
│       ├── registration.spec.ts
│       └── password-reset.spec.ts
└── playwright.config.ts  # Optional module-specific config
```

**Module Playwright config (optional):**
```typescript title="modules/Auth/playwright.config.ts"
export default {
    name: 'Auth',
    testDir: './tests/e2e',
};
```

The module loader will automatically:
- Prefix the project with `@` (becomes `@Auth`)
- Include module tests when running `npm run test:e2e`

### Test Helpers and Utilities

**Extract repeated logic into helpers:**

```typescript title="tests/e2e/helpers/auth.ts"
import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
}

export async function logout(page: Page) {
    await page.click('button[aria-label="User menu"]');
    await page.click('text=Logout');
}
```

**SSR test helpers** (already included in Saucebase):

```typescript title="tests/e2e/helpers/ssr.ts"
import { Page, expect } from '@playwright/test';

export async function expectSSREnabled(page: Page, expectedComponent?: string) {
    const htmlContent = await page.content();

    // Check for Inertia SSR markers
    expect(htmlContent).toContain('id="app"');
    expect(htmlContent).toContain('data-page');

    if (expectedComponent) {
        expect(htmlContent).toContain(`"component":"${expectedComponent}"`);
    }
}

export async function expectSSRDisabled(page: Page) {
    const htmlContent = await page.content();

    // Should have app div but no data-page
    expect(htmlContent).toContain('id="app"');
    expect(htmlContent).not.toContain('data-page');
}
```

**Using helpers in tests:**
```typescript title="tests/e2e/dashboard.spec.ts"
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';
import { expectSSRDisabled } from './helpers/ssr';

test('dashboard disables SSR', async ({ page }) => {
    await login(page, 'chef@saucebase.dev', 'secretsauce');
    await page.goto('/dashboard');

    await expectSSRDisabled(page);
});
```

## Continuous Integration

When running tests in CI environments:

```bash
# Set environment to testing
export APP_ENV=testing

# Run backend tests
php artisan test --parallel

# Run E2E tests (headless)
npm run test:e2e -- --reporter=github
```

:::tip
In CI, Playwright automatically runs in headless mode and doesn't start the Vite dev server (detects CI environment).
:::

## Troubleshooting

### PHPUnit Issues

**Database not found:**
```bash
# Ensure SQLite is configured in phpunit.xml
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

**Tests fail with "Class not found":**
```bash
# Regenerate autoload files
composer dump-autoload
```

### Playwright Issues

**Module tests not discovered:**
```bash
# Verify module is enabled in modules_statuses.json
# Rebuild the config
npm run test:e2e -- --list
```

**Vite server not starting:**
```bash
# Check if port 5173 is available
# Or specify a different port in playwright.config.ts
webServer: {
    port: 5174,
}
```

## Next Steps

- **Module Development:** Learn how to add tests to your modules in the [Module System](/fundamentals/modules) guide
- **Coding Standards:** Review testing standards in the [Coding Standards](/development/coding-standards) guide
- **CI/CD:** Set up automated testing in your deployment pipeline (coming soon)
