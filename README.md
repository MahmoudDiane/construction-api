# Construction Site Management API

A RESTful API for managing construction site operations — projects, workers, equipment, materials, and daily production sheets.

Built with **Node.js**, **TypeScript**, **Express**, **Prisma**, and **PostgreSQL**.

## Features

- Full CRUD for projects, workers, equipment, and materials
- Daily sheet management with business rule enforcement:
  - Workers and equipment cannot be double-booked on the same date
  - Material allocation is validated against current stock
  - Stock is automatically decremented when a sheet is approved
  - Sheets follow a strict workflow: `DRAFT → SUBMITTED → APPROVED`
- 61 integration tests covering happy paths and error scenarios

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **ORM**: Prisma 7
- **Database**: PostgreSQL 18
- **Testing**: Jest + Supertest
- **Infrastructure**: Docker

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop

### Installation

```bash
git clone https://github.com/MahmoudDiane/construction-api
cd construction-api
npm install
```

### Environment setup

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/construction"
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<password>
POSTGRES_DB=construction
TEST_DATABASE_URL="postgresql://<user>:<password>@localhost:5432/construction_test"
```

### Start the database

```bash
docker compose up -d
```

### Run migrations

```bash
npx prisma migrate deploy
```

### Start the server

```bash
npm run dev
```

Server runs on `http://localhost:3000`.

### Health check

```bash
curl http://localhost:3000/health
```

## Running Tests

Create the test database first:

```bash
docker exec -it construction_db psql -U <user> -d construction -c "CREATE DATABASE construction_test;"
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/construction_test" npx prisma migrate deploy
```

Then run the test suite:

```bash
npm test
```

## API Endpoints

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /projects | List all projects |
| GET | /projects/:id | Get a project |
| POST | /projects | Create a project |
| PUT | /projects/:id | Update a project |
| DELETE | /projects/:id | Delete a project |

### Workers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /workers | List all workers |
| GET | /workers/:id | Get a worker |
| POST | /workers | Create a worker |
| PUT | /workers/:id | Update a worker |
| DELETE | /workers/:id | Delete a worker |

### Equipment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /equipment | List all equipment |
| GET | /equipment/:id | Get equipment |
| POST | /equipment | Create equipment |
| PUT | /equipment/:id | Update equipment |
| DELETE | /equipment/:id | Delete equipment |

### Materials
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /materials | List all materials |
| GET | /materials/:id | Get a material |
| POST | /materials | Create a material |
| PUT | /materials/:id | Update a material |
| DELETE | /materials/:id | Delete a material |

### Daily Sheets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /daily-sheets | List all sheets |
| GET | /daily-sheets/:id | Get a sheet |
| POST | /daily-sheets | Create a sheet |
| POST | /daily-sheets/:id/workers | Add a worker to a sheet |
| POST | /daily-sheets/:id/equipment | Add equipment to a sheet |
| POST | /daily-sheets/:id/materials | Add a material to a sheet |
| PATCH | /daily-sheets/:id/status | Update sheet status |
| DELETE | /daily-sheets/:id | Delete a sheet |