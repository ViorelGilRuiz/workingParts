import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AmbientTechScene } from "@/components/marketing/ambient-tech-scene";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { Button } from "@/components/ui/button";

const featurePills = ["tickets", "clientes", "firmas", "pdf", "seguimiento", "supervision"];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 lg:px-8 lg:py-8">
      <AmbientTechScene />
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-40" />

      <div className="relative mx-auto flex max-w-[1480px] flex-col gap-8">
        <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/78 p-6 shadow-soft backdrop-blur lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.10),transparent_18%)]" />

          <div className="relative grid gap-10 xl:grid-cols-[0.96fr_1.04fr] xl:items-center">
            <div className="max-w-3xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-200">
                <Sparkles className="h-4 w-4" />
                WorkingParts
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-extrabold tracking-[-0.065em] text-white lg:text-7xl xl:text-[5.6rem]">
                  Operacion IT con presencia, profundidad y control.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 lg:text-xl">
                  Partes, clientes, seguimiento y documentos premium en una interfaz viva y preparada para empresa real.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/login">
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/app/dashboard">Ver dashboard</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {featurePills.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <ProductShowcase />
          </div>
        </section>
      </div>
    </main>
  );
}
