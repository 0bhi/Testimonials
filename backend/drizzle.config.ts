import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      "postgresql://neondb_owner:hT3vBi4gGVao@ep-twilight-night-a53ao2l1-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
  verbose: true,
  strict: true,
});
