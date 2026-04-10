"use client";

import { Award, Clock3, ShieldCheck, Sparkles, Users2 } from "lucide-react";
import { teamMembers } from "@/data/demo";
import { useReports } from "@/components/providers/reports-provider";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function TeamPage() {
  const { reports } = useReports();

  const teamMetrics = teamMembers.map((member) => {
    const memberReports = reports.filter((report) => report.technicianId === member.id);
    const totalHours = memberReports.reduce((sum, report) => sum + report.durationHours, 0);
    const resolved = memberReports.filter((report) => report.status === "Resuelto" || report.status === "Cerrado").length;
    const billed = memberReports.reduce((sum, report) => sum + report.durationHours * report.hourlyRate, 0);

    return {
      ...member,
      totalHours,
      resolved,
      billed,
      reports: memberReports.length
    };
  });

  return (
    <div className="space-y-6">
      <Topbar
        title="Equipo tecnico"
        subtitle="Rendimiento, rentabilidad y visibilidad premium del trabajo del equipo"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Equipo activo</p>
          <p className="mt-3 text-3xl font-extrabold">{teamMembers.length}</p>
          <p className="mt-2 text-sm text-muted-foreground">Perfiles operativos y de supervision</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Horas registradas</p>
          <p className="mt-3 text-3xl font-extrabold">
            {teamMetrics.reduce((sum, member) => sum + member.totalHours, 0).toFixed(1)} h
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Carga consolidada del servicio</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Partes resueltos</p>
          <p className="mt-3 text-3xl font-extrabold">{teamMetrics.reduce((sum, member) => sum + member.resolved, 0)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Cierre real de intervenciones</p>
        </Card>
        <Card className="bg-gradient-to-br from-primary/12 via-card to-secondary/12">
          <p className="text-sm text-muted-foreground">Leaderboard</p>
          <p className="mt-3 text-2xl font-extrabold">
            {teamMetrics.sort((a, b) => b.totalHours - a.totalHours)[0]?.name ?? "-"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Mayor dedicacion en el periodo actual</p>
        </Card>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
          {teamMetrics.map((member) => (
            <Card key={member.id} className="relative overflow-hidden">
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-primary/10 blur-3xl" />
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-sm capitalize text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary">{member.reports} partes</Badge>
                <Badge className="bg-secondary/15 text-secondary-foreground">{member.totalHours.toFixed(1)} h</Badge>
                <Badge className="bg-muted text-muted-foreground">{member.resolved} cerrados</Badge>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Facturacion generada</span>
                  <span className="font-semibold">{member.billed.toFixed(0)} EUR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nivel de servicio</span>
                  <span className="font-semibold">{member.role === "admin" ? "Control" : "Premium"}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <p className="text-sm text-muted-foreground">Seguimiento de direccion</p>
          <h3 className="text-xl font-bold">Panel rapido para el jefe</h3>
          <div className="mt-6 space-y-4">
            {[
              {
                icon: Users2,
                title: "Asignacion de carga",
                text: "Visualiza que tecnico esta soportando mas clientes y donde conviene repartir mejor el trabajo."
              },
              {
                icon: Clock3,
                title: "Horas trazables",
                text: "Cada parte suma horas, categoria, cliente e importe para defender el valor del servicio."
              },
              {
                icon: Award,
                title: "Rendimiento visible",
                text: "Puedes detectar rapidamente quien cierra mas intervenciones y quien necesita apoyo."
              },
              {
                icon: ShieldCheck,
                title: "Control premium",
                text: "La supervison se apoya en partes firmados, facturas y detalle de actividad por empleado."
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
          <div className="mt-5 rounded-[24px] bg-primary/8 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Vista premium para responsable de equipo
            </div>
            <p className="mt-2">Diseñado para consultar rápidamente qué hace cada empleado y cuánto valor genera.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
