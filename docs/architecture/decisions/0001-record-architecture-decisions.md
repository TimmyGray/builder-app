# ADR-0001: Record architecture decisions

> **Summary:** We will keep short Architecture Decision Records for significant choices.
> **Status:** Accepted
> **Date:** 2026-05-30

[← Back to docs index](../../INDEX.md) · [Architecture overview](../overview.md)

---

## Context

Builder App has several non-obvious conventions (interface-token DI, header-based auth, naming-driven error translation) that are easy to violate by accident and tedious to re-derive from the code. New contributors and AI agents need the *why*, not just the *what*.

## Decision

We will record notable architectural decisions as numbered Markdown files in `docs/architecture/decisions/`, one decision per file, using the template at `docs/architecture/decisions/` (see this file's siblings). Each ADR states the context, the decision, and its consequences.

## Consequences

**Positive**
- The rationale behind conventions is captured next to the code, in version control.
- The Context Map in `AGENTS.md` can point directly at the decision that governs a task.

**Negative / trade-offs**
- ADRs must be kept honest; a stale ADR is worse than none. Update or supersede rather than silently diverge.

**Follow-ups**
- Add an ADR when a convention is introduced or materially changed.

## Alternatives considered

| Option | Why not chosen |
|--------|----------------|
| Document everything in one long doc | Hard to navigate; defeats selective context loading |
| Rely on code comments only | Comments explain lines, not system-level trade-offs |

---

*The first ADR in a repo is conventionally "Record architecture decisions" — establishing that ADRs are used at all.*
