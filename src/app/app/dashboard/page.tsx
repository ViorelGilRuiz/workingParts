"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import { ArrowRight, Building2, ClipboardList, Sparkles, UserRound } from "lucide-react";
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
  const { clients, reports, analytics } = useReports();

  const dashboardKpis = useMemo(
    () => [
      {
        label: "Clientes",
        value: `${clients.length}`,
        change: clients.length === 0 ? "Nuevo" : "Activos",
        trend: "neutral" as const,
        helper: "Cartera"
      },
      {
        label: "Tickets",
        value: `${analytics.totalReports}`,
        change: analytics.pendingReports === 0 ? "Sin cola" : `${analytics.pendingReports} abiertos`,
        trend: analytics.pendingReports > 0 ? ("down" as const) : ("up" as const),
        helper: "Actividad"
      },
      {
        label: "Horas",
        value: `${analytics.monthHours.toFixed(1)} h`,
        change: analytics.todayHours > 0 ? `${analytics.todayHours.toFixed(1)} hoy` : "Sin hoy",
        trend: "up" as const,
        helper: "Mes"
      },
      {
        label: "Resolucion",
        value: `${analytics.resolvedReports}`,
        change: analytics.totalReports === 0 ? "Sin historico" : analytics.mostFrequentCategory,
        trend: "neutral" as const,
        helper: "Cierre"
      }
    ],
    [analytics, clients.length]
  );

  if (reports.length === 0 && clients.length === 0) {
    return (
      <div className="space-y-6">
        <Topbar title="Dashboard" subtitle="Centro de control" />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardKpis.map((item) => (
            <KpiCard key={item.label} item={item} />
          ))}
        </section>

        <Card className="relative overflow-hidden rounded-[36px] border border-border/70 bg-card/88 p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.10),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.08),transparent_22%)]" />
          <div className="relative space-y-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Base lista
              </div>
              <h3 className="text-4xl font-extrabold tracking-tight">Todo preparado para empezar.</h3>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <Card className="border-border/60 bg-background/65">
                <Building2 className="h-8 w-8 text-primary" />
                <h4 className="mt-5 text-xl font-bold">Clientes</h4>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/app/clientes">Abrir</Link>
                </Button>
              </Card>

              <Card className="border-border/60 bg-background/65">
                <ClipboardList className="h-8 w-8 text-primary" />
                <h4 className="mt-5 text-xl font-bold">Tickets</h4>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/app/partes">Abrir</Link>
                </Button>
              </Card>

              <Card className="border-border/60 bg-background/65">
                <UserRound className="h-8 w-8 text-primary" />
                <h4 className="mt-5 text-xl font-bold">Perfil</h4>
                <Button className="mt-6 w-full" variant="outline" asChild>
                  <Link href="/app/perfil">Abrir</Link>
                </Button>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Topbar title="Dashboard" subtitle="Vision operativa" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <RevenueChart data={analytics.monthlySummary} />
        <Card className="rounded-[30px] border border-border/70 bg-card/82">
          <div className="grid gap-3">
            {[
              ["Hoy", `${analytics.todayHours.toFixed(1)} h`],
              ["Pendientes", `${analytics.pendingReports}`],
              ["Clientes", `${analytics.uniqueClients}`]
            ].map(([label, value]) => (
              <div key={label} className="rounded-[24px] bg-background/55 p-4">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-2 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <IncidentChart data={analytics.incidentSummary.slice(0, 6)} />
        <ReportsTimeline />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { href: "/app/partes", label: "Tickets", icon: ClipboardList },
          { href: "/app/clientes", label: "Clientes", icon: Building2 },
          { href: "/app/perfil", label: "Perfil", icon: UserRound }
        ].map((item) => (
          <Card key={item.href} className="rounded-[30px] border border-border/70 bg-card/82">
            <item.icon className="h-8 w-8 text-primary" />
            <div className="mt-5 flex items-center justify-between">
              <h3 className="text-xl font-bold">{item.label}</h3>
              <Button variant="ghost" size="icon" asChild>
                <Link href={item.href}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
