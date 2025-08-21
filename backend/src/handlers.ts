import { spaceHandler } from "./routes/spaceHandler";
import { handleAuth } from "./routes/authHandler";

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Add CORS headers to all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    // Route requests based on path
    if (path.startsWith("/space")) {
      return await spaceHandler(request, path, env);
    } else if (path.startsWith("/api/auth")) {
      return await handleAuth(request, env);
    } else if (path === "/") {
      return new Response("Hello, world!", {
        status: 200,
        headers: corsHeaders,
      });
    } else {
      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  } catch (error) {
    console.error("Error in handleRequest:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}
