import { createBrowserClient } from "@supabase/ssr";
import { appEnv, isSupabaseConfigured } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured() || !appEnv.supabaseUrl || !appEnv.supabaseAnonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(appEnv.supabaseUrl, appEnv.supabaseAnonKey);
  }

  return browserClient;
}
