"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Download, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { quickFilters } from "@/lib/constants";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notification, Notifications } from "@/components/shared/notifications";

const initialNotifications: Notification[] = [];

const quickFilterMap: Record<string, string> = {
  Hoy: "hoy",
  "Esta semana": "esta semana",
  Pendientes: "pendiente",
  Facturable: "factura",
  Cliente: "cliente"
};

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPresetFilters, setShowPresetFilters] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const deferredQuery = useDeferredValue(searchQuery);

  const quickSummary = useMemo(() => {
    if (!deferredQuery.trim()) {
      return "Entorno limpio y listo para trabajar";
    }

    return `Filtro rapido: ${deferredQuery}`;
  }, [deferredQuery]);

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

  return (
    <header className="sticky top-3 z-20 space-y-4 rounded-[30px] border border-border/70 bg-card/78 p-4 shadow-soft backdrop-blur lg:top-6 lg:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {quickSummary}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-border/70 bg-background/55 px-4 py-2 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Sesion</p>
            <p className="text-sm font-semibold">{user?.name ?? "Sin usuario"}</p>
          </div>
          <Button variant="subtle" type="button" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Notifications notifications={notifications} onMarkAsRead={handleMarkAsRead} onDismiss={handleDismiss} />
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 rounded-2xl border-border/70 bg-background/75 pl-10 pr-10"
            placeholder="Buscar por cliente, incidencia, tecnico o etiqueta..."
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
                  className="bg-background/55"
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
    </header>
  );
}
