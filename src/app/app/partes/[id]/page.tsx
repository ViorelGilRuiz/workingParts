"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Clock3, Paperclip, ShieldCheck } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { statusStyles } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const { getReportById, hydrated } = useReports();
  const report = getReportById(params.id);

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <Topbar title="Cargando parte..." subtitle="Recuperando la intervención seleccionada" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <Topbar title="Parte no encontrado" subtitle="No hemos localizado ese identificador en el entorno actual" />
        <Card className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Puede que el parte pertenezca a otra sesión del navegador o que haya sido eliminado de la demo local.
          </p>
          <Button asChild>
            <Link href="/app/partes">Volver al listado</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Topbar title={`Parte ${report.id}`} subtitle="Detalle operativo, solución aplicada y seguimiento" />

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted-foreground">Duración total</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Clock3 className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold">{report.durationHours} h</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Adjuntos</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Paperclip className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold">{report.attachments}</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Validación</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-lg font-extrabold">{report.hasSignature ? "Firma registrada" : "Pendiente firma"}</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={statusStyles[report.status]}>{report.status}</Badge>
            <Badge className="bg-primary/10 text-primary">{report.category}</Badge>
            <Badge className="bg-secondary/15 text-secondary-foreground">{report.priority}</Badge>
            {report.tags.map((tag) => (
              <Badge key={tag} className="bg-muted text-muted-foreground">
                {tag}
              </Badge>
            ))}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Incidencia</p>
            <h2 className="text-2xl font-extrabold">{report.reason}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Trabajo realizado</p>
              <p className="mt-2">{report.workDone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Solución</p>
              <p className="mt-2">{report.solution}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Observaciones</p>
            <p className="mt-2">{report.observations || "Sin observaciones adicionales."}</p>
          </div>
        </Card>

        <Card className="space-y-4">
          {[
            ["Fecha", formatDate(report.date)],
            ["Técnico", report.technician],
            ["Cliente", report.client],
            ["Empresa", report.company],
            ["Contacto", report.contact],
            ["Tipo", report.type],
            ["Horario", `${report.startTime} - ${report.endTime}`],
            ["Duración", `${report.durationHours} h`],
            ["Adjuntos", `${report.attachments}`],
            ["Firma cliente", report.hasSignature ? "Disponible" : "No aplicada"]
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border-b border-border/60 pb-3 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}

          <Button className="w-full" variant="outline" asChild>
            <Link href="/app/partes">Volver al listado</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
