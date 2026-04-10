"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { Download, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { quickFilters } from "@/data/demo";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notification, Notifications } from "@/components/shared/notifications";

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "info",
    title: "Nuevo parte registrado",
    message: "Se ha registrado un nuevo parte para el cliente ABC Corp.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: "2",
    type: "warning",
    title: "Parte pendiente de revision",
    message: "El parte #123 requiere atencion inmediata.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: true
  }
];

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const deferredQuery = useDeferredValue(searchQuery);

  const quickSummary = useMemo(() => {
    if (!deferredQuery.trim()) {
      return "Todo listo para trabajar";
    }

    return `Filtro rapido: ${deferredQuery}`;
  }, [deferredQuery]);

  const handleSearch = (query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <header className="sticky top-3 z-20 space-y-4 rounded-[28px] border border-border/70 bg-card/75 p-4 shadow-soft backdrop-blur lg:top-6 lg:p-5">
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
          <Button variant="subtle">
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
            onChange={(event) => handleSearch(event.target.value)}
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <Button key={filter} variant="ghost" className="bg-background/55">
              {filter}
            </Button>
          ))}
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
