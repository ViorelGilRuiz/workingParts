"use client";

import { FolderSearch2 } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function FrequentIncidentsPage() {
  const { reports, analytics } = useReports();

  return (
    <div className="space-y-6">
      <Topbar
        title="Incidencias frecuentes"
        subtitle="Deteccion de patrones, recurrencia por categoria y oportunidades de mejora preventiva"
      />

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="space-y-4">
          {analytics.incidentSummary.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-border/70 p-5 text-sm text-muted-foreground">
              Aun no hay categorias repetidas. Este panel se activara cuando empieces a registrar incidencias reales.
            </div>
          ) : (
            analytics.incidentSummary.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.value}</span>
                </div>
                <div className="h-3 rounded-full bg-muted">
                  <div className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${item.value * 8}%` }} />
                </div>
              </div>
            ))
          )}
        </Card>

        <Card>
          <p className="text-sm text-muted-foreground">Casos destacados</p>
          <h3 className="text-xl font-bold">Intervenciones con seguimiento</h3>
          <div className="mt-5 space-y-4">
            {reports.filter((report) => report.status !== "Resuelto" && report.status !== "Cerrado").length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-border/70 p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <FolderSearch2 className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  No hay incidencias activas en seguimiento. Cuando aparezcan tickets abiertos o repetitivos los tendras
                  resumidos aqui.
                </p>
              </div>
            ) : (
              reports
                .filter((report) => report.status !== "Resuelto" && report.status !== "Cerrado")
                .map((report) => (
                  <div key={report.id} className="rounded-2xl border border-border/60 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary/10 text-primary">{report.category}</Badge>
                      <Badge className="bg-secondary/15 text-secondary-foreground">{report.client}</Badge>
                    </div>
                    <p className="mt-3 font-semibold">{report.reason}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{report.observations || "Sin observaciones."}</p>
                  </div>
                ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
