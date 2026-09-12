/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** Public Supabase project URL — safe to expose (see supabase/functions/portfolio-chat). */
	readonly VITE_SUPABASE_URL?: string;
	/** Public Supabase anon/publishable key — required to invoke the portfolio-chat Edge Function (verify_jwt = true). Never the service-role key. */
	readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
