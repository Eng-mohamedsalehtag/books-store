# Express Book Management API

This is a RESTful API built with **Express.js** and **MongoDB**, designed to manage users and books. It provides functionality for user authentication, viewing available books, purchasing books, and viewing the books a user has purchased.

## Features

*   **User Authentication**: Secure user registration and login using `bcrypt` for password hashing and `jsonwebtoken` for secure API access.
*   **Book Management**:
    *   View a list of all available (unpurchased) books.
    *   Purchase a specific book (assigns the book to the logged-in user).
    *   View a list of books purchased by the currently authenticated user.
*   **Error Handling**: Centralized error handling for clean, consistent responses (e.g., handling duplicate emails during registration, invalid IDs).

## Tech Stack

*   **Node.js** & **Express.js** (Web Framework)
*   **MongoDB** & **Mongoose** (Database & ODM)
*   **bcrypt** (Password Hashing)
*   **jsonwebtoken** (JWT for Authentication)
*   **dotenv** (Environment Variable Management)

## Project Structure

```
project/
├── books/
│   ├── books.controller.js  # Logic for handling book routes
│   ├── books.model.js       # Mongoose schema for Books
│   └── books.router.js      # Express routes for /books
├── middlewares/
│   └── auth.middlewares.js  # Middleware to protect routes via JWT verification
├── src/
│   └── index.js             # Entry point of the application, server setup
├── users/
│   ├── users.controller.js  # Logic for user registration and login
│   ├── users.model.js       # Mongoose schema for Users
│   └── users.router.js      # Express routes for /users
├── .env                     # Environment variables (ignored in Git)
├── package.json             # Project metadata and scripts
└── package-lock.json        # Dependency lock file
```

## Setup & Installation

1. **Clone the repository** (if applicable) and navigate to the project directory:
   ```bash
   cd project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT_NUMBER=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server**:
   *   For development (uses Node's native watch mode):
       ```bash
       npm run dev
       ```
   *   For production:
       ```bash
       npm start
       ```

The server will start on the port specified in your `.env` file (e.g., `http://localhost:3000`).

## API Endpoints

### Users (`/users`)

| Method | Endpoint    | Description | Body | Requires Auth |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | `{ "name": "...", "email": "...", "password": "..." }` | No |
| `POST` | `/login`    | Login user & receive JWT | `{ "email": "...", "password": "..." }` | No |

### Books (`/books`) - *All routes require Authentication*

You must pass the JWT token in the `Authorization` header as a Bearer token (`Bearer <your_token>`) to access these routes.

| Method | Endpoint | Description | Requires Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all available books (where `owner` does not exist) | Yes |
| `GET` | `/me` | Get all books purchased by the logged-in user | Yes |
| `POST` | `/purchase/:id` | Purchase a book by its ID (assigns current user as owner) | Yes |

## Database Models

### User Model
*   `name`: String
*   `email`: String (Unique)
*   `password`: String (Hashed)

### Book Model
*   *(Other book details depending on the model, e.g., title, author)*
*   `owner`: ObjectId (References the `User` model; exists only if the book has been purchased)

## License
ISC
