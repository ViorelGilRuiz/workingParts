"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type AuthMode = "login" | "register";

const roleLabels = {
  technician: "Técnico",
  supervisor: "Supervisor",
  admin: "Administración"
} as const;

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated, login, register } = useAuth();
  const nextPath = searchParams.get("next") || "/app/dashboard";

  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "carlos.martin@portalit.es",
    password: "demo1234"
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "technician",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (hydrated && user) {
      router.replace(nextPath);
    }
  }, [hydrated, nextPath, router, user]);

  const submitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const result = login(loginForm);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push(nextPath);
  };

  const submitRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (registerForm.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Las contraseñas no coinciden.");
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

    setMessage("Cuenta creada correctamente. Entrando al portal...");
    router.push(nextPath);
  };

  if (!hydrated) {
    return <main className="min-h-screen bg-gray-50" />;
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Portal Incidencias IT
          </h1>
          <p className="text-gray-600">
            Gestiona tus partes de trabajo de forma eficiente
          </p>
        </div>

        <div className="flex mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-center font-medium ${
              mode === "login"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-center font-medium ${
              mode === "register"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Registrarse
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {message}
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={submitLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="pl-10"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        ) : (
          <form onSubmit={submitRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="pl-10"
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="pl-10"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <Input
                id="company"
                type="text"
                value={registerForm.company}
                onChange={(e) => setRegisterForm({ ...registerForm, company: e.target.value })}
                placeholder="Nombre de la empresa"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <Select
                value={registerForm.role}
                onValueChange={(value) => setRegisterForm({ ...registerForm, role: value })}
              >
                <option value="technician">Técnico</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administración</option>
              </Select>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>

        {mode === "login" && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-medium mb-1">Cuenta demo:</p>
            <p className="text-xs text-blue-700">Email: carlos.martin@portalit.es</p>
            <p className="text-xs text-blue-700">Contraseña: demo1234</p>
          </div>
        )}
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-gray-50" />}>
      <LoginPageContent />
    </Suspense>
  );
}
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
    company: "",
    role: "technician",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (hydrated && user) {
      router.replace(nextPath);
    }
  }, [hydrated, nextPath, router, user]);

  const quickPoints = useMemo(
    () => [
      "Acceso directo a partes y clientes",
      "Interfaz optimizada para operativa diaria",
      "Base lista para autenticacion empresarial"
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

    setMessage("Cuenta creada correctamente. Entrando al portal...");
    router.push(nextPath);
  };

  if (!hydrated) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_26%),linear-gradient(180deg,rgba(2,6,23,0.12),transparent)] px-4 py-4 lg:px-8 lg:py-6">
      <div className="pointer-events-none absolute inset-0 login-grid opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_38%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_38%)]" />

      {floatingNodes.map((node) => (
        <div
          key={node.label}
          className={cn(
            "pointer-events-none absolute hidden h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/10 bg-slate-950/70 text-sky-300 shadow-soft backdrop-blur lg:flex",
            node.className
          )}
        >
          <node.icon className="h-5 w-5" />
        </div>
      ))}

      <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1540px] gap-6 lg:grid-cols-[1.18fr_0.82fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/82 p-6 text-white shadow-soft backdrop-blur lg:p-10"
        >
          <div className="absolute inset-0 login-scanline" />
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_80%_24%,rgba(34,197,94,0.12),transparent_18%),radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.14),transparent_24%)]" />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.55 }}
                className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-white/5 px-4 py-2 text-sm font-semibold text-sky-200"
              >
                <Network className="h-4 w-4" />
                Portal para tecnicos de sistemas y soporte IT
              </motion.div>

              <div className="max-w-4xl space-y-5">
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.6 }}
                  className="text-5xl font-extrabold tracking-[-0.05em] text-white lg:text-7xl"
                >
                  Un acceso que parece una consola premium de operaciones.
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="max-w-2xl text-lg leading-8 text-slate-300"
                >
                  Diseno mas limpio, atmosfera tecnica y una entrada visual que conecta con redes, monitorizacion,
                  seguridad y trabajo de campo real.
                </motion.p>
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.65 }}
                  className="rounded-[30px] border border-sky-300/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-sky-200/70">Live operations</p>
                      <h2 className="mt-2 text-xl font-bold">Panel de acceso tecnico</h2>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                      Online
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <StatusChip label="Nodos" value="24 activos" />
                    <StatusChip label="Tickets" value="7 abiertos" />
                    <StatusChip label="SLA" value="96% ok" />
                  </div>

                  <div className="mt-6 rounded-[26px] border border-white/8 bg-slate-950/65 p-4">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Actividad de infraestructura</p>
                        <p className="text-xs text-slate-400">Visualizacion inspirada en monitorizacion y telemetria</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "VPN clientes", value: "Estable", width: "84%" },
                        { label: "Backups noche", value: "8/9", width: "72%" },
                        { label: "Remoto RDP", value: "Alto", width: "90%" }
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.48 + index * 0.08, duration: 0.45 }}
                        >
                          <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: item.width }}
                              transition={{ delay: 0.55 + index * 0.1, duration: 0.9, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.65 }}
                  className="grid gap-4"
                >
                  <Card className="border-white/8 bg-white/5 text-white">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                        <Fingerprint className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Acceso seguro</p>
                        <p className="text-xs text-slate-400">Entrada rapida, clara y corporativa</p>
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
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hidden items-center gap-5 rounded-[30px] border border-white/8 bg-white/5 px-5 py-4 text-sm text-slate-300 xl:flex"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <p>
                Diseno enfocado en transmitir fiabilidad, control y tecnologia sin recargar la experiencia de acceso.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, delay: 0.15, ease: "easeOut" }}
          className="relative rounded-[40px] border border-border/70 bg-card/82 p-5 shadow-soft backdrop-blur lg:p-8"
        >
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="mx-auto flex max-w-lg flex-col gap-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-primary">Control de acceso</p>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Entra al portal</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Interfaz limpia, rapida y agradable para empezar a trabajar sin friccion.
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
                      <Input
                        type="email"
                        value={loginForm.email}
                        onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                        placeholder="tecnico@empresa.com"
                        className="h-12 rounded-2xl bg-background/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contrasena</label>
                      <Input
                        type="password"
                        value={loginForm.password}
                        onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                        placeholder="••••••••••"
                        className="h-12 rounded-2xl bg-background/80"
                      />
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
                        <Input
                          value={registerForm.name}
                          onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))}
                          placeholder="Lucia Gomez"
                          required
                          className="h-12 rounded-2xl bg-background/80"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">Correo</label>
                        <Input
                          type="email"
                          value={registerForm.email}
                          onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                          placeholder="lucia@empresa.com"
                          required
                          className="h-12 rounded-2xl bg-background/80"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Empresa</label>
                        <Input
                          value={registerForm.company}
                          onChange={(event) => setRegisterForm((current) => ({ ...current, company: event.target.value }))}
                          placeholder="Portal Incidencias"
                          className="h-12 rounded-2xl bg-background/80"
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
                          onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
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
              <span>Preparado para conectar Supabase Auth mas adelante.</span>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <LoginPageContent />
    </Suspense>
  );
}
