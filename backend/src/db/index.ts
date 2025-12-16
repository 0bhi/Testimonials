import { drizzle } from "drizzle-orm/neon-http";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import * as schema from "./schema";

// Create database connection function
export function createDb(databaseUrl: string) {
  const sql = neon(databaseUrl) as NeonQueryFunction<boolean, boolean>;
  return drizzle(sql, { schema });
}

// Export schema for convenience
export * from "./schema";
