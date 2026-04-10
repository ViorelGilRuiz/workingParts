"use client";

import { BarChart3, Receipt, ShieldCheck, TrendingUp } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { formatCurrency } from "@/lib/utils";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

export default function MonthlySummaryPage() {
  const { analytics, reports } = useReports();
  const estimatedBilling = reports.reduce((sum, report) => sum + report.durationHours * report.hourlyRate, 0);
  const signedCount = reports.filter((report) => report.hasSignature).length;

  return (
    <div className="space-y-6">
      <Topbar
        title="Resumen mensual"
        subtitle="Vista ejecutiva premium para direccion: volumen, horas, facturacion y validacion"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Facturacion estimada</p>
          <p className="mt-3 text-3xl font-extrabold">{formatCurrency(estimatedBilling)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Importe acumulado segun horas registradas</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Horas del mes</p>
          <p className="mt-3 text-3xl font-extrabold">{analytics.monthHours.toFixed(1)} h</p>
          <p className="mt-2 text-sm text-muted-foreground">Trabajo consolidado en el periodo actual</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Partes firmados</p>
          <p className="mt-3 text-3xl font-extrabold">{signedCount}</p>
          <p className="mt-2 text-sm text-muted-foreground">Listos para justificar servicio y cobro</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Repetitivas</p>
          <p className="mt-3 text-3xl font-extrabold">
            {analytics.clientSummaries.reduce((sum, client) => sum + client.repeatedIssues, 0)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Oportunidad directa de mejora preventiva</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <p className="text-sm text-muted-foreground">Detalle mensual</p>
          <h3 className="text-xl font-bold">Comparativa del historico disponible</h3>
          <div className="mt-6 overflow-x-auto">
            {analytics.monthlySummary.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-border/70 p-5 text-sm text-muted-foreground">
                Todavia no hay meses con actividad registrada. Cuando el equipo empiece a cargar tickets, aqui veras la
                evolucion de partes, horas y facturacion.
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="pb-3">Mes</th>
                    <th className="pb-3">Partes</th>
                    <th className="pb-3">Horas</th>
                    <th className="pb-3">Facturacion</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.monthlySummary.map((item) => (
                    <tr key={item.month} className="border-t border-border/60">
                      <td className="py-4 font-semibold">{item.month}</td>
                      <td className="py-4">{item.reports}</td>
                      <td className="py-4">{item.hours} h</td>
                      <td className="py-4">{formatCurrency(item.billable)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        <Card>
          <p className="text-sm text-muted-foreground">Lectura para gerencia</p>
          <h3 className="text-xl font-bold">Indicadores premium</h3>
          <div className="mt-6 space-y-4">
            {[
              {
                icon: TrendingUp,
                title: "Rentabilidad visible",
                text: "Cada hora registrada impacta directamente en la lectura de facturacion del mes."
              },
              {
                icon: Receipt,
                title: "Documentacion preparada",
                text: "Los partes firmados se convierten en base documental para justificar cada factura."
              },
              {
                icon: ShieldCheck,
                title: "Trazabilidad premium",
                text: "Direccion puede revisar lo que hace el tecnico y que cliente ha validado el servicio."
              },
              {
                icon: BarChart3,
                title: "Decision mas rapida",
                text: "La foto mensual deja claro donde hay mas carga, repeticion e ingreso."
              }
            ].map((item) => (
              <div key={item.title} className="rounded-[24px] border border-border/60 bg-background/45 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
