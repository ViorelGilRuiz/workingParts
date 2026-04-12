import Link from "next/link";
import { ArrowRight, ShieldCheck, Users2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const highlights = [
  {
    icon: Zap,
    title: "Operacion rapida",
    text: "Registro de partes, clientes y seguimiento con una interfaz ligera y estable."
  },
  {
    icon: Users2,
    title: "Trabajo compartido",
    text: "Base preparada para perfiles persistentes, actividad y colaboracion entre usuarios."
  },
  {
    icon: ShieldCheck,
    title: "Acceso seguro",
    text: "Login corporativo, sesiones controladas y base lista para crecer con Supabase."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1280px] space-y-8">
        <section className="rounded-[36px] border border-border/70 bg-card/88 p-6 shadow-soft lg:p-10">
          <div className="grid gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" />
                WorkingParts
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-foreground lg:text-6xl">
                  Gestion tecnica estable, clara y lista para empresa real.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Partes de trabajo, clientes, exportaciones y control operativo en una base mas seria y fiable.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/login">
                    Entrar en la aplicacion
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/app/dashboard">Abrir dashboard</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {highlights.map((item) => (
                <Card key={item.title} className="border-border/60 bg-background/55">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
