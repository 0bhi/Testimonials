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

export const handleAuth = async (request: Request, env: any) => {
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    // Sign in endpoint
    if (path === "/api/auth/signin" && request.method === "POST") {
      const body = (await request.json()) as SignInBody;
      const { email, password } = body;

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: "Email and password are required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Get user from database
      const user = await getUserByEmail(email, env);
      if (!user) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Verify password (you'll need to get the hashed password from the database)
      const db = createDb(env.DATABASE_URL);
      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (dbUser.length === 0 || !dbUser[0].password) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const isValidPassword = await verifyPassword(
        password,
        dbUser[0].password
      );
      if (!isValidPassword) {
        return new Response(JSON.stringify({ error: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Generate JWT token
      const token = generateToken(user, env.JWT_SECRET);

      return new Response(
        JSON.stringify({
          user,
          token,
          message: "Sign in successful",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Sign up endpoint
    if (path === "/api/auth/signup" && request.method === "POST") {
      const body = (await request.json()) as SignUpBody;
      const { email, password, firstName, lastName } = body;

      if (!email || !password || !firstName) {
        return new Response(
          JSON.stringify({
            error: "Email, password, and firstName are required",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Check if user already exists
      const existingUser = await getUserByEmail(email, env);
      if (existingUser) {
        return new Response(JSON.stringify({ error: "User already exists" }), {
          status: 409,
          headers: { "Content-Type": "application/json" },
        });
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

      return new Response(
        JSON.stringify({
          user: newUser,
          token,
          message: "Sign up successful",
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Session endpoint
    if (path === "/api/auth/session" && request.method === "GET") {
      const authHeader = request.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "No token provided" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const token = authHeader.substring(7);
      const payload = verifyToken(token, env.JWT_SECRET);

      if (!payload) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const user = await getUserByEmail(payload.email, env);
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          user,
          accessToken: token,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If no auth route matched, return 404
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Auth handler error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
