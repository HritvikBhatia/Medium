# Blog Platform Clone

This is a full-stack, monorepo-style project that clones the core functionality of the blogging platform. It features a modern frontend built with React and Vite, a serverless backend powered by Cloudflare Workers and Hono, and a shared common module for type-safe validation between them.

## Features

  * **User Authentication:** Secure user signup and signin using JWTs.
  * **Blog Management:** Users can create, read, and publish new blog posts.
  * **Blog Feed:** A central page to browse all blog posts from all users.
  * **Read Post:** A dedicated, styled page for reading a single blog post.
  * **Interactions:** Users can "like" and "bookmark" posts.
  * **User Profile:** A personal profile page where users can see their own posts, as well as lists of posts they have liked and bookmarked.

## Tech Stack

  * **Frontend:**

      * React
      * Vite
      * TypeScript
      * Tailwind CSS (with `tailwindcss-animate`) for styling
      * React Router for navigation
      * Axios for API requests
      * Sonner for toast notifications
      * React Context API for global user state

  * **Backend:**

      * Cloudflare Workers (Serverless)
      * Hono (Web framework for serverless)
      * Prisma (ORM) with Accelerate for database connection pooling
      * PostgreSQL Database
      * `hono/jwt` for JWT-based authentication

  * **Common:**

      * Zod for schema definition and validation
      * Shared TypeScript types for a type-safe API

## Project Structure

The project is organized into three main directories:

```
/
├── backend/     # Cloudflare Worker API (Hono, Prisma)
├── common/      # Shared Zod schemas and types
└── frontend/    # React client (Vite, Tailwind)
```

## Getting Started

### Prerequisites

  * Node.js (v20+ recommended)
  * `npm`
  * A PostgreSQL database instance
  * Cloudflare account (for deployment and Prisma Accelerate)

### Backend Setup

1.  Navigate to the backend directory:

    ```sh
    cd backend
    ```

2.  Install dependencies:

    ```sh
    npm install
    ```

3.  Create a `.dev.vars` file in the `backend` directory for local development. You can copy the example:

    ```sh
    cp .env.example .dev.vars
    ```

4.  Edit `.dev.vars` and add your values:

      * `DATABASE_URL`: Your PostgreSQL connection string (it's recommended to use a connection pooler like Prisma Accelerate).
      * `JWT_SECRET`: A strong, random secret for signing tokens.

5.  Sync your database schema with Prisma:

    ```sh
    npx prisma db push
    ```

6.  Start the local development server:

    ```sh
    npm run dev
    ```

    The backend will be running, typically at `http://127.0.0.1:8787`.

### Frontend Setup

1.  Navigate to the frontend directory:

    ```sh
    cd frontend
    ```

2.  Install dependencies:

    ```sh
    npm install
    ```

3.  In `frontend/src/config.ts`, ensure the `BACKEND_URL` constant points to your running backend (e.g., `http://127.0.0.1:8787`).

4.  Start the local development server:

    ```sh
    npm run dev
    ```

    The frontend will be running,
    typically at `http://localhost:5173`.

## Available Scripts

### Backend (`/backend`)

  * `npm run dev`: Starts the local Wrangler development server.
  * `npm run deploy`: Deploys the worker to Cloudflare.
  * `npm run lint`: Lints the backend code using ESLint.
  * `npm run type-check`: Runs the TypeScript compiler to check for type errors.

### Frontend (`/frontend`)

  * `npm run dev`: Starts the local Vite development server.
  * `npm run build`: Builds the frontend for production.
  * `npm run lint`: Lints the frontend code using ESLint.
  * `npm run type-check`: Runs the TypeScript compiler to check for type errors.

## Continuous Integration

This project uses GitHub Actions for CI checks. The workflow in `.github/workflows/pr-checks.yml` automatically runs the following on every pull request to the `main` branch:

  * **Backend:** Installs dependencies, lints, and type-checks the code.
  * **Frontend:** Installs dependencies, lints, type-checks, and runs a production build.