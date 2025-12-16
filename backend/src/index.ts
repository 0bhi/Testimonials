import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./routes/authHandler";
import { spaceRoutes } from "./routes/spaceHandler";

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  ALLOWED_ORIGIN?: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allowedOrigin = c.env.ALLOWED_ORIGIN || "*";
      if (allowedOrigin === "*") {
        return "*";
      }
      return origin === allowedOrigin ? origin : "";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
    credentials: true,
  })
);

// Health check route
app.get("/", (c) => {
  return c.text("Hello, world!");
});

// Mount route handlers
app.route("/api/auth", authRoutes);
app.route("/space", spaceRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error("Error handling request:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
