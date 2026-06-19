# a11y-ally

A Chrome/Edge extension for accessibility testing: a screen-reader **simulator**
with playback controls (play/pause, next/prev, speed), a live transcript, an
on-page element highlight, and an **axe-core** audit shown in the side panel.

## Develop

```bash
pnpm install
pnpm dev      # launches Chrome with the extension + HMR
pnpm test     # run unit + integration tests
pnpm build    # emit .output/chrome-mv3
```

## Architecture

Pure domain logic lives in `src/core/` (no React/extension deps):
`a11y-tree` → `announcer` → `player` (driven by a `speech` engine), plus `audit`.
The content script builds the reading list and mounts a Shadow-DOM React overlay;
the side panel renders the audit report. See
`docs/superpowers/specs/2026-06-17-a11y-ally-design.md`.

## Scope

v1 covers the simulator core + axe-core audit. Deferred: element picker, report
export, keyboard-nav checker, SR-specific announcement profiles, real-browser
Playwright E2E.
