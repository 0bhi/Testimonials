import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { createDb } from "./db";
import { users } from "./db/schema";

export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Helper function to hash passwords
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

// Helper function to verify passwords
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (user: User, secret: string): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    secret,
    { expiresIn: "7d" }
  );
};

// Verify JWT token
export const verifyToken = (
  token: string,
  secret: string
): JWTPayload | null => {
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
};

// Get user by email
export const getUserByEmail = async (
  email: string,
  env: Env
): Promise<User | null> => {
  const db = createDb(env.DATABASE_URL);
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return {
    id: user[0].id,
    email: user[0].email,
    firstName: user[0].firstName,
    lastName: user[0].lastName || undefined,
  };
};

// Create new user
export const createUser = async (
  userData: {
    email: string;
    firstName: string;
    lastName?: string;
    password?: string;
    googleId?: string;
  },
  env: Env
): Promise<User> => {
  const db = createDb(env.DATABASE_URL);

  const newUser = await db
    .insert(users)
    .values({
      id: createId(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password
        ? await hashPassword(userData.password)
        : null,
      googleId: userData.googleId || null,
    })
    .returning();

  return {
    id: newUser[0].id,
    email: newUser[0].email,
    firstName: newUser[0].firstName,
    lastName: newUser[0].lastName || undefined,
  };
};
