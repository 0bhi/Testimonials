import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Singleton connection pool
let client: postgres.Sql | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;
let currentDatabaseUrl: string | null = null;

// Get or create database connection (singleton pattern with connection pooling)
export function createDb(databaseUrl: string) {
  // Reuse existing connection if available and URL matches
  if (client && dbInstance && currentDatabaseUrl === databaseUrl) {
    return dbInstance;
  }

  // Warn if trying to use a different URL (shouldn't happen in production)
  if (currentDatabaseUrl && currentDatabaseUrl !== databaseUrl) {
    console.warn(
      "Warning: createDb called with different database URL. Reusing existing connection."
    );
    return dbInstance!;
  }

  // Create new connection with pooling enabled
  currentDatabaseUrl = databaseUrl;
  client = postgres(databaseUrl, {
    max: 10, // Maximum number of connections in the pool
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout in seconds
  });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

// Export schema for convenience
export * from "./schema";
