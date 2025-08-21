# Testimonials Backend

A Cloudflare Workers backend for the Testimonials app using Drizzle ORM, NeonDB, and Better Auth.

## Features

- User authentication with Better Auth
- Google OAuth integration
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

Create a `.dev.vars` file in the backend directory with the following variables:

```env
DATABASE_URL=your_neon_database_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH_SECRET=your_auth_secret_key
```

#### Getting Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your domain to the authorized origins
6. Add your redirect URI: `https://your-domain.com/api/auth/callback/google`

#### Generating AUTH_SECRET

Generate a secure random string for your AUTH_SECRET:

```bash
openssl rand -base64 32
```

### 3. Database Setup

The database schema is already set up with the necessary tables. Make sure your NeonDB instance is running and accessible.

### 4. Development

```bash
npm run dev
```

### 5. Deployment

```bash
npm run deploy
```

## API Endpoints

### Authentication
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/callback/google` - Google OAuth callback

### Spaces
- `GET /space` - Get user's spaces (authenticated)
- `POST /space/create` - Create a new space (authenticated)
- `GET /space/:spaceName` - Get specific space (authenticated)
- `GET /space/public/:spaceName` - Get public space data

### Testimonials
- `POST /space/:spaceName/testimonials` - Submit a testimonial
- `DELETE /space/:spaceName/testimonials/:id` - Delete testimonial (authenticated)

## Authentication Flow

1. Users can sign in with Google OAuth or email/password
2. Better Auth handles session management with JWT tokens
3. Protected routes require valid session tokens
4. Session tokens are automatically refreshed

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
