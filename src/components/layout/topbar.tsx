"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Download, LogOut, Search, SlidersHorizontal, X } from "lucide-react";
import { quickFilters, roleMeta } from "@/lib/constants";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notification, Notifications } from "@/components/shared/notifications";
import { UserAvatar } from "@/components/shared/user-avatar";

const initialNotifications: Notification[] = [];

const quickFilterMap: Record<string, string> = {
  Hoy: "hoy",
  Semana: "esta semana",
  Pendientes: "pendiente",
  Facturable: "factura"
};

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPresetFilters, setShowPresetFilters] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const deferredQuery = useDeferredValue(searchQuery);

  const activeRole = user?.role ?? "technician";
  const roleInfo = roleMeta[activeRole];

  const quickSummary = useMemo(() => {
    if (!deferredQuery.trim()) {
      return subtitle ?? "";
    }

    return `Filtro - ${deferredQuery}`;
  }, [deferredQuery, subtitle]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExport = () => {
    if (pathname === "/app/partes") {
      window.dispatchEvent(new CustomEvent("portal:export-reports"));
      return;
    }

    router.push("/app/partes");
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-3 z-20 rounded-[32px] border border-border/70 bg-card/82 p-4 shadow-soft backdrop-blur lg:top-6 lg:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">{title}</h2>
            {quickSummary ? <p className="text-sm text-muted-foreground">{quickSummary}</p> : null}
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-12 rounded-2xl border-border/70 bg-background/72 pl-11 pr-10"
                placeholder="Buscar"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              {showPresetFilters
                ? quickFilters.map((filter) => (
                    <Button
                      key={filter}
                      type="button"
                      variant="ghost"
                      className="rounded-2xl bg-background/56 px-4"
                      onClick={() => setSearchQuery(quickFilterMap[filter] ?? filter.toLowerCase())}
                    >
                      {filter}
                    </Button>
                  ))
                : null}
              <Button variant="outline" size="icon" type="button" onClick={() => setShowPresetFilters((value) => !value)}>
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 xl:min-w-[360px]">
          <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-background/60 p-4">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${roleInfo.accent}`} />
            <div className="relative flex items-center gap-4">
              <UserAvatar
                name={user?.name}
                avatar={user?.avatar}
                avatarUrl={user?.avatarUrl}
                className="h-14 w-14 rounded-[20px] ring-1 ring-white/10"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold">{user?.name ?? "Sin usuario"}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${roleInfo.chip}`}>
                    {roleInfo.label}
                  </span>
                </div>
              </div>

              <Notifications notifications={notifications} onMarkAsRead={handleMarkAsRead} onDismiss={handleDismiss} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="subtle" type="button" onClick={handleExport} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/app/perfil">
                <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
                Perfil
              </Link>
            </Button>
            <Button variant="outline" type="button" onClick={handleLogout} className="flex-1">
              <LogOut className="mr-2 h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
