# Getting Started

> **Summary:** Install dependencies, start MySQL, point node-config at the YAML files, and run the API locally.
> **Read this when:** You're setting the project up for the first time.
> **Audience:** both
> **Related:** [Development](development.md) · [Configuration](../reference/configuration.md) · [Testing](testing.md)

[← Back to docs index](../INDEX.md)

---

## Prerequisites

- **Node.js 20+** and npm
- **Docker** (for the bundled MySQL), or an existing MySQL 8 instance
- Windows, macOS, or Linux

## Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start MySQL (and phpMyAdmin)**
   ```bash
   docker compose up -d
   ```
   This starts MySQL 8 on `localhost:3306` (database `builder_app`, user `builder` / `builder`) and phpMyAdmin on `http://localhost:8080`. Credentials come from `docker-compose.yml` and match `src/configuration/local.yaml`.

3. **Tell node-config where the YAML lives.** The config files are in `src/configuration/`, but `node-config` looks in `./config` unless told otherwise. Set `NODE_CONFIG_DIR` before starting:

   ```bash
   # bash / macOS / Linux
   NODE_CONFIG_DIR=./src/configuration npm run start:dev
   ```
   ```powershell
   # PowerShell (Windows)
   $env:NODE_CONFIG_DIR = "./src/configuration"; npm run start:dev
   ```

   > The `cross-env` package is already a dependency, so you can also wrap the script:
   > `npx cross-env NODE_CONFIG_DIR=./src/configuration nest start --watch`.
   > See [Configuration](../reference/configuration.md#node_config_dir) for why this is needed.

## Verify it worked

- The console logs that Nest started and routes are mapped.
- Open **`http://localhost:3000/api`** — the Swagger UI lists Authentication, Users, Tasks, and Job Types.
- Create a user to confirm the DB connection:
  ```bash
  curl -X POST http://localhost:3000/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"username":"alice","password":"P@ssw0rd","jobRole":"Builder"}'
  ```
  A `201` with a user object (no password) means the API and MySQL are wired up. On first run, TypeORM `synchronize` creates the tables automatically.

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Configuration key "mysql" is missing` / `MySQL configuration is missing` | `NODE_CONFIG_DIR` not set, so node-config can't find the YAML | Set `NODE_CONFIG_DIR=./src/configuration` (step 3) |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL not running | `docker compose up -d`, wait for it to be healthy |
| `400 Bad Request` on signup | Missing/invalid field (e.g. bad `jobRole`) | Send `username`, `password`, and a valid `jobRole` (`Builder` or `Supervisor`) |
| Protected route returns `403` | Missing/unknown `username` header | Send a `username` header for an existing user (see [API](../reference/api.md)) |

---

*Next: [Development](development.md) for the day-to-day workflow · back to the [index](../INDEX.md).*
