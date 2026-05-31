# Deployment

> **Summary:** How to run Builder App in a non-local environment using Docker Compose, and what changes compared to local dev.
> **Read this when:** You're shipping the app to a non-local environment.
> **Audience:** both
> **Related:** [Configuration](../reference/configuration.md) · [Data model](../architecture/data-model.md)

[← Back to docs index](../INDEX.md)

---

## Docker Compose

The project ships with a `docker-compose.yml` that starts all four services:

| Service | Image | Port |
|---------|-------|------|
| MySQL 8 | `mysql:8.4` | 3306 |
| NestJS API | built from `Dockerfile` | 3000 |
| React frontend | built from `frontend/Dockerfile` | 5173 |
| phpMyAdmin | `phpmyadmin:5-apache` | 8080 |

```bash
cp .env.example .env   # then adjust values as needed
docker compose up --build
```

The API waits for MySQL to pass its healthcheck before starting. On first boot, `entrypoint.sh` runs the seed script (if `SEED_DATABASE=true`) then starts the app with `node dist/main`.

### Environment variables

Configure via `.env` in the repo root (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `SEED_DATABASE` | `true` | Run the seed on startup if the DB is empty |
| `AUTH_ROUNDS` | `10` | bcrypt cost factor |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin for the API |
| `VITE_API_URL` | `http://localhost:3000` | API base URL baked into the frontend dev server |

MySQL credentials are hardcoded in `docker-compose.yml` (`builder`/`builder`). Override them there or via `.env` if needed for a shared/staging environment.

Full variable reference: [Configuration](../reference/configuration.md).

---

## Manual build (without Docker)

```bash
npm ci
npm run build            # compiles to dist/
node dist/main
```

`npm run start:prod` is a shortcut for `node dist/main`. The process listens on `PORT` (default `3000`).

Configuration is read from `config/` at startup. In a non-Docker environment, set env vars to override defaults (see [Configuration](../reference/configuration.md#config-keys)).

---

## What changes vs local dev

| Concern | Local | Docker / production |
|---------|-------|---------------------|
| TypeORM `synchronize` | **on** (auto-creates schema) | **on** in Docker (`NODE_ENV=development`), **off** when `NODE_ENV=production` |
| Config source | `config/local.yaml` overrides | env vars via `config/custom-environment-variables.yaml` |
| CORS origin | `http://localhost:3000` | set `FRONTEND_URL` |
| Seed | manual (`npm run seed`) | automatic if `SEED_DATABASE=true` |

## Schema / migrations

`synchronize` is disabled when `NODE_ENV=production`. The project has no migration files. Before relying on a production deploy you must either:

- Generate and run TypeORM migrations, or
- Provision the schema out of band.

> TODO: verify — choose and document a migration strategy before the first production release.

## Security checklist before going live

- Replace the header-based `AuthGuard` with real credential verification. See [ADR-0003](../architecture/decisions/0003-header-based-authentication.md).
- Tune `AUTH_ROUNDS` to your production hardware (12 is a reasonable default).
- Set real DB credentials via env vars, never committed.
- Remove or restrict phpMyAdmin from public-facing deployments.

---

*Next: [Configuration](../reference/configuration.md) · back to the [index](../INDEX.md).*
