"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChevronRight, LogOut, MoonStar, Sparkles, SunMedium } from "lucide-react";
import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAppTheme } from "@/components/providers/app-providers";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

const summaryCards = [
  { label: "Hoy", value: "13.4h" },
  { label: "Partes", value: "28" },
  { label: "SLA", value: "96%" }
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useAppTheme();
  const { user, logout } = useAuth();

  return (
    <aside className="glass-panel flex h-full flex-col rounded-[32px] border border-border/70 p-4 shadow-soft backdrop-blur">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 text-base font-extrabold text-primary">
            PI
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Portal IT</p>
            <h1 className="text-xl font-extrabold">Working Parts</h1>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </Button>
      </div>

      <div className="mb-5 overflow-hidden rounded-[28px] border border-border/60 bg-gradient-to-br from-primary/12 via-background/80 to-secondary/12 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Workspace</p>
            <p className="mt-2 text-lg font-bold">Centro de control tecnico</p>
          </div>
          <div className="rounded-2xl bg-primary/10 p-2 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {summaryCards.map((item) => (
            <div key={item.label} className="rounded-2xl bg-background/70 px-2 py-3 shadow-sm">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-sm font-bold">{item.value}</p>
            </div>
          ))}
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
                "group relative flex min-w-fit items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-medium transition lg:w-full",
                isActive ? "text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-2xl bg-primary"
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              ) : null}

              <span className="relative z-10 flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>

              <ChevronRight
                className={cn(
                  "relative z-10 ml-auto h-4 w-4 transition-transform",
                  isActive ? "translate-x-0" : "translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                )}
              />
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-[28px] border border-border/60 bg-background/55 p-4 lg:mt-auto">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
            {user?.avatar ?? "PI"}
          </div>
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
