# Frontend Guide

> **Summary:** Install, configure, run, and develop the React SPA in `frontend/` — commands, conventions, and worked recipes for adding a page or an API call.
> **Read this when:** You're working in the web client (`frontend/`).
> **Audience:** both
> **Related:** [Frontend architecture](../architecture/frontend.md) · [Getting Started](getting-started.md) · [API Reference](../reference/api.md)

[← Back to docs index](../INDEX.md)

---

## Prerequisites

- **Node.js 20+** and npm
- The **backend running** at the URL in `VITE_API_URL` (default `http://localhost:3000`). See [Getting Started](getting-started.md) to boot the API + MySQL first.

The frontend has its **own** `package.json` and `node_modules` under `frontend/` — install and run commands from inside that directory.

## Setup

```bash
cd frontend
npm install
cp .env.example .env      # then edit if your API isn't on http://localhost:3000
npm run dev
```

`npm run dev` starts Vite on **`http://localhost:5173`**. Open it; you'll land on `/auth`. Sign up (Builder or Supervisor), then you're redirected to `/tasks`.

> The backend must allow the SPA origin via CORS — set `FRONTEND_URL=http://localhost:5173` for the API (see [Configuration](../reference/configuration.md)).

## Environment variables

Vite only exposes vars prefixed with `VITE_` to the client (`import.meta.env`).

| Var | Default | Purpose |
|-----|---------|---------|
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the Builder App API. Read in `src/api/client.ts`. |

Put local values in `frontend/.env` (git-ignored); `frontend/.env.example` is the template.

## Commands

Run from `frontend/`:

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (HMR) on `:5173` |
| `npm run build` | Type-aware production build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run typecheck` | `tsc --noEmit` — type-check without building |
| `npm run lint` | ESLint over `src` |

## Project layout

```
frontend/
  index.html              HTML shell; loads fonts and /src/main.tsx
  vite.config.ts          Vite config (port 5173, "@" → ./src)
  src/
    main.tsx              React root (StrictMode)
    App.tsx               ThemeProvider + Router + routes + GlobalSnackbar
    theme.ts              MUI dark theme (violet/cyan, Space Grotesk/Syne)
    api/
      client.ts           Shared Axios instance + interceptors
      auth.ts users.ts tasks.ts jobTypes.ts   One module per backend area
    stores/
      authStore.ts        Persisted current user
      tasksStore.ts jobTypesStore.ts usersStore.ts   Cached lists
      notifyStore.ts      Snackbar state
    components/
      Header.tsx ProtectedLayout.tsx GlobalSnackbar.tsx
      modals/             Create/Edit/Profile dialogs
    pages/
      AuthPage.tsx TasksPage.tsx JobTypesPage.tsx
    types/
      api.ts              Hand-written mirrors of backend DTOs
```

See [Frontend architecture](../architecture/frontend.md) for how these layers fit together.

## Conventions in practice

- **Imports use the `@` alias** for `src` (`import { apiClient } from '@/api/client'`). Configured in both `vite.config.ts` and `tsconfig.json`.
- **HTTP only through `src/api/`.** Components never call `axios` directly — add or use a typed wrapper that goes through the shared `apiClient`, so the auth header and error normalisation always apply.
- **Stores are caches.** Do the network call in the component (via an `api/` wrapper), then update the store with `add*`/`replace*`/`remove*`. Use `fetch*` for the initial load in a page's `useEffect`.
- **Report errors with `notify`.** Wrap awaited calls in `try/catch` and call `useNotifyStore`'s `notify(message, 'error')`; the rejected value is an `ApiError` with a `message`. Success messages use `notify(msg, 'success' | 'info')`.
- **Keep types in sync with the backend.** When a backend DTO changes, update the matching interface in `src/types/api.ts` — there is no codegen.
- **Style with MUI + the theme.** Use MUI components and the `sx` prop / `theme.ts`; avoid ad-hoc CSS files.
- **Guarded screens go under `ProtectedLayout`.** Add new authenticated routes inside that branch in `App.tsx`; public routes go alongside `/auth`.

## Recipe: call a new endpoint

1. Add a typed function to the relevant `src/api/<area>.ts` (or create a new file) that uses `apiClient` and returns parsed `data`. Type its result against `src/types/api.ts` (add a type if the shape is new).
2. Call it from the page/modal inside `try/catch`; on success update the store, on error `notify(...)`.
3. If it's a brand-new domain, add a store in `src/stores/` mirroring `tasksStore` (state + `fetch` + `add`/`replace`/`remove`).

## Recipe: add a page

1. Create `src/pages/<Name>Page.tsx`.
2. Register a `<Route>` in `src/App.tsx` — inside the `ProtectedLayout` branch if it needs auth.
3. Add a nav entry to `NAV_ITEMS` in `src/components/Header.tsx` if it should appear in the top nav.
4. Fetch data in a `useEffect` via the store's `fetch*`; render with MUI.

## Before you commit

```bash
cd frontend
npm run lint
npm run typecheck
npm run build   # catches type/build errors the dev server tolerates
```

---

*Next: [Frontend architecture](../architecture/frontend.md) · [API Reference](../reference/api.md) · back to the [index](../INDEX.md).*
