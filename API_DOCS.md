# Equipment Lending Portal - API Documentation

Base URL: `/api`

Auth header (required for protected routes):

```
Authorization: Bearer <token>
```

## Auth

### POST /auth/signup
Create a user.

Request:
```json
{
  "name": "Student User",
  "email": "student@school.edu",
  "password": "Password123!",
  "role": "student"
}
```

Response (201):
```json
{
  "user": {
    "id": "...",
    "name": "Student User",
    "email": "student@school.edu",
    "role": "student"
  }
}
```

### POST /auth/login
Request:
```json
{
  "email": "student@school.edu",
  "password": "Password123!"
}
```

Response (200):
```json
{
  "token": "...",
  "user": {
    "id": "...",
    "name": "Student User",
    "email": "student@school.edu",
    "role": "student"
  }
}
```

### POST /auth/logout
Clears the session token.

Response (200):
```json
{ "message": "Logged out" }
```

### GET /auth/me
Response (200):
```json
{ "user": { "id": "...", "name": "...", "email": "...", "role": "..." } }
```

## Equipment

### GET /equipment
Response (200):
```json
{
  "items": [
    {
      "id": "...",
      "name": "DSLR Camera Kit",
      "category": "Media",
      "condition": "Good",
      "quantity": 5,
      "available_quantity": 4
    }
  ]
}
```

### GET /equipment/:id
Response (200):
```json
{
  "item": {
    "id": "...",
    "name": "Microscope Set",
    "category": "Lab",
    "condition": "Excellent",
    "quantity": 3,
    "available_quantity": 3
  }
}
```

### POST /equipment (admin)
Request:
```json
{
  "name": "Tripod",
  "category": "Media",
  "condition": "Good",
  "quantity": 2
}
```

Response (201):
```json
{ "id": "..." }
```

### PUT /equipment/:id (admin)
Request:
```json
{
  "name": "Tripod",
  "category": "Media",
  "condition": "Excellent",
  "quantity": 3
}
```

Response (200):
```json
{ "message": "Equipment updated" }
```

### DELETE /equipment/:id (admin)
Response (200):
```json
{ "message": "Equipment deleted" }
```

## Borrow

### POST /borrow
Request:
```json
{
  "equipmentId": "...",
  "startDate": "2026-05-15",
  "endDate": "2026-05-17"
}
```

Response (201):
```json
{ "id": "..." }
```

### GET /borrow/mine
Response (200):
```json
{
  "requests": [
    {
      "id": "...",
      "equipment_id": "...",
      "equipment_name": "DSLR Camera Kit",
      "start_date": "2026-05-15",
      "end_date": "2026-05-17",
      "status": "pending"
    }
  ]
}
```

### GET /borrow (staff/admin)
Response (200):
```json
{
  "requests": [
    {
      "id": "...",
      "user_id": "...",
      "user_name": "Student User",
      "equipment_name": "Microscope Set",
      "start_date": "2026-05-15",
      "end_date": "2026-05-17",
      "status": "pending"
    }
  ]
}
```

### POST /borrow/:id/approve (staff/admin)
Response (200):
```json
{ "message": "Request approved" }
```

### POST /borrow/:id/reject (staff/admin)
Response (200):
```json
{ "message": "Request rejected" }
```

### POST /borrow/:id/return (staff/admin)
Response (200):
```json
{ "message": "Item returned" }
```

## Errors
Common responses:
- `400` Missing required fields
- `401` Missing/invalid token
- `403` Forbidden
- `404` Resource not found
- `409` Conflict (availability or duplicate email)