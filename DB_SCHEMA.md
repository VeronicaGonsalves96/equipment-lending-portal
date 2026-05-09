# Equipment Lending Portal - Database Schema

MongoDB collections modeled via Mongoose.

## ER diagram

```mermaid
erDiagram
  USERS ||--o{ BORROW_REQUESTS : requests
  EQUIPMENT ||--o{ BORROW_REQUESTS : booked_for
  USERS ||--o{ SESSIONS : has

  USERS {
    ObjectId _id
    string name
    string email
    string password_hash
    string role
    date created_at
  }

  EQUIPMENT {
    ObjectId _id
    string name
    string category
    string condition
    number quantity
    number available_quantity
    date created_at
  }

  BORROW_REQUESTS {
    ObjectId _id
    ObjectId user_id
    ObjectId equipment_id
    date start_date
    date end_date
    string status
    ObjectId approved_by
    date created_at
  }

  SESSIONS {
    ObjectId _id
    string token
    ObjectId user_id
    date expires_at
    date created_at
  }
```

## Notes
- `users.email` and `sessions.token` are unique.
- `borrow_requests.status` is one of: `pending`, `approved`, `rejected`, `returned`.