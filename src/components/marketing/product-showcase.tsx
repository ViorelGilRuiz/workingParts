"use client";

import { motion } from "framer-motion";
import { Activity, BarChart3, FileCheck2, FolderKanban, ShieldCheck, Users2 } from "lucide-react";

const showcaseItems = [
  { eyebrow: "Ops", title: "Tickets", icon: FolderKanban },
  { eyebrow: "Control", title: "Clientes", icon: Users2 },
  { eyebrow: "Proof", title: "Firmas", icon: FileCheck2 },
  { eyebrow: "Stats", title: "Resumen", icon: BarChart3 },
  { eyebrow: "Flow", title: "Actividad", icon: Activity },
  { eyebrow: "Trust", title: "Seguridad", icon: ShieldCheck }
];

export function ProductShowcase({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[720px] perspective-[2400px]">
      <motion.div
        initial={{ opacity: 0, rotateX: 18, y: 24 }}
        animate={{ opacity: 1, rotateX: 12, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hero-tilt-panel tech-hud relative rounded-[36px] border border-white/10 p-5 text-white shadow-[0_50px_140px_rgba(2,8,23,0.52)]"
      >
        <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.16),transparent_22%)]" />
        <div className="absolute inset-x-10 top-5 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div className="relative space-y-4">
          <div className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/5 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">WorkingParts Core</p>
              <p className="mt-2 text-lg font-semibold">Operacion visible, elegante y controlada</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.22em] text-sky-200">
              Live
            </div>
          </div>

          <div className={`grid gap-4 ${compact ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {showcaseItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.38, delay: 0.08 + index * 0.05 }}
                  className="surface-elevated rounded-[24px] border border-white/8 bg-white/6 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{item.eyebrow}</p>
                    <Icon className="h-4 w-4 text-sky-300" />
                  </div>
                  <p className="mt-4 text-xl font-bold">{item.title}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="surface-elevated rounded-[22px] border border-white/8 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Realtime</p>
              <p className="mt-2 font-semibold">Seguimiento</p>
            </div>
            <div className="surface-elevated rounded-[22px] border border-white/8 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Documents</p>
              <p className="mt-2 font-semibold">PDF premium</p>
            </div>
            <div className="surface-elevated rounded-[22px] border border-white/8 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Auth</p>
              <p className="mt-2 font-semibold">Google y local</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
