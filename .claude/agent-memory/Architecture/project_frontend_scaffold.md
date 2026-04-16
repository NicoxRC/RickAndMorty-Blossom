---
name: Frontend scaffold status
description: Tracks which frontend files have been created and their key design decisions
type: project
---

Frontend scaffolded under `frontend/` as part of Step 3.

Key decisions:
- Vite 5 + React 18 + TypeScript (strict: true), NOT Create React App
- Apollo Client 3 with `cache-and-network` fetch policy by default
- Path aliases defined in both `vite.config.ts` and `tsconfig.json` (must stay in sync): `@/` maps to `src/`, plus named aliases for each sub-folder
- Vitest config is inline in `vite.config.ts` (no separate vitest.config), using jsdom environment and `src/setupTests.ts` for @testing-library/jest-dom
- React Router DOM v6 using `createBrowserRouter` + `RouterProvider` (not the legacy `BrowserRouter`)
- Route layout: `/` → `App` (navbar shell with `<Outlet>`) → index: `CharactersPage`, `/characters/:id`: `CharacterDetailPage`
- `CharacterFilters` type uses empty string `''` for "all" (no filter) on status/gender selects — matches `<select>` default option value
- Tailwind CSS v3 with PostCSS; entry CSS is `src/index.css` imported in `main.tsx`

**Why:** Matches the docker-compose `frontend` service config (port 3000, `VITE_GRAPHQL_URL` env var, volume mount).

**How to apply:** When implementing real queries or mutations, add them to `src/hooks/` following the `useCharacters` pattern. When adding new routes, register them in `src/router/index.tsx` as children of the root `App` route.
