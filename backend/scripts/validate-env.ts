#!/usr/bin/env tsx
/**
 * Environment Variables Validation Script
 *
 * This script validates that all required environment variables are set
 * before starting the application. Use this in CI/CD pipelines or before deployment.
 *
 * Usage:
 *   npm run validate-env
 *   or
 *   tsx scripts/validate-env.ts
 */

import "dotenv/config";
import { getConfig } from "../src/config/env";

try {
  const config = getConfig();
  console.log("✅ All environment variables are valid!");
  console.log("\n📋 Configuration Summary:");
  console.log(`   Database URL: ${config.database.url.substring(0, 30)}...`);
  console.log(`   JWT Secret: ${config.auth.jwtSecret.length} characters`);
  console.log(`   Port: ${config.server.port}`);
  console.log(`   Environment: ${config.server.nodeEnv}`);
  console.log(
    `   Allowed Origin(s): ${
      Array.isArray(config.server.allowedOrigin)
        ? config.server.allowedOrigin.join(", ")
        : config.server.allowedOrigin
    }`
  );
  console.log("\n🚀 Ready to start the server!");
  process.exit(0);
} catch (error) {
  console.error("\n❌ Environment validation failed:\n");
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error:", error);
  }
  console.error(
    "\n💡 Tip: Copy .env.example to .env and fill in the required values."
  );
  process.exit(1);
}
