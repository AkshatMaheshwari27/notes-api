# Notes Management API

A REST API that allows authenticated users to create and manage personal notes, with role-based access control for admin users.

## Tech Stack
- Node.js + Express
- SQLite (better-sqlite3)
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd notes-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file in the root folder
```
PORT=3000
JWT_SECRET=mysecretkey123
```

### 4. Run the server
```bash
npm run dev
```

Server will start at `http://localhost:3000`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and get token |

### Notes (Requires Auth Token)
| Method | Endpoint | Description |
|---|---|---|
| POST | /notes | Create a note |
| GET | /notes | Get all your notes |
| GET | /notes/:id | Get a single note |
| PUT | /notes/:id | Update a note |
| DELETE | /notes/:id | Delete a note |

### Admin (Requires Admin Token)
| Method | Endpoint | Description |
|---|---|---|
| GET | /admin/notes | Get all notes from all users |
| DELETE | /admin/notes/:id | Delete any note |

## Example Requests

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "password123"}'
```

### Create a Note
```bash
curl -X POST http://localhost:3000/notes \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" \
-d '{"title": "My Note", "content": "Note content here"}'
```

## Roles
- **user** — can manage only their own notes
- **admin** — can view and delete all notes

## Notes
- Passwords are hashed using bcryptjs
- JWT tokens expire after 24 hours
- `.env` file is not included in the repository for security