"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, LogOut, MoonStar, Sparkles, SunMedium } from "lucide-react";
import { navigation } from "@/lib/constants";
import { IBERSOFT_BRAND } from "@/lib/exports";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/components/providers/app-providers";
import { useAuth } from "@/components/providers/auth-provider";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useAppTheme();
  const { user, logout, isCloudAuthEnabled } = useAuth();

  useEffect(() => {
    const prefetchTargets = navigation.map((item) => item.href).filter((href) => href !== pathname).slice(0, 5);

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

  return (
    <aside className="glass-panel flex h-full flex-col rounded-[36px] border border-border/70 p-4 shadow-soft backdrop-blur lg:p-5">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 text-lg font-extrabold text-primary">
            IB
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Portal IT</p>
            <h1 className="text-xl font-extrabold">{IBERSOFT_BRAND.name}</h1>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>

      <div className="mb-6 overflow-hidden rounded-[30px] border border-border/60 bg-gradient-to-br from-primary/12 via-background/85 to-secondary/12 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Workspace</p>
            <p className="mt-2 text-lg font-bold">Centro de trabajo minimal</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Menu grande, limpio y preparado para tickets, clientes, facturas y supervision.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {isCloudAuthEnabled ? "Cloud auth" : "Modo local"}
            </div>
          </div>
          <div className="rounded-2xl bg-primary/10 p-2 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="mb-3 px-1">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Navegacion</p>
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
                  ? "border-primary/20 text-primary-foreground shadow-soft"
                  : "border-border/60 bg-background/35 text-muted-foreground hover:border-primary/25 hover:bg-muted/50 hover:text-foreground"
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
                <span className={cn("mt-1 block text-xs", isActive ? "text-primary-foreground/75" : "text-muted-foreground")}>
                  {item.description}
                </span>
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
        <div className="mb-4 flex items-center gap-3">
          <UserAvatar
            name={user?.name}
            avatar={user?.avatar}
            avatarUrl={user?.avatarUrl}
            className="h-12 w-12"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold">{user?.name ?? "Invitado"}</p>
            <p className="truncate text-sm capitalize text-muted-foreground">{user?.role ?? "Sin sesion"}</p>
          </div>
        </div>

        <Button className="w-full" variant="outline" onClick={logout} asChild>
          <Link href="/login">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesion
          </Link>
        </Button>
      </div>
    </aside>
  );
}
