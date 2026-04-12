const trimList = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export const appEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "WorkingParts",
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Ibersoft",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  defaultRole: (process.env.NEXT_PUBLIC_DEFAULT_ROLE ?? "technician") as "technician" | "supervisor" | "admin",
  adminEmails: trimList(process.env.WORKINGPARTS_ADMIN_EMAILS),
  supervisorEmails: trimList(process.env.WORKINGPARTS_SUPERVISOR_EMAILS)
};

export function isSupabaseConfigured() {
  return Boolean(appEnv.supabaseUrl && appEnv.supabaseAnonKey);
}

export function getSafeAppPath(nextPath?: string | null) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/app/dashboard";
  }

  if (nextPath.startsWith("//")) {
    return "/app/dashboard";
  }

  return nextPath;
}

export function getAuthCallbackUrl(nextPath = "/app/dashboard", origin?: string | null) {
  const baseUrl = (origin || appEnv.siteUrl).replace(/\/$/, "");
  return `${baseUrl}/auth/callback?next=${encodeURIComponent(getSafeAppPath(nextPath))}`;
}
