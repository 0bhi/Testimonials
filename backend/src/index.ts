import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { authRoutes } from "./routes/authHandler";
import { spaceRoutes } from "./routes/spaceHandler";
import { getEnvConfig } from "./config/env";

// Validate environment variables on startup
const config = getEnvConfig();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware with validated config
app.use(
  cors({
    origin: config.server.allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length"],
    maxAge: 86400,
    credentials: true,
  })
);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

// Mount route handlers
app.use("/api/auth", authRoutes);
app.use("/space", spaceRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error handling request:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = config.server.port;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📦 Environment: ${config.server.nodeEnv}`);
  console.log(
    `🌐 Allowed origins: ${
      Array.isArray(config.server.allowedOrigin)
        ? config.server.allowedOrigin.join(", ")
        : config.server.allowedOrigin
    }`
  );
});

export default app;
