# Rick & Morty — Blossom Tech Test

## Context

Full stack application to search Rick and Morty characters.
Technical test for Blossom.

## Stack

- Backend: Express + TypeScript + Apollo Server + Sequelize + PostgreSQL + Redis
- Frontend: React 18 + TypeScript + Apollo Client + TailwindCSS + React Router DOM
- Testing: Jest (BE) + Vitest + Testing Library (FE)
- DevOps: Docker Compose

## Backend Architecture

Resolver → Service → Repository → Sequelize/DB
↕
Redis (Cache-Aside)

## Required Patterns

- Repository Pattern
- Service Layer
- Decorator Pattern (@MeasureTime)
- Cache-Aside with Redis

## Code Rules

- Strict TypeScript (strict: true in tsconfig)
- No use of "any" in TypeScript unless absolutely justified
- Error handling in all async/await with try/catch

## Delivery Priority

Complete ALL mandatory requirements first, then optionals in this order:

1. TypeScript
2. Search filters (Status, Species, Gender)
3. Soft-delete
4. Unit tests
5. Cron job
6. Method decorator
7. Swagger
8. Design patterns
