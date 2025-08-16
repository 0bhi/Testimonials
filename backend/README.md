# Backend Setup

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/testimonials_db"

# Clerk Configuration
CLERK_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"
CLERK_SECRET_KEY="sk_test_your_secret_key_here"
CLERK_JWT_KEY="your_jwt_key_here"

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Getting Clerk Keys

1. Go to your Clerk Dashboard
2. Navigate to API Keys section
3. Copy the Publishable Key and Secret Key
4. For JWT Key, go to JWT Templates and copy the signing key

## Installation

```bash
npm install
```

## Database Setup

```bash
npx prisma generate
npx prisma db push
```

## Running the Server

```bash
npm run dev
```

## Authentication Flow

The backend now implements proper authentication and authorization:

1. **Authentication Middleware**: Verifies Clerk JWT tokens
2. **Authorization Middleware**: Ensures users can only access their own spaces
3. **Protected Routes**: All space management routes require authentication
4. **Public Routes**: Testimonial submission and viewing are publicly accessible

## API Endpoints

### Protected Endpoints (Require Authentication)

- `POST /space/create` - Create a new space
- `GET /space` - Get all spaces for authenticated user
- `GET /space/:spaceName` - Get specific space (owner only)
- `DELETE /space/:spaceName/testimonials/:testimonialId` - Delete testimonial (owner only)

### Public Endpoints (No Authentication Required)

- `GET /space/public/:spaceName` - Get space data for testimonial pages
- `POST /space/:spaceName/testimonials` - Submit a testimonial
