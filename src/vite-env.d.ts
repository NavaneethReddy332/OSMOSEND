/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_STORJ_ACCESS_KEY: string;
  readonly VITE_STORJ_SECRET_KEY: string;
  readonly VITE_STORJ_BUCKET: string;
  readonly VITE_STORJ_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
