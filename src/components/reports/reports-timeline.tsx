"use client";

import { useMemo } from "react";
import { Clock3, FolderOpenDot, MapPinned } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { statusStyles } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ReportsTimeline() {
  const { reports } = useReports();

  const timeline = useMemo(() => {
    return [...reports]
      .sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`))
      .slice(0, 6);
  }, [reports]);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
      <div className="mb-5">
        <p className="text-sm text-muted-foreground">Timeline operativo</p>
        <h3 className="text-xl font-bold">Ultimas intervenciones</h3>
      </div>

      {timeline.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-border/70 bg-background/35 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <FolderOpenDot className="h-6 w-6" />
          </div>
          <h4 className="mt-4 text-lg font-semibold">Todavia no hay historico</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            Cuando empieces a registrar tickets aqui veras una linea temporal limpia para revisar actividad reciente.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {timeline.map((report) => (
            <div key={report.id} className="flex gap-4 rounded-[24px] border border-border/60 bg-background/40 p-4">
              <div className="relative mt-1">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <div className="absolute left-1/2 top-3 h-[calc(100%+1rem)] w-px -translate-x-1/2 bg-border/70 last:hidden" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{report.reason}</p>
                  <Badge className={statusStyles[report.status]}>{report.status}</Badge>
                  <Badge className="bg-primary/10 text-primary">{report.durationHours} h</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-4 w-4" />
                    {formatDate(report.date)} · {report.startTime} - {report.endTime}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPinned className="h-4 w-4" />
                    {report.client} · {report.technician}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
