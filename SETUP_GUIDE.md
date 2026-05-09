# Equipment Lending Portal - Complete Setup Guide

> Full-Stack Application for School Equipment Management
> Built with Node.js, Express, MongoDB, and React

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [MongoDB Setup](#mongodb-setup)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Seed Data](#seed-data)
6. [Quick Demo](#quick-demo)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Docs](#docs)

---

## Project Structure

```
equipment-lending-portal/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── SETUP_GUIDE.md
├── API_DOCS.md
├── DB_SCHEMA.md
├── AI_USAGE_LOG_TEMPLATE.md
├── REFLECTION_OUTLINE.md
└── README.md
```

---

## MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition.
2. Start the service:
   ```bash
   mongod
   ```
3. Set the connection string in `backend/.env`:
   ```bash
   MONGODB_URI=mongodb://localhost:27017/equipment-lending-portal
   ```

### MongoDB Atlas
1. Create a cluster and database user.
2. Allow your IP address in Network Access.
3. Use your Atlas connection string in `backend/.env`:
   ```bash
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/equipment-lending-portal
   ```

---

## Backend Setup

1. Open a terminal in the workspace root.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create an env file:
   ```bash
   cp .env.example .env
   ```
4. Start the API:
   ```bash
   npm run dev
   ```

The API runs at `http://localhost:4000`.

---

## Frontend Setup

1. Open another terminal tab.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the UI:
   ```bash
   npm run dev
   ```

The UI runs at `http://localhost:5173`.

---

## Seed Data

Run the seed script to generate sample users, equipment, and borrow requests:

```bash
cd backend
npm run seed
```

Seeded accounts (password: `Password123!`):
- `admin@school.edu`
- `staff@school.edu`
- `student@school.edu`

---

## Quick Demo

1. Start MongoDB.
2. In one terminal:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run seed
   npm run dev
   ```
3. In another terminal:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Login with the seeded credentials and explore equipment and requests.

---

## API Endpoints

Base URL: `/api`

Swagger UI (local): `http://localhost:4000/api-docs`

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Equipment
- `GET /equipment`
- `GET /equipment/:id`
- `POST /equipment` (admin)
- `PUT /equipment/:id` (admin)
- `DELETE /equipment/:id` (admin)

### Borrow
- `POST /borrow`
- `GET /borrow/mine`
- `GET /borrow` (staff/admin)
- `POST /borrow/:id/approve` (staff/admin)
- `POST /borrow/:id/reject` (staff/admin)
- `POST /borrow/:id/return` (staff/admin)

---

## Database Schema

MongoDB is used for persistence. Update `MONGODB_URI` in `backend/.env`.

Collections:
- `users`: id, name, email, password_hash, role, created_at
- `equipment`: id, name, category, condition, quantity, available_quantity, created_at
- `borrow_requests`: id, user_id, equipment_id, start_date, end_date, status, approved_by, created_at
- `sessions`: token, user_id, expires_at, created_at

---

## Testing

There is no automated test suite yet.

Manual checks:
1. Sign up as an admin and create equipment items.
2. Sign up as a student and submit a borrow request.
3. Approve/reject as admin or staff.
4. Mark returned and verify availability updates.

---

## Deployment

Suggested approach:
- Host backend on Render/Railway/Fly.io.
- Use MongoDB Atlas or another managed MongoDB service.
- Host frontend on Vercel/Netlify.
- Update `VITE_API_URL` in `frontend/.env.local` to the deployed API base URL.

---

## Notes

- Auth is a simple server-stored token (UUID) for assignment scope.
- Roles supported: student, staff, admin.

---

## Docs

- API reference: [API_DOCS.md](API_DOCS.md)
- Data model: [DB_SCHEMA.md](DB_SCHEMA.md)
- AI usage log: [AI_USAGE_LOG_TEMPLATE.md](AI_USAGE_LOG_TEMPLATE.md)
- Reflection outline: [REFLECTION_OUTLINE.md](REFLECTION_OUTLINE.md)
