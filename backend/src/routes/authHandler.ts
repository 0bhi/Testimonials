import { Hono } from "hono";
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

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

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

export const authRoutes = new Hono<{ Bindings: Env }>();

// Sign in endpoint
authRoutes.post("/signin", async (c) => {
  try {
    const body = await c.req.json<SignInBody>();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const env = c.env;

    // Get user from database
    const user = await getUserByEmail(email, env);
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Verify password (you'll need to get the hashed password from the database)
    const db = createDb(env.DATABASE_URL);
    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (dbUser.length === 0 || !dbUser[0].password) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const isValidPassword = await verifyPassword(password, dbUser[0].password);
    if (!isValidPassword) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Generate JWT token
    const token = generateToken(user, env.JWT_SECRET);

    return c.json({
      user,
      token,
      message: "Sign in successful",
    });
  } catch (error) {
    console.error("Auth handler error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Sign up endpoint
authRoutes.post("/signup", async (c) => {
  try {
    const body = await c.req.json<SignUpBody>();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName) {
      return c.json(
        {
          error: "Email, password, and firstName are required",
        },
        400
      );
    }

    const env = c.env;

    // Check if user already exists
    const existingUser = await getUserByEmail(email, env);
    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
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

    return c.json(
      {
        user: newUser,
        token,
        message: "Sign up successful",
      },
      201
    );
  } catch (error) {
    console.error("Auth handler error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// Session endpoint
authRoutes.get("/session", async (c) => {
  try {
    const authHeader = c.req.header("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "No token provided" }, 401);
    }

    const token = authHeader.substring(7);
    const env = c.env;
    const payload = verifyToken(token, env.JWT_SECRET);

    if (!payload) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const user = await getUserByEmail(payload.email, env);
    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }

    return c.json({
      user,
      accessToken: token,
    });
  } catch (error) {
    console.error("Auth handler error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});
