"use client";

import { clients } from "@/data/demo";
import { useReports } from "@/components/providers/reports-provider";
import { formatDate } from "@/lib/utils";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

export default function ClientsPage() {
  const { reports, analytics } = useReports();

  return (
    <div className="space-y-6">
      <Topbar
        title="Área de clientes"
        subtitle="Historial, carga acumulada, incidencias repetidas y visión de servicio por cuenta"
      />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          {analytics.clientSummaries.map((summary) => {
            const client = clients.find((item) => item.id === summary.clientId || item.name === summary.name);
            return (
              <Card key={summary.name}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{client?.sector ?? "Servicios IT"}</p>
                    <h3 className="text-xl font-bold">{summary.name}</h3>
                    <p className="text-sm text-muted-foreground">{client?.contact ?? "Contacto no definido"}</p>
                  </div>
                  <div className="rounded-2xl bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                    {summary.hours} h
                  </div>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">Ciudad</p>
                    <p className="font-semibold">{client?.city ?? "-"}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">SLA</p>
                    <p className="font-semibold">{client?.sla ?? "-"}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">Partes</p>
                    <p className="font-semibold">{summary.reports}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">Recurrentes</p>
                    <p className="font-semibold">{summary.repeatedIssues}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <p className="text-sm text-muted-foreground">Historial reciente</p>
          <h3 className="text-xl font-bold">Últimos trabajos realizados</h3>
          <div className="mt-6 space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="rounded-2xl border border-border/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{report.client}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{report.reason}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(report.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{report.durationHours} h</p>
                    <p className="text-sm text-muted-foreground">{report.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
