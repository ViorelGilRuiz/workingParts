"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Clock3, FolderClock, Target, Zap } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const RevenueChart = dynamic(
  () => import("@/components/dashboard/charts").then((module) => module.RevenueChart),
  {
    loading: () => <Card className="h-[390px] animate-pulse" />
  }
);

const IncidentChart = dynamic(
  () => import("@/components/dashboard/charts").then((module) => module.IncidentChart),
  {
    loading: () => <Card className="h-[390px] animate-pulse" />
  }
);

const ReportsTimeline = dynamic(
  () => import("@/components/reports/reports-timeline").then((module) => module.ReportsTimeline),
  {
    loading: () => <Card className="min-h-[320px] animate-pulse" />
  }
);

export default function DashboardPage() {
  const { reports, analytics } = useReports();

  const dashboardKpis = [
    {
      label: "Horas esta semana",
      value: `${analytics.weekHours.toFixed(1)} h`,
      change: `${analytics.todayHours.toFixed(1)} h hoy`,
      trend: "up" as const,
      helper: "Carga real acumulada por el equipo"
    },
    {
      label: "Partes registrados",
      value: `${analytics.totalReports}`,
      change: `${analytics.pendingReports} abiertos`,
      trend: analytics.pendingReports > analytics.resolvedReports ? ("down" as const) : ("up" as const),
      helper: "Total consolidado en la sesión actual"
    },
    {
      label: "Clientes activos",
      value: `${analytics.uniqueClients}`,
      change: analytics.mostFrequentCategory,
      trend: "neutral" as const,
      helper: "Cuentas atendidas con histórico disponible"
    },
    {
      label: "Tiempo medio",
      value: `${analytics.averageResolutionHours.toFixed(1)} h`,
      change: `${analytics.resolvedReports} resueltos`,
      trend: "up" as const,
      helper: "Promedio por intervención registrada"
    }
  ];

  return (
    <div className="space-y-6">
      <Topbar
        title="Dashboard ejecutivo"
        subtitle="Seguimiento operativo en tiempo real para técnicos, supervisión y dirección"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Centro de control</p>
          <h3 className="text-xl font-bold">Visión operativa clara para técnicos y supervisión</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <Zap className="h-4 w-4" />
          Panel vivo con métricas derivadas
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <RevenueChart data={analytics.monthlySummary} />
        <Card>
          <p className="text-sm text-muted-foreground">Estado operativo</p>
          <h3 className="text-xl font-bold">Resumen de carga actual</h3>
          <div className="mt-6 space-y-4">
            {[
              { icon: Clock3, label: "Horas hoy", value: `${analytics.todayHours.toFixed(1)} h` },
              { icon: FolderClock, label: "Pendientes", value: `${analytics.pendingReports} partes` },
              {
                icon: Target,
                label: "Resolución",
                value: `${Math.round((analytics.resolvedReports / Math.max(analytics.totalReports, 1)) * 100)}%`
              }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4 rounded-2xl bg-muted/40 p-4">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <IncidentChart data={analytics.incidentSummary.slice(0, 6)} />
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Actividad reciente</p>
              <h3 className="text-xl font-bold">Últimos partes</h3>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="mt-6 space-y-4">
            {reports.slice(0, 4).map((report) => (
              <div key={report.id} className="rounded-2xl border border-border/60 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{report.reason}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {report.client} · {report.technician}
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary">{report.durationHours} h</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <p className="text-sm text-muted-foreground">Clientes recurrentes</p>
          <h3 className="text-xl font-bold">Mayor dedicación mensual</h3>
          <div className="mt-5 space-y-3">
            {analytics.clientSummaries.slice(0, 5).map((client) => (
              <div key={client.name} className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
                <div>
                  <p className="font-semibold">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.reports} partes registrados</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{client.hours} h</p>
                  <p className="text-sm text-muted-foreground">{client.repeatedIssues} repetidas</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-sm text-muted-foreground">Carga por técnico</p>
          <h3 className="text-xl font-bold">Distribución semanal</h3>
          <div className="mt-5 space-y-4">
            {analytics.topTechnicians.map((member) => {
              const width = Math.min(100, Math.round((member.hours / Math.max(analytics.weekHours || member.hours, 1)) * 100));
              return (
                <div key={member.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{member.name}</span>
                    <span>
                      {member.hours} h · {member.reports} partes
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <ReportsTimeline />
    </div>
  );
}
