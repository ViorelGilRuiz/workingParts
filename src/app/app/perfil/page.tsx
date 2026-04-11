"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Download, LogOut, ShieldCheck, Sparkles, UserRound, WalletCards } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useReports } from "@/components/providers/reports-provider";
import { Topbar } from "@/components/layout/topbar";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { roleMeta } from "@/lib/constants";
import { rolePermissions } from "@/lib/permissions";
import { formatCurrency } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isCloudAuthEnabled } = useAuth();
  const { reports, clients, analytics } = useReports();

  const myReports = reports.filter((report) => report.technicianId === user?.id);
  const myHours = myReports.reduce((sum, report) => sum + report.durationHours, 0);
  const myBilling = myReports.reduce((sum, report) => sum + report.durationHours * report.hourlyRate, 0);
  const signedReports = myReports.filter((report) => report.clientSignatureDataUrl || report.hasSignature).length;
  const activeRole = roleMeta[user?.role ?? "technician"];
  const permissions = rolePermissions[user?.role ?? "technician"];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  const handleExportShortcut = () => {
    router.push("/app/partes");
  };

  return (
    <div className="space-y-6">
      <Topbar title="Perfil" />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden rounded-[34px] border border-border/70 bg-card/88 p-6">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${activeRole.accent}`} />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar
                name={user?.name}
                avatar={user?.avatar}
                avatarUrl={user?.avatarUrl}
                className="h-20 w-20 rounded-[28px] ring-1 ring-white/10"
                textClassName="text-xl"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={activeRole.chip}>{activeRole.label}</Badge>
                  <Badge className="bg-muted text-muted-foreground">{isCloudAuthEnabled ? "Google" : "Local"}</Badge>
                </div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{user?.name ?? "Usuario"}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{user?.email ?? "Sin correo"}</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:w-[360px]">
              <Button variant="subtle" type="button" onClick={handleExportShortcut}>
                <Download className="mr-2 h-4 w-4" />
                Exportaciones
              </Button>
              <Button variant="outline" type="button" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Volver al login
              </Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-[34px] border border-border/70 bg-card/82 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Acceso</p>
              <p className="text-lg font-bold">Permisos activos</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {permissions.map((permission) => (
              <Badge key={permission} className="bg-background/70 text-foreground">
                {permission}
              </Badge>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Partes</p>
          <p className="mt-3 text-3xl font-extrabold">{myReports.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Horas</p>
          <p className="mt-3 text-3xl font-extrabold">{myHours.toFixed(1)} h</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Firmas</p>
          <p className="mt-3 text-3xl font-extrabold">{signedReports}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Facturacion</p>
          <p className="mt-3 text-3xl font-extrabold">{formatCurrency(myBilling)}</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <Card className="rounded-[34px] border border-border/70 bg-card/82 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seguimiento</p>
              <p className="text-lg font-bold">Actividad del perfil</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[26px] border border-border/60 bg-background/55 p-4">
              <p className="text-sm text-muted-foreground">Clientes visibles</p>
              <p className="mt-2 text-2xl font-extrabold">{clients.length}</p>
            </div>
            <div className="rounded-[26px] border border-border/60 bg-background/55 p-4">
              <p className="text-sm text-muted-foreground">Tickets globales</p>
              <p className="mt-2 text-2xl font-extrabold">{analytics.totalReports}</p>
            </div>
            <div className="rounded-[26px] border border-border/60 bg-background/55 p-4">
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="mt-2 text-2xl font-extrabold">{analytics.pendingReports}</p>
            </div>
            <div className="rounded-[26px] border border-border/60 bg-background/55 p-4">
              <p className="text-sm text-muted-foreground">Categoria top</p>
              <p className="mt-2 text-2xl font-extrabold">{analytics.mostFrequentCategory}</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-[34px] border border-border/70 bg-card/82 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <WalletCards className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Centro rapido</p>
              <p className="text-lg font-bold">Atajos de trabajo</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <Button className="justify-between" asChild>
              <Link href="/app/partes">
                Ver partes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link href="/app/clientes">
                Ver clientes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link href="/app/resumen-mensual">
                Resumen mensual
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 rounded-[26px] border border-border/60 bg-background/55 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Vista pensada para empleado y administrador
            </div>
            <p className="mt-2">
              El perfil se adapta al rol y sirve como punto de entrada para sesión, permisos, actividad y accesos rápidos.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
