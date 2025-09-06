# Todo Application (NestJS + Next.js)

Full‑stack task management application featuring JWT authentication, CRUD todos, filtering, testing, TypeORM with MySQL, and containerized dev/prod workflows.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
- [API (Backend)](#api-backend)
- [Environment Variables](#environment-variables)
- [Running (Without Docker)](#running-without-docker)
- [Docker (Development)](#docker-development)
- [Docker (Production Simulation)](#docker-production-simulation)
- [Migrations (Backend)](#migrations-backend)
- [Testing](#testing)
- [Lint & Format](#lint--format)
- [Security Notes](#security-notes)
- [Potential Improvements](#potential-improvements)
- [Troubleshooting](#troubleshooting)
- [Scripts Summary](#scripts-summary)

## Tech Stack
- Frontend: Next.js 15 (App Router, React 19, Tailwind CSS 4)  
- Backend: NestJS 11, TypeORM, MySQL 8, JWT Auth, Class‑Validator  
- Tooling: Docker / Compose, Jest, ESLint + Prettier, Migrations, Turbopack

## Features
### Authentication
- Register / Login / Me (`/auth/register`, `/auth/login`, `/auth/me`)
- JWT strategy via `Authorization: Bearer <token>`
- Password hashing (bcrypt)

### Todos
- Create / List / Get / Update / Delete
- Status workflow: PENDING → IN_PROGRESS → DONE
- Filtering on dashboard
- Inline editing and status controls

### Code Quality
- Unit + e2e tests (backend)  
- Component + interaction tests (frontend)  
- Centralized HTTP exception filter: [`HttpExceptionFilter`](backend/src/common/filters/http-exception.filter.ts)

## Project Structure
```
.
├── backend
│   ├── src
│   │   ├── app.module.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   └── todo
│   │   └── common/filters
│   └── migrations
├── frontend
│   ├── src/app (App Router pages)
│   ├── src/components
│   ├── src/contexts
│   └── src/lib
└── docker-compose*.yml
```

## Data Models
### User
(id uuid, username unique, email unique, password hashed, timestamps)

### Todo
(id uuid, title, description?, status enum[PENDING|IN_PROGRESS|DONE], timestamps)

## API (Backend)
Base URL: `http://localhost:3001`

| Method | Endpoint            | Body / Params                 | Response (200/201) |
|--------|---------------------|-------------------------------|--------------------|
| POST   | /auth/register      | { username, email, password } | { token, user }    |
| POST   | /auth/login         | { email, password }           | { token, user }    |
| GET    | /auth/me            | (JWT)                         | user               |
| GET    | /todos              | ?status=IN_PROGRESS           | Todo[]             |
| POST   | /todos              | { title, description? }       | Todo (201)         |
| GET    | /todos/:id          |                               | Todo               |
| PUT    | /todos/:id          | partial { title / desc / status } | Todo          |
| DELETE | /todos/:id          |                               | { status:true, message } (200) |

Authorization: All `/todos/*` & `/auth/me` require Bearer token.

## Environment Variables
See backend: [`backend/.env.example`](backend/.env.example) and frontend: [`frontend/.env.example`](frontend/.env.example)

Minimum:
```
# Backend
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=todo_user
DB_PASSWORD=todo_password
DB_NAME=todo_app
JWT_SECRET=replace-me
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Running (Without Docker)
1. Install
   ```
   npm run setup
   ```
2. Start backend (dev):
   ```
   cd backend
   npm run start:dev
   ```
3. Start frontend (dev):
   ```
   cd frontend
   npm run dev
   ```
4. Visit http://localhost:3000

Ensure MySQL running locally with matching credentials.

## Docker (Development)
Starts hot‑reload backend + frontend + MySQL:
```
npm run docker:dev
# or detached
npm run docker:dev:d
```
Stop:
```
npm run docker:dev:down
```

## Docker (Production Simulation)
```
npm run docker:build
npm run docker:up
```
Frontend: http://localhost:3000  
Backend: http://localhost:3001

## Migrations (Backend)
Generate (development only):
```
cd backend
npm run migration:generate src/migrations/NewMigration
```
Run (prod / when synchronize=false):
```
npm run migration:run
```
Revert:
```
npm run migration:revert
```

## Testing
### Backend
- Unit + e2e:
  ```
  cd backend
  npm test
  npm run test:cov
  ```
Coverage excludes migrations and `main.ts`.

### Frontend
- Component + interaction tests:
  ```
  cd frontend
  npm test
  ```

## Lint & Format
```
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
npm run format
```

## Security Notes
- Replace `JWT_SECRET` in production.
- Enable HTTPS and proper CORS origin whitelisting before deployment.
- Consider rate limiting and helmet (not yet included).

## Potential Improvements
- Add refresh tokens
- Pagination / search
- Optimistic UI updates with rollback
- Role-based authorization

## Troubleshooting
| Issue | Fix |
|-------|-----|
| Frontend 401 on /todos | Ensure token stored & `/auth/me` succeeds |
| DB refused connection | Check `DB_HOST` inside container (`mysql`) |
| Migration not running | Ensure `NODE_ENV=production` for automatic run or execute manually |
| Jest memory / slow | Run `--runInBand` for e2e isolation |

## Scripts Summary
Root convenience scripts in [`package.json`](package.json).  
Backend scripts in [`backend/package.json`](backend/package.json).  
Frontend scripts in [`frontend/package.json`](frontend/package.json).