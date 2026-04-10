"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Fingerprint,
  LockKeyhole,
  Mail,
  RadioTower,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus2
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

const roleLabels = {
  technician: "Tecnico",
  supervisor: "Supervisor",
  admin: "Administracion"
} as const;

const quickStats = [
  { label: "Nodos", value: "24 activos" },
  { label: "Tickets", value: "07 abiertos" },
  { label: "SLA", value: "96% estable" }
];

const quickPoints = [
  "Login rapido con sensacion profesional",
  "Sesion local persistente para demo y preventa",
  "Alta de usuarios lista para crecer con Supabase"
];

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated, login, register } = useAuth();
  const nextPath = searchParams.get("next") || "/app/dashboard";

  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "carlos.martin@portalit.es",
    password: "demo1234"
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    company: "Portal Incidencias",
    role: "technician",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (hydrated && user) {
      router.replace(nextPath);
    }
  }, [hydrated, nextPath, router, user]);

  const heroBars = useMemo(
    () => [
      { label: "Monitorizacion remota", value: "Estable", width: "84%" },
      { label: "Backups nocturnos", value: "8/9", width: "72%" },
      { label: "Acceso RDP", value: "Alto", width: "90%" }
    ],
    []
  );

  const submitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const result = login(loginForm);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage("Acceso correcto. Entrando al portal...");
    router.push(nextPath);
  };

  const submitRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (registerForm.password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    const result = register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      role: registerForm.role as "technician" | "supervisor" | "admin",
      company: registerForm.company
    });

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage("Cuenta creada correctamente. Redirigiendo...");
    router.push(nextPath);
  };

  if (!hydrated) {
    return <main className="min-h-screen bg-background" />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
      <div className="pointer-events-none absolute inset-0 login-grid opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.14),transparent_24%)]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1540px] gap-6 lg:grid-cols-[1.14fr_0.86fr]">
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/84 p-6 text-white shadow-soft backdrop-blur lg:p-10"
        >
          <div className="absolute inset-0 login-scanline" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.2),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(34,197,94,0.12),transparent_18%),radial-gradient(circle_at_70%_86%,rgba(249,115,22,0.16),transparent_24%)]" />

          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-white/5 px-4 py-2 text-sm font-semibold text-sky-200"
              >
                <RadioTower className="h-4 w-4" />
                Portal tecnico para soporte, mantenimiento y supervision
              </motion.div>

              <div className="max-w-4xl space-y-5">
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.55 }}
                  className="text-5xl font-extrabold tracking-[-0.05em] text-white lg:text-7xl"
                >
                  Acceso operativo con presencia premium y cero friccion.
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.55 }}
                  className="max-w-2xl text-lg leading-8 text-slate-300"
                >
                  Una entrada pensada para tecnicos y responsables de equipo: limpia, corporativa y lista para
                  empezar a trabajar en segundos.
                </motion.p>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.36, duration: 0.6 }}
                  className="rounded-[30px] border border-sky-300/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-sky-200/70">Live operations</p>
                      <h2 className="mt-2 text-xl font-bold">Estado de la operacion</h2>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                      Online
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {quickStats.map((item) => (
                      <div key={item.label} className="rounded-[24px] border border-white/8 bg-slate-950/65 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                        <p className="mt-3 text-base font-semibold">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-[26px] border border-white/8 bg-slate-950/65 p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Actividad de infraestructura</p>
                        <p className="text-xs text-slate-400">Resumen visual inspirado en telemetria y soporte real</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {heroBars.map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.48 + index * 0.08, duration: 0.42 }}
                        >
                          <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: item.width }}
                              transition={{ delay: 0.58 + index * 0.1, duration: 0.9, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.44, duration: 0.65 }}
                  className="grid gap-4"
                >
                  <Card className="border-white/8 bg-white/5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                        <Fingerprint className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Acceso seguro</p>
                        <p className="text-xs text-slate-400">Entrada limpia, rapida y corporativa</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="border-white/8 bg-white/5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Cuenta demo</p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs text-slate-400">Correo</p>
                        <p className="font-semibold">carlos.martin@portalit.es</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Contrasena</p>
                        <p className="font-semibold">demo1234</p>
                      </div>
                      <Button
                        className="w-full bg-white text-slate-950 hover:bg-sky-50"
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setLoginForm({ email: "carlos.martin@portalit.es", password: "demo1234" });
                          setError("");
                          setMessage("Credenciales demo cargadas.");
                        }}
                      >
                        Usar acceso demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>

                  <Card className="border-white/8 bg-white/5 text-white">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Ventajas</p>
                    <div className="mt-4 space-y-3">
                      {quickPoints.map((item) => (
                        <div key={item} className="flex items-center gap-3 text-sm text-slate-200">
                          <div className="h-2.5 w-2.5 rounded-full bg-sky-300" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="hidden items-center gap-5 rounded-[30px] border border-white/8 bg-white/5 px-5 py-4 text-sm text-slate-300 xl:flex"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p>Diseno enfocado en fiabilidad, control y tecnologia sin recargar la experiencia de acceso.</p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.16, ease: "easeOut" }}
          className="relative rounded-[40px] border border-border/70 bg-card/82 p-5 shadow-soft backdrop-blur lg:p-8"
        >
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="mx-auto flex max-w-lg flex-col gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Control de acceso
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Entra al portal</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Interfaz ligera, moderna y agradable para arrancar la jornada sin ruido visual.
              </p>
            </div>

            <div className="relative grid grid-cols-2 rounded-[24px] border border-border/70 bg-muted/50 p-1.5">
              <motion.div
                animate={{ x: mode === "login" ? "0%" : "100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 28 }}
                className="absolute left-1.5 top-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-[18px] bg-card shadow-soft"
              />
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
                className={cn(
                  "relative z-10 rounded-[18px] px-4 py-3 text-sm font-semibold transition",
                  mode === "login" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Iniciar sesion
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setMessage("");
                }}
                className={cn(
                  "relative z-10 rounded-[18px] px-4 py-3 text-sm font-semibold transition",
                  mode === "register" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Crear cuenta
              </button>
            </div>

            {message ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
              >
                {message}
              </motion.div>
            ) : null}

            {error ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"
              >
                {error}
              </motion.div>
            ) : null}

            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
            >
              {mode === "login" ? (
                <form className="space-y-4" onSubmit={submitLogin}>
                  <Card className="space-y-5 border-border/60 bg-background/60">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correo corporativo</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          value={loginForm.email}
                          onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                          placeholder="tecnico@empresa.com"
                          className="h-12 rounded-2xl bg-background/80 pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contrasena</label>
                      <div className="relative">
                        <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          value={loginForm.password}
                          onChange={(event) =>
                            setLoginForm((current) => ({ ...current, password: event.target.value }))
                          }
                          placeholder="Introduce tu contrasena"
                          className="h-12 rounded-2xl bg-background/80 pl-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                      Acceso pensado para tecnicos, supervisores y administracion.
                    </div>

                    <Button className="h-12 w-full rounded-2xl text-base">
                      <LockKeyhole className="mr-2 h-4 w-4" />
                      Acceder al portal
                    </Button>
                  </Card>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={submitRegister}>
                  <Card className="space-y-5 border-border/60 bg-background/60">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">Nombre completo</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            value={registerForm.name}
                            onChange={(event) =>
                              setRegisterForm((current) => ({ ...current, name: event.target.value }))
                            }
                            placeholder="Lucia Gomez"
                            required
                            className="h-12 rounded-2xl bg-background/80 pl-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">Correo</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            value={registerForm.email}
                            onChange={(event) =>
                              setRegisterForm((current) => ({ ...current, email: event.target.value }))
                            }
                            placeholder="lucia@empresa.com"
                            required
                            className="h-12 rounded-2xl bg-background/80 pl-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Empresa</label>
                        <Input
                          value={registerForm.company}
                          onChange={(event) =>
                            setRegisterForm((current) => ({ ...current, company: event.target.value }))
                          }
                          placeholder="Portal Incidencias"
                          className="h-12 rounded-2xl bg-background/80"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Perfil</label>
                        <Select
                          value={registerForm.role}
                          onChange={(event) => setRegisterForm((current) => ({ ...current, role: event.target.value }))}
                          className="h-12 rounded-2xl bg-background/80"
                        >
                          {Object.entries(roleLabels).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Contrasena</label>
                        <Input
                          type="password"
                          value={registerForm.password}
                          onChange={(event) =>
                            setRegisterForm((current) => ({ ...current, password: event.target.value }))
                          }
                          placeholder="Minimo 6 caracteres"
                          required
                          className="h-12 rounded-2xl bg-background/80"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirmar contrasena</label>
                        <Input
                          type="password"
                          value={registerForm.confirmPassword}
                          onChange={(event) =>
                            setRegisterForm((current) => ({ ...current, confirmPassword: event.target.value }))
                          }
                          placeholder="Repite la contrasena"
                          required
                          className="h-12 rounded-2xl bg-background/80"
                        />
                      </div>
                    </div>

                    <Button className="h-12 w-full rounded-2xl text-base">
                      <UserPlus2 className="mr-2 h-4 w-4" />
                      Crear cuenta y entrar
                    </Button>
                  </Card>
                </form>
              )}
            </motion.div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
              <Link href="/" className="font-semibold text-primary">
                Volver a la landing
              </Link>
              <span>Preparado para conectar Supabase Auth cuando quieras.</span>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <LoginPageContent />
    </Suspense>
  );
}
