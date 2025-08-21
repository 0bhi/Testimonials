import { handleRequest } from "./handlers";

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const requestOrigin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";
    const originToUse =
      allowedOrigin === "*"
        ? "*"
        : requestOrigin === allowedOrigin
        ? requestOrigin
        : "";

    const baseCorsHeaders: Record<string, string> = {
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      Vary: "Origin",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...(originToUse
            ? { "Access-Control-Allow-Origin": originToUse }
            : {}),
          ...baseCorsHeaders,
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    try {
      const response = await handleRequest(request, env);

      const corsHeaders: Record<string, string> = {
        ...(originToUse ? { "Access-Control-Allow-Origin": originToUse } : {}),
        ...baseCorsHeaders,
      };

      // Create new response with CORS headers
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          ...corsHeaders,
        },
      });

      return newResponse;
    } catch (error) {
      console.error("Error handling request:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...(originToUse
            ? { "Access-Control-Allow-Origin": originToUse }
            : {}),
          ...baseCorsHeaders,
        },
      });
    }
  },
};

interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  ALLOWED_ORIGIN?: string;
}
