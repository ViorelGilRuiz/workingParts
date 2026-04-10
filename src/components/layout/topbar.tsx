"use client";

import { useState } from "react";
import { Bell, Download, Search, SlidersHorizontal } from "lucide-react";
import { quickFilters } from "@/data/demo";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notifications, Notification } from "@/components/shared/notifications";

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "Nuevo parte registrado",
      message: "Se ha registrado un nuevo parte para el cliente ABC Corp.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: "2",
      type: "warning",
      title: "Parte pendiente de revisión",
      message: "El parte #123 requiere atención inmediata.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Aquí se implementaría la lógica de búsqueda real
    console.log("Buscando:", query);
  };

  return (
    <header className="sticky top-3 z-20 space-y-4 rounded-[28px] border border-border/70 bg-card/75 p-4 shadow-soft backdrop-blur lg:top-6 lg:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-2xl border border-border/70 bg-background/55 px-4 py-2 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Sesión</p>
            <p className="text-sm font-semibold">{user?.name ?? "Sin usuario"}</p>
          </div>
          <Button variant="subtle">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Notifications
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onDismiss={handleDismiss}
          />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-12 rounded-2xl pl-10"
            placeholder="Buscar por cliente, incidencia, técnico o etiqueta..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
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
