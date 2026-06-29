# 0001. Record architecture decisions

- **Status:** accepted
- **Date:** 2026-06-29
- **Deciders:** Nick Pantier

## Context

As a11y-ally grows beyond v1 (simulator core + axe-core audit), architectural
choices accumulate — new ARIA-role handling strategies, the core/shell boundary,
messaging-protocol shape, build/tooling workarounds. Rationale that lives only in
commit messages or a person's head gets lost, and future changes re-litigate
settled decisions without knowing why they were made.

## Decision

We keep lightweight Architecture Decision Records in `docs/adr/`, one Markdown file
per significant decision, numbered sequentially (`NNNN-title.md`) using the
MADR-lite `template.md` in this directory. Each record states context, the decision,
its consequences, and the alternatives considered.

Mundane config choices (formatter settings, lint rules, script names) stay in
CLAUDE.md, not in an ADR. ADRs are reserved for decisions that shape the
architecture or are expensive to reverse.

## Consequences

- New contributors and future sessions can read _why_ the code is shaped as it is.
- A small per-decision authoring cost; the discipline only pays off if records are
  written when decisions are actually made.
- Superseded decisions stay in the log marked `superseded by <link>` rather than
  being deleted, preserving the history.

## Alternatives considered

- **No formal practice** — rationale stays in commits/PRs. Rejected: not
  discoverable, and PR discussion is hard to reconstruct later.
- **A single growing DECISIONS.md** — rejected: merge-conflict prone and harder to
  link to or supersede individual entries.
