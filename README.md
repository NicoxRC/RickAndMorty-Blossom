# Rick and Morty — Blossom Tech Test

A full-stack application to search and manage characters from the Rick and Morty series, built as a technical test for Blossom. The backend exposes a GraphQL API backed by PostgreSQL and Redis; the frontend is a React 18 SPA that consumes it via Apollo Client.

---

## Architecture

```
Frontend (React 18 + Apollo Client)
          |
          | GraphQL over HTTP
          v
  Resolver Layer (Apollo Server + Express)
          |
  Service Layer (business logic, cache checks)
          |               |
  Repository Layer     Redis (Cache-Aside)
          |
  Sequelize ORM
          |
    PostgreSQL
```

### Design Patterns

**Repository Pattern** — every entity (`Character`, `Comment`, `Favorite`, `User`) has a dedicated repository class that implements a typed interface (`ICharacterRepository`, etc.). Resolvers and services never touch Sequelize models directly; they depend on the interface. This makes the data layer swappable and independently testable.

**Service Layer** — business logic lives exclusively in service classes (`CharacterService`, etc.) that sit between the resolvers and the repositories. Resolvers are kept thin: they validate input and delegate to the service, which decides whether to hit the cache or the database.

**Cache-Aside with Redis** — on every read, the service first checks Redis for a cached result. On a cache miss it queries PostgreSQL, stores the result in Redis with a TTL, and returns it. On any write (soft-delete, favorites toggle, comment creation) the relevant cache keys are invalidated so subsequent reads are always consistent.

**Decorator Pattern (`@MeasureTime`)** — a TypeScript method decorator wraps async service methods to record the start and end timestamps, then logs the elapsed time to the console. It is applied at the class level so any method marked with `@MeasureTime` gets automatic performance instrumentation without changing the method body.

---

## Tech Stack

| Layer    | Technologies                                                                      |
| -------- | --------------------------------------------------------------------------------- |
| Backend  | Node.js, Express, Apollo Server, GraphQL, Sequelize, PostgreSQL, Redis, node-cron |
| Frontend | React 18, Vite, Apollo Client, React Router DOM, TailwindCSS                      |
| Language | TypeScript (strict mode, both workspaces)                                         |
| Testing  | Jest + ts-jest (backend), Vitest + Testing Library (frontend)                     |
| DevOps   | Docker Compose                                                                    |

---

## Prerequisites

- Node.js v18 or later
- Docker and Docker Compose
- npm v8 or later (workspaces support)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NicoxRC/RickAndMorty-Blossom.git
cd RickAndMorty-Blossom
```

### 2. Configure environment variables

Copy the root example file (used by Docker Compose):

```bash
cp .env.example .env
```

Copy the backend example file (used when running the backend locally without Docker):

```bash
cp backend/.env.example backend/.env
```

Edit both files if you need to change default credentials. The defaults are configured to work with the Docker Compose services without modification.

### 3. Start the database and cache

```bash
docker compose up postgres redis -d
```

### 4. Install dependencies

```bash
npm install
```

This installs dependencies for both workspaces (`backend` and `frontend`) from the root.

### 5. Run database migrations

```bash
cd backend && npx sequelize-cli db:migrate
```

### 6. Seed the database

This populates the database with 15 characters from the Rick and Morty API and creates the default users:

```bash
npx sequelize-cli db:seed:all
```

### 7. Start the development servers

From the project root, start both servers concurrently:

```bash
npm run dev
```

Or start them individually:

```bash
# Backend only
npm run dev --workspace=backend

# Frontend only
npm run dev --workspace=frontend
```

### 8. (Alternative) Full Docker setup

To run everything — including the backend and frontend — inside Docker:

```bash
npm run docker:up
```

---

## Default Users

After running the seeders, two users are available. Authentication is done by typing a username in the auth modal in the UI — no password is required.

| Username | Role  | Permissions                                    |
| -------- | ----- | ---------------------------------------------- |
| `admin`  | ADMIN | Can soft-delete characters, all regular access |
| `user`   | USER  | Regular access (favorites, comments, browsing) |

Click the user avatar in the top-right corner of the header to open the login/register modal.

---

## Application URLs

| Service        | URL                                              |
| -------------- | ------------------------------------------------ |
| Frontend       | http://localhost:3000                            |
| GraphQL API    | http://localhost:4000/graphql                    |
| Health check   | http://localhost:4000/health                     |
| Apollo Sandbox | http://localhost:4000/graphql (development mode) |

---

## API Reference

The API is a GraphQL endpoint. All queries and mutations are sent to `http://localhost:4000/graphql` via `POST`. Apollo Sandbox is available at that same URL in development mode for interactive exploration.

