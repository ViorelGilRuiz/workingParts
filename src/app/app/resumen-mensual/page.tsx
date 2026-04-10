"use client";

import { useReports } from "@/components/providers/reports-provider";
import { formatCurrency } from "@/lib/utils";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

export default function MonthlySummaryPage() {
  const { analytics } = useReports();
  const estimatedBilling = analytics.monthHours * 52;

  return (
    <div className="space-y-6">
      <Topbar
        title="Resumen mensual"
        subtitle="Vista ejecutiva para dirección: volumen, horas, facturación estimada y evolución"
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted-foreground">Rentabilidad estimada</p>
          <p className="mt-3 text-3xl font-extrabold">{formatCurrency(estimatedBilling)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Basado en coste/hora configurable por cliente</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Horas del mes</p>
          <p className="mt-3 text-3xl font-extrabold">{analytics.monthHours.toFixed(1)} h</p>
          <p className="mt-2 text-sm text-muted-foreground">Trabajo consolidado en el periodo actual</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Incidencias repetidas</p>
          <p className="mt-3 text-3xl font-extrabold">
            {analytics.clientSummaries.reduce((sum, client) => sum + client.repeatedIssues, 0)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Oportunidad directa de mejora preventiva</p>
        </Card>
      </div>

      <Card>
        <p className="text-sm text-muted-foreground">Detalle mensual</p>
        <h3 className="text-xl font-bold">Comparativa del histórico disponible</h3>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="pb-3">Mes</th>
                <th className="pb-3">Partes</th>
                <th className="pb-3">Horas</th>
                <th className="pb-3">Facturación</th>
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
        </div>
      </Card>
    </div>
  );
}
