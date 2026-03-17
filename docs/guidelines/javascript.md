---
sidebar_position: 3
title: JavaScript Guidelines
description: JavaScript and TypeScript coding guidelines for Saucebase
---

# JavaScript Guidelines

:::info Attribution
These guidelines are adapted from [spatie.be/guidelines/javascript](https://spatie.be/guidelines/javascript) and tailored for the Saucebase stack (Vue 3, TypeScript, ESLint, Prettier).
:::

:::tip Enforced automatically
Many of these rules are already enforced by the project's ESLint and Prettier configuration. Run `npm run lint` and `npm run format` to auto-fix issues before committing.
:::

## Prettier Configuration

The project's `.prettierrc` enforces:

```json
{
    "singleQuote": true,
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "trailingComma": "all",
    "arrowParens": "always",
    "bracketSpacing": true,
    "endOfLine": "lf"
}
```

Key points:
- **Single quotes** for strings
- **4-space indentation** (not 2, not tabs)
- **120 character line width** — gives room for verbose TypeScript and Vue templates
- **Trailing commas** everywhere (including function parameters)
- **Semicolons** required

## Variable Assignment

Prefer `const` over `let`. Only use `let` when you know the value will need to change. Never use `var`.

```js
// Good
const greeting = 'Hello';

// Good — value changes
let count = 0;
count++;

// Bad
var greeting = 'Hello';
let message = 'Static message'; // Should be const
```

## Variable Names

Variable names should be `camelCase`. For booleans, prefix with `is`, `has`, or `can` to make intent clear.

```js
// Good
const isLoggedIn = true;
const hasSubscription = false;
const canEditPost = computed(() => user.value.isAdmin);

// Bad
const loggedin = true;
const subscription = false;
const editPost = computed(() => user.value.isAdmin);
```

## Comparisons

Always use `===` instead of `==`. When checking truthiness for strings, numbers, or arrays, use the explicit comparison rather than relying on type coercion.

```js
// Good
if (value === '') { ... }
if (count === 0) { ... }
if (items.length === 0) { ... }

// Bad
if (value == '') { ... }
if (!count) { ... }
if (!items.length) { ... }
```

## Function Keyword vs Arrow Functions

Prefer arrow functions for callbacks and composables. Use named function declarations for top-level functions or methods that need to be hoisted.

```js
// Good — arrow for callbacks
const doubled = items.map((item) => item * 2);

// Good — named function for composable
function useCounter() {
    const count = ref(0);
    const increment = () => count.value++;
    return { count, increment };
}

// Bad — unnecessary function keyword in callback
const doubled = items.map(function (item) {
    return item * 2;
});
```

Always include parentheses around arrow function parameters, even for single parameters (enforced by `arrowParens: "always"`).

```js
// Good
const double = (n) => n * 2;

// Bad (will be auto-fixed by Prettier)
const double = n => n * 2;
```

## Object and Array Destructuring

Use destructuring when you need multiple properties from an object or specific elements from an array.

```js
// Good
const { name, email } = user;
const [first, ...rest] = items;

// Good — destructure in function parameters
function greet({ name, role }) {
    return `Hello, ${name} (${role})`;
}

// Acceptable — single property access is fine without destructuring
const name = user.name;
```

## Object Method Shorthand

Use the shorthand syntax for object methods.

```js
// Good
const obj = {
    name: 'Saucebase',
    greet() {
        return `Hello from ${this.name}`;
    },
};

// Bad
const obj = {
    name: 'Saucebase',
    greet: function () {
        return `Hello from ${this.name}`;
    },
};
```

## Template Literals

Use template literals instead of string concatenation when embedding variables.

```js
// Good
const message = `Hello, ${user.name}! You have ${count} notifications.`;

// Bad
const message = 'Hello, ' + user.name + '! You have ' + count + ' notifications.';
```

## TypeScript

### Type Inference

Don't annotate a type that TypeScript can infer. Add explicit types only where they add clarity or where inference fails.

```ts
// Good — TypeScript infers string[]
const names = ['Alice', 'Bob'];

// Good — explicit return type adds clarity on public API
function getUser(id: number): Promise<User> { ... }

// Bad — redundant annotation
const names: string[] = ['Alice', 'Bob'];
```

### Interfaces vs Types

Prefer `interface` for object shapes and `type` for unions, intersections, or aliases.

```ts
// Good
interface User {
    id: number;
    name: string;
    email: string;
}

type Status = 'active' | 'inactive' | 'pending';
type UserWithStatus = User & { status: Status };
```

### Enums

Avoid TypeScript `enum`. Prefer `const` objects with `as const` or string union types for better tree-shaking and compatibility.

```ts
// Good
const Role = {
    Admin: 'admin',
    User: 'user',
} as const;
type Role = (typeof Role)[keyof typeof Role];

// Also good for simple cases
type Role = 'admin' | 'user';

// Avoid
enum Role {
    Admin = 'admin',
    User = 'user',
}
```

## Vue Components

### Composition API

Always use `<script setup>` with the Composition API. Do not use Options API for new components.

```vue
<!-- Good -->
<script setup lang="ts">
const props = defineProps<{ title: string }>();
const emit = defineEmits<{ close: [] }>();
</script>

<!-- Bad -->
<script lang="ts">
export default {
    props: { title: String },
    methods: { ... },
};
</script>
```

### Component Names

Component file names should use `PascalCase`. Single-instance components (used once per page) should be prefixed with `The`: `TheHeader.vue`, `TheSidebar.vue`.

### Props and Emits

Always type props and emits using TypeScript generics in `defineProps` and `defineEmits`.

```vue
<script setup lang="ts">
interface Props {
    title: string;
    count?: number;
    items: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
    update: [value: string];
    close: [];
}>();
</script>
```
