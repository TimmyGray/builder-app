# ADR-0004: Domain exceptions translated by a global filter

> **Summary:** Services throw plain `Error` subclasses; a global `DomainExceptionFilter` maps them to HTTP status codes by class-name convention.
> **Status:** Accepted
> **Date:** 2026-05-30

[← Back to docs index](../../INDEX.md) · [Architecture overview](../overview.md)

---

## Context

Business logic in services needs to signal failures (not found, conflict, unauthorized, internal). Throwing Nest `HttpException` from services couples the domain layer to HTTP. We want services to stay HTTP-agnostic while still producing correct, consistent HTTP responses.

## Decision

Each domain defines named `Error` subclasses in `*.errors.ts` (e.g. `TaskNotFoundException`, `JobTypeAlreadyExistsException`, `UserCreationException`). Services throw these. A single global filter, `DomainExceptionFilter` (`src/infrastructure/filters/domain-exception.filter.ts`, registered in `src/main.ts`), inspects the thrown error's `name` and maps it:

| Class-name pattern | HTTP status |
|--------------------|-------------|
| `…NotFoundException` | `404 Not Found` |
| `…AlreadyExistsException` | `409 Conflict` |
| `InvalidCredentialsException`, `UnauthorizedUserException` | `401 Unauthorized` |
| `…Creation` / `…Update` / `…DeletionException`, or names starting `Internal…` | `500 Internal Server Error` |
| Native Nest `HttpException` (e.g. `ValidationPipe` → `400`, `AuthGuard` → `403`) | passes through unchanged |
| Anything else | `500` with a generic message (internals not leaked) |

Every response is shaped as `{ statusCode, message, timestamp, path }`. `5xx` responses are logged with a stack trace.

## Consequences

**Positive**
- Services never import `@nestjs/common` HTTP exceptions; the domain stays transport-agnostic.
- Consistent error envelope across the whole API.
- Unexpected errors degrade safely to a generic 500.

**Negative / trade-offs**
- The mapping is **convention over configuration**: a new error class only gets the right status if its name matches a pattern. Misnamed errors silently become `500`.
- The rules live in the filter, away from the error definitions — keep them in sync.

**Follow-ups**
- When adding a domain error, name it to match an existing pattern (or extend the filter's `resolve` method deliberately).

## Alternatives considered

| Option | Why not chosen |
|--------|----------------|
| Throw `HttpException` in services | Couples domain logic to HTTP transport |
| A base `DomainException` carrying an explicit status | More boilerplate per error; current naming convention is terse and works |

---

*Related: error classes live in each module's `*.errors.ts` (see [Modules](../modules.md)). Status codes per endpoint are in the [API reference](../reference/api.md).*
