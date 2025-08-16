import express from "express";
import { PrismaClient } from "@prisma/client";
import { spaceRoutes } from "./routes/spaceRoutes";
import { clerkRoutes } from "./routes/clerkRoutes";
import cors from "cors";

// Validate required environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "CLERK_JWT_KEY",
  "CLERK_PUBLISHABLE_KEY",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;
app.use(cors({ origin: true }));
app.use(express.json());
app.use("/space", spaceRoutes);
app.use("/webhooks/clerk", clerkRoutes);
app.get("/", async (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    console.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
});
