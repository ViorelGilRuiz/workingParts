"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Clock3, Download, Eraser, FileSignature, Paperclip, ShieldCheck } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { buildReportInvoicePdf, IBERSOFT_BRAND } from "@/lib/exports";
import { statusStyles } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR"
  }).format(amount);
}

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const { getReportById, hydrated, updateReport } = useReports();
  const report = getReportById(params.id);
  const [signerName, setSignerName] = useState("");
  const [signatureMessage, setSignatureMessage] = useState("");

  useEffect(() => {
    if (!report) return;
    setSignerName(report.clientSignatureName || report.contact);
  }, [report]);

  useEffect(() => {
    if (!report || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#f8fafc";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#0f172a";
    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";

    if (report.clientSignatureDataUrl) {
      const image = new Image();
      image.onload = () => {
        context.fillStyle = "#f8fafc";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = report.clientSignatureDataUrl;
    }
  }, [report]);

  const totalAmount = useMemo(() => {
    if (!report) return 0;
    return report.durationHours * report.hourlyRate;
  }, [report]);

  const startDrawing = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    context.beginPath();
    context.moveTo(clientX - rect.left, clientY - rect.top);
    drawingRef.current = true;
  };

  const draw = (clientX: number, clientY: number) => {
    if (!drawingRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const rect = canvas.getBoundingClientRect();
    context.lineTo(clientX - rect.left, clientY - rect.top);
    context.stroke();
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.fillStyle = "#f8fafc";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setSignatureMessage("Firma limpiada.");
  };

  const saveSignature = () => {
    if (!report || !canvasRef.current) return;

    if (!signerName.trim()) {
      setSignatureMessage("Indica el nombre de quien firma.");
      return;
    }

    const dataUrl = canvasRef.current.toDataURL("image/png");
    updateReport(report.id, {
      hasSignature: true,
      clientSignatureName: signerName.trim(),
      clientSignatureDataUrl: dataUrl,
      signedAt: new Date().toISOString()
    });
    setSignatureMessage("Firma digital guardada correctamente.");
  };

  const exportInvoicePdf = async () => {
    if (!report) return;
    const pdf = await buildReportInvoicePdf(report);
    const blob = pdf.output("blob");
    downloadBlob(blob, `${report.id}-ibersoft-factura.pdf`);
  };

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <Topbar title="Cargando" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="space-y-6">
        <Topbar title="Parte no encontrado" />
        <Card className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Puede que el parte pertenezca a otra sesion del navegador o que haya sido eliminado de la demo local.
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
      <Topbar title={`Parte ${report.id}`} />

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Duracion total</p>
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
          <p className="text-sm text-muted-foreground">Validacion</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-lg font-extrabold">{report.hasSignature ? "Firma registrada" : "Pendiente firma"}</p>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Importe factura</p>
          <div className="mt-3 flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <FileSignature className="h-5 w-5" />
            </div>
            <p className="text-2xl font-extrabold">{formatCurrency(totalAmount)}</p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
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
              <p className="text-sm text-muted-foreground">Solucion</p>
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
            ["Empresa prestadora", IBERSOFT_BRAND.legalName],
            ["Fecha", formatDate(report.date)],
            ["Tecnico", report.technician],
            ["Cliente", report.client],
            ["Empresa", report.company],
            ["Contacto", report.contact],
            ["Tipo", report.type],
            ["Horario", `${report.startTime} - ${report.endTime}`],
            ["Tarifa hora", formatCurrency(report.hourlyRate)],
            ["Mantenimiento", report.maintenanceIncluded ? "Incluido" : "No incluido"],
            ["Total", formatCurrency(totalAmount)],
            ["Firma cliente", report.hasSignature ? "Disponible" : "No aplicada"]
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border-b border-border/60 pb-3 text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}

          <Button className="w-full" type="button" onClick={exportInvoicePdf}>
            <Download className="mr-2 h-4 w-4" />
            Exportar factura PDF
          </Button>
          <Button className="w-full" variant="outline" asChild>
            <Link href="/app/partes">Volver al listado</Link>
          </Button>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Conformidad del cliente</p>
            <h3 className="text-xl font-bold">Firma digital para validar el servicio</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              La firma se guarda en la demo local y se incorpora al PDF tipo factura de Ibersoft.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de quien firma</label>
            <Input value={signerName} onChange={(event) => setSignerName(event.target.value)} placeholder="Nombre del cliente o responsable" />
          </div>

          <div className="rounded-[28px] border border-dashed border-border/80 bg-slate-50 p-3 dark:bg-slate-950/40">
            <canvas
              ref={canvasRef}
              width={720}
              height={220}
              className="h-[220px] w-full rounded-[20px] bg-slate-50 touch-none dark:bg-slate-100"
              onPointerDown={(event) => startDrawing(event.clientX, event.clientY)}
              onPointerMove={(event) => draw(event.clientX, event.clientY)}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
            />
          </div>

          {signatureMessage ? <p className="text-sm text-primary">{signatureMessage}</p> : null}

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={saveSignature}>
              <FileSignature className="mr-2 h-4 w-4" />
              Guardar firma
            </Button>
            <Button type="button" variant="outline" onClick={clearSignature}>
              <Eraser className="mr-2 h-4 w-4" />
              Limpiar firma
            </Button>
            <Button type="button" variant="outline" onClick={exportInvoicePdf}>
              <Download className="mr-2 h-4 w-4" />
              PDF firmable
            </Button>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Resumen de facturacion</p>
            <h3 className="text-xl font-bold">Plantilla de cobro Ibersoft</h3>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-background/55 p-4">
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Servicio tecnico</span>
              <span>{report.durationHours.toFixed(1)} h</span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Tarifa</span>
              <span>{formatCurrency(report.hourlyRate)} / hora</span>
            </div>
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Salida de mantenimiento</span>
              <span>{report.maintenanceIncluded ? "Incluida" : "No incluida"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-4 text-base font-semibold">
              <span>Total factura</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="rounded-[24px] bg-primary/8 p-4 text-sm text-muted-foreground">
            El PDF incluye espacio de conformidad, nombre del firmante, fecha de firma y firma digital incrustada si ya
            ha sido registrada en esta pantalla.
          </div>
        </Card>
      </section>
    </div>
  );
}
