import { Router, Request, Response } from "express";
import {
  generateToken,
  verifyPassword,
  getUserByEmail,
  createUser,
  verifyToken,
} from "../auth";
import { createDb } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getEnv, getDatabaseUrl, getJwtSecret, getCachedConfig } from "../config/env";

interface SignInBody {
  email: string;
  password: string;
}

interface SignUpBody {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export const authRoutes = Router();

// Sign in endpoint
authRoutes.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as SignInBody;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const env = getEnv();

    // Get user from database
    const user = await getUserByEmail(email, env);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password (you'll need to get the hashed password from the database)
    const db = createDb(env.DATABASE_URL);
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (dbUser.length === 0 || !dbUser[0].password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await verifyPassword(password, dbUser[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user, env.JWT_SECRET);

    return res.json({
      user,
      token,
      message: "Sign in successful",
    });
  } catch (error) {
    console.error("Auth handler error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { errorMessage, errorStack });
    return res.status(500).json({
      error: "Internal server error",
      ...(getCachedConfig().server.nodeEnv === "development" && { details: errorMessage }),
    });
  }
});

// Sign up endpoint
authRoutes.post("/signup", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body as SignUpBody;

    if (!email || !password || !firstName) {
      return res.status(400).json({
        error: "Email, password, and firstName are required",
      });
    }

    const env = getEnv();

    // Check if user already exists
    const existingUser = await getUserByEmail(email, env);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create new user
    const newUser = await createUser(
      {
        email,
        firstName,
        lastName,
        password,
      },
      env
    );

    // Generate JWT token
    const token = generateToken(newUser, env.JWT_SECRET);

    return res.status(201).json({
      user: newUser,
      token,
      message: "Sign up successful",
    });
  } catch (error) {
    console.error("Auth handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Session endpoint
authRoutes.get("/session", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const jwtSecret = getJwtSecret();
    const env = getEnv();

    const payload = verifyToken(token, jwtSecret);

    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await getUserByEmail(payload.email, env);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.json({
      user,
      accessToken: token,
    });
  } catch (error) {
    console.error("Session handler error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { errorMessage, errorStack });
    return res.status(500).json({
      error: "Internal server error",
      ...(getCachedConfig().server.nodeEnv === "development" && { details: errorMessage }),
    });
  }
});
