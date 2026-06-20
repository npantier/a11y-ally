---
name: add-aria-role
description: Use when adding screen-reader support for a new ARIA role or native element to a11y-ally — a role that isn't announced yet, a new element-to-role mapping, or a missing spoken label. Specific to this repo's src/core a11y-tree → announcer pipeline.
---

# Add ARIA Role Support

## Overview

A role flows through one pipeline in `src/core/`:

`resolveRole` (element → role string) → `buildReadingList` (decides inclusion) → `ROLE_LABELS` (spoken label) → `announce` (final phrasing).

Adding a role means touching the relevant stops on that path **and** their colocated tests. Skip a stop and you get a silent gap: the node is mapped but never spoken, spoken without its role, or dropped from the reading list entirely.

## Touchpoints

Work them in order. Not every role needs all of them — the "When" column says.

| # | File | Change | When |
|---|------|--------|------|
| 1 | `src/core/a11y-tree/resolve-role.ts` | Map the source to the role string | Native element (`TAG_ROLES` map) or an `<input type>` branch. **Explicit `role="x"` attributes already pass through — skip this step.** |
| 2 | `src/core/a11y-tree/build-reading-list.ts` | Add the role to `INTERACTIVE_ROLES` | Only if it's an interactive control that must be announced even with no accessible name. Named nodes, `heading`, and `image` are already included. |
| 3 | `src/core/announcer/role-labels.ts` | Add `role: 'spoken label'` to `ROLE_LABELS` | Almost always. (Skip only `heading` — `announce` special-cases its level.) |
| 4 | `src/core/announcer/announce.ts` | Add custom phrasing | Only if the role needs more than `name, label, state, value, setInfo` (e.g. heading's `level`). Most roles need nothing here. |
| 5 | Colocated `*.test.ts` | Assert each change | `resolve-role.test.ts` (mapping), `build-reading-list.test.ts` (inclusion), `announce.test.ts` (spoken string). |

## Worked example: the `tab` role

`role="tab"` is an explicit attribute, so step 1 is skipped — it passes straight through `resolveRole`.

```ts
// 2. build-reading-list.ts — a tab is interactive; announce it even when nameless
const INTERACTIVE_ROLES = new Set([
  'button', 'link', 'textbox', 'checkbox', 'radio', 'combobox', 'slider',
  'tab',
]);

// 3. role-labels.ts
export const ROLE_LABELS: Record<string, string> = {
  // ...existing...
  tab: 'tab',
};
```

```ts
// 5a. announce.test.ts
it('reads a tab', () => {
  expect(announce({ ...base, role: 'tab', name: 'Overview' })).toBe('Overview, tab');
});

// 5b. build-reading-list.test.ts — a nameless tab is still emitted
it('keeps a nameless interactive tab', () => {
  const root = mount(`<div role="tab"></div>`);
  expect(buildReadingList(root).nodes.map((n) => n.role)).toEqual(['tab']);
});
```

For a **native element** (e.g. `<article>` → `article`), step 1 is instead `TAG_ROLES.ARTICLE = 'article'` in `resolve-role.ts` (with a `resolve-role.test.ts` case); steps 3 and 5 still apply. A landmark like `article` isn't interactive, so skip step 2 — it's emitted only when it has an accessible name.

## Verify

```bash
pnpm compile
pnpm test src/core/a11y-tree src/core/announcer
```

`pnpm test` binds a port via the WXT plugin and fails under a restricted sandbox — run it with the sandbox disabled.

## Common mistakes

- Mapped the role in `resolveRole` but forgot `ROLE_LABELS` → the node is read with its name only, no role.
- Interactive role missing from `INTERACTIVE_ROLES` → a control with no accessible name silently drops out of the reading list.
- Added an explicit-role case to `TAG_ROLES` → unnecessary; explicit `role` attributes already pass through `resolveRole`.
