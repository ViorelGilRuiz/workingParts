import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardList, ShieldCheck, Sparkles } from "lucide-react";
import { clients, dashboardKpis } from "@/data/demo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";

export default function LandingPage() {
  return (
    <main className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1400px] space-y-10">
        <header className="rounded-[32px] border border-border/60 bg-card/80 p-6 shadow-soft backdrop-blur lg:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Portal profesional para soporte IT
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl">
                Gestión de partes técnicos con visión operativa y control empresarial.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Una plataforma pensada para registrar cada intervención, supervisar la carga del equipo y convertir el trabajo técnico diario en métricas útiles para dirección.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/login">
                    Entrar al portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Acceso seguro</Link>
                </Button>
              </div>
            </div>

            <Card className="w-full max-w-xl bg-gradient-to-br from-primary/10 via-card to-secondary/10">
              <div className="grid gap-4 sm:grid-cols-2">
                {dashboardKpis.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/50 bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-3 text-2xl font-extrabold">{item.value}</p>
                    <p className="mt-1 text-sm text-primary">{item.change}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: ClipboardList,
              title: "Partes impecables",
              text: "Formulario rápido, adjuntos, tiempos automáticos y trazabilidad completa por cliente."
            },
            {
              icon: BarChart3,
              title: "Dirección con contexto",
              text: "Dashboards ejecutivos, tendencias mensuales, incidencias recurrentes y ranking de carga."
            },
            {
              icon: ShieldCheck,
              title: "Preparado para empresa",
              text: "Roles, permisos, arquitectura escalable y base lista para integrarse con Supabase."
            }
          ].map((item) => (
            <Card key={item.title}>
              <item.icon className="h-10 w-10 text-primary" />
              <h2 className="mt-5 text-xl font-bold">{item.title}</h2>
              <p className="mt-3 text-muted-foreground">{item.text}</p>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Clientes activos"
            title="Historial y rentabilidad por cuenta"
            description="Cada cliente dispone de ficha operativa, tiempo acumulado, incidencias recurrentes y visión rápida del servicio prestado."
          />
          <div className="grid gap-4 lg:grid-cols-4">
            {clients.map((client) => (
              <Card key={client.id}>
                <p className="text-sm text-muted-foreground">{client.sector}</p>
                <h3 className="mt-1 text-xl font-bold">{client.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  {client.city} · SLA {client.sla}
                </p>
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Horas este mes</span>
                    <span className="font-semibold">{client.monthlyHours} h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Incidencias repetidas</span>
                    <span className="font-semibold">{client.recurringIssues}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
