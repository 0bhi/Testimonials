# Testimonials Frontend

A React-based frontend for the Testimonials app using Better Auth for authentication.

## Features

- User authentication with Better Auth
- Google OAuth integration
- Credentials (email/password) authentication
- Space management dashboard
- Testimonial collection forms
- Responsive design with Tailwind CSS

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_BACKEND_URL=http://localhost:3000
VITE_FRONTEND_URL=http://localhost:5173
```

**Notes:**
- The `.env` file is gitignored and should not be committed
- For production, set `VITE_BACKEND_URL` to your production API URL in your deployment platform
- Defaults to `http://localhost:3000` if not set (development only)
- Vite environment variables are embedded at build time, not runtime

**📖 For detailed environment setup instructions for both development and production, see [ENVIRONMENT_SETUP.md](../ENVIRONMENT_SETUP.md)**

### 3. Development

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

## Authentication

The frontend uses JWT-based authentication:

- **Credentials**: Users can sign in with email and password
- **Session Management**: JWT tokens stored in localStorage
- **Protected Routes**: Routes that require authentication are automatically protected

## Pages

- **Landing Page** (`/`): Public landing page with sign-in options
- **Dashboard** (`/dashboard`): User dashboard showing all spaces (protected)
- **Create Space** (`/create-space`): Form to create new testimonial spaces (protected)
- **Space Page** (`/space/:spaceName`): Manage specific space and view testimonials (protected)
- **Testimonial Form** (`/testimonial/:spaceName`): Public form for submitting testimonials
- **Embed Page** (`/embed/testimonials/:spaceName`): Embeddable testimonials display

## Components

- **Header**: Navigation and authentication status
- **ProtectedRoute**: Wrapper for routes requiring authentication
- **Layout**: Main layout wrapper
- **EmbedLayout**: Layout for embeddable pages

## API Integration

The frontend communicates with the backend API for:

- User authentication and session management
- Space creation and management
- Testimonial submission and retrieval
- User data management

## Styling

The application uses Tailwind CSS for styling with a dark theme focused on the slate color palette.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── components/     # Reusable React components
├── pages/         # Page components
├── services/      # API service functions
├── config/        # Configuration files
├── types/         # TypeScript type definitions
└── assets/        # Static assets
```
