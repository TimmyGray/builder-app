# ADR-0002: Dependency injection via abstract-class interface tokens and repository factories

> **Summary:** Services are injected behind `abstract class` tokens; repositories are hand-built from a shared `DataSource` via `useFactory`.
> **Status:** Accepted
> **Date:** 2026-05-30

[← Back to docs index](../../INDEX.md) · [Architecture overview](../overview.md)

---

## Context

NestJS resolves providers by token. TypeScript interfaces vanish at runtime, so they can't be injection tokens. We want services to depend on **abstractions** (for testability and clear contracts) without pulling in a separate string-token or `@Inject()` ceremony everywhere. We also use TypeORM but deliberately avoid `@nestjs/typeorm`'s `@InjectRepository`, keeping data access in explicit repository classes.

## Decision

**Services** are defined as `abstract class I<Name>Service` (e.g. `IAuthService`, `ITasksService`) in `*.interface.ts`. The concrete class implements it, and the module binds them:

```ts
providers: [{ provide: ITasksService, useClass: TasksService }]
```

Controllers and collaborators inject the **abstract class** as both the type and the token.

**Repositories** are plain classes wrapping a TypeORM `Repository<Entity>`. Each module builds one with a factory from the shared `MainDb` `DataSource` and exports it:

```ts
{
  provide: TasksRepository,
  useFactory: (mainDb: MainDb) => new TasksRepository(mainDb.getRepository(Task)),
  inject: [MainDb],
}
```

`MainDb` itself is a `@Global()` provider in `DatabaseModule`, created from the `mysql` config slice.

The same `forFeature` idea applies to **config**: `ConfigModule.forFeature(AuthConfig, 'auth')` binds a typed `abstract class` to a node-config key.

## Consequences

**Positive**
- Tests can swap a service or repository by providing the same token with a mock.
- Data-access logic is centralised in explicit repository classes, independent of Nest's TypeORM integration.
- One initialised `DataSource` is shared across all repositories.

**Negative / trade-offs**
- More wiring per module than `@InjectRepository`.
- Abstract-class tokens are a Nest idiom that can surprise newcomers; the `abstract class` is doing the job a TypeScript `interface` can't at runtime.

**Follow-ups**
- New services: add an `I<Name>Service` token and bind with `useClass`.
- New entities: add a repository class and a `useFactory` provider, and export it if other modules need it.

## Alternatives considered

| Option | Why not chosen |
|--------|----------------|
| `@nestjs/typeorm` + `@InjectRepository` | Couples modules to Nest's TypeORM module; less control over the repository API |
| String/symbol injection tokens | Loses the type ↔ token unification the abstract class gives |
| Inject concrete services directly | Harder to substitute in tests; leaks implementation |

---

*See [Modules](../modules.md) for the per-module wiring and [Overview](../overview.md) for the layers.*
