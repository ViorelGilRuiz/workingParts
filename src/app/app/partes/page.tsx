"use client";

import dynamic from "next/dynamic";
import { Download, FileSpreadsheet, FileText, Sparkles, Timer } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { buildExcelWorkbook, buildPdfSummary } from "@/lib/exports";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ReportForm = dynamic(
  () => import("@/components/reports/report-form").then((module) => module.ReportForm),
  {
    loading: () => <Card className="min-h-[320px] animate-pulse" />
  }
);

const ReportsTimeline = dynamic(
  () => import("@/components/reports/reports-timeline").then((module) => module.ReportsTimeline),
  {
    loading: () => <Card className="min-h-[320px] animate-pulse" />
  }
);

const ReportTable = dynamic(
  () => import("@/components/reports/report-table").then((module) => module.ReportTable),
  {
    loading: () => <Card className="min-h-[420px] animate-pulse" />
  }
);

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { reports, analytics } = useReports();

  const exportExcel = async () => {
    const workbook = await buildExcelWorkbook(reports);
    const buffer = await workbook.xlsx.writeBuffer();
    downloadBlob(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }),
      "partes-tecnicos.xlsx"
    );
  };

  const exportPdf = async () => {
    const pdf = await buildPdfSummary(reports);
    const blob = pdf.output("blob");
    downloadBlob(blob, "resumen-partes.pdf");
  };

  return (
    <div className="space-y-6">
      <Topbar
        title="Partes de trabajo"
        subtitle="Registro diario, edición rápida, filtros y trazabilidad completa de intervenciones"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-primary/10 blur-3xl" />
          <p className="text-sm text-muted-foreground">Partes abiertos</p>
          <p className="mt-3 text-3xl font-extrabold">{analytics.pendingReports}</p>
          <p className="mt-2 text-sm text-muted-foreground">Pendientes o en seguimiento</p>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-secondary/10 blur-3xl" />
          <p className="text-sm text-muted-foreground">Horas del mes</p>
          <p className="mt-3 text-3xl font-extrabold">{analytics.monthHours.toFixed(1)} h</p>
          <p className="mt-2 text-sm text-muted-foreground">Dedicación total registrada</p>
        </Card>
        <Card className="relative overflow-hidden">
          <p className="text-sm text-muted-foreground">Categoría principal</p>
          <p className="mt-3 text-2xl font-extrabold">{analytics.mostFrequentCategory}</p>
          <p className="mt-2 text-sm text-muted-foreground">La más frecuente en la operación</p>
        </Card>
        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Exportación</p>
            <p className="mt-3 text-2xl font-extrabold">Informes listos</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportExcel}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" onClick={exportPdf}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </Card>
      </section>

      <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Experiencia de uso</p>
          <h3 className="text-xl font-bold">Panel pensado para cargar partes sin fricción</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            Flujo visual más limpio
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl bg-muted/60 px-4 py-2 text-sm">
            <Timer className="h-4 w-4 text-primary" />
            Registro rápido y claro
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <ReportForm />
        <ReportsTimeline />
      </div>

      <ReportTable />
    </div>
  );
}
