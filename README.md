# Node.js Authentication API

A simple authentication API built with Node.js, Express, and MySQL.

## Features

- User registration with password hashing
- User login with password verification
- Input validation
- Error handling
- CORS support

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file in the root directory:**
   ```env
   # Server Configuration
   PORT=3000

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_DATABASE=auth_db
   DB_PORT=3306

   # Security
   NODE_ENV=development
   ```

3. **Create the MySQL database and users table:**
   ```sql
   CREATE DATABASE nodejs;
   USE nodejs;

   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "userId": 1
  }
  ```

### Login User
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

## Project Structure

```
nodejs/
├── server.js      # Main Express application
├── auth.js        # Authentication routes
├── db.js          # Database connection
├── package.json   # Dependencies and scripts
└── .env           # Environment variables (create this)
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- Input validation
- SQL injection prevention with parameterized queries
- CORS configuration
- Error handling without exposing sensitive information

## Dependencies

- `express`: Web framework
- `bcrypt`: Password hashing
- `mysql2`: MySQL database driver
- `dotenv`: Environment variable management
- `nodemon`: Development server (dev dependency) 