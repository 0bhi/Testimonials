import { verifyToken, getUserByEmail } from "../auth";
import { spaces, users } from "../db";
import { eq, and } from "drizzle-orm";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  space?: any;
}

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export const authenticateUser = async (
  request: Request,
  env: Env
): Promise<AuthenticatedUser | null> => {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the JWT token
    const payload = verifyToken(token, env.JWT_SECRET);
    if (!payload) {
      return null;
    }

    // Get user details from database
    const user = await getUserByEmail(payload.email, env);
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
};

// Middleware to check if user owns a specific space
export const authorizeSpaceOwner = async (
  request: Request,
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
