import Link from "next/link";
import { ArrowRight, BarChart3, ClipboardList, ShieldCheck, Sparkles, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";

const featureCards = [
  {
    icon: ClipboardList,
    title: "Tickets impecables",
    text: "Formulario rapido, partes elegantes, PDF tipo factura y firma digital del cliente."
  },
  {
    icon: BarChart3,
    title: "Direccion con contexto",
    text: "Paneles ejecutivos, historico visual, resumen mensual y patrones de incidencias."
  },
  {
    icon: Users2,
    title: "Clientes bien organizados",
    text: "Base de clientes desde cero, sin datos demo, preparada para crecer contigo."
  },
  {
    icon: ShieldCheck,
    title: "Estructura para empresa",
    text: "Roles, flujo de trabajo claro y base preparada para conectar backend real mas adelante."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-[1480px] space-y-10">
        <header className="rounded-[36px] border border-border/60 bg-card/80 p-6 shadow-soft backdrop-blur lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                Portal minimalista para soporte IT
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl">
                Tickets, clientes y supervision con una interfaz premium y limpia.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Ibersoft Portal IT nace para que el tecnico trabaje rapido, el jefe lo controle todo con claridad y la
                facturacion salga lista con firma y estilo profesional.
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

            <Card className="grid gap-4 bg-gradient-to-br from-primary/10 via-card to-secondary/10">
              {[
                ["Base limpia", "Sin clientes ni tickets de ejemplo"],
                ["Menu grande", "Acceso claro a toda la operativa"],
                ["PDF premium", "Parte factura con firma digital"],
                ["Escalable", "Preparado para backend real"]
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-border/50 bg-background/60 p-4">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-2 text-xl font-extrabold">{value}</p>
                </div>
              ))}
            </Card>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-4">
          {featureCards.map((item) => (
            <Card key={item.title}>
              <item.icon className="h-10 w-10 text-primary" />
              <h2 className="mt-5 text-xl font-bold">{item.title}</h2>
              <p className="mt-3 text-muted-foreground">{item.text}</p>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Flujo de trabajo"
            title="Una operativa mas ordenada de principio a fin"
            description="Todo queda pensado para que el tecnico registre rapido, el cliente firme y la direccion consulte con contexto."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ["1. Crear clientes", "Alta manual sin datos de prueba para arrancar con una cartera real."],
              ["2. Registrar tickets", "Plantillas, tiempos, firma y exportacion PDF para cada parte."],
              ["3. Supervisar y facturar", "Historico, paneles y base premium para seguimiento y cobro."]
            ].map(([title, text]) => (
              <Card key={title}>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-3 text-muted-foreground">{text}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
