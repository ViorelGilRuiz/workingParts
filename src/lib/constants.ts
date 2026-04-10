import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Gauge,
  LayoutDashboard,
  ShieldCheck,
  Users
} from "lucide-react";

export const navigation = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/partes", label: "Partes", icon: ClipboardList },
  { href: "/app/clientes", label: "Clientes", icon: Building2 },
  { href: "/app/resumen-mensual", label: "Resumen mensual", icon: Gauge },
  { href: "/app/incidencias-frecuentes", label: "Incidencias", icon: BriefcaseBusiness },
  { href: "/app/equipo", label: "Equipo", icon: Users },
  { href: "/app/admin", label: "Administración", icon: ShieldCheck }
];

export const statusStyles: Record<string, string> = {
  Resuelto: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Pendiente: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "En seguimiento": "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Cerrado: "bg-slate-500/10 text-slate-700 dark:text-slate-300"
};
