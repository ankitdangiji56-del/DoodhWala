/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_STORE_NAME?: string;
  readonly VITE_STORE_PHONE?: string;
  readonly VITE_STORE_EMAIL?: string;
  readonly VITE_WHATSAPP_SUPPORT_NUMBER?: string;
  readonly VITE_STORE_UPI_ID?: string;
  readonly VITE_STORE_UPI_PAYEE_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
