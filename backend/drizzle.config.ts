import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    // Use the SAME database as your Worker (`DATABASE_URL` in `.env` / `wrangler.toml`)
    connectionString: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
