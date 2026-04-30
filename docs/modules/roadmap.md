---
title: Roadmap
description: Let customers suggest features and bugs, vote on them, and track your product roadmap publicly.
---

# Roadmap Module

The Roadmap module gives authenticated users a page to suggest features or bugs, vote on what matters most, and see where things stand. New suggestions go through a moderation step before they become visible to others.

**Requires:** [Auth module](./auth)

![Public roadmap page](</screenshot/roadmap/roadmap.png>)

## What you get

- **Roadmap page** at `/roadmap` — authenticated users see all public items grouped by status
- **Voting** — upvote or downvote items; score updates instantly without a page reload
- **Feature suggestions** — users can submit new items directly from the roadmap page via a dialog
- **Moderation** — new suggestions default to Pending Approval and are hidden until you review them
- **Item types** — Feature or Bug, so your team can triage quickly
- **Six statuses** — track items from suggestion through to completion
- **Filament CRUD** — manage all roadmap items in the admin panel

## Installation

```bash
composer require saucebase/roadmap
php artisan migrate
php artisan modules:seed --module=roadmap
npm run build
```

## Admin panel

Navigate to `/admin` → **Roadmap Items** to manage items.

Use the **New roadmap item** button to create an item directly. The form auto-generates a slug from the title.

![Roadmap admin panel](</screenshot/roadmap/roadmap-admin.png>)

The table is sorted by submission date (newest first) by default. Use the **status** filter to find items awaiting approval, and the **type** filter to separate features from bugs.

## Item fields

| Field | Description |
|-------|-------------|
| **Title** | The name of the feature or bug |
| **Slug** | Used in the URL. Auto-generated from the title on create |
| **Description** | A detailed explanation of the item |
| **Status** | The current state of the item (see statuses below) |
| **Type** | `Feature` or `Bug` |
| **Submitted by** | The user who suggested the item (nullable for admin-created items) |

## Item statuses

| Status | Visible publicly | Description |
|--------|-----------------|-------------|
| **Pending Approval** | No | Default when a user submits a suggestion. Hidden until you approve it |
| **Approved** | Yes | Approved and open for voting |
| **In Progress** | Yes | You have started working on it |
| **Completed** | Yes | Done |
| **Rejected** | No | You decided not to pursue this item |
| **Cancelled** | No | Work was started but cancelled |

Only items with status **Approved**, **In Progress**, or **Completed** appear on the roadmap.

## Frontend behavior

The roadmap page at `/roadmap` requires authentication — guests are redirected to the login page.

Items are grouped by status (In Progress → Planned → Completed) and sorted by vote score within each group. Clicking a sort button (Top / New / Old) re-fetches items without a full page reload.

- **Voting** — clicking upvote or downvote updates the score and button color instantly (optimistic UI). Clicking the same vote again removes it. Items re-rank in real time when the score changes.
- **Suggestions** — the "Suggest a feature" button opens a dialog. New suggestions are submitted with status `Pending Approval` and do not appear publicly until an admin approves them.

![Suggest a feature dialog](</screenshot/roadmap/roadmap-suggest.png>)

## Testing

```bash
php artisan test --testsuite=Modules --filter=Roadmap
npx playwright test --project="@Roadmap*"
```
