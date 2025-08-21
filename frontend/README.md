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
VITE_BACKEND_URL=your_backend_url
VITE_FRONTEND_URL=your_frontend_url
```

### 3. Development

```bash
npm run dev
```

### 4. Build

```bash
npm run build
```

## Authentication

The frontend uses Better Auth for authentication with the following features:

- **Google OAuth**: Users can sign in with their Google account
- **Credentials**: Users can sign in with email and password
- **Session Management**: Automatic session handling and token refresh
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
