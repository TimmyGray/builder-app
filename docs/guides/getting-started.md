# Getting Started

> **Summary:** Two ways to run the full stack — Docker Compose (everything in one command) or locally (backend + frontend started separately).
> **Read this when:** You're setting the project up for the first time.
> **Audience:** both
> **Related:** [Development](development.md) · [Configuration](../reference/configuration.md) · [Testing](testing.md)

[← Back to docs index](../INDEX.md)

---

## Prerequisites

- **Docker Desktop** — for Option 1 (Docker), or just the DB in Option 2
- **Node.js 20+** and npm — for Option 2 (local)

---

## Option 1 — Docker Compose (recommended)

Starts MySQL, the NestJS API, and the Vite frontend in one command.

```bash
cp .env.example .env          # defaults work out of the box
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| Swagger UI | http://localhost:3000/api |
| phpMyAdmin | http://localhost:8080 |

The seed script runs automatically on first start (controlled by `SEED_DATABASE` in `.env`, default `true`). It is idempotent — if the database already has data it skips without touching anything.

To wipe the database and reseed from scratch:

```bash
docker compose down -v        # removes containers + the mysql_data volume
docker compose up --build
```

---

## Option 2 — Local development

### 1. Start MySQL

```bash
docker compose up -d mysql
```

MySQL 8 on `localhost:3306`, database `builder_app`, user `builder`/`builder`. phpMyAdmin on `http://localhost:8080`.

### 2. Backend

```bash
npm install
npm run start:dev             # watches for changes, listens on :3000
```

Configuration is loaded from `config/` via `node-config` (that is already the default lookup path — no extra env var needed). Local overrides (DB credentials, bcrypt rounds) go in `config/local.yaml`, which is gitignored. See [Configuration](../reference/configuration.md).

`config/local.yaml` example:
```yaml
mysql:
  username: builder
  password: builder

auth:
  rounds: 12
```

**Optional:** seed the database with sample data:

```bash
npm run seed
```

The seed script is idempotent — it checks `users.count()` first and exits early if the database is not empty.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:3000
npm run dev                   # Vite dev server on http://localhost:5173
```

Or start both backend and frontend together from the repo root:

```bash
npm run start:all
```

---

## Verify it worked

- Open **`http://localhost:3000/api`** — Swagger UI lists all routes.
- Open **`http://localhost:5173`** — the login/signup page loads.
- Sign up, then log in; you should land on the tasks screen.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `MySQL configuration is missing` | `config/local.yaml` missing or has wrong keys | Create it with `mysql.username` and `mysql.password` |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL not running | `docker compose up -d mysql` |
| API returns `500` on signup | `auth.rounds` not set | Add `auth: rounds: 12` to `config/local.yaml` (or set `AUTH_ROUNDS` env var) |
| `400 Bad Request` on signup | Missing/invalid field | Send `username`, `password`, and a valid `jobRole` (`Builder` or `Supervisor`) |
| Protected route returns `403` | Missing `username` header | Send a `username` header matching an existing user (see [API](../reference/api.md)) |

---

*Next: [Development](development.md) for the day-to-day workflow · back to the [index](../INDEX.md).*
