# Builder App

> A full-stack construction-site **task log**: users (builders & supervisors), job types, and the tasks that assign a job type to a user and track it to completion. A NestJS REST API plus a React single-page app.

## What is this?

Builder App is a construction log made of two parts in one repository:

- **Backend** (repo root) — a [NestJS](https://nestjs.com/) 11 REST API over TypeORM and MySQL, with Swagger docs. It manages **users**, **job types** (e.g. "Bricklaying"), and **tasks** (a job type assigned to a user, tracked through a status lifecycle). Organised as feature modules (`auth`, `users`, `tasks`, `job-type`) over a shared `infrastructure` module for configuration, the database connection, and global error handling.
- **Frontend** (`frontend/`) — a Vite + React 19 single-page app (MUI, Zustand, React Router, Axios) that consumes the API. See **[Frontend architecture](docs/architecture/frontend.md)**.

## Starting the app

There are two ways to run the application: **Docker** (everything in one command) or **locally** (backend and frontend started separately).

---

### Option 1 — Docker Compose (recommended)

Starts MySQL, the NestJS API, and the Vite frontend all at once. Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
# Copy the example env file (defaults are fine for local use)
cp .env.example .env

# Build images and start all services
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | <http://localhost:5173> |
| API | <http://localhost:3000> |
| Swagger UI | <http://localhost:3000/api> |
| phpMyAdmin | <http://localhost:8080> |

**Database seeding** is controlled by the `SEED_DATABASE` variable in `.env` (default `true`). The seed script is idempotent — it checks whether the database is empty first and skips if data already exists.

To wipe the database and start fresh:

```bash
docker compose down -v   # removes containers + the mysql_data volume
docker compose up --build
```

**Environment variables** (see `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `SEED_DATABASE` | `true` | Run the seed script on startup if the DB is empty |
| `AUTH_ROUNDS` | `10` | bcrypt rounds for password hashing |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin for the API |
| `VITE_API_URL` | `http://localhost:3000` | API base URL used by the frontend |

---

### Option 2 — Local development

Requires **Node 20+** and a running **MySQL 8** instance (you can still use `docker compose up -d mysql` for just the DB).

**1. Database**

```bash
docker compose up -d mysql
```

**2. Backend**

```bash
# Install dependencies
npm install

# (Optional) seed the database
npm run seed

# Start the API in watch mode — listens on http://localhost:3000
npm run start:dev
```

Configuration is read from `config/` via `node-config`. Secrets and local overrides go in `config/local.yaml` (gitignored). See `config/default.yaml` for available keys and `config/custom-environment-variables.yaml` for the env-var mapping.

`config/local.yaml` example:

```yaml
mysql:
  username: builder
  password: builder

auth:
  rounds: 12
```

**3. Frontend**

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3000
npm run dev              # Vite dev server on http://localhost:5173
```

Or run both backend and frontend together from the repo root:

```bash
npm run start:all
```

## Documentation

| Doc | What's in it |
|-----|--------------|
| 📑 **[Docs Index](docs/INDEX.md)** | Map of all documentation |
| 🤖 **[AGENTS.md](AGENTS.md)** | Conventions + context map for AI agents and contributors |
| 🏛 **[Architecture](docs/architecture/overview.md)** | How the backend is built and why |
| 🎨 **[Frontend](docs/architecture/frontend.md)** | React SPA architecture + [dev guide](docs/guides/frontend.md) |
| 🚀 **[Getting Started](docs/guides/getting-started.md)** | Local backend setup |
| 🛠 **[Development](docs/guides/development.md)** | Day-to-day workflow |
| 🔌 **[API Reference](docs/reference/api.md)** | Every endpoint |

## Project layout

```
src/
  main.ts            Bootstrap: pipes, filters, CORS, Swagger
  app.module.ts      Root module wiring all features together
  auth/              Sign in / up / out, account deletion, AuthGuard
  users/             User CRUD-ish operations
  job-type/          Job type CRUD
  tasks/             Task CRUD + lifecycle, joins users & job types
  infrastructure/    Config, database (TypeORM DataSource), exception filter
  configuration/     node-config YAML files (default/local/env-var mapping)
test/                Jest + Supertest end-to-end suite
frontend/            React SPA (Vite) — see frontend/src/{pages,stores,api}
docs/                Documentation suite (start at docs/INDEX.md)
```

The frontend is a separate npm project; see its layout in the **[Frontend guide](docs/guides/frontend.md#project-layout)**.

## Tech stack

**Backend**

- **Language:** TypeScript 5.7 (ES2023 target)
- **Framework:** NestJS 11 (Express platform) - Chosen for its modular architecture, dependency injection, and built-in support for validation, guards, and filters.
- **Data:** MySQL 8 via TypeORM 1.0 - Chosen because of TypeORM's DataSource and Repository patterns fit well with Nest's DI and module system. Also it much easer and faster in a small projects and datasets with no complex relations or query needs then postgres.
- **Config:** `node-config` (YAML, env-var overrides)
- **Docs:** `@nestjs/swagger` (OpenAPI at `/api`) - Chosen for its seamless integration with NestJS, auto-generating API docs from decorators.
- **Auth:** `bcrypt` password hashing + a `username` request header guard - Chosen for simplicity in this demo app; not production-ready but enough to demonstrate config and auth concepts.
- **Testing:** Jest 30, Supertest (unit `*.spec.ts`, e2e `test/*.e2e-spec.ts`)

**Frontend** (`frontend/`)

- **Build/runtime:** Vite 8 + React 19, TypeScript -  Chosen for fast development experience out of the box. Simple cofigurations.
- **UI:** MUI 9 (`@mui/material`, `@mui/x-data-grid`) with Emotion - Chose for its comprehensive component library and ease of styling. Modern React support and good accessibility out of the box.
- **State / routing / HTTP:** Zustand 5 · React Router 7 · Axios 1 - Zustand for its minimal API. Honestly its an only one stagemanager using with react that I know. I also work with pinia and vue and they are very similar.

## Common commands

**Backend** (repo root):

| Command | Does |
|---------|------|
| `npm run start:dev` | Run with file watching |
| `npm run build` | Compile to `dist/` |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run the end-to-end suite (needs MySQL) |
| `npm run lint` | ESLint with `--fix` |

**Frontend** (`cd frontend`):

| Command | Does |
|---------|------|
| `npm run dev` | Vite dev server on `:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run typecheck` | Type-check (`tsc --noEmit`) |
| `npm run lint` | ESLint over `src` |

See [Development](docs/guides/development.md) (backend) and the [Frontend guide](docs/guides/frontend.md) for the full lists.

## Contributing

Conventions, guardrails, and a task-to-files routing table live in **[AGENTS.md](AGENTS.md)**.

## License

UNLICENSED (private).
