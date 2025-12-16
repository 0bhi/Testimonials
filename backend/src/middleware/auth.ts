import { Context, Next } from "hono";
import { verifyToken, getUserByEmail } from "../auth";
import { spaces } from "../db";
import { eq, and } from "drizzle-orm";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
}

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  ALLOWED_ORIGIN?: string;
}

// Hono middleware to authenticate user
export const authenticateUser = async (
  c: Context<{ Variables: { user: AuthenticatedUser } }>,
  next: Next
) => {
  try {
    const authHeader = c.req.header("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const env = c.env as Env;

    // Verify the JWT token
    const payload = verifyToken(token, env.JWT_SECRET);
    if (!payload) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user details from database
    const user = await getUserByEmail(payload.email, env);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Set user in context
    c.set("user", user);
    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json({ error: "Unauthorized" }, 401);
  }
};

// Helper function to check if user owns a specific space
export const authorizeSpaceOwner = async (
  spaceName: string,
  userId: string,
  env: Env
): Promise<any | null> => {
  try {
    const { createDb } = await import("../db");
    const db = createDb(env.DATABASE_URL);

    // Check if the space exists and belongs to the user
    const space = await db
      .select()
      .from(spaces)
      .where(and(eq(spaces.spaceName, spaceName), eq(spaces.userId, userId)))
      .limit(1);

    return space[0] || null;
  } catch (error) {
    console.error("Authorization error:", error);
    return null;
  }
};
