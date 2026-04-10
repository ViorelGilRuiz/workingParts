import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { appEnv, isSupabaseConfigured } from "@/lib/env";

export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured() || !appEnv.supabaseUrl || !appEnv.supabaseAnonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(appEnv.supabaseUrl, appEnv.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options as CookieOptions);
        });
      }
    }
  });
}
