import { Request, Response, NextFunction } from "express";
import { verifyToken, getUserByEmail } from "../auth";
import { spaces } from "../db";
import { eq, and } from "drizzle-orm";
import { createDb } from "../db";
import { getEnv, getJwtSecret, getDatabaseUrl } from "../config/env";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Express middleware to authenticate user
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const jwtSecret = getJwtSecret();
    const env = getEnv();

    // Verify the JWT token
    const payload = verifyToken(token, jwtSecret);
    if (!payload) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await getUserByEmail(payload.email, env);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// Helper function to check if user owns a specific space
export const authorizeSpaceOwner = async (
  spaceName: string,
  userId: string
): Promise<any | null> => {
  try {
    const databaseUrl = getDatabaseUrl();
    const db = createDb(databaseUrl);

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
