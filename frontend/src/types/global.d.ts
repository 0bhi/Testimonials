// Global type declarations
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken(): Promise<string | null>;
      };
    };
  }

  interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    readonly VITE_FRONTEND_URL: string;
    readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