### Queries

#### `characters` — list and filter characters

Returns all non-deleted characters. Supports optional filtering on any combination of fields.

```graphql
query GetCharacters($filters: CharacterFiltersInput) {
  characters(filters: $filters) {
    id
    externalId
    name
    status
    species
    gender
    image
    origin
    location
    deletedAt
    createdAt
    isFavorite(userId: 1)
    comments {
      id
      content
      userName
      createdAt
    }
  }
}
```

Example with filters:

```graphql
query {
  characters(filters: { status: Alive, species: "Human", gender: Male }) {
    id
    name
    status
    species
    gender
    image
    origin
  }
}
```

Available filter fields (`CharacterFiltersInput`):

| Field     | Type              | Description                                  |
| --------- | ----------------- | -------------------------------------------- |
| `name`    | `String`          | Partial name match                           |
| `status`  | `CharacterStatus` | `Alive`, `Dead`, or `unknown`                |
| `species` | `String`          | Exact species string                         |
| `gender`  | `CharacterGender` | `Female`, `Male`, `Genderless`, or `unknown` |
| `origin`  | `String`          | Partial origin match                         |

#### `character` — single character by ID

```graphql
query GetCharacter($id: Int!) {
  character(id: $id) {
    id
    name
    status
    species
    gender
    image
    origin
    location
    deletedAt
    isFavorite(userId: 1)
    comments {
      id
      content
      userId
      userName
      createdAt
    }
  }
}
```

Example:

```graphql
query {
  character(id: 1) {
    id
    name
    status
    species
    image
    origin
    isFavorite(userId: 2)
  }
}
```

#### `userById` — look up a user by ID

```graphql
query {
  userById(id: 1) {
    id
    name
    role
    createdAt
  }
}
```

#### `userByName` — look up a user by name (used by the auth modal)

```graphql
query {
  userByName(name: "admin") {
    id
    name
    role
  }
}
```

---

### Mutations

#### `softDeleteCharacter` — soft-delete a character (ADMIN only)

Sets `deletedAt` on the character. The character is excluded from all future queries. Returns a descriptive error if the user does not have the ADMIN role.

```graphql
mutation {
  softDeleteCharacter(id: 3, userId: 1)
}
```

#### `toggleFavorite` — add or remove a favorite for a user

If the character is already a favorite for the given user it is removed; otherwise it is added. Returns `added: true` when added, `added: false` when removed.

```graphql
mutation {
  toggleFavorite(characterId: 5, userId: 2) {
    added
  }
}
```

#### `addComment` — add a comment to a character

`userId` is optional. When provided, the comment is linked to the user and `userName` is populated automatically.

```graphql
mutation {
  addComment(
    characterId: 1
    content: "One of my favourite characters!"
    userId: 2
  ) {
    id
    content
    userId
    userName
    createdAt
  }
}
```

Anonymous comment (no `userId`):

```graphql
mutation {
  addComment(characterId: 1, content: "Anonymous comment") {
    id
    content
    userName
    createdAt
  }
}
```

#### `createUser` — register a new user

```graphql
mutation {
  createUser(name: "newuser", role: USER) {
    id
    name
    role
    createdAt
  }
}
```

---

## Frontend Features

- Character grid with card layout showing name, image, and species
- Filter bar: name (text search), status, species, gender, and origin
- Sort by name A-Z / Z-A
- Character detail page with full info, favorites toggle, and comments section
- Favorites per user (each user maintains an independent list)
- Comments linked to the logged-in user, with username displayed
- Soft-delete button visible only to ADMIN users
- User auth modal (click the avatar in the header) — login or register by username only
- Error modal that catches and displays exact backend error messages (e.g., permission denied)
- Fully responsive layout using CSS Flexbox and CSS Grid via TailwindCSS

---

## Database Schema

An ERD diagram is available at `/docs/erd.png`.

### `characters`

