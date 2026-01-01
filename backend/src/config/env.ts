/**
 * Environment configuration module
 * Validates and exports all environment variables with type safety
 */

interface Config {
  database: {
    url: string;
  };
  auth: {
    jwtSecret: string;
  };
  server: {
    port: number;
    allowedOrigin: string | string[];
    nodeEnv: "development" | "production" | "test";
  };
}

/**
 * Validates and returns environment configuration
 * Throws descriptive errors if required variables are missing
 */
export function getConfig(): Config {
  const nodeEnv = (process.env.NODE_ENV ||
    "development") as Config["server"]["nodeEnv"];

  // Database configuration
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "❌ Missing required environment variable: DATABASE_URL\n" +
        "   Please set DATABASE_URL in your .env file.\n" +
        "   Example: DATABASE_URL=postgresql://user:password@host:port/database"
    );
  }

  // Auth configuration
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error(
      "❌ Missing required environment variable: JWT_SECRET\n" +
        "   Please set JWT_SECRET in your .env file.\n" +
        "   Generate one with: openssl rand -base64 32"
    );
  }

  if (jwtSecret.length < 32) {
    console.warn(
      "⚠️  WARNING: JWT_SECRET should be at least 32 characters long for security."
    );
  }

  // CORS configuration
  const allowedOrigin = process.env.ALLOWED_ORIGIN;
  if (!allowedOrigin) {
    throw new Error(
      "❌ Missing required environment variable: ALLOWED_ORIGIN\n" +
        "   Please set ALLOWED_ORIGIN in your .env file.\n" +
        "   Development: ALLOWED_ORIGIN=http://localhost:5173\n" +
        "   Production: ALLOWED_ORIGIN=https://yourdomain.com\n" +
        "   Multiple origins: ALLOWED_ORIGIN=https://domain1.com,https://domain2.com"
    );
  }

  // Parse multiple origins if comma-separated
  const allowedOrigins = allowedOrigin.includes(",")
    ? allowedOrigin.split(",").map((origin) => origin.trim())
    : allowedOrigin;

  // Server port
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(
      `❌ Invalid PORT value: ${process.env.PORT}\n` +
        "   PORT must be a number between 1 and 65535"
    );
  }

  return {
    database: {
      url: databaseUrl,
    },
    auth: {
      jwtSecret,
    },
    server: {
      port,
      allowedOrigin: allowedOrigins,
      nodeEnv,
    },
  };
}

/**
 * Get environment-specific configuration
 */
export function getEnvConfig() {
  const config = getConfig();
  const isDevelopment = config.server.nodeEnv === "development";
  const isProduction = config.server.nodeEnv === "production";

  return {
    ...config,
    isDevelopment,
    isProduction,
  };
}

// Export a singleton config instance
let configInstance: Config | null = null;

/**
 * Get cached config instance (validates once on first call)
 */
export function getCachedConfig(): Config {
  if (!configInstance) {
    configInstance = getConfig();
  }
  return configInstance;
}

/**
 * Get environment variables in the format expected by auth.ts Env interface
 * This provides backward compatibility with existing code
 */
export function getEnv(): { DATABASE_URL: string; JWT_SECRET: string } {
  const config = getCachedConfig();
  return {
    DATABASE_URL: config.database.url,
    JWT_SECRET: config.auth.jwtSecret,
  };
}

/**
 * Get database URL directly
 */
export function getDatabaseUrl(): string {
  return getCachedConfig().database.url;
}

/**
 * Get JWT secret directly
 */
export function getJwtSecret(): string {
  return getCachedConfig().auth.jwtSecret;
}
