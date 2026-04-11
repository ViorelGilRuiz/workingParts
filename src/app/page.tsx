import Link from "next/link";
import { ArrowRight, Orbit, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

const featurePills = ["tickets", "clientes", "firmas", "pdf", "seguimiento"];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0 tech-depth-grid opacity-50" />
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-orb hero-orb-c" />
        <div className="tech-ring tech-ring-a" />
        <div className="tech-ring tech-ring-b" />
      </div>

      <div className="relative mx-auto flex max-w-[1460px] flex-col gap-8">
        <section className="overflow-hidden rounded-[40px] border border-border/70 bg-card/82 p-6 shadow-soft backdrop-blur lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" />
                WorkingParts
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl text-5xl font-extrabold tracking-[-0.06em] lg:text-7xl">
                  Operativa técnica con estética limpia y control real.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Un portal minimalista para registrar trabajo, organizar clientes y supervisar actividad sin ruido visual.
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
                  <Link href="/app/dashboard">Dashboard</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {featurePills.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border/60 bg-background/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px] perspective-[1800px]">
              <div className="hero-tilt-panel relative rounded-[34px] border border-white/10 bg-slate-950/88 p-5 text-white shadow-[0_40px_120px_rgba(15,23,42,0.45)]">
                <div className="absolute inset-0 rounded-[34px] bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.16),transparent_22%)]" />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between rounded-[26px] border border-white/10 bg-white/5 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Session</p>
                      <p className="mt-1 text-lg font-semibold">Minimal control</p>
                    </div>
                    <div className="rounded-2xl bg-sky-400/12 p-3 text-sky-300">
                      <Orbit className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[26px] border border-white/8 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Flow</p>
                      <p className="mt-3 text-xl font-bold">Tickets</p>
                    </div>
                    <div className="rounded-[26px] border border-white/8 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Ops</p>
                      <p className="mt-3 text-xl font-bold">Clientes</p>
                    </div>
                    <div className="rounded-[26px] border border-white/8 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Proof</p>
                      <p className="mt-3 text-xl font-bold">Firmas</p>
                    </div>
                    <div className="rounded-[26px] border border-white/8 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Export</p>
                      <p className="mt-3 text-xl font-bold">PDF / Excel</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[24px] bg-white/5 p-4">
                      <Workflow className="h-5 w-5 text-sky-300" />
                    </div>
                    <div className="rounded-[24px] bg-white/5 p-4">
                      <ShieldCheck className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div className="rounded-[24px] bg-white/5 p-4">
                      <Sparkles className="h-5 w-5 text-amber-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