| Column        | Type                                            | Constraints            |
| ------------- | ----------------------------------------------- | ---------------------- |
| `id`          | INTEGER                                         | PK, auto-increment     |
| `external_id` | INTEGER                                         | NOT NULL, UNIQUE       |
| `name`        | VARCHAR                                         | NOT NULL               |
| `status`      | ENUM(`Alive`, `Dead`, `unknown`)                | NOT NULL               |
| `species`     | VARCHAR                                         | NOT NULL               |
| `gender`      | ENUM(`Female`, `Male`, `Genderless`, `unknown`) | NOT NULL               |
| `image`       | VARCHAR                                         | NOT NULL               |
| `origin`      | VARCHAR                                         | NOT NULL               |
| `location`    | VARCHAR                                         | NOT NULL               |
| `deleted_at`  | TIMESTAMP                                       | nullable (soft-delete) |
| `created_at`  | TIMESTAMP                                       | NOT NULL               |
| `updated_at`  | TIMESTAMP                                       | NOT NULL               |

### `comments`

| Column         | Type      | Constraints                           |
| -------------- | --------- | ------------------------------------- |
| `id`           | INTEGER   | PK, auto-increment                    |
| `character_id` | INTEGER   | NOT NULL, FK → characters(id) CASCADE |
| `user_id`      | INTEGER   | nullable, FK → users(id) SET NULL     |
| `content`      | TEXT      | NOT NULL                              |
| `deleted_at`   | TIMESTAMP | nullable                              |
| `created_at`   | TIMESTAMP | NOT NULL                              |
| `updated_at`   | TIMESTAMP | NOT NULL                              |

### `favorites`

| Column         | Type      | Constraints                           |
| -------------- | --------- | ------------------------------------- |
| `id`           | INTEGER   | PK, auto-increment                    |
| `character_id` | INTEGER   | NOT NULL, FK → characters(id) CASCADE |
| `user_id`      | INTEGER   | NOT NULL, FK → users(id) CASCADE      |
| `created_at`   | TIMESTAMP | NOT NULL                              |
| `updated_at`   | TIMESTAMP | NOT NULL                              |

Unique constraint on `(character_id, user_id)` — a user cannot favorite the same character twice, but can have multiple favorites across different characters.

### `users`

| Column       | Type                  | Constraints              |
| ------------ | --------------------- | ------------------------ |
| `id`         | INTEGER               | PK, auto-increment       |
| `name`       | VARCHAR               | NOT NULL                 |
| `role`       | ENUM(`ADMIN`, `USER`) | NOT NULL, default `USER` |
| `created_at` | TIMESTAMP             | NOT NULL                 |
| `updated_at` | TIMESTAMP             | NOT NULL                 |

---

## Running Tests

```bash
# Backend tests only
npm run test --workspace=backend

# Frontend tests only
npm run test --workspace=frontend

# All tests from root
npm run test
```

---

## Background Jobs

A cron job runs every 12 hours to fetch updated character data from the public Rick and Morty API and sync any changes to the local PostgreSQL database. It runs automatically when the backend starts in any environment. Progress and any errors are logged to the console.

---

## Project Structure

```
RickAndMorty-Blossom/
├── backend/
│   └── src/
│       ├── __tests__/        # Jest unit tests
│       ├── cache/            # CacheService (Redis Cache-Aside)
│       ├── config/           # DB and Redis configuration
│       ├── decorators/       # @MeasureTime method decorator
│       ├── interfaces/       # Repository interfaces
│       ├── jobs/             # Cron job for character sync
│       ├── middlewares/      # Request logger middleware
│       ├── migrations/       # Sequelize migrations
│       ├── models/           # Sequelize models
│       ├── repositories/     # Repository implementations
│       ├── resolvers/        # GraphQL resolvers
│       ├── schema/           # .graphql schema files
│       ├── seeders/          # Initial data seeders
│       ├── services/         # Business logic services
│       └── types/            # TypeScript type definitions
├── frontend/
│   └── src/
│       ├── apollo/           # Apollo Client setup
│       ├── components/       # Reusable UI components
│       ├── context/          # React context providers
│       ├── graphql/          # Apollo queries and mutations
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Route-level page components
│       ├── router/           # React Router configuration
│       └── types/            # TypeScript type definitions
├── docs/
│   └── erd.png               # Entity Relationship Diagram
├── docker-compose.yml
├── .env.example
└── package.json              # Monorepo root (npm workspaces)
```
