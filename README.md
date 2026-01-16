# Testimonials

<div align="center">

**Collect customer testimonials in minutes — no coding required.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![Drizzle](https://img.shields.io/badge/Drizzle_ORM-0.29-C5F74F?style=flat&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## ✨ Features

- **🚀 Quick Setup** — Create a testimonial space in seconds
- **📝 Custom Questions** — Define up to 3 custom questions for your customers
- **🎨 6 Beautiful Templates** — Modern, Classic, Minimal, Card Grid, Carousel, and Gradient
- **📋 Easy Embedding** — One line of code to embed on any website
- **🔒 Secure Authentication** — JWT-based authentication system
- **📱 Fully Responsive** — Works beautifully on all devices
- **⚡ Smooth Animations** — Powered by Framer Motion

---

## 🎨 Templates

| Template | Description |
|----------|-------------|
| **Modern** | Sleek, contemporary design with smooth animations |
| **Classic** | Timeless, elegant design for professional use |
| **Minimal** | Clean and simple, focusing on content |
| **Card Grid** | Beautiful card-based responsive layout |
| **Carousel** | Interactive cycling through testimonials |
| **Gradient** | Vibrant gradient design with dynamic colors |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **React Router** — Navigation

### Backend
- **Express.js** — Web framework
- **Drizzle ORM** — Database ORM
- **NeonDB** — PostgreSQL database
- **JWT** — Authentication
- **bcryptjs** — Password hashing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (NeonDB recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/testimonials.git
   cd testimonials
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**

   Create `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=your_neondb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```

   Create `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_FRONTEND_URL=http://localhost:5173
   ```

4. **Run database migrations**
   ```bash
   cd backend
   npm run db:push
   ```

5. **Start the development servers**
   ```bash
   # Backend (from backend directory)
   npm run dev

   # Frontend (from frontend directory)
   npm run dev
   ```

---

## 📦 Project Structure

```
testimonials/
├── backend/
│   ├── src/
│   │   ├── db/           # Database schema & connection
│   │   ├── routes/       # API route handlers
│   │   ├── middleware/   # Auth middleware
│   │   └── index.ts      # Server entry point
│   ├── drizzle/          # Database migrations
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── templates/    # Testimonial display templates
│   └── package.json
│
└── README.md
```

---

## 🔧 Available Scripts

### Backend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Run production server |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio |

### Frontend

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🌐 Embedding Testimonials

After creating a space and collecting testimonials, embed them on your website with a simple iframe:

```html
<iframe 
  src="https://your-domain.com/embed/your-space-name" 
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>
```

---

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">

**Built with ❤️ using React & Express**

</div>

