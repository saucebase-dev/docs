---
sidebar_position: 2
title: Dialogs
description: Show confirmation dialogs from anywhere in your application using the useDialog composable
---

# Dialogs

Saucebase provides a promise-based `useDialog` composable that lets any component or module show a confirmation dialog and await the user's response — without managing local state or rendering a `<Dialog>` inline.

## How It Works

- A singleton `DynamicDialog` component (`resources/js/components/DynamicDialog.vue`) is mounted once in `App.vue` — it is an internal implementation detail; use `useDialog()` instead of referencing it directly
- `useDialog().confirm(options)` opens it and returns a `Promise<boolean>`
- `true` = confirmed, `false` = cancelled
- Built on shadcn-vue `AlertDialog` (`role="alertdialog"`) — clicking outside does **not** dismiss it, which prevents accidental dismissal of destructive confirmations

![Confirm dialog example](</screenshot/fundamentals/dialog-confirm.png>)

## Basic Usage

```typescript
import { useDialog } from '@/composables/useDialog';

const { confirm } = useDialog();

if (await confirm({ title: 'Delete item?' })) {
    // user confirmed
}
```

## Destructive Variant

Pass `variant: 'destructive'` to style the confirm button in red — use this for irreversible actions like deletion or logout. Optionally pass an `icon` (any Vue component, typically Lucide) to render it above the title in a coloured rounded square.

```typescript
import { Trash2 } from 'lucide-vue-next';

const { confirm } = useDialog();

if (await confirm({
    title: 'Delete item?',
    description: 'This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    variant: 'destructive',
    icon: Trash2,
})) {
    // user confirmed
}
```

## API Reference

### `useDialog()`

Returns:

| Property    | Type                                      | Description                              |
| ----------- | ----------------------------------------- | ---------------------------------------- |
| `confirm`   | `(opts: ConfirmOptions) => Promise<boolean>` | Opens the dialog, resolves on close   |

### `ConfirmOptions`

| Property       | Type                          | Default       | Description                        |
| -------------- | ----------------------------- | ------------- | ---------------------------------- |
| `title`        | `string`                      | —             | Dialog heading (required)          |
| `description`  | `string`                      | —             | Optional body text                 |
| `confirmLabel` | `string`                      | `'Confirm'`   | Confirm button label               |
| `cancelLabel`  | `string`                      | `'Cancel'`    | Cancel button label                |
| `variant`      | `'default' \| 'destructive'`  | `'default'`   | Confirm button variant             |
| `icon`         | `Component`                   | —             | Optional Lucide (or any Vue) icon rendered alongside the title |
| `align`        | `'center' \| 'left'`          | `'center'`    | `center`: icon above title, everything centred. `left`: icon inline-left of title/description |

## Using in Modules

The composable is part of the core (`@/composables/useDialog`), so any module can import it directly — no registration needed.

```typescript title="modules/YourModule/resources/js/app.ts"
import { useDialog } from '@/composables/useDialog';
import { router } from '@inertiajs/vue3';

const { confirm } = useDialog();

if (await confirm({ title: 'Cancel subscription?', variant: 'destructive' })) {
    router.delete(route('billing.subscription.cancel'));
}
```

## Test IDs

The `DynamicDialog` renders with `data-testid` attributes for E2E testing:

| Element          | `data-testid`            |
| ---------------- | ------------------------ |
| Dialog wrapper   | `confirm-dialog`         |
| Confirm button   | `confirm-dialog-confirm` |
| Cancel button    | `confirm-dialog-cancel`  |

```typescript title="Playwright example"
await page.getByRole('menuitem', { name: /delete/i }).click();

const dialog = page.getByTestId('confirm-dialog');
await expect(dialog).toBeVisible();

await page.getByTestId('confirm-dialog-confirm').click();
await expect(dialog).not.toBeVisible();
```

## What's Next?

- [Navigation](./navigation.md) — Register action-based nav items that trigger dialogs
- [Modules](./modules.md) — Creating and managing modules
