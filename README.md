# 📚 Books Store API

A RESTful API for managing a bookstore, built with **Node.js**, **Express.js**, and **MongoDB**. The API supports user authentication, role-based access control, book browsing, purchasing, and full CRUD management for admins.

---

## ✨ Features

- **User Registration & Login** — Secure auth with hashed passwords (`bcrypt`) and JWT tokens.
- **Role-Based Access Control (RBAC)** — Two roles: `user` (default) and `admin`. Admin-only routes for creating, updating, and deleting books.
- **Book Browsing** — Any authenticated user can browse all available (unpurchased) books.
- **Book Purchase** — Authenticated users can purchase a book, which assigns them as the owner.
- **My Books** — Users can view all books they have purchased.
- **Admin Book Management** — Admins can create, update, and delete books.
- **Centralized Error Handling** — Clean, consistent error responses for duplicate emails, invalid IDs, and server errors.
- **Password Hashing Hook** — Passwords are automatically hashed before saving via a Mongoose `pre-save` hook.

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Node.js** | JavaScript runtime |
| **Express.js v5** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM (schema & model management) |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | JWT generation & verification |
| **dotenv** | Environment variable management |

---

## 📁 Project Structure

```
project/
├── books/
│   ├── books.controller.js  # Route handlers for all book operations
│   ├── books.model.js       # Mongoose schema/model for Book (name, price, owner)
│   └── books.router.js      # Express router for /books endpoints
├── middlewares/
│   ├── auth.middlewares.js  # JWT verification middleware (protects routes)
│   └── role.middlewares.js  # Role-based access control middleware (admin guard)
├── src/
│   └── index.js             # App entry point: server setup, DB connection, global middleware
├── users/
│   ├── users.controller.js  # Route handlers for register and login
│   ├── users.model.js       # Mongoose schema/model for User (name, email, password, role)
│   └── users.router.js      # Express router for /users endpoints
├── .env                     # Environment variables (not committed to Git)
├── .gitignore               # Ignores node_modules and .env
├── package.json             # Project scripts and dependencies
└── package-lock.json        # Dependency lock file
```

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A running [MongoDB](https://www.mongodb.com/) instance (local or Atlas)

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create the `.env` file** in the project root:
   ```env
   PORT_NUMBER=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

3. **Run the server:**

   - Development mode (auto-restarts on file changes):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

   The server will be running at `http://localhost:3000`.

---

## 🔐 Authentication

Protected routes require a **JWT Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

The token is returned upon a successful login (`POST /users/login`). It contains the user's `_id` and `role`, and **expires after 1 day**.

---

## 📡 API Endpoints

### 👤 Users — `/users` (Public)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/users/register` | Register a new user | `{ "name", "email", "password" }` |
| `POST` | `/users/login` | Login and receive a JWT | `{ "email", "password" }` |

---

### 📖 Books — `/books`

| Method | Endpoint | Description | Auth | Role |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/books/` | Get all available (unpurchased) books | Required | Any |
| `GET` | `/books/me` | Get all books owned by the logged-in user | Required | Any |
| `POST` | `/books/purchase/:id` | Purchase a book by ID | Required | Any |
| `POST` | `/books/` | Create a new book | Required | **Admin** |
| `PATCH` | `/books/:id` | Update a book's details by ID | Required | **Admin** |
| `DELETE` | `/books/:id` | Delete a book by ID | Required | **Admin** |

---

## 🗄️ Database Models

### User Model (`users` collection)

| Field | Type | Constraints |
| :--- | :--- | :--- |
| `name` | String | Required, min: 3, max: 100 chars |
| `email` | String | Required, Unique, must be a valid email format |
| `password` | String | Required, min: 6, max: 100 chars (stored **hashed**) |
| `role` | String | Enum: `["user", "admin"]`, Default: `"user"` |

> 🔒 Passwords are automatically hashed using `bcrypt` (12 salt rounds) via a `pre-save` Mongoose hook before they are stored in the database.

---

### Book Model (`books` collection)

| Field | Type | Constraints |
| :--- | :--- | :--- |
| `name` | String | Required, min: 3, max: 100 chars |
| `price` | Number | Required |
| `owner` | ObjectId | References the `User` model. Only present **after** the book is purchased. |

> A book is considered **available** when it has no `owner`. Once purchased, the buyer's `_id` is set as the `owner`.

---

## 🧱 Middleware

### `authMiddleware` (`middlewares/auth.middlewares.js`)
- Reads the `Authorization: Bearer <token>` header.
- Verifies the JWT using `JWT_SECRET`.
- On success, attaches the decoded payload (`{ _id, role }`) to `req.user` for downstream use.
- Returns `401 Unauthorized` if the token is missing or invalid.

### `roleMiddleware` (`middlewares/role.middlewares.js`)
- A factory function: `roleMiddleware("admin")`.
- Checks that `req.user.role` matches one of the allowed roles.
- Returns `403 Forbidden` if the user's role is not permitted.

---

## ⚠️ Error Handling

The global error handler in `src/index.js` catches and handles the following cases:

| Error | HTTP Status | Response |
| :--- | :--- | :--- |
| Duplicate email on register (`code: 11000`) | `400` | `{ "message": "Email already exists" }` |
| Invalid MongoDB ObjectId (`CastError`) | `400` | `{ "message": "Invalid ID" }` |
| Any other server error | `500` | `{ "message": "Internal Server Error" }` |

---

## 📄 License

ISC
