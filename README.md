## Node.js (TypeScript) API — Credential Issuance
<img width="1919" height="1028" alt="image" src="https://github.com/user-attachments/assets/673bf487-7a5a-4632-bd82-dc13c574ed9c" />
<img width="716" height="321" alt="image" src="https://github.com/user-attachments/assets/e8152a11-1700-46f1-ac54-775720a7f053" />
<img width="801" height="572" alt="image" src="https://github.com/user-attachments/assets/bdf2c26e-eb1b-4eea-b866-f84cff8d20a6" />
<img width="897" height="882" alt="image" src="https://github.com/user-attachments/assets/605ee3f9-d89f-4207-a6a7-7e3fe8d5bad7" />

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
| `issued_at`        | INT           | NOT NULL (epoch)                 | Creation timestamp |
| `updated_at`       | INT           | NOT NULL (epoch)                 | Updation timestamp |
| `issued_status`    | STRING        | ENUM: `PENDING`, `SUBMITTED`, `PROCESSED` ,`DELETED`  | Assignment state |

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
