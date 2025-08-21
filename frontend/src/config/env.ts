// Environment configuration
export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL,
  frontendUrl: import.meta.env.VITE_FRONTEND_URL,
} as const;

// Validate required environment variables
const requiredEnvVars = {
  VITE_BACKEND_URL: config.backendUrl,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default config;
