# Coding Standards

Saucebase enforces strict coding standards to ensure maintainability, readability, and quality. This guide covers the tools, conventions, and patterns used in the project.

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

## Next Steps

- [Git Workflow](/development/git-workflow) - Learn about commit standards
- [Commands](/development/commands) - Development commands
