---
sidebar_position: 2
title: Laravel Guidelines
description: PHP and Laravel coding guidelines for Saucebase
---

# Laravel Guidelines

:::info Attribution
These guidelines are adapted from [spatie.be/guidelines/laravel](https://spatie.be/guidelines/laravel) and tailored for the Saucebase stack.
:::

## General PHP Rules

Code style must follow [PSR-1](http://www.php-fig.org/psr/psr-1/), [PSR-2](http://www.php-fig.org/psr/psr-2/), and [PSR-12](https://www.php-fig.org/psr/psr-12/). Formatting is enforced automatically by **Laravel Pint** — run `composer lint` before committing.

### Nullable and Union Types

Whenever possible use the short nullable notation of a type, instead of using a union with `null`.

```php
// Good
public function getUser(?int $id): ?User

// Bad
public function getUser(int|null $id): User|null
```

### Void Return Types

If a method returns nothing, it should be indicated with `void`. This makes it more clear to the reader that the method intentionally returns nothing.

```php
// Good
public function handle(): void
{
    // ...
}
```

### Typed Properties

You should type a class property whenever possible.

```php
class Foo
{
    public string $bar;
}
```

### Enums

Enum **cases** should use `TitleCase`. Enum **values** should use `snake_case` or `kebab-case` for string-backed enums.

```php
// Good
enum Status: string
{
    case Active = 'active';
    case SoftDeleted = 'soft_deleted';
}

// Bad
enum Status: string
{
    case active = 'active';
    case SOFT_DELETED = 'soft_deleted';
}
```

## Docblocks

Don't use docblocks for methods that can be fully type hinted (unless you need a description).

Only add a description when it provides more context than the method signature itself. Use full sentences for descriptions, including a period at the end.

```php
// Good
class Url
{
    public static function fromString(string $url): Url
    {
        // ...
    }
}

// Bad: The description is redundant and the `@param` and `@return` are duplicated.
class Url
{
    /**
     * Create a url from a string.
     *
     * @param  string  $url
     *
     * @return \Spatie\Url\Url
     */
    public static function fromString(string $url): Url
    {
        // ...
    }
}
```

When dealing with arrays of objects, add the correct type hint via PHPDoc:

```php
/** @param User[] $users */
public function notifyUsers(array $users): void
{
    // ...
}
```

## Constructor Property Promotion

Use constructor property promotion for simple dependencies.

```php
// Good
class Foo
{
    public function __construct(
        protected readonly Bar $bar,
        protected readonly Baz $baz,
    ) {}
}

// Bad
class Foo
{
    protected Bar $bar;
    protected Baz $baz;

    public function __construct(Bar $bar, Baz $baz)
    {
        $this->bar = $bar;
        $this->baz = $baz;
    }
}
```

## Traits

Each applied trait should go on its own line, and the `use` keyword must be used for each trait.

```php
// Good
class MyModel extends Model
{
    use HasFactory;
    use SoftDeletes;
}

// Bad
class MyModel extends Model
{
    use HasFactory, SoftDeletes;
}
```

## Strings

When possible, prefer string interpolation over `sprintf` or concatenation with `.`.

```php
// Good
$greeting = "Hello, {$user->name}!";

// Okay
$greeting = 'Hello, ' . $user->name . '!';
```

## If Statements

### Happy Path Last

Generally a function should have its unhappy path first and its happy path last. This keeps the main logic unindented and easier to read.

```php
// Good
if (! $goodCondition) {
    throw new Exception;
}

// do work
```

```php
// Bad
if ($goodCondition) {
    // do work
}

throw new Exception;
```

### Avoid Else

Avoid `else` after a `return` or `throw`. This keeps nesting flat.

```php
// Good
if ($conditionA) {
    // if body
    return;
}

if ($conditionB) {
    // if body
    return;
}

// default behavior

// Bad
if ($conditionA) {
    // if body
} elseif ($conditionB) {
    // if body
} else {
    // default behavior
}
```

### Compound Ifs

In general, separate `if` statements should be preferred over a compound condition. This makes debugging easier.

```php
// Good
if (! $conditionA) {
    return;
}

if (! $conditionB) {
    return;
}

if (! $conditionC) {
    return;
}

// do stuff

// Bad
if (! $conditionA || ! $conditionB || ! $conditionC) {
    return;
}

// do stuff
```

## Whitespace

Statements should have to breathe. Add blank lines between groups of statements, but don't add blank lines inside a single block.

```php
// Good
public function getPage(string $url): ?Page
{
    $page = $this->pages()->where('url', $url)->first();

    if (! $page) {
        return null;
    }

    if ($page->deleted_at) {
        return null;
    }

    return $page;
}

// Bad: too compressed
public function getPage(string $url): ?Page
{
    $page = $this->pages()->where('url', $url)->first();
    if (! $page) {
        return null;
    }
    if ($page->deleted_at) {
        return null;
    }
    return $page;
}
```

Don't add any extra empty lines between a `{` and the first statement in a block, or between the last statement and `}`.

## Configuration

Configuration values must never be used directly in code via `env()`. Always proxy them through a config file.

```php
// Good
$apiKey = config('services.mailgun.key');

// Bad
$apiKey = env('MAILGUN_KEY');
```

## Artisan Commands

Command names should use `kebab-case` and should be namespaced with a colon.

```bash
# Good
php artisan export:users
php artisan generate:api-keys

# Bad
php artisan exportUsers
php artisan export_users
```

Commands should always provide feedback on what they're doing, using `$this->info()`, `$this->warn()`, etc.

## Routing

Public-facing URLs must use `kebab-case`.

```
// Good
/open-source
/jobs-at-spatie

// Bad
/openSource
/jobs_at_spatie
```

Route names must use `camelCase`.

```php
// Good
Route::get('open-source', [OpenSourceController::class, 'index'])->name('openSource');

// Bad
Route::get('open-source', [OpenSourceController::class, 'index'])->name('open-source');
```

All routes have an HTTP verb. Route names for resource controllers follow Laravel conventions: `index`, `create`, `store`, `show`, `edit`, `update`, `destroy`.

## Controllers

Controllers should use `PascalCase` and end with `Controller`. Controllers that handle a single resource should be named after that resource. Use resource controllers whenever possible, limiting methods to the seven standard actions.

```php
// Good
class UsersController extends Controller {}
class UserSettingsController extends Controller {}

// Bad
class UserControllerNew extends Controller {}
class ManageUsersController extends Controller {}
```

## Views

View file names should use `camelCase` and must correspond to the controller method or Inertia page.

```php
// Controller
return inertia('Blog::Index');       // modules/Blog/resources/js/pages/Index.vue
return inertia('Blog::PostShow');    // modules/Blog/resources/js/pages/PostShow.vue
```

## Validation

Always use a dedicated Form Request class. Never inline `$request->validate()` in a controller.

```php
// Good
class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
        ];
    }
}

public function store(StoreUserRequest $request): RedirectResponse
{
    // ...
}
```

## Authorization

Prefer policies over inline `$this->authorize()` calls in controllers. Register them in the model's `$policies` array or via `AuthServiceProvider`.

## Naming Classes

Naming things is often seen as one of the harder things in programming. That's why we've established some high-level guidelines for how to name various "types" of classes.

| Suffix | Example | When to use |
|---|---|---|
| `Controller` | `UsersController` | Handles HTTP requests for a resource |
| `Request` | `StoreUserRequest` | Validates and authorises a form submission |
| `Resource` | `UserResource` | API JSON transformer |
| `Policy` | `UserPolicy` | Authorisation rules for a model |
| `Observer` | `UserObserver` | Reacts to model events |
| `Job` | `SendWelcomeEmailJob` | Queued task |
| `Mail` | `WelcomeMail` | Mailable class |
| `Notification` | `InvoicePaidNotification` | Notification class |
| `Seeder` | `UsersDatabaseSeeder` | Database seeder |
| `Factory` | `UserFactory` | Model factory |
| `Command` | `GenerateApiKeysCommand` | Artisan command |
| `Middleware` | `EnsureUserIsAdmin` | HTTP middleware |
| `ServiceProvider` | `NavigationServiceProvider` | Service provider |
| `Plugin` | `BillingPlugin` | Filament plugin |
