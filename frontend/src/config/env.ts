export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:3000",

  frontendUrl: import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173",
} as const;

export default config;
