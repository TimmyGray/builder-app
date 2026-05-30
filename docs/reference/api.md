# API Reference

> **Summary:** Every HTTP endpoint — path, auth, request body, and status codes. Source of truth is the controllers; this is the lookup table.
> **Read this when:** You're calling the API or adding/changing an endpoint.
> **Audience:** both
> **Related:** [Modules](../architecture/modules.md) · [Glossary](glossary.md) · [Header auth (ADR-0003)](../architecture/decisions/0003-header-based-authentication.md)

[← Back to docs index](../INDEX.md)

---

## Conventions

- **Base URL:** `http://localhost:3000`. Interactive docs (Swagger) at `/api`.
- **Auth:** endpoints marked 🔒 require a `username` HTTP header for an existing user (validated by `AuthGuard`). Missing/unknown → `403`. See [ADR-0003](../architecture/decisions/0003-header-based-authentication.md).
- **Validation:** bodies are validated and **whitelisted** (unknown fields stripped). Invalid input → `400`.
- **Errors:** every error response is `{ statusCode, message, timestamp, path }` (from `DomainExceptionFilter`).
- **Quirk:** `@Post` handlers return **`201`** by default — including `POST /auth/signin` and `POST /auth/signout`.

## Auth — `src/auth/auth.controller.ts`

| Method | Path | Auth | Body | Success | Errors |
|--------|------|:----:|------|---------|--------|
| `POST` | `/auth/signup` | — | `CreateUserDto` `{ username, password, jobRole }` | `201` `UserResponseDto` | `409` exists · `400` invalid |
| `POST` | `/auth/signin` | — | `SignInDto` `{ username, password }` | `201` `UserResponseDto` | `401` bad credentials · `400` invalid |
| `POST` | `/auth/signout` | 🔒 | `string` token (placeholder) | `201` (no-op) | `403` no/unknown header |
| `DELETE` | `/auth/delete` | 🔒 | `DeleteUserDto` `{ username, password }` | `200` message string | `401` wrong password · `404` not found · `403` header |

> `signout` does nothing yet (no token store). `delete` verifies the **body** username + password with bcrypt, independent of the header that passes the guard.

## Users — `src/users/users.controller.ts` (entire controller 🔒)

| Method | Path | Body | Success | Errors |
|--------|------|------|---------|--------|
| `GET` | `/users` | — | `200` `UserResponseDto[]` | `403` |
| `GET` | `/users/:username` | — | `200` `UserResponseDto` | `404` not found · `403` |
| `PATCH` | `/users` | `UpdateUserDto` `{ id, username }` | `200` `UserResponseDto` | `404` not found · `403` · `400` |

## Job Types — `src/job-type/job-type.controller.ts` (entire controller 🔒)

| Method | Path | Body | Success | Errors |
|--------|------|------|---------|--------|
| `GET` | `/job-types` | — | `200` `JobTypeResponseDto[]` | `403` |
| `GET` | `/job-types/:id` | — | `200` `JobTypeResponseDto` | `404` · `403` |
| `POST` | `/job-types` | `CreateJobTypeDto` `{ name, description?, measure? }` | `201` `JobTypeResponseDto` | `409` exists · `403` · `400` |
| `PATCH` | `/job-types` | `UpdateJobTypeDto` `{ id, name, description?, measure? }` | `200` `JobTypeResponseDto` | `404` · `409` duplicate name · `403` · `400` |
| `DELETE` | `/job-types` | `DeleteJobTypeDto` `{ id }` | `204` | `404` · `403` |

## Tasks — `src/tasks/tasks.controller.ts` (entire controller 🔒)

| Method | Path | Body | Success | Errors |
|--------|------|------|---------|--------|
| `GET` | `/tasks` | — | `200` `TaskResponseDto[]` | `403` |
| `GET` | `/tasks/:id` | — | `200` `TaskResponseDto` | `404` · `403` |
| `POST` | `/tasks` | `CreateTaskDto` `{ userId, jobTypeId, quantity?, scopeOfWork? }` | `201` `TaskResponseDto` | `404` user/job type not found · `403` · `400` invalid / scope mismatch |
| `PATCH` | `/tasks` | `UpdateTaskDto` `{ id, status?, dateOfCompletion?, userId?, quantity?, scopeOfWork? }` | `200` `TaskResponseDto` | `404` task/target user · `403` · `400` invalid / scope mismatch |
| `DELETE` | `/tasks` | `DeleteTaskDto` `{ id }` | `204` | `404` · `403` |

> **REST quirk:** `DELETE` on tasks and job types takes the id in the **request body**, not the URL.
> **Update behaviour:** providing `dateOfCompletion` forces `status` to `Completed`.
> **Scope-of-work:** `quantity` (a positive number) is for **measured** job types; `scopeOfWork` (free text) is for **unmeasured** ones. Sending the wrong one for the job type's `measure`, or both at once, returns `400`. Both are optional. See [Data model](../architecture/data-model.md#scope-of-work-rule).

## Response shapes

Defined in the `*.dto.ts` files (the source of truth):

- **`UserResponseDto`** — `{ id, username, jobRole, createdAt, updatedAt }` (never includes `password`).
- **`JobTypeResponseDto`** — `{ id, name, description: string | null, measure: Measure | null }`.
- **`TaskResponseDto`** — `{ id, user: { id, username, jobRole }, jobType: string, measure: Measure | null, quantity: number | null, scopeOfWork: string | null, status, dateOfCompletion, createdAt, updatedAt }` (`measure` is the job type's unit, included for display).

Enums: `jobRole` ∈ {`Builder`, `Supervisor`}; `status` ∈ {`ToBeDone`, `InProgress`, `Completed`, `Cancelled`}; `measure` ∈ {`m`, `liters`, `m^2`, `m^3`, `kg`}. See [Glossary](glossary.md).

---

*Back to the [index](../INDEX.md).*
