# Documentation Index

> **Summary:** Catalog of all project documentation with a one-line summary and a "read when" cue for each. This is the browse/route hub for humans and agents.

For task-based routing, see the **[Context Map in AGENTS.md](../AGENTS.md#context-map--what-to-read-for-the-task-at-hand)**.

---

## Start here

| Doc | Summary | Read when |
|-----|---------|-----------|
| [README](../README.md) | Project overview & quick start | You're new to the project |
| [AGENTS](../AGENTS.md) | Conventions + context map | Before any code change (esp. agents) |

## Architecture

| Doc | Summary | Read when |
|-----|---------|-----------|
| [Overview](architecture/overview.md) | Layered feature-module architecture, request flow, cross-cutting concerns | You need the big picture (backend) |
| [Modules](architecture/modules.md) | Responsibilities & boundaries of auth/users/tasks/job-type/infrastructure | You're changing a specific backend area |
| [Data model](architecture/data-model.md) | User, JobType, Task entities and their relationships | You're touching data/persistence |
| [Frontend](architecture/frontend.md) | React SPA structure: stack, layers, routing, state, auth flow | You're changing the web client |
| [Decisions (ADRs)](architecture/decisions/) | Recorded architecture decisions and their rationale | You want the "why" behind a choice |

## Guides

| Doc | Summary | Read when |
|-----|---------|-----------|
| [Getting started](guides/getting-started.md) | Install, start MySQL, run the API locally | First-time setup (backend) |
| [Development](guides/development.md) | Day-to-day backend workflow, commands, how to add a feature | While developing the API |
| [Frontend](guides/frontend.md) | Install, run, and develop the React SPA; env, commands, recipes | While developing the web client |
| [Testing](guides/testing.md) | Unit vs e2e tests, how they're structured, how to run | Adding or running tests |
| [Deployment](guides/deployment.md) | Building for production, `synchronize`, env-var config | Releasing/deploying |

## Reference

| Doc | Summary | Read when |
|-----|---------|-----------|
| [API](reference/api.md) | Every endpoint, its body, auth, and status codes | Calling or extending the API |
| [Configuration](reference/configuration.md) | Config keys, env-var overrides, `NODE_CONFIG_DIR` | Configuring the app |
| [Glossary](reference/glossary.md) | Domain & project terms | A term is unclear |

## Architecture Decision Records

| ADR | Decision |
|-----|----------|
| [0001](architecture/decisions/0001-record-architecture-decisions.md) | Record architecture decisions |
| [0002](architecture/decisions/0002-dependency-injection-with-interface-tokens.md) | DI via abstract-class interface tokens & repository factories |
| [0003](architecture/decisions/0003-header-based-authentication.md) | Header-based authentication (no JWT yet) |
| [0004](architecture/decisions/0004-domain-exceptions-via-global-filter.md) | Domain exceptions translated by a global filter |

---

*Each doc above starts with a header block (summary · read-when · related links) and links back here.*
