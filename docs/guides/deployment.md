# Deployment

> **Summary:** How to build and run Builder App for production, and the two things that change there: `synchronize` is off and config comes from environment variables.
> **Read this when:** You're shipping the app to a non-local environment.
> **Audience:** both
> **Related:** [Configuration](../reference/configuration.md) · [Data model](../architecture/data-model.md)

[← Back to docs index](../INDEX.md)

---

## Build and run

```bash
npm ci
npm run build            # compiles to dist/
NODE_ENV=production NODE_CONFIG_DIR=./src/configuration node dist/main
```

`npm run start:prod` is the shortcut for `node dist/main`. The process listens on `PORT` (default `3000`) and serves Swagger at `/api`.

> `NODE_CONFIG_DIR` must still point at the configuration directory so node-config can load the YAML and apply env-var overrides. The compiled config files ship under `dist/` too; point at whichever you deploy. See [Configuration](../reference/configuration.md#node_config_dir).

## What changes in production

| Concern | Local | Production (`NODE_ENV=production`) |
|---------|-------|-----------------------------------|
| TypeORM `synchronize` | **on** (auto-creates schema) | **off** |
| Config source | `local.yaml` overrides | env vars via `custom-environment-variables.yaml` |
| CORS origin | `http://localhost:3000` | set `FRONTEND_URL` |

## Configuration via environment variables

In production, set these (mapped in `src/configuration/custom-environment-variables.yaml`):

| Env var | Maps to |
|---------|---------|
| `MYSQL_HOST` | `mysql.host` |
| `MYSQL_PORT` | `mysql.port` |
| `MYSQL_USER` | `mysql.username` |
| `MYSQL_PASSWORD` | `mysql.password` |
| `MYSQL_DATABASE` | `mysql.database` |
| `AUTH_ROUNDS` | `auth.rounds` (bcrypt cost factor; mapped as a JSON number) |

Plus direct process env: `PORT`, `FRONTEND_URL`, `NODE_ENV`, `NODE_CONFIG_DIR`. Full details in [Configuration](../reference/configuration.md).

## Schema / migrations

Because `synchronize` is **disabled** in production and the project has **no migration files**, the database schema is not created or updated automatically there. Before relying on a production deploy you must apply the schema by one of:

- Generating and running TypeORM migrations (not yet set up), or
- Provisioning the schema out of band.

> TODO: verify — choose and document a migration strategy before the first production release. Do not depend on `synchronize` for production schema changes (it can drop/alter data).

## Database

A `docker-compose.yml` is provided for **local** MySQL 8 + phpMyAdmin. It is not a production deployment artifact; production should point `MYSQL_*` at a managed/instance database.

## Security checklist before going live

- Replace the header-based `AuthGuard` with a real credential (token). See [ADR-0003](../architecture/decisions/0003-header-based-authentication.md).
- Tune `AUTH_ROUNDS` for your production hardware (12 is a reasonable default; higher is slower but harder to brute-force).
- Set real DB credentials via env vars, never committed.

---

*Next: [Configuration](../reference/configuration.md) · back to the [index](../INDEX.md).*
