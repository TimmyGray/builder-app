# ADR-0003: Header-based authentication (no JWT yet)

> **Summary:** Protected routes are gated by an `AuthGuard` that requires a valid `username` request header; JWT is installed but not wired.
> **Status:** Accepted
> **Date:** 2026-05-30

[← Back to docs index](../../INDEX.md) · [Architecture overview](../overview.md)

---

## Context

The API needs to distinguish authenticated callers from anonymous ones for the `users`, `tasks`, and `job-type` endpoints. `@nestjs/jwt` is a dependency, implying tokens were intended, but no token issuing or verification is currently implemented. The codebase needs a working gate in the meantime.

## Decision

Authentication is enforced by `AuthGuard` (`src/auth/auth.guard.ts`), applied with `@UseGuards(AuthGuard)` on protected controllers. The guard:

1. Reads the `username` HTTP header.
2. Rejects the request with `403 Forbidden` if the header is missing.
3. Looks the user up via `UsersRepository`; rejects with `403` if no such user exists.

Credentials are verified with **bcrypt** only at `POST /auth/signin` and `DELETE /auth/delete`, against the hashed `password`. Password hashing uses bcrypt with a **per-password random salt** at the configured cost factor (`auth.rounds`); the salt is embedded in the stored hash, so verification needs nothing else.

`signIn` returns the user profile (`UserResponseDto`) but **no token**; `signOut` is a no-op placeholder.

## Consequences

**Positive**
- Simple, dependency-light gate that works today; protected endpoints reject anonymous and unknown-user requests.
- All authorisation logic is in one guard, easy to replace later.

**Negative / trade-offs**
- **The header is not a credential.** Possession of any existing username — with no password or token — passes the guard. This is weak and not suitable for untrusted clients; treat it as a placeholder.
- `@nestjs/jwt` sits unused.

**Follow-ups**
- Replace the header check with token verification (issue a JWT on sign-in, verify it in the guard), or another real credential.
- Tune `auth.rounds` for production hardware (higher = slower = more brute-force resistant).

## Alternatives considered

| Option | Why not chosen |
|--------|----------------|
| Full JWT now | More work than the current milestone required; deferred |
| Session cookies | No session store in place |

---

*Related: the guard is reused across modules — see [Modules](../modules.md). Endpoint-by-endpoint auth is in the [API reference](../reference/api.md).*
