---
name: Backend scaffold status
description: Tracks which backend layers have been created and their key design decisions
type: project
---

Backend scaffolded under `backend/` as part of Step 2.

Key decisions:
- Apollo Server v4 (`@apollo/server`) with Express middleware (not the deprecated `apollo-server-express`)
- Sequelize `paranoid: true` on the Character model for soft-delete (adds `deletedAt` column automatically)
- Cache-Aside pattern implemented in `CacheService` — callers check cache, then DB, then populate cache
- `@MeasureTime()` is a method decorator that wraps async methods and logs execution time; requires `experimentalDecorators` + `emitDecoratorMetadata` in tsconfig
- `reflect-metadata` imported at entry point (`src/index.ts`) before anything else

**Why:** Satisfies all mandatory requirements (TypeScript strict, Repository pattern, Service layer, Cache-Aside, soft-delete) before optionals.

**How to apply:** When implementing the cron job (optional priority 5), add it under `src/jobs/` and import it in `src/index.ts` after server start.
