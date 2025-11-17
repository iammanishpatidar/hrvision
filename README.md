# HRMS Backend

## Overview

This is the backend for the HRMS (Human Resource Management System) application. It is built using **AdonisJS** with **TypeScript**, and uses **TypeORM** for database interactions.

## Prerequisites

Before setting up the project, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Yarn](https://yarnpkg.com/) (optional, if using Yarn instead of npm)
- [PostgreSQL](https://www.postgresql.org/) (or any other supported database)

## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/Fibonacci-Innovative-Solutions/hrms-be.git
cd hrms-be
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Configure Environment Variables

Copy `docs/env.example` to `.env` and update the necessary values:

```sh
cp docs/env.example .env
```

Ensure you set up the database, email, Clerk, and branding details in the `.env` file.

### 4. Run Database Migrations

```sh
node ace migration:run
```

### 5. Start the Development Server

```sh
npm run dev
```

## Available Scripts

| Command                  | Description                                   |
| ------------------------ | --------------------------------------------- |
| `npm install`            | Installs project dependencies                 |
| `node ace migration:run` | Runs database migrations                      |
| `npm run dev`            | Starts the backend server in development mode |

## API Documentation

API documentation is available via Swagger UI. Once the server is running, visit:

```
http://localhost:3333/api/docs
```

You can also access the raw OpenAPI specification at:

```
http://localhost:3333/api/swagger.json
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Code Standards & Best Practices

To ensure maintainability, consistency, and quality in the HRMS backend, follow these best practices:

### Naming Conventions

1. Use camelCase for all variables, functions, and method names.
2. Use PascalCase for class names.
3. Keep function and variable names descriptive and meaningful.

### Layered Architecture

1. Controllers: Only handle request/response logic. Do not write business logic here.
2. Services: Contain all business logic. Controllers should call services.
3. Repositories: Handle database operations (queries, inserts, updates, deletes).
4. Middleware: Use for authentication, authorization, and request transformations.

### Error & Response Handling

1. Always use error handler and response handler to return consistent responses.
2. Use HTTP status codes:
   1. 200 → For all successful responses.
   2. 400 → For all types of errors, including validation, authentication, and business logic errors.
3. Provide clear and descriptive error and success messages.

### Request Validation

1. Use AdonisJS Validator to validate all incoming request payloads.
2. Return meaningful validation error messages.
3. Ensure validation is done before processing any request.

### Code Quality & Formatting

1. Use ESLint to enforce coding standards and catch potential issues.
2. Use Prettier to format code automatically.
3. Ensure no ESLint or Prettier issues before committing.

### Database Transactions

1. Use DB transactions when performing multiple insert, update, or delete operations across multiple tables.
2. Rollback transactions on failure to ensure data consistency.

### Git Workflow

1. Make a build before pushing to Git.
2. Follow feature-branch workflow: feature/your-feature-name
3. Ensure clean commits with meaningful commit messages.

### Performance & Security

1. Optimize queries using indexes and pagination where necessary.
2. Avoid exposing sensitive data in responses.
