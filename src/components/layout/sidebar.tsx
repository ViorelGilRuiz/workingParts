"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut, MoonStar, Sparkles, SunMedium } from "lucide-react";
import { IBERSOFT_BRAND } from "@/lib/exports";
import { navigation, roleMeta } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/components/providers/app-providers";
import { useAuth } from "@/components/providers/auth-provider";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useAppTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    const prefetchTargets = navigation.map((item) => item.href).filter((href) => href !== pathname).slice(0, 6);

    const runPrefetch = () => {
      prefetchTargets.forEach((href) => router.prefetch(href));
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(runPrefetch, { timeout: 1500 });
      return () => idleWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = globalThis.setTimeout(runPrefetch, 300);
    return () => globalThis.clearTimeout(timeoutId);
  }, [pathname, router]);

  const currentRole = roleMeta[user?.role ?? "technician"];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="glass-panel flex h-full flex-col rounded-[36px] border border-border/70 p-4 shadow-soft backdrop-blur lg:p-5">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/app/dashboard" className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-gradient-to-br from-primary/22 via-primary/10 to-transparent text-lg font-extrabold text-primary">
            IB
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Portal IT</p>
            <h1 className="text-xl font-extrabold">{IBERSOFT_BRAND.name}</h1>
          </div>
        </Link>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>

      <div className="mb-5 overflow-hidden rounded-[30px] border border-border/60 bg-background/55 p-4">
        <div className={`pointer-events-none absolute`} />
        <div className="flex items-center gap-3">
          <UserAvatar
            name={user?.name}
            avatar={user?.avatar}
            avatarUrl={user?.avatarUrl}
            className="h-14 w-14 rounded-[20px] ring-1 ring-white/10"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{user?.name ?? "Invitado"}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${currentRole.chip}`}>
                {currentRole.label}
              </span>
                </div>
              </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="subtle" className="flex-1" asChild>
            <Link href="/app/perfil">Perfil</Link>
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>

      <nav className="flex gap-3 overflow-x-auto pb-2 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={cn(
                "group relative flex min-w-[250px] items-center gap-4 overflow-hidden rounded-[26px] border px-4 py-4 text-left transition lg:min-w-0 lg:w-full",
                isActive
                  ? "border-primary/18 text-primary-foreground shadow-soft"
                  : "border-border/60 bg-background/34 text-muted-foreground hover:border-primary/20 hover:bg-muted/45 hover:text-foreground"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-[26px] bg-primary"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              ) : null}

              <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-background/60 text-primary shadow-sm">
                <item.icon className="h-5 w-5" />
              </span>

              <span className="relative z-10 min-w-0 flex-1">
                <span className="block font-semibold">{item.label}</span>
              </span>

              <ChevronRight
                className={cn(
                  "relative z-10 h-4 w-4 transition-transform",
                  isActive ? "translate-x-0" : "translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                )}
              />
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[30px] border border-border/60 bg-background/55 p-4 lg:mt-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          WorkingParts
        </div>
      </div>
    </aside>
  );
}
