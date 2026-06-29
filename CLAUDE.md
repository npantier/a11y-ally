# CLAUDE.md

Guidance for working in this repo. Keep it current as the architecture evolves.

## What this is

**a11y-ally** is a Chrome/Edge MV3 browser extension built with [WXT](https://wxt.dev).
It's a screen-reader **simulator** (play/pause, next/prev, speed, live transcript,
on-page element highlight) plus an **axe-core** accessibility audit rendered in the
side panel.

## Commands

```bash
pnpm dev          # launch Chrome with the extension + HMR
pnpm build        # emit .output/chrome-mv3
pnpm compile      # tsc --noEmit typecheck (no build artifacts)
pnpm lint         # eslint . (named-export rule; build output ignored)
pnpm format       # prettier --write .
pnpm format:check # prettier --check . (CI/verify-friendly)
pnpm test         # vitest run (unit + integration)
pnpm test:watch   # vitest in watch mode
```

Run a single test file: `pnpm test src/core/player/player.test.ts`.

> **Gotcha:** `pnpm test` binds a port via the WXT Vitest plugin and fails under a
> restricted sandbox. Run it with the sandbox disabled.

## Architecture

The codebase separates **pure domain logic** from the **extension shell**.

### `src/core/` — pure logic, no React or extension APIs

Everything here runs in jsdom and is dependency-injected, so it's unit-testable in
isolation. The simulator pipeline:

```
a11y-tree  →  announcer  →  player  ←  speech engine
(reading list)  (node → string)  (playback state)   (Web Speech API)
```

- `a11y-tree/` — `buildReadingList(root)` walks the DOM, skips hidden subtrees,
  resolves ARIA roles (`resolveRole`), and returns `{ nodes, elements }` where
  `nodes` are serializable `AnnounceableNode`s and `elements` maps node id → DOM
  `Element`.
- `announcer/` — `announce(node)` turns an `AnnounceableNode` into the spoken string
  (role labels live in `role-labels.ts`).
- `player/` — `createPlayer({ nodes, engine, announce })` holds playback state
  (`idle | playing | paused`, index, rate) and exposes a subscribe/getState store.
- `speech/` — `SpeechEngine` interface; `web-speech-engine.ts` wraps the browser
  Web Speech API behind it (swap-in mock for tests).
- `audit/` — `runAudit(document)` runs axe-core and maps results into `ReportModel`.

### `entrypoints/` — WXT entrypoints (extension shell)

- `background.ts` — toolbar click opens the side panel (must happen in the
  user-gesture turn) and sends `toggleOverlay` to the active tab.
- `content.tsx` — builds the reading list, wires up player + speech + highlight,
  and mounts the React overlay inside a **Shadow DOM** root (`createShadowRootUi`,
  `cssInjectionMode: 'ui'`) so page styles don't leak in.
- `sidepanel/` — runs the audit and renders the report; clicking a finding messages
  the content script to highlight that element on the page.

### `src/messaging/` — typed cross-context messaging

`@webext-core/messaging` with a single `ProtocolMap` (`toggleOverlay`, `runAudit`,
`highlightSelector`). Add new cross-context calls here, not ad hoc.

### `src/ui/` — React components

`overlay/` (Shadow-DOM overlay: `Controls`, `Transcript`, `usePlayer`),
`sidepanel/` (`Report`), `highlight/` (`highlight-box` DOM outline, not React),
`components/` (shared `IconButton`, `Slider`).

## Conventions

- **TypeScript strict** + `noUncheckedIndexedAccess` + `noImplicitOverride`. Avoid
  `any` — narrow with a small typed cast and a comment explaining _why_ (see
  `SidePanelCapable` in `background.ts`), rather than reaching for `any`.
- **Named exports** everywhere; `export default` only where the framework requires
  it (WXT `entrypoints/`, `*.config.*`). Enforced by eslint (`no-restricted-syntax`
  bans `ExportDefaultDeclaration`).
- **Function declarations** (`export function`) are the house style — intentionally
  _not_ constrained to arrow consts, so there's no `func-style` lint rule.
- **Prefer early returns** over deep nesting; descriptive names over terse ones.
- **Formatting is Prettier** (`pnpm format` / `format:check`); **linting is ESLint**
  flat config (`pnpm lint`). No git hooks run these yet — see Deferred decisions.
- **Tests are colocated** as `*.test.ts(x)` next to source. Cross-module tests live
  in `src/core/__integration__/`; the scaffold smoke test is in `src/core/__smoke__/`.
- **Comments explain the why**, especially the non-obvious workarounds (the Vite 5/6
  duplicate-type bridge in `vitest.config.ts`, the TextEncoder realm fix in
  `src/test/setup.ts`, the user-gesture requirement for opening the side panel).
- Keep `src/core/` free of React and `browser`/extension globals so it stays
  testable; the entrypoints are the only place those are wired together.

## Build/tooling notes

- **Vite version mismatch:** wxt@0.19 resolves Vite 6 while vitest@2 bundles Vite 5.
  `@vitejs/plugin-react` is pinned via a pnpm override (`pnpm-workspace.yaml`) so the
  build and tests share one compatible plugin; `vitest.config.ts` bridges the
  duplicated plugin types.
- Manifest permissions are minimal (`activeTab`); WXT auto-adds `sidepanel` and dev-only
  `scripting`/`tabs`.
- This repo ships Claude Code hooks in `.claude/settings.json` (type-check on stop;
  edit-guard on `pnpm-lock.yaml`/`.output/`). They need `jq` on PATH (`brew install jq`) —
  without it the edit-guard silently no-ops.

## Decision records

When a major or architectural decision is made, capture it as an ADR in `docs/adr/`
using the `template.md` there (sequential `NNNN-title.md`). Mundane config choices
(lint rules, formatter settings, script names) live in this file, not in an ADR.

## Deferred decisions

Punted during convention setup — revisit when the friction shows up:

- [ ] **Git hooks (lefthook):** skipped. ESLint/Prettier run via editor + manual
      `pnpm lint` / `format:check` only; the `.claude/settings.json` hooks still cover
      typecheck-on-stop. Adopt lefthook (lean pre-commit) if unformatted/unlinted code
      starts landing.
- [ ] **Storybook:** skipped. The UI is a Shadow-DOM extension overlay, awkward to
      host in Storybook, and components are covered by Testing Library. Revisit if the
      component surface grows enough to want isolated visual development.

## Scope

v1 = simulator core + axe-core audit. Deferred: element picker, report export,
keyboard-nav checker, SR-specific announcement profiles, real-browser Playwright E2E.
