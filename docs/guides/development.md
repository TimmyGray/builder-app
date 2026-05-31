# Development

> **Summary:** Everyday commands, the project's conventions in practice, and a worked recipe for adding a feature.
> **Read this when:** You're actively developing in the codebase.
> **Audience:** both
> **Related:** [Getting Started](getting-started.md) · [Testing](testing.md) · [Modules](../architecture/modules.md)

[← Back to docs index](../INDEX.md)

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm run start` | Run once |
| `npm run start:dev` | Run with file watching |
| `npm run start:debug` | Run with watch + inspector |
| `npm run start:prod` | Run the compiled build (`node dist/main`) |
| `npm run build` | Compile to `dist/` (`nest build`) |
| `npm run lint` | ESLint over `src`/`test` with `--fix` |
| `npm run format` | Prettier over `src`/`test` |
| `npm test` | Unit tests (`*.spec.ts`) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:cov` | Unit tests with coverage |
| `npm run test:e2e` | End-to-end tests (needs MySQL) |

> The e2e suite sets its own env automatically. For local dev, make sure `config/local.yaml` exists with DB credentials and `auth.rounds` — see [Getting Started](getting-started.md).

## Conventions in practice

- **Feature-folder layout.** Everything for a domain lives under `src/<feature>/` with the standard file set (module, controller, service, interface, repository, entity, dto, errors, `index.ts`). Mirror an existing module — `job-type` is the cleanest full example.
- **Depend on tokens, not classes.** Inject `I<Name>Service`; bind it with `useClass`. Build repositories with a `useFactory` from `MainDb`. See [ADR-0002](../architecture/decisions/0002-dependency-injection-with-interface-tokens.md).
- **Throw domain errors, not `HttpException`.** Add named `Error` subclasses in `*.errors.ts`; the global filter maps them by name. See [ADR-0004](../architecture/decisions/0004-domain-exceptions-via-global-filter.md).
- **Validate at the edge.** DTOs carry `class-validator` decorators; the global `ValidationPipe({ transform: true, whitelist: true })` enforces them and strips unknown fields. Add `@ApiProperty` for Swagger.
- **Guard protected routes.** Apply `@UseGuards(AuthGuard)` and document the required `username` header with `@ApiHeader`.
- **Import sibling entities directly**, never through a barrel — see [the circular-import note](../architecture/modules.md#a-note-on-circular-imports).

## Recipe: add a feature module

1. Create `src/<feature>/` and copy the file set from `job-type/`.
2. Define the **entity** (`*.entity.ts`) — remember `type: 'enum'` on any enum column. Add the repository factory provider in the module.
3. Define **DTOs** (`*.dto.ts`) with validation + `@ApiProperty`.
4. Define the **service token** (`abstract class I<Name>Service` in `*.interface.ts`) and the implementation; bind with `{ provide: I<Name>Service, useClass: <Name>Service }`.
5. Add **errors** (`*.errors.ts`) named to match the [filter's conventions](../architecture/decisions/0004-domain-exceptions-via-global-filter.md).
6. Write the **controller** with Swagger decorators and `@UseGuards(AuthGuard)` where needed.
7. Export the public surface (repository, DTOs, errors) from `index.ts`.
8. Register the module in `src/app.module.ts`.
9. Add unit specs and, for HTTP-visible behaviour, an e2e spec. See [Testing](testing.md).

## Recipe: add an endpoint to an existing module

1. Add the route method to the controller with Swagger + (if protected) the guard.
2. Add the method to the service token (`*.interface.ts`) and implement it.
3. Add any repository method needed.
4. Add/adjust DTOs.
5. Cover it with a spec and/or e2e test, then `npm run lint`.

## Before you commit

```bash
npm run lint
npm test
npm run test:e2e   # if you touched controllers, entities, or the DB
```

---

*Next: [Testing](testing.md) · [API Reference](../reference/api.md) · back to the [index](../INDEX.md).*
