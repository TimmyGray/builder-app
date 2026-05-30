# Builder App

> A NestJS REST API for a construction-site **task log**: users (builders & supervisors), job types, and the tasks that assign a job type to a user and track it to completion.

## What is this?

Builder App is the backend for a construction log. It exposes a REST API to manage **users**, **job types** (e.g. "Bricklaying"), and **tasks** (a job type assigned to a user, tracked through a status lifecycle). It is built with [NestJS](https://nestjs.com/) 11 on top of TypeORM and MySQL, with request/response schemas documented through Swagger.

The codebase is organised as feature modules (`auth`, `users`, `tasks`, `job-type`) over a shared `infrastructure` module that owns configuration, the database connection, and global error handling.

## Quick start

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

## Documentation

| Doc | What's in it |
|-----|--------------|
| 📑 **[Docs Index](docs/INDEX.md)** | Map of all documentation |
| 🤖 **[AGENTS.md](AGENTS.md)** | Conventions + context map for AI agents and contributors |
| 🏛 **[Architecture](docs/architecture/overview.md)** | How the system is built and why |
| 🚀 **[Getting Started](docs/guides/getting-started.md)** | Local setup |
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
docs/                Documentation suite (start at docs/INDEX.md)
```

## Tech stack

- **Language:** TypeScript 5.7 (ES2023 target)
- **Framework:** NestJS 11 (Express platform)
- **Data:** MySQL 8 via TypeORM 1.0
- **Config:** `node-config` (YAML, env-var overrides)
- **Docs:** `@nestjs/swagger` (OpenAPI at `/api`)
- **Auth:** `bcrypt` password hashing + a `username` request header guard
- **Testing:** Jest 30, Supertest (unit `*.spec.ts`, e2e `test/*.e2e-spec.ts`)

## Common commands

| Command | Does |
|---------|------|
| `npm run start:dev` | Run with file watching |
| `npm run build` | Compile to `dist/` |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run the end-to-end suite (needs MySQL) |
| `npm run lint` | ESLint with `--fix` |

See [Development](docs/guides/development.md) for the full list.

## Contributing

Conventions, guardrails, and a task-to-files routing table live in **[AGENTS.md](AGENTS.md)**.

## License

UNLICENSED (private).
