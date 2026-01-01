# Testimonials Backend

An Express.js backend for the Testimonials app using Drizzle ORM and NeonDB.

## Features

- User authentication with JWT tokens
- Credentials (email/password) authentication
- Space management
- Testimonial collection and management
- RESTful API endpoints

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_key
ALLOWED_ORIGIN=http://localhost:5173
PORT=3000
NODE_ENV=development
```

#### Generating JWT_SECRET

Generate a secure random string for your JWT_SECRET:

```bash
openssl rand -base64 32
```

#### Validate Environment Variables

Before starting the server, validate your environment configuration:

```bash
npm run validate-env
```

This will check all required variables and show a configuration summary.

**📖 For detailed environment setup instructions, see [ENVIRONMENT_SETUP.md](../ENVIRONMENT_SETUP.md)**

### 3. Database Setup

The database schema is already set up with the necessary tables. Make sure your NeonDB instance is running and accessible.

### 4. Development

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

### 5. Build and Production

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with email and password
- `POST /api/auth/signup` - Create a new account
- `GET /api/auth/session` - Get current session (requires Bearer token)

### Spaces
- `GET /space` - Get user's spaces (authenticated)
- `POST /space/create` - Create a new space (authenticated)
- `GET /space/:spaceName` - Get specific space with testimonials (authenticated)
- `GET /space/public/:spaceName` - Get public space data (no authentication required)
- `PATCH /space/:spaceName/template` - Update space template (authenticated)

### Testimonials
- `POST /space/:spaceName/testimonials` - Submit a testimonial (no authentication required)
- `DELETE /space/:spaceName/testimonials/:testimonialId` - Delete testimonial (authenticated)

## Authentication Flow

1. Users sign up or sign in with email/password
2. JWT tokens are generated and returned upon successful authentication
3. Protected routes require a valid Bearer token in the Authorization header
4. Tokens expire after 7 days

## Database Schema

The application uses the following tables:
- `users` - User accounts and authentication data
- `spaces` - User-created testimonial spaces
- `testimonials` - Submitted testimonials

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for session management
- CORS is properly configured
- Input validation is implemented
- SQL injection protection via Drizzle ORM
