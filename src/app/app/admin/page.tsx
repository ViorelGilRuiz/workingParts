"use client";

import { BriefcaseBusiness, Building2, FileText, Settings2, Users } from "lucide-react";
import { teamMembers } from "@/data/demo";
import { useReports } from "@/components/providers/reports-provider";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  const { clients, reports, storageStrategy } = useReports();
  const signedReports = reports.filter((report) => report.hasSignature).length;

  return (
    <div className="space-y-6">
      <Topbar title="Admin" />

      <section className="grid gap-4 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Clientes</p>
          <h3 className="mt-3 text-3xl font-extrabold">{clients.length}</h3>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Usuarios</p>
          <h3 className="mt-3 text-3xl font-extrabold">{teamMembers.length}</h3>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Firmados</p>
          <h3 className="mt-3 text-3xl font-extrabold">{signedReports}</h3>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Catalogos</p>
          <h3 className="mt-3 text-3xl font-extrabold">4</h3>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {[
          {
            icon: Building2,
            title: "Clientes y SLA",
            text: "Control centralizado de cuentas, acuerdos de servicio y rentabilidad por cliente."
          },
          {
            icon: Users,
            title: "Usuarios y permisos",
            text: "Separacion clara entre tecnicos, supervisores y administracion."
          },
          {
            icon: FileText,
            title: "Facturas y conformidad",
            text: "Partes exportables con firma del cliente y base de cobro por hora."
          },
          {
            icon: BriefcaseBusiness,
            title: "Plantillas",
            text: "Base preparada para incidencias tipicas, ticketing recurrente y automatizacion futura."
          }
        ].map((item) => (
          <Card key={item.title} className="relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>

      <Card>
        <h3 className="text-xl font-bold">Crecimiento</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Configuracion", "Tarifas por cliente, packs de mantenimiento y reglas de cobro."],
            ["Facturacion", "Agrupar partes por cliente y generar cierres mensuales."],
            ["Auditoria", "Historial de firmas, cambios de estado y acciones administrativas."],
            ["Automatizaciones", "Alertas SLA, tickets repetitivos y seguimiento preventivo."]
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl bg-muted/40 p-4">
              <p className="font-semibold">{title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <Settings2 className="h-4 w-4" />
          Storage {storageStrategy}
        </div>
      </Card>
    </div>
  );
}
