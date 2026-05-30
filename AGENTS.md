# Agent Guide

> **Summary:** Conventions, guardrails, and a context map so an agent loads only the docs it needs.
> **Read this first**, then jump to the specific docs the Context Map points to.

[📑 Full docs index](docs/INDEX.md)

---

## Context Map — what to read for the task at hand

Load the **"Read first"** file only. Open "Then maybe" sources if that's not enough.

| If you are working on…                       | Read first                                          | Then maybe                                  |
|----------------------------------------------|-----------------------------------------------------|---------------------------------------------|
| Understanding the system                     | `docs/architecture/overview.md`                     | `docs/architecture/modules.md`              |
| A feature module (auth/users/tasks/job-type) | `docs/architecture/modules.md`                      | `src/<module>/`                             |
| Adding or changing an endpoint               | `docs/reference/api.md`                              | `docs/architecture/modules.md`              |
| Entities / relationships / persistence       | `docs/architecture/data-model.md`                   | `src/<module>/<module>.entity.ts`           |
| Authentication / the `username` guard        | `docs/architecture/decisions/0003-header-based-authentication.md` | `src/auth/auth.guard.ts`      |
| Error handling / HTTP status codes           | `docs/architecture/decisions/0004-domain-exceptions-via-global-filter.md` | `src/infrastructure/filters/domain-exception.filter.ts` |
| Dependency injection / providers             | `docs/architecture/decisions/0002-dependency-injection-with-interface-tokens.md` | `src/*/*.module.ts` |
| Config / environment variables               | `docs/reference/configuration.md`                   | `src/configuration/*.yaml`                  |
| Local setup                                  | `docs/guides/getting-started.md`                    | —                                           |
| Day-to-day dev / commands                    | `docs/guides/development.md`                         | —                                           |
| Writing/running tests                        | `docs/guides/testing.md`                             | `test/`                                     |
| Deploying / production behaviour             | `docs/guides/deployment.md`                          | `docs/reference/configuration.md`           |

Each "Read first" is **one** file. Don't load the whole `docs/` tree.

---

## Project snapshot

- **What it is:** A NestJS REST API for a construction task log (users, job types, tasks).
- **Stack:** TypeScript / NestJS 11 / TypeORM / MySQL 8 / `node-config` / Swagger.
- **Entry point:** `src/main.ts` → `src/app.module.ts`.
- **How it runs:** `npm run start:dev` boots Nest, connects to MySQL, serves the API on `:3000` and Swagger on `/api`.

## Conventions (follow these)

- **One feature = one folder** under `src/`, with a consistent file set: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.entity.ts`, `*.dto.ts`, `*.interface.ts`, `*.errors.ts`, `index.ts` (barrel).
- **Services depend on abstractions.** Each service implements an `abstract class` token (`IAuthService`, `IUsersService`, …) and is bound with `{ provide: IToken, useClass: Impl }`. Inject the token, not the concrete class. See [ADR-0002](docs/architecture/decisions/0002-dependency-injection-with-interface-tokens.md).
- **Repositories are hand-built** via `useFactory` from the shared `MainDb` DataSource (`new XRepository(mainDb.getRepository(Entity))`) and exported from their module.
- **Domain errors are plain `Error` subclasses** in `*.errors.ts` (e.g. `TaskNotFoundException`). Never throw raw `HttpException` from services — the naming convention drives the HTTP status via the global filter. See [ADR-0004](docs/architecture/decisions/0004-domain-exceptions-via-global-filter.md).
- **Validation/serialisation** is centralised: a global `ValidationPipe({ transform: true, whitelist: true })` strips unknown fields. Annotate DTOs with `class-validator` decorators and `@nestjs/swagger` `@ApiProperty`.
- **Entity imports avoid barrels.** Import sibling entities directly (`../tasks/tasks.entity`), not via `../tasks`, to dodge a circular dependency that breaks under Jest. See [Modules](docs/architecture/modules.md#a-note-on-circular-imports).
- **Tests:** unit tests are `*.spec.ts` beside the code; e2e tests are `test/*.e2e-spec.ts` and run against a live MySQL.

## Guardrails (do / don't)

- ✅ Add new domain failures as named `Error` subclasses ending in `…NotFoundException` / `…AlreadyExistsException` / `…Creation|Update|DeletionException` so the filter maps them to 404/409/500.
- ✅ Run `npm run lint` and `npm test` before declaring work done; run `npm run test:e2e` if you touched controllers, entities, or the DB.
- ✅ Keep config keys in sync across `src/configuration/default.yaml`, `local.yaml`, and `custom-environment-variables.yaml`.
- ❌ Don't introduce a circular import by importing a sibling entity through its barrel `index.ts`.
- ❌ Don't rely on `synchronize` for production schema changes — it's disabled when `NODE_ENV=production` and there are **no migrations**. See [Deployment](docs/guides/deployment.md).
- ❌ Don't add new dependencies without flagging it.

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install deps |
| `npm run start:dev` | Run locally (watch) |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests (needs MySQL) |
| `npm run lint` | Lint + autofix |
| `npm run build` | Compile to `dist/` |

## Where things live

| Concern | Location |
|---------|----------|
| HTTP routes | `src/<module>/<module>.controller.ts` |
| Business logic | `src/<module>/<module>.service.ts` |
| Data access | `src/<module>/<module>.repository.ts` |
| Entities (schema) | `src/<module>/<module>.entity.ts` |
| Request/response shapes | `src/<module>/<module>.dto.ts` |
| Domain errors | `src/<module>/<module>.errors.ts` |
| Config, DB, error filter | `src/infrastructure/` |
| Config values | `src/configuration/*.yaml` |
| Bootstrap | `src/main.ts` |
| Tests | `*.spec.ts` (unit), `test/*.e2e-spec.ts` (e2e) |

---

*Keep this file small and current. Detailed/long material belongs in `docs/` and is reached through the Context Map above.*
