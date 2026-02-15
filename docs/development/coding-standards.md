# Coding Standards

Saucebase enforces strict coding standards to ensure maintainability, readability, and quality. This guide covers the principles, tools, and best practices for writing clean code.

## Core Principles

### DRY (Don't Repeat Yourself)

**CRITICAL**: Extract common logic into reusable functions, classes, or composables.

```php
// ❌ Bad: Repeated logic
public function showUserProfile($id) {
    $user = User::find($id);
    if (!$user) {
        abort(404);
    }
    if (!auth()->user()->can('view', $user)) {
        abort(403);
    }
    return inertia('Profile', ['user' => $user]);
}

public function editUserProfile($id) {
    $user = User::find($id);
    if (!$user) {
        abort(404);
    }
    if (!auth()->user()->can('view', $user)) {
        abort(403);
    }
    return inertia('ProfileEdit', ['user' => $user]);
}

// ✅ Good: Extracted authorization logic
public function showUserProfile($id) {
    $user = $this->findAuthorizedUser($id, 'view');
    return inertia('Profile', ['user' => $user]);
}

public function editUserProfile($id) {
    $user = $this->findAuthorizedUser($id, 'update');
    return inertia('ProfileEdit', ['user' => $user]);
}

private function findAuthorizedUser($id, $ability) {
    $user = User::findOrFail($id);
    $this->authorize($ability, $user);
    return $user;
}
```

### KISS (Keep It Simple, Stupid)

Prefer simple, obvious solutions over clever ones.

```php
// ❌ Bad: Over-engineered
class StringTransformationFactory {
    public function createTransformer($type) {
        return match($type) {
            'uppercase' => new UppercaseTransformer(),
            'lowercase' => new LowercaseTransformer(),
        };
    }
}

$factory = new StringTransformationFactory();
$transformer = $factory->createTransformer('uppercase');
$result = $transformer->transform($name);

// ✅ Good: Simple and direct
$result = strtoupper($name);
```

### YAGNI (You Aren't Gonna Need It)

Don't build features for hypothetical future requirements.

```php
// ❌ Bad: Building for the future
class UserRepository {
    public function findById($id) { /* ... */ }
    public function findByEmail($email) { /* ... */ }
    public function findByPhoneNumber($phone) { /* ... */ }  // Not needed yet
    public function findBySocialSecurity($ssn) { /* ... */ }   // Not needed yet
    public function findByDriversLicense($dl) { /* ... */ }    // Not needed yet
}

// ✅ Good: Only what's needed now
class UserRepository {
    public function findById($id) { /* ... */ }
    public function findByEmail($email) { /* ... */ }
}
// Add other methods when actually needed
```

### Single Responsibility Principle

Each class/function should do one thing well.

```php
// ❌ Bad: Multiple responsibilities
class UserController {
    public function register(Request $request) {
        // Validate
        $validated = $request->validate([...]);

        // Create user
        $user = User::create($validated);

        // Send welcome email
        Mail::to($user)->send(new WelcomeEmail($user));

        // Log activity
        Log::info("User registered: {$user->email}");

        // Track analytics
        Analytics::track('user_registered', ['user_id' => $user->id]);

        return redirect()->route('dashboard');
    }
}

// ✅ Good: Separated concerns
class UserController {
    public function register(
        Request $request,
        UserService $userService
    ) {
        $validated = $request->validate([...]);
        $user = $userService->register($validated);

        return redirect()->route('dashboard');
    }
}

class UserService {
    public function register(array $data): User {
        $user = User::create($data);

        event(new UserRegistered($user));

        return $user;
    }
}

// Listeners handle side effects
class SendWelcomeEmail {
    public function handle(UserRegistered $event) {
        Mail::to($event->user)->send(new WelcomeEmail($event->user));
    }
}
```

## PHP/Laravel Standards

### Enforced by Tools

- **PHPStan Level 5** - Static analysis (`composer analyse`)
- **Laravel Pint PSR-12** - Code formatting (`composer lint`)
- **Pre-commit hooks** - Automatic formatting

### Type Hints and PHPDoc

