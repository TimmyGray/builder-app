# Glossary

> **Summary:** Domain and project terms used across the codebase and docs.
> **Read this when:** A term or enum value is unclear.
> **Audience:** both
> **Related:** [Data model](../architecture/data-model.md) · [API Reference](api.md)

[← Back to docs index](../INDEX.md)

---

## Domain terms

| Term | Meaning |
|------|---------|
| **User** | A person who can be assigned tasks. Has a `username`, a hashed `password`, and a `jobRole`. |
| **Job type** | A category of work a task can be (e.g. "Bricklaying"). Unique by `name`. |
| **Task** | A unit of work: one job type assigned to one user, tracked through a status lifecycle. |
| **Construction Log** | The product framing for the API (the Swagger tag) — a log of construction tasks. |

## `UserJobRole`

The role a user holds. Defined in `src/users/users.dto.ts`.

| Value | Meaning |
|-------|---------|
| `Builder` | Default role; performs tasks. |
| `Supervisor` | Oversight role. |

## <a id="task-status"></a>`TaskStatus`

A task's lifecycle state. Defined in `src/tasks/tasks.dto.ts`. (Note the enum **values** differ from the keys.)

| Value | Enum key | Meaning |
|-------|----------|---------|
| `ToBeDone` | `TBD` | Default on creation; not started. |
| `InProgress` | `InProgress` | Being worked on. |
| `Completed` | `Completed` | Done. Set automatically when `dateOfCompletion` is provided. |
| `Cancelled` | `Cancelled` | Abandoned. |

## Technical terms

| Term | Meaning |
|------|---------|
| **`MainDb`** | The single shared TypeORM `DataSource`, provided globally; every repository is built from it. |
| **Interface token** | An `abstract class` (e.g. `IAuthService`) used as a runtime DI token because TS interfaces don't exist at runtime. See [ADR-0002](../architecture/decisions/0002-dependency-injection-with-interface-tokens.md). |
| **Repository** | A plain class wrapping `Repository<Entity>` that owns TypeORM access for one entity. |
| **Domain exception** | A plain `Error` subclass (in `*.errors.ts`) mapped to an HTTP status by the global filter. See [ADR-0004](../architecture/decisions/0004-domain-exceptions-via-global-filter.md). |
| **`AuthGuard`** | The guard that requires a valid `username` header on protected routes. See [ADR-0003](../architecture/decisions/0003-header-based-authentication.md). |
| **`DomainExceptionFilter`** | Global Nest filter translating domain errors into the `{ statusCode, message, timestamp, path }` envelope. |
| **node-config** | The `config` package; loads YAML from `NODE_CONFIG_DIR`. See [Configuration](configuration.md). |
| **synchronize** | TypeORM's auto-schema feature; on outside production, off in production. See [Data model](../architecture/data-model.md#schema-management). |

---

*Back to the [index](../INDEX.md).*
