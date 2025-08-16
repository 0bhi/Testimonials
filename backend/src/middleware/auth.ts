import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extend the Request interface to include user and space
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
      };
      space?: any;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the token with Clerk
    const payload = await verifyToken(token, {
      jwtKey: process.env.CLERK_JWT_KEY!,
      authorizedParties: [process.env.CLERK_PUBLISHABLE_KEY!],
    });

    if (!payload) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Extract user information from the token
    const user = {
      id: payload.sub as string,
      email: (payload.email as string) || "",
      firstName: (payload.first_name as string) || "",
      lastName: (payload.last_name as string) || undefined,
    };

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

// Middleware to check if user owns a specific space
export const authorizeSpaceOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { spaceName } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if the space exists and belongs to the user
    const space = await prisma.space.findFirst({
      where: {
        spaceName,
        userId,
      },
    });

    if (!space) {
      return res
        .status(403)
        .json({ error: "Access denied. Space not found or you don't own it." });
    }

    // Add space to request for use in subsequent middleware/routes
    req.space = space;
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(500).json({ error: "Authorization failed" });
  }
};
