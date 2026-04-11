"use client";

import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck, Users2, WalletCards } from "lucide-react";
import { teamMembers } from "@/data/demo";
import { useReports } from "@/components/providers/reports-provider";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { roleMeta } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

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
      <Topbar title="Equipo" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Equipo</p>
          <p className="mt-3 text-3xl font-extrabold">{teamMembers.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Horas</p>
          <p className="mt-3 text-3xl font-extrabold">
            {teamMetrics.reduce((sum, member) => sum + member.totalHours, 0).toFixed(1)} h
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Cierres</p>
          <p className="mt-3 text-3xl font-extrabold">{teamMetrics.reduce((sum, member) => sum + member.resolved, 0)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Facturacion</p>
          <p className="mt-3 text-3xl font-extrabold">
            {formatCurrency(teamMetrics.reduce((sum, member) => sum + member.billed, 0))}
          </p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {teamMetrics.map((member) => {
            const roleInfo = roleMeta[member.role];

            return (
              <Card key={member.id} className="relative overflow-hidden rounded-[32px] border border-border/70 bg-card/84 p-5">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${roleInfo.accent}`} />
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary/10 text-lg font-bold text-primary">
                      {member.avatar}
                    </div>
                    <div>
                      <Badge className={roleInfo.chip}>{roleInfo.label}</Badge>
                      <h3 className="mt-3 text-xl font-bold">{member.name}</h3>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-[22px] bg-background/55 p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Partes</p>
                      <p className="mt-2 text-lg font-bold">{member.reports}</p>
                    </div>
                    <div className="rounded-[22px] bg-background/55 p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Horas</p>
                      <p className="mt-2 text-lg font-bold">{member.totalHours.toFixed(1)}</p>
                    </div>
                    <div className="rounded-[22px] bg-background/55 p-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Cierres</p>
                      <p className="mt-2 text-lg font-bold">{member.resolved}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{formatCurrency(member.billed)}</p>
                    <Button variant="ghost" asChild>
                      <Link href="/app/perfil">
                        Ver perfil
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="rounded-[32px] border border-border/70 bg-card/84 p-6">
          <div className="grid gap-4">
            {[
              { icon: Users2, title: "Carga" },
              { icon: Clock3, title: "Tiempo" },
              { icon: WalletCards, title: "Facturacion" },
              { icon: ShieldCheck, title: "Control" }
            ].map((item) => (
              <div key={item.title} className="rounded-[24px] border border-border/60 bg-background/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