Always use type hints and PHPDoc:

```php
// ✅ Good: Type hints, PHPDoc, clear method names
/**
 * Retrieve active users with their roles.
 *
 * @return \Illuminate\Database\Eloquent\Collection<int, User>
 */
public function getActiveUsers(): Collection
{
    return User::with('roles')
        ->where('active', true)
        ->get();
}

// ❌ Bad: No types, unclear name, missing docs
public function getUsers()
{
    return User::where('active', true)->get();
}
```

### Class Structure

- **Max 200-300 lines per class** (if larger, consider splitting)
- **Max 20-30 lines per method**
- Use service classes for complex business logic
- Keep controllers thin (validate input, call service, return response)

```php
// ✅ Good: Thin controller
class PostController extends Controller
{
    public function store(
        StorePostRequest $request,
        PostService $postService
    ): RedirectResponse {
        $post = $postService->create($request->validated());

        return redirect()
            ->route('post.show', $post)
            ->with('success', 'Post created successfully');
    }
}

// Business logic in service
class PostService
{
    public function create(array $data): Post
    {
        $post = Post::create($data);

        event(new PostCreated($post));

        return $post;
    }
}
```

### Naming Conventions

```php
// Classes: PascalCase
class UserController
class PostService
class OrderStatusEnum

// Methods: camelCase
public function getUserPosts()
public function createNewPost()

// Variables: camelCase
$activeUsers = User::where('active', true)->get();
$postCount = $user->posts()->count();

// Constants: SCREAMING_SNAKE_CASE
const MAX_UPLOAD_SIZE = 10485760;
const DEFAULT_TIMEZONE = 'UTC';

// Database tables: snake_case, plural
users, blog_posts, order_items

// Database columns: snake_case
created_at, user_id, first_name
```

### Eloquent Best Practices

```php
// ❌ Bad: N+1 query problem
$users = User::all();
foreach ($users as $user) {
    echo $user->posts->count(); // Queries for each user
}

// ✅ Good: Eager loading
$users = User::withCount('posts')->get();
foreach ($users as $user) {
    echo $user->posts_count; // Single query
}

// ✅ Good: Specific columns
User::select('id', 'name', 'email')->get();

// ✅ Good: Chunking large datasets
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // Process user
    }
});
```

## JavaScript/TypeScript Standards

### Enforced by Tools

- **ESLint** - Vue + TypeScript rules (`npm run lint`)
- **Prettier** - Code formatting (`npm run format`)
- **Pre-commit hooks** - Automatic formatting

### TypeScript Types

Always use TypeScript types:

```typescript
// ✅ Good: TypeScript types, composables, clear structure
<script setup lang="ts">
import { ref, computed } from 'vue';

interface User {
    id: number;
    name: string;
    email: string;
    active: boolean;
}

interface Props {
    users: User[];
}

const props = defineProps<Props>();

const activeUsers = computed(() =>
    props.users.filter((u) => u.active)
);

const count = ref<number>(0);
</script>

// ❌ Bad: No types, unclear logic
<script setup>
const props = defineProps(['users']);
const filtered = props.users.filter(u => u.active);
const count = ref(0);
</script>
```

### Component Structure

```html
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue';
import { useForm } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';

// 2. Interfaces/Types
interface Props {
    user: User;
}

// 3. Props/Emits
const props = defineProps<Props>();
const emit = defineEmits<{
    update: [user: User];
}>();

// 4. Reactive state
const isEditing = ref(false);

// 5. Computed properties
const displayName = computed(() => props.user.name);

// 6. Methods
const startEdit = () => {
    isEditing.value = true;
};

// 7. Lifecycle hooks
onMounted(() => {
    console.log('Component mounted');
});
</script>

<template>
    <!-- Template content -->
</template>

<style scoped>
/* Scoped styles (prefer Tailwind utility classes) */
</style>
```

### Naming Conventions

