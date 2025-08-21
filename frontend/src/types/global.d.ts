// Global type declarations
declare global {
  interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    readonly VITE_FRONTEND_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
