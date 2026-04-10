import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { appEnv, isSupabaseConfigured } from "@/lib/env";

async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  if (!isSupabaseConfigured() || !appEnv.supabaseUrl || !appEnv.supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(appEnv.supabaseUrl, appEnv.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers
          }
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as CookieOptions);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/app") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/app/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/app/:path*", "/login"]
};
