"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, MoonStar, SunMedium } from "lucide-react";
import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/components/providers/app-providers";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useAppTheme();
  const { user, logout } = useAuth();

  return (
    <aside className="glass-panel flex h-full flex-col rounded-[32px] border border-border/70 p-4 shadow-soft backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 text-base font-extrabold text-primary">
            PI
          </div>
          <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Portal IT</p>
          <h1 className="text-xl font-extrabold">Partes técnicos</h1>
        </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>

      <div className="mb-5 rounded-[26px] border border-border/60 bg-background/40 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Resumen</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-muted/55 px-2 py-3">
            <p className="text-xs text-muted-foreground">Hoy</p>
            <p className="mt-1 text-sm font-bold">13.4h</p>
          </div>
          <div className="rounded-2xl bg-muted/55 px-2 py-3">
            <p className="text-xs text-muted-foreground">Partes</p>
            <p className="mt-1 text-sm font-bold">28</p>
          </div>
          <div className="rounded-2xl bg-muted/55 px-2 py-3">
            <p className="text-xs text-muted-foreground">SLA</p>
            <p className="mt-1 text-sm font-bold">96%</p>
          </div>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={cn(
                "flex min-w-fit items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition lg:w-full",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-[26px] bg-gradient-to-br from-primary/15 via-transparent to-secondary/20 p-4 lg:mt-auto">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-sm font-bold">
          {user?.avatar ?? "PI"}
        </div>
        <p className="font-semibold">{user?.name ?? "Invitado"}</p>
        <p className="text-sm capitalize text-muted-foreground">{user?.role ?? "Sin sesión"}</p>
        <Button className="mt-4 w-full" variant="outline" onClick={logout} asChild>
          <Link href="/login">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Link>
        </Button>
      </div>
    </aside>
  );
}
