"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ArrowRight, Building2, ClipboardList, FolderOpenDot, Sparkles, Users2 } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const RevenueChart = dynamic(
  () => import("@/components/dashboard/charts").then((module) => module.RevenueChart),
  {
    loading: () => <Card className="h-[390px] animate-pulse bg-muted/50" />,
    ssr: false
  }
);

const IncidentChart = dynamic(
  () => import("@/components/dashboard/charts").then((module) => module.IncidentChart),
  {
    loading: () => <Card className="h-[390px] animate-pulse bg-muted/50" />,
    ssr: false
  }
);

const ReportsTimeline = dynamic(
  () => import("@/components/reports/reports-timeline").then((module) => module.ReportsTimeline),
  {
    loading: () => <Card className="min-h-[320px] animate-pulse bg-muted/50" />,
    ssr: false
  }
);

export default function DashboardPage() {
  const { clients, reports, analytics, storageStrategy } = useReports();

  const dashboardKpis = useMemo(
    () => [
      {
        label: "Clientes",
        value: `${clients.length}`,
        change: clients.length === 0 ? "Empieza desde cero" : "Cartera activa",
        trend: "neutral" as const,
        helper: "Base de clientes actual"
      },
      {
        label: "Tickets",
        value: `${analytics.totalReports}`,
        change: analytics.pendingReports === 0 ? "Sin pendientes" : `${analytics.pendingReports} abiertos`,
        trend: analytics.pendingReports > 0 ? ("down" as const) : ("up" as const),
        helper: "Partes registrados en la sesion"
      },
      {
        label: "Horas",
        value: `${analytics.monthHours.toFixed(1)} h`,
        change: analytics.todayHours > 0 ? `${analytics.todayHours.toFixed(1)} h hoy` : "Sin actividad hoy",
        trend: "up" as const,
        helper: "Tiempo acumulado este mes"
      },
      {
        label: "Resolucion",
        value: `${analytics.resolvedReports}`,
        change: analytics.totalReports === 0 ? "Sin historico" : analytics.mostFrequentCategory,
        trend: "neutral" as const,
        helper: "Tickets cerrados o resueltos"
      }
    ],
    [analytics, clients.length]
  );

  if (reports.length === 0 && clients.length === 0) {
    return (
      <div className="space-y-6">
        <Topbar
          title="Dashboard ejecutivo"
          subtitle="Centro limpio para arrancar la operativa de Ibersoft desde cero"
        />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardKpis.map((item) => (
            <KpiCard key={item.label} item={item} />
          ))}
        </section>

        <Card className="overflow-hidden rounded-[34px] border border-border/70 bg-gradient-to-br from-primary/12 via-card to-secondary/10 p-6 lg:p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Entorno minimal listo
            </div>
            <h3 className="mt-4 text-3xl font-extrabold tracking-tight">La base ya esta preparada para crecer bien.</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              No hay datos demo en clientes ni en tickets. El portal arranca limpio para que construyas tu operativa real
              con una experiencia mas ordenada, elegante y rapida.
            </p>
          </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Card className="border-border/60 bg-background/70">
              <Building2 className="h-8 w-8 text-primary" />
              <h4 className="mt-4 text-lg font-semibold">1. Alta de clientes</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Registra manualmente tus primeras empresas con contacto, ciudad, sector y SLA.
              </p>
              <Button className="mt-5 w-full" asChild>
                <Link href="/app/clientes">Abrir clientes</Link>
              </Button>
            </Card>

            <Card className="border-border/60 bg-background/70">
              <ClipboardList className="h-8 w-8 text-primary" />
              <h4 className="mt-4 text-lg font-semibold">2. Crear primer ticket</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Usa el formulario minimalista para documentar trabajo tecnico, firma y factura PDF.
              </p>
              <Button className="mt-5 w-full" asChild>
                <Link href="/app/partes">Ir a tickets</Link>
              </Button>
            </Card>

            <Card className="border-border/60 bg-background/70">
              <Users2 className="h-8 w-8 text-primary" />
              <h4 className="mt-4 text-lg font-semibold">3. Supervisar actividad</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Cuando entre historico, este panel mostrara carga, patrones, horas y facturacion.
              </p>
              <Button className="mt-5 w-full" variant="outline" asChild>
                <Link href="/app/admin">Ver estructura</Link>
              </Button>
            </Card>
          </div>
        </Card>

        <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
          <Card>
            <p className="text-sm text-muted-foreground">Arquitectura de trabajo</p>
            <h3 className="text-xl font-bold">Que queda listo en este portal</h3>
            <div className="mt-5 grid gap-3">
              {[
                "Clientes manuales sin datos de ejemplo",
                "Tickets elegantes con plantillas, firma y exportacion PDF",
                "Historico visual y tablas filtrables",
                "Paneles para jefe, administracion y resumen mensual",
                "Base preparada para pasar a backend real cuando quieras"
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-muted/35 px-4 py-3 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Estado actual</p>
              <h3 className="text-xl font-bold">Sistema vacio y listo para produccion interna</h3>
            </div>
            <div className="mt-6 rounded-[28px] border border-dashed border-border/70 bg-background/35 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <FolderOpenDot className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                El historico empezara a poblarse en cuanto registres clientes y partes reales.
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Persistencia actual: {storageStrategy}
              </p>
              <Button className="mt-5" asChild>
                <Link href="/app/partes">
                  Empezar ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Topbar
        title="Dashboard ejecutivo"
        subtitle="Seguimiento operativo en tiempo real para tecnicos, supervision y direccion"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <RevenueChart data={analytics.monthlySummary} />
        <Card>
          <p className="text-sm text-muted-foreground">Estado operativo</p>
          <h3 className="text-xl font-bold">Resumen de carga actual</h3>
          <div className="mt-6 space-y-4">
            {[
              ["Horas hoy", `${analytics.todayHours.toFixed(1)} h`],
              ["Pendientes", `${analytics.pendingReports} partes`],
              ["Clientes", `${analytics.uniqueClients}`]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <IncidentChart data={analytics.incidentSummary.slice(0, 6)} />
        <ReportsTimeline />
      </section>
    </div>
  );
}
