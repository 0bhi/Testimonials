import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    // Use the SAME database as your Worker (`DATABASE_URL` in `.env` / `wrangler.toml`)
    connectionString:
      "postgresql://neondb_owner:npg_ajGzV1wmdX7Y@ep-sweet-tree-a1so7or2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
  verbose: true,
  strict: true,
});
