# Configuration

> **Summary:** Every config key, its YAML location, its environment-variable override, and the all-important `NODE_CONFIG_DIR`.
> **Read this when:** You're configuring the app or debugging a "config missing" error.
> **Audience:** both
> **Related:** [Getting Started](../guides/getting-started.md) · [Deployment](../guides/deployment.md) · [Frontend guide](../guides/frontend.md)

[← Back to docs index](../INDEX.md)

---

## How config works

Configuration uses the [`config`](https://github.com/node-config/node-config) (node-config) package, wrapped by `ConfigModule`. Typed slices are bound to keys with `ConfigModule.forFeature(<Class>, '<key>')` — e.g. `MysqlConfig` ← `mysql`, `AuthConfig` ← `auth`. If a key is missing at boot, the app throws (`Configuration key "<key>" is missing`).

Files live in **`src/configuration/`** and are merged in node-config's order: `default.yaml` → environment file → `local.yaml` → environment variables.

| File | Role |
|------|------|
| `default.yaml` | Base values committed for everyone |
| `local.yaml` | Local-machine overrides (DB creds, dev salt) |
| `custom-environment-variables.yaml` | Maps env vars onto config keys (used in deployment) |

## `NODE_CONFIG_DIR`

node-config looks in `./config` by default, but this project stores YAML in `src/configuration/`. **You must set `NODE_CONFIG_DIR=./src/configuration`** before the app loads, or every config lookup fails.

- **App (dev/prod):** set it in the environment, e.g. `NODE_CONFIG_DIR=./src/configuration npm run start:dev` (PowerShell: `$env:NODE_CONFIG_DIR="./src/configuration"`). The npm scripts do **not** set it for you; `cross-env` is available if you prefer to bake it into a command.
- **Tests:** `test/helpers/env-setup.ts` sets it automatically for the e2e suite.

> TODO: verify — consider adding `NODE_CONFIG_DIR` to the `start*` scripts (via `cross-env`) so running the app needs no manual env setup.

## Config keys

| Key | Type | `default.yaml` | `local.yaml` | Env override | Used by |
|-----|------|----------------|--------------|--------------|---------|
| `mysql.host` | string | `localhost` | — | `MYSQL_HOST` | `MysqlConfig` → DataSource |
| `mysql.port` | number | `3306` | — | `MYSQL_PORT` | DataSource |
| `mysql.database` | string | `builder_app` | — | `MYSQL_DATABASE` | DataSource |
| `mysql.username` | string | — | `builder` | `MYSQL_USER` | DataSource |
| `mysql.password` | string | — | `builder` | `MYSQL_PASSWORD` | DataSource |
| `auth.rounds` | number | `12` | — | `AUTH_ROUNDS` | `AuthConfig` → bcrypt cost factor |

Source of truth: `src/configuration/*.yaml`, `src/infrastructure/database/database.config.ts`, `src/auth/auth.config.ts`.

## Process environment variables (read directly)

| Var | Default | Effect | Where |
|-----|---------|--------|-------|
| `PORT` | `3000` | HTTP listen port | `src/main.ts` |
| `FRONTEND_URL` | `http://localhost:3000` | CORS allowed origin | `src/main.ts` |
| `NODE_ENV` | _(unset)_ | `production` disables TypeORM `synchronize` | `src/infrastructure/database/database.module.ts` |
| `NODE_CONFIG_DIR` | `./config` (node-config default) | Where YAML config is loaded from — **set to `./src/configuration`** | node-config |

## Frontend configuration

The above is **backend** config. The React SPA in `frontend/` is configured separately at build time by Vite — only `VITE_`-prefixed variables in `frontend/.env` reach the client:

| Var | Default | Purpose |
|-----|---------|---------|
| `VITE_API_URL` | `http://localhost:3000` | Base URL the SPA calls (read in `frontend/src/api/client.ts`) |

These two settings must agree: the backend's `FRONTEND_URL` must list the SPA's origin (default `http://localhost:5173`) for CORS, and the SPA's `VITE_API_URL` must point at the API. See the [Frontend guide](../guides/frontend.md#environment-variables).

## Notes

- `mysql.username`/`password` are intentionally only in `local.yaml` (and env vars), not committed defaults.
- `auth.rounds` is the bcrypt **cost factor**, not a salt. bcrypt generates a unique random salt per password and embeds it in the hash, so there's no salt to store (see [ADR-0003](../architecture/decisions/0003-header-based-authentication.md)). Higher rounds = slower hashing = more brute-force resistance.
- env vars arrive as **strings**, but `bcrypt.hash` needs a number — so `AUTH_ROUNDS` is mapped with `__format: json` in `custom-environment-variables.yaml`, parsing `AUTH_ROUNDS=12` to the number `12`.

---

*Next: [Deployment](../guides/deployment.md) · back to the [index](../INDEX.md).*