```typescript
// Components: PascalCase
UserProfile.vue
DashboardLayout.vue
LoginForm.vue

// Composables: camelCase with "use" prefix
useAuth.ts
useLocalStorage.ts
useDebounce.ts

// Utilities: camelCase
formatDate.ts
parseQuery.ts
resolveModularPageComponent.ts

// Constants: SCREAMING_SNAKE_CASE
const API_TIMEOUT = 5000;
const MAX_RETRIES = 3;

// Variables/Functions: camelCase
const activeUsers = ref<User[]>([]);
const getUserById = (id: number) => {};
```

## When to Abstract vs Keep Simple

### ✅ Create Abstractions When

- Same logic appears **3+ times**
- Clear reusability across multiple contexts
- Well-defined interface/contract
- Logic is complex enough to warrant isolation

```php
// ✅ Good abstraction: Reusable service
class UserNotificationService {
    public function notifyPasswordChanged(User $user): void
    {
        $user->notify(new PasswordChangedNotification());
    }

    public function notifyEmailChanged(User $user): void
    {
        $user->notify(new EmailChangedNotification());
    }
}
```

```typescript
// ✅ Good abstraction: Composable for shared state
// useLocalization.ts
export function useLocalization() {
    const language = ref(loadStoredLanguage());

    const setLanguage = (lang: string) => {
        language.value = lang;
        localStorage.setItem('language', lang);
    };

    return { language, setLanguage };
}
```

### ❌ Don't Create Abstractions When

- Logic used only **once** or **twice**
- Abstraction makes code harder to understand
- Building for hypothetical future needs
- Simple inline code is clearer

```php
// ❌ Bad: Over-engineered for one-time use
class StringUppercaseTransformer {
    public function transform(string $input): string {
        return strtoupper($input);
    }
}

$name = (new StringUppercaseTransformer())->transform($user->name);

// ✅ Good: Simple inline operation
$name = strtoupper($user->name);
```

## Security Best Practices

### SQL Injection Prevention

```php
// ✅ Good: Eloquent ORM
User::where('email', $email)->first();

// ✅ Good: Query builder with bindings
DB::table('users')->where('email', $email)->first();

// ❌ Bad: Raw SQL with concatenation
DB::select("SELECT * FROM users WHERE email = '$email'");
```

### XSS Prevention

```html
<!-- ✅ Good: Auto-escaped by Vue -->
<template>
    <div>{{ user.name }}</div>
</template>

<!-- ❌ Bad: Unsafe HTML rendering -->
<template>
    <div v-html="userContent"></div>
</template>

<!-- ✅ Good: Sanitized HTML if needed -->
<script setup lang="ts">
import DOMPurify from 'dompurify';

const sanitizedContent = computed(() => DOMPurify.sanitize(userContent));
</script>

<template>
    <div v-html="sanitizedContent"></div>
</template>
```

### CSRF Protection

```html
<!-- ✅ Good: CSRF token automatically included by Inertia -->
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';

const form = useForm({
    email: '',
    password: '',
});

const submit = () => {
    form.post(route('login')); // CSRF token automatically added
};
</script>
```

### Command Injection

```php
// ❌ Bad: User input in shell command
exec("ping -c 4 {$userInput}");

// ✅ Good: Use Laravel's Process facade
Process::run(['ping', '-c', '4', $userInput]);
```

### Authentication/Authorization

```php
// ✅ Good: Check permissions
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);

    $post->update($request->validated());

    return redirect()->route('post.show', $post);
}

// ✅ Good: Middleware
Route::middleware(['auth', 'can:update,post'])
    ->put('/posts/{post}', [PostController::class, 'update']);
```

## Readability & Maintainability

### Function Length

- **Ideal**: 10-20 lines
- **Maximum**: 30-40 lines
- If longer, break into smaller functions

### Nesting Depth

- **Maximum**: 3-4 levels deep
- Use early returns to reduce nesting

```php
// ✅ Good: Early returns, flat structure
public function process(User $user): bool
{
    if (!$user->isActive()) {
        return false;
    }

    if (!$user->hasPermission('process')) {
        return false;
    }

    return $this->performProcess($user);
}

// ❌ Bad: Deep nesting
public function process(User $user): bool
{
    if ($user->isActive()) {
        if ($user->hasPermission('process')) {
            return $this->performProcess($user);
        }
    }
    return false;
}
```

