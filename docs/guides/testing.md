# Testing

> **Summary:** How unit and end-to-end tests are organised, how to run them, and the conventions the e2e suite follows.
> **Read this when:** You're adding or running tests.
> **Audience:** both
> **Related:** [Development](development.md) · [Configuration](../reference/configuration.md)

[← Back to docs index](../INDEX.md)

---

## Two test layers

| Layer | Files | Config | Runs against |
|-------|-------|--------|--------------|
| Unit | `src/**/*.spec.ts` | `jest` block in `package.json` (rootDir `src`) | Mocks — no DB |
| End-to-end | `test/*.e2e-spec.ts` | `test/jest-e2e.json` | A **live MySQL** instance |

## Running

```bash
npm test            # unit tests
npm run test:watch  # unit tests, watch
npm run test:cov    # unit tests with coverage
npm run test:e2e    # end-to-end tests (start MySQL first)
```

For e2e, bring up the database first: `docker compose up -d`.

## Unit tests

Co-located `*.spec.ts` files use `@nestjs/testing` to build a module with mocked collaborators. Existing examples cover each controller, service, and the auth guard (e.g. `src/tasks/tasks.service.spec.ts`, `src/auth/auth.guard.spec.ts`). Provide the same DI **token** you bind in production (`I<Name>Service`, `<Name>Repository`) with a mock implementation.

## End-to-end tests

The e2e suite (in `test/`) boots the real `AppModule` and drives it with Supertest.

- **`test/jest-e2e.json`** — `maxWorkers: 1`, `testTimeout: 30000`, `forceExit: true`, and `setupFiles: ["<rootDir>/helpers/env-setup.ts"]`.
- **`test/helpers/env-setup.ts`** — sets `NODE_CONFIG_DIR=./src/configuration` *before* anything imports the `config` package, so node-config finds the YAML. This is why e2e doesn't need you to set the env var manually.
- **`test/helpers/setup.ts`** — `createApp()` bootstraps the full app with the same global `ValidationPipe`, `DomainExceptionFilter`, and Swagger as `main.ts`.

Suites (≈55 tests total):

| File | Covers |
|------|--------|
| `test/auth.e2e-spec.ts` | signup / signin / signout / delete |
| `test/users.e2e-spec.ts` | list / get-by-username / update |
| `test/job-types.e2e-spec.ts` | full CRUD |
| `test/tasks.e2e-spec.ts` | full CRUD + lifecycle |
| `test/app.e2e-spec.ts` | Swagger smoke + 404 |

### Conventions

- **Isolated data per suite.** Each suite mints unique records with `e2e_<module>_<Date.now()>_*` prefixes in `beforeAll` and removes them in `afterAll` via the API's own delete endpoints. No shared state between suites.
- **Auth.** Guarded endpoints need a `username` header for an existing user; the suites create a setup user and pass its username.
- **Status codes** assert the real behaviour, including the quirks documented in the [API reference](../reference/api.md) (e.g. `signin`/`signup` return `201`).

## Tips

- A `400` you didn't expect usually means the global `whitelist` pipe rejected or stripped a field — check the DTO decorators.
- If e2e fails with a config/DB error, confirm MySQL is up and that `src/configuration/local.yaml` matches your DB credentials.

---

*Next: [Configuration](../reference/configuration.md) · back to the [index](../INDEX.md).*
