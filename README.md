# Store Rating Platform

A full-stack web application that allows users to browse stores and submit ratings, store owners to view their store's performance, and administrators to manage users and stores across the platform.

## 🚀 Tech Stack

### Frontend
- **React 19** (Scaffolded with Vite)
- **React Router DOM v7** for routing and navigation
- **Bootstrap 5 & React-Bootstrap** for responsive UI and styling
- **React Icons** for scalable vector icons

### Backend
- **Node.js & Express.js** for the REST API
- **Prisma ORM** for database interaction and schema management
- **JSON Web Tokens (JWT)** for secure, stateless authentication
- **Bcrypt.js** for password hashing

## ✨ Features

- **Role-Based Access Control (RBAC):**
  - **Admin:** Can view all users and stores, create new users, and create new stores (assigning them to owners).
  - **Owner:** Has a dedicated dashboard to view their assigned store, overall average rating, and a breakdown of which users left which ratings.
  - **User:** Can browse all stores, see average ratings, and submit or update their own 1-5 star ratings for any store.
- **Authentication & Security:** Secure login and registration with hashed passwords and protected API routes using JWT middleware.
- **Profile Management:** All authenticated users can securely update their passwords.

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A relational database supported by Prisma (e.g., PostgreSQL, MySQL, or SQLite)

## ⚙️ Environment Variables

You will need to create a `.env` file in the `backend` directory with the following variables:

```env
# backend/.env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_URL="postgresql://user:password@localhost:5432/store_db?schema=public"
```
*(Note: Adjust the `DATABASE_URL` according to your specific database provider and credentials).*

## 🚀 Installation and Setup

### 1. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Install the backend dependencies:

```bash
npm install
```

Initialize the database and generate the Prisma Client:

```bash
npx prisma db push
npx prisma generate
```

Start the backend development server:

```bash
npm run dev
```
The backend will run on `http://localhost:5000`.

### 2. Frontend Setup

Open a new, separate terminal and navigate to the frontend directory:

```bash
cd store
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```
The frontend will be accessible at `http://localhost:5173`.