### Descriptive Names

```php
// ✅ Good: Descriptive, self-documenting
$activeSubscriptionUsers = User::whereHas('subscription', fn($q) =>
    $q->where('status', 'active')
)->get();

// ❌ Bad: Unclear abbreviations
$asUsers = User::whereHas('sub', fn($q) => $q->where('s', 'a'))->get();
```

## Code Quality Tools

### Running Checks Manually

```bash
# PHP
composer analyse          # PHPStan static analysis
composer lint             # Laravel Pint formatting
vendor/bin/phpstan analyse --memory-limit=2G

# JavaScript/TypeScript
npm run lint              # ESLint (auto-fixes)
npm run format            # Prettier formatting
npm run format:check      # Check formatting without changes
```

### Pre-commit Hooks

Husky automatically runs these before each commit:

1. **PHP**: `composer lint` - Formats PHP code
2. **JS/TS/Vue**: `npx lint-staged` - Formats staged files
3. **Commit message**: `commitlint` - Validates format

## Testing Standards

### Required Tests

- **Feature tests** for user-facing workflows
- **Unit tests** for complex business logic
- **E2E tests** for critical user paths

### Test Structure

```php
// ✅ Good: Clear test structure
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
    $user = User::create($data);

    // Assert
    $this->assertDatabaseHas('users', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);
    $this->assertNotNull($user->id);
}
```

### DRY Principle in Tests

```typescript
// ✅ Good: Reusable test helpers
// tests/e2e/helpers/auth.ts
export async function login(page: Page, email: string, password: string) {
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
}

// tests/e2e/dashboard.spec.ts
test('user can view dashboard after login', async ({ page }) => {
    await login(page, 'test@example.com', 'password'); // Reusable!
    await expect(page.locator('h1')).toHaveText('Dashboard');
});
```

## Performance Guidelines

### Database Optimization

```php
// ❌ Bad: Multiple queries
$users = User::all();
$activeCount = User::where('active', true)->count();
$inactiveCount = User::where('active', false)->count();

// ✅ Good: Single query
$users = User::selectRaw('
    COUNT(*) as total,
    SUM(CASE WHEN active = 1 THEN 1 ELSE 0 END) as active_count,
    SUM(CASE WHEN active = 0 THEN 1 ELSE 0 END) as inactive_count
')->first();
```

### Caching Strategies

```php
// ✅ Good: Cache expensive queries
$users = Cache::remember('active_users', 3600, function () {
    return User::with('roles')
        ->where('active', true)
        ->get();
});

// Clear cache after updates
User::created(function ($user) {
    Cache::forget('active_users');
});
```

### Frontend Performance

```html
<script setup lang="ts">
// ✅ Good: Lazy load heavy components
import { defineAsyncComponent } from 'vue';

const HeavyChart = defineAsyncComponent(() =>
    import('@/components/HeavyChart.vue')
);

// ✅ Good: Memoized computed
const sortedUsers = computed(() => {
    return [...props.users].sort((a, b) => a.name.localeCompare(b.name));
});
</script>

<template>
    <!-- ✅ Good: v-show for frequent toggles -->
    <div v-show="isVisible">Content</div>

    <!-- ✅ Good: v-if for conditional rendering -->
    <div v-if="isAuthenticated">Dashboard</div>
</template>
```

## Code Review Checklist

Before requesting review, ensure:

- [ ] Code runs without errors
- [ ] All tests pass (`php artisan test`, `npm run test:e2e`)
- [ ] Static analysis passes (`composer analyse`)
- [ ] Code is formatted (`composer lint`, `npm run format`)
- [ ] No security vulnerabilities
- [ ] No N+1 queries or performance issues
- [ ] PHPDoc/JSDoc added for public methods
- [ ] Commit messages follow conventional format
- [ ] No sensitive data in commits

## Next Steps

- [Git Workflow](/development/git-workflow) - Learn about commit standards
- [Commands](/development/commands) - Development commands
