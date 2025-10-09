## Node.js (TypeScript) API — Credential Issuance

## Architecture Overview

src/
├── config/                # Environment, database, and logger setup
├── controllers/           # Express route handlers
├── services/              # Business logic and DB interactions
├── models/                # Database schema and ORM models
├── routes/                # Express route definitions
├── middleware/            # Global error handlers and validation
├── utils/                 # Helper utilities (logger, constants, enums)
├── tests/                 # Jest test cases
└── index.ts               # Application entry point

### Tech Stack

- **Node.js + TypeScript**
- **Express.js**
- **PostgreSQL** (via `pg` / Prisma / TypeORM)
- **Winston** for logging
- **Zod** for environment validation
- **Jest** for unit testing
- **Docker or Podman** for containerization

---

## Database Design

### Table: `assignments`

| Column             | Type          | Constraints                      | Description |
|--------------------|---------------|----------------------------------|-------------|
| `id`               | UUID (PK)     | Primary Key                      | Unique ID for each assignment |
| `username`         | TEXT (UNIQUE) | NOT NULL                         | Assignment username |
| `issued_by`        | TEXT          | NOT NULL                         | Assigned by worker nth |
| `issued_at`        | BIGINT        | NOT NULL (epoch)                 | Creation timestamp |
| `updated_at`       | BIGINT        | NOT NULL (epoch)                 | Updation timestamp |
| `issued_status`    | STRING        | ENUM: `PENDING`, `SUBMITTED`, `COMPLETED`, `DELETED`  | Assignment state |

---

## Project Setup

### Prerequisites

- Node.js ≥ 18.x
- Docker or Podman
- PostgreSQL running locally or in a container

---

### Local Development

```bash
git clone https://github.com/your-username/assign-service.git
cd assign-service
pnpm install

cp .env.example .env

pnpm run dev
```

> Server will run at: **[http://localhost:3000](http://localhost:3000)**

---

### Prisma Migrations

- Make Migration
```bash
pnpx prisma migrate dev --name init
pnpx prisma generate
```
- Apply Migration
```
pnpx prisma migrate dev
```

> Server will run at: **[http://localhost:3000](http://localhost:3000)**

---

### Docker Deployment

```bash
docker build -t assign-service .
docker run -p 3000:3000 --env-file .env assign-service
```

## Global Exception Handling

- **`errorHandler` middleware** catches all runtime errors.
- Logs details via Winston.
- Returns consistent JSON:

  ```json
  { "error": "Database connection failed", "stack": "production" }
  ```

---

## Testing

```bash
npm run test
```

Tests are written using **Jest** and cover:

- API Testing
- Service logic
- Database interactions
