# Builder App

> A full-stack construction-site **task log**: users (builders & supervisors), job types, and the tasks that assign a job type to a user and track it to completion. A NestJS REST API plus a React single-page app.

## What is this?

Builder App is a construction log made of two parts in one repository:

- **Backend** (repo root) — a [NestJS](https://nestjs.com/) 11 REST API over TypeORM and MySQL, with Swagger docs. It manages **users**, **job types** (e.g. "Bricklaying"), and **tasks** (a job type assigned to a user, tracked through a status lifecycle). Organised as feature modules (`auth`, `users`, `tasks`, `job-type`) over a shared `infrastructure` module for configuration, the database connection, and global error handling.
- **Frontend** (`frontend/`) — a Vite + React 19 single-page app (MUI, Zustand, React Router, Axios) that consumes the API. See **[Frontend architecture](docs/architecture/frontend.md)**.

## Quick start

**Backend** (API + database):

```bash
# Install dependencies
npm install

# Start the MySQL database (Docker)
docker compose up -d

# Run the API in watch mode (see the config note below)
npm run start:dev
```

> **Config gotcha:** the app reads YAML config from `src/configuration/` via `node-config`, which only looks there if `NODE_CONFIG_DIR` is set. See **[Getting Started](docs/guides/getting-started.md)** and **[Configuration](docs/reference/configuration.md)**.

Requires **Node 20+** and a reachable **MySQL 8** instance. Once running, the API listens on `http://localhost:3000` and Swagger UI is at `http://localhost:3000/api`.

**Frontend** (React SPA) — with the API running:

```bash
cd frontend
npm install
cp .env.example .env      # set VITE_API_URL if the API isn't on :3000
npm run dev               # Vite dev server on http://localhost:5173
```

Set `FRONTEND_URL=http://localhost:5173` for the API so CORS allows the SPA. See the **[Frontend guide](docs/guides/frontend.md)**.

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
- **Framework:** NestJS 11 (Express platform)
- **Data:** MySQL 8 via TypeORM 1.0
- **Config:** `node-config` (YAML, env-var overrides)
- **Docs:** `@nestjs/swagger` (OpenAPI at `/api`)
- **Auth:** `bcrypt` password hashing + a `username` request header guard
- **Testing:** Jest 30, Supertest (unit `*.spec.ts`, e2e `test/*.e2e-spec.ts`)

**Frontend** (`frontend/`)

- **Build/runtime:** Vite 8 + React 19, TypeScript
- **UI:** MUI 9 (`@mui/material`, `@mui/x-data-grid`) with Emotion
- **State / routing / HTTP:** Zustand 5 · React Router 7 · Axios 1

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
