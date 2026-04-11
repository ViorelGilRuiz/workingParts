"use client";

import { motion } from "framer-motion";
import { Activity, Boxes, Cpu, HardDriveDownload, RadioTower, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const nodePositions = ["floating-node-a", "floating-node-b", "floating-node-c"];

const sceneCards = [
  { label: "Queue", value: "24 tickets", icon: Activity, tone: "text-sky-300" },
  { label: "Infra", value: "6 nodos", icon: Boxes, tone: "text-cyan-300" },
  { label: "Security", value: "2FA ready", icon: ShieldCheck, tone: "text-emerald-300" },
  { label: "Backups", value: "PDF / XLS", icon: HardDriveDownload, tone: "text-amber-300" },
  { label: "Ops", value: "Realtime", icon: RadioTower, tone: "text-fuchsia-300" },
  { label: "Core", value: "Stable", icon: Cpu, tone: "text-violet-300" }
];

export function AmbientTechScene({
  className,
  compact = false
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 tech-depth-grid opacity-55" />
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />
      <div className="hero-orb hero-orb-c" />
      <div className="tech-ring tech-ring-a" />
      <div className="tech-ring tech-ring-b" />
      <div className="signal-beam signal-beam-a" />
      <div className="signal-beam signal-beam-b" />
      <div className="signal-beam signal-beam-c" />
      {nodePositions.map((item) => (
        <div key={item} className={`floating-node ${item}`} />
      ))}

      <div className="absolute inset-x-0 bottom-[-12%] top-[8%]">
        {sceneCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
              className={cn(
                "scene-card absolute rounded-[26px] border border-white/10 bg-slate-950/46 p-4 text-white/90 backdrop-blur-xl",
                compact ? "w-[150px]" : "w-[180px]"
              )}
              style={{
                left: `${8 + (index % 3) * 27}%`,
                top: `${12 + Math.floor(index / 3) * 28}%`,
                animationDelay: `${index * 0.9}s`
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{card.label}</span>
                <Icon className={cn("h-4 w-4", card.tone)} />
              </div>
              <p className="mt-4 text-base font-semibold">{card.value}</p>
              <div className="mt-4 h-1 rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300"
                  style={{ width: `${58 + index * 6}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="absolute inset-x-[12%] bottom-[12%] top-[20%] rounded-[46px] border border-white/6 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.06),transparent_38%)] opacity-80" />
    </div>
  );
}
