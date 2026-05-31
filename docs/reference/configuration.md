# Configuration

> **Summary:** Every config key, its YAML location, its environment-variable override, and how local vs Docker config works.
> **Read this when:** You're configuring the app or debugging a "config missing" error.
> **Audience:** both
> **Related:** [Getting Started](../guides/getting-started.md) · [Deployment](../guides/deployment.md) · [Frontend guide](../guides/frontend.md)

[← Back to docs index](../INDEX.md)

---

## How config works

Configuration uses the [`config`](https://github.com/node-config/node-config) (node-config) package, wrapped by `ConfigModule`. Typed slices are bound to keys with `ConfigModule.forFeature(<Class>, '<key>')` — e.g. `MysqlConfig` ← `mysql`, `AuthConfig` ← `auth`. If a required key is missing at boot, the app throws (`MySQL configuration is missing`).

Files live in **`config/`** (the default lookup path for node-config — no `NODE_CONFIG_DIR` override needed). They are merged in this order:

| File | Role |
|------|------|
| `config/default.yaml` | Base values committed for everyone (no secrets) |
| `config/local.yaml` | Local-machine overrides — DB credentials, bcrypt rounds. **Gitignored.** |
| `config/custom-environment-variables.yaml` | Maps env vars onto config keys (used in Docker / CI / production) |

## Config keys

| Key | Type | `default.yaml` | `local.yaml` | Env var override | Used by |
|-----|------|----------------|--------------|------------------|---------|
| `mysql.host` | string | `localhost` | — | `MYSQL_HOST` | DataSource |
| `mysql.port` | number | `3306` | — | `MYSQL_PORT` | DataSource |
| `mysql.database` | string | `builder_app` | — | `MYSQL_DATABASE` | DataSource |
| `mysql.username` | string | — | `see the local.yaml` | `MYSQL_USER` | DataSource |
| `mysql.password` | string | — | `see the local.yaml` | `MYSQL_PASSWORD` | DataSource |
| `auth.rounds` | number | — | e.g. `{see the local.yaml}` | `AUTH_ROUNDS` | bcrypt cost factor |

`mysql.username`, `mysql.password`, and `auth.rounds` have no committed defaults — they must come from `config/local.yaml` (local dev) or env vars (Docker / CI).

`AUTH_ROUNDS` is mapped with `__format: json` in `custom-environment-variables.yaml` so the string `"10"` is parsed to the number `10` before reaching bcrypt.

## Process environment variables (read directly)

| Var | Default | Effect |
|-----|---------|--------|
| `PORT` | `3000` | HTTP listen port (`src/main.ts`) |
| `FRONTEND_URL` | `http://localhost:3000` | CORS allowed origin (`src/main.ts`) |
| `NODE_ENV` | _(unset)_ | `production` disables TypeORM `synchronize` |
| `SEED_DATABASE` | — | Set to `true` to run the seed script on startup (read by `entrypoint.sh`) |

## Frontend configuration

The React SPA in `frontend/` is configured separately. Only `VITE_`-prefixed variables in `frontend/.env` reach the client:

| Var | Default | Purpose |
|-----|---------|---------|
| `VITE_API_URL` | `http://localhost:3000` | Base URL the SPA calls (read in `frontend/src/api/client.ts`) |

For Docker, `VITE_API_URL` is passed as a runtime env var to the Vite dev server — no build-time baking needed.

These two settings must agree: the backend's `FRONTEND_URL` must list the SPA's origin (default `http://localhost:5173`) for CORS, and `VITE_API_URL` must point at the API.

## Local dev setup

Create `config/local.yaml` (gitignored):

```yaml
mysql:
  username: {your value here}
  password: {your value here}

auth:
  rounds: {your value here, e.g. 10}
```

## Notes

- `auth.rounds` is the bcrypt **cost factor**, not a salt. bcrypt generates a unique random salt per hash and embeds it, so there's nothing to store separately.
- Higher `auth.rounds` = slower hashing = more brute-force resistance. 10–12 is typical for dev; tune upward for production.
- See [ADR-0003](../architecture/decisions/0003-header-based-authentication.md) for the full auth design.

---

_Next: [Deployment](../guides/deployment.md) · back to the [index](../INDEX.md)._
