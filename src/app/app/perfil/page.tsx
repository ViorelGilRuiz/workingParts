"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Camera,
  Download,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useReports } from "@/components/providers/reports-provider";
import { Topbar } from "@/components/layout/topbar";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { roleMeta } from "@/lib/constants";
import { rolePermissions } from "@/lib/permissions";
import { formatCurrency } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isCloudAuthEnabled, updateProfile } = useAuth();
  const { reports, clients, analytics } = useReports();
  const [form, setForm] = useState({
    name: "",
    jobTitle: "",
    phone: "",
    location: "",
    bio: "",
    avatarUrl: ""
  });
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  const myReports = reports.filter((report) => report.technicianId === user?.id);
  const myHours = myReports.reduce((sum, report) => sum + report.durationHours, 0);
  const myBilling = myReports.reduce((sum, report) => sum + report.durationHours * report.hourlyRate, 0);
  const signedReports = myReports.filter((report) => report.clientSignatureDataUrl || report.hasSignature).length;
  const activeRole = roleMeta[user?.role ?? "technician"];
  const permissions = rolePermissions[user?.role ?? "technician"];

  const completionItems = useMemo(
    () => [form.name, user?.email ?? "", form.jobTitle, form.phone, form.location, form.bio, form.avatarUrl].filter(Boolean).length,
    [form, user?.email]
  );
  const completionPercent = Math.round((completionItems / 7) * 100);

  useEffect(() => {
    setForm({
      name: user?.name ?? "",
      jobTitle: user?.jobTitle ?? "",
      phone: user?.phone ?? "",
      location: user?.location ?? "",
      bio: user?.bio ?? "",
      avatarUrl: user?.avatarUrl ?? ""
    });
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
    router.refresh();
  };

  const handleExportShortcut = () => {
    router.push("/app/partes");
  };

  const handleInputChange =
    (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setSaveState("idle");
    };

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((current) => ({ ...current, avatarUrl: result }));
      setSaveState("idle");
    };
    reader.onerror = () => setSaveState("error");
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      updateProfile({
        name: form.name.trim() || user?.name,
        jobTitle: form.jobTitle.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        bio: form.bio.trim(),
        avatarUrl: form.avatarUrl || undefined
      });
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  return (
    <div className="space-y-6">
      <Topbar title="Perfil" subtitle="Datos del empleado, foto y ajustes rapidos para trabajar mejor." />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden rounded-[34px] border border-border/70 bg-card/88 p-6">
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${activeRole.accent}`} />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <UserAvatar
                name={form.name || user?.name}
                avatar={user?.avatar}
                avatarUrl={form.avatarUrl || user?.avatarUrl}
                className="h-20 w-20 rounded-[28px] ring-1 ring-white/10"
                textClassName="text-xl"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={activeRole.chip}>{activeRole.label}</Badge>
                  <Badge className="bg-muted text-muted-foreground">{isCloudAuthEnabled ? "Google" : "Local"}</Badge>
                </div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{form.name || user?.name || "Usuario"}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{user?.email ?? "Sin correo"}</p>
                {form.jobTitle ? <p className="mt-2 text-sm text-foreground/80">{form.jobTitle}</p> : null}
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

          <div className="mt-6 rounded-[24px] border border-border/60 bg-background/55 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Perfil completado</p>
                <p className="text-2xl font-extrabold">{completionPercent}%</p>
              </div>
              <div className="h-3 flex-1 rounded-full bg-muted/80">
                <div className="h-3 rounded-full bg-primary" style={{ width: `${completionPercent}%` }} />
              </div>
            </div>
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
              El perfil se adapta al rol y sirve como punto de entrada para sesion, permisos, actividad y accesos rapidos.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[34px] border border-border/70 bg-card/82 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Datos basicos</p>
              <p className="text-lg font-bold">Perfil editable</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            <div className="flex flex-col gap-4 rounded-[28px] border border-border/60 bg-background/50 p-4 sm:flex-row sm:items-center">
              <UserAvatar
                name={form.name || user?.name}
                avatar={user?.avatar}
                avatarUrl={form.avatarUrl || user?.avatarUrl}
                className="h-20 w-20 rounded-[24px] ring-1 ring-white/10"
                textClassName="text-xl"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">Foto del empleado</p>
                <p className="mt-1 text-sm text-muted-foreground">Puedes subir una imagen para que se vea en todo el panel.</p>
              </div>

              <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-border/80 bg-background/70 px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/30">
                Subir foto
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre</label>
                <Input value={form.name} onChange={handleInputChange("name")} placeholder="Nombre y apellidos" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Puesto</label>
                <Input value={form.jobTitle} onChange={handleInputChange("jobTitle")} placeholder="Tecnico de sistemas" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Telefono</label>
                <Input value={form.phone} onChange={handleInputChange("phone")} placeholder="600 000 000" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Ubicacion</label>
                <Input value={form.location} onChange={handleInputChange("location")} placeholder="Madrid" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sobre ti</label>
              <Textarea
                value={form.bio}
                onChange={handleInputChange("bio")}
                placeholder="Especialidad, horario, enfoque tecnico o notas utiles del empleado."
                className="min-h-[140px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Guardar perfil
              </Button>
              {saveState === "saved" ? <p className="text-sm text-emerald-400">Cambios guardados en este equipo.</p> : null}
              {saveState === "error" ? <p className="text-sm text-red-400">No se pudo guardar el perfil.</p> : null}
            </div>
          </div>
        </Card>

        <Card className="rounded-[34px] border border-border/70 bg-card/82 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ficha visible</p>
              <p className="text-lg font-bold">Resumen del empleado</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="rounded-[26px] border border-border/60 bg-background/55 p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Correo</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{user?.email ?? "Sin correo"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-border/60 bg-background/55 p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Telefono</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{form.phone || "Pendiente"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-border/60 bg-background/55 p-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Ubicacion</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{form.location || "Pendiente"}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-border/60 bg-background/55 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Bio</p>
              <p className="mt-2 text-sm text-foreground/85">{form.bio || "Anade una descripcion breve para que el perfil quede mas completo."}</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
