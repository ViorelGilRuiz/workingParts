"use client";

import Link from "next/link";
import { Suspense, startTransition, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, Sparkles, UserPlus2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type AuthMode = "login" | "register";

const roleLabels = {
  technician: "Tecnico",
  supervisor: "Supervisor",
  admin: "Administracion"
} as const;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4 0-.7-.1-1.3-.2-2H12Z" />
      <path fill="#4285F4" d="M12 21.5c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.6-4.1H3.1V16c1.6 3.2 4.9 5.5 8.9 5.5Z" />
      <path fill="#FBBC05" d="M6.4 13.4c-.2-.6-.4-1.2-.4-1.9s.1-1.3.4-1.9V7.1H3.1C2.4 8.4 2 9.9 2 11.5s.4 3.1 1.1 4.4l3.3-2.5Z" />
      <path fill="#34A853" d="M12 5.5c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 2.6 14.7 1.5 12 1.5c-4 0-7.3 2.3-8.9 5.6l3.3 2.5c.8-2.4 3-4.1 5.6-4.1Z" />
    </svg>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated, login, loginWithGoogle, register, isCloudAuthEnabled } = useAuth();
  const nextPath = searchParams.get("next") || "/app/dashboard";

  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "carlos.martin@ibersoft.es",
    password: "demo1234"
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    company: "Ibersoft",
    role: "technician",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (hydrated && user) {
      router.replace(nextPath);
    }
  }, [hydrated, nextPath, router, user]);

  useEffect(() => {
    if (!hydrated) return;

    router.prefetch(nextPath);
    router.prefetch("/app/dashboard");
    router.prefetch("/app/perfil");
  }, [hydrated, nextPath, router]);

  const authBadge = useMemo(() => (isCloudAuthEnabled ? "Cloud auth" : "Local mode"), [isCloudAuthEnabled]);

  const runLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    const result = await login(loginForm);
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    setMessage("Accediendo...");
    startTransition(() => {
      router.push(nextPath);
    });
  };

  const runRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    if (registerForm.password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      setSubmitting(false);
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Las contrasenas no coinciden.");
      setSubmitting(false);
      return;
    }

    const result = await register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      role: registerForm.role as "technician" | "supervisor" | "admin",
      company: registerForm.company
    });

    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    setMessage("Cuenta creada.");
    startTransition(() => {
      router.push(nextPath);
    });
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    setError("");
    setMessage("");

    const result = await loginWithGoogle(nextPath);
    if (!result.ok) {
      setError(result.message);
      setSubmitting(false);
      return;
    }

    setMessage("Redirigiendo...");
  };

  if (!hydrated) {
    return <main className="min-h-screen bg-background" />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
      <div className="pointer-events-none absolute inset-0 tech-depth-grid opacity-55" />
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-orb hero-orb-c" />
        <div className="tech-ring tech-ring-a" />
        <div className="tech-ring tech-ring-b" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1500px] gap-6 lg:grid-cols-[1.06fr_0.94fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/88 p-6 text-white shadow-soft backdrop-blur lg:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.14),transparent_20%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-white/5 px-4 py-2 text-sm font-semibold text-sky-200">
                <Sparkles className="h-4 w-4" />
                WorkingParts
              </div>

              <div className="max-w-3xl space-y-5">
                <h1 className="text-5xl font-extrabold tracking-[-0.06em] lg:text-7xl">
                  Acceso limpio para una operativa técnica seria.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-slate-300">
                  Minimalismo, sesión segura y una entrada más propia de producto que de demo.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {["tickets", "clientes", "export", authBadge.toLowerCase()].slice(0, 3).map((item) => (
                  <div key={item} className="rounded-[28px] border border-white/8 bg-white/5 p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] perspective-[1800px]">
              <div className="hero-tilt-panel rounded-[34px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[26px] border border-white/8 bg-slate-950/50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Auth</p>
                    <p className="mt-3 text-xl font-bold">{authBadge}</p>
                  </div>
                  <div className="rounded-[26px] border border-white/8 bg-slate-950/50 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Mode</p>
                    <p className="mt-3 text-xl font-bold">Minimal UI</p>
                  </div>
                  <div className="rounded-[26px] border border-white/8 bg-slate-950/50 p-4 sm:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-sky-400/12 p-3 text-sky-300">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-slate-300">Entrada reducida, limpia y preparada para flujo cloud.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.12, ease: "easeOut" }}
          className="relative rounded-[40px] border border-border/70 bg-card/84 p-5 shadow-soft backdrop-blur lg:p-8"
        >
          <div className="mx-auto flex max-w-lg flex-col gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                <LockKeyhole className="h-3.5 w-3.5" />
                Acceso
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight lg:text-4xl">Iniciar sesión</h2>
            </div>

            <Card className="space-y-4 border-border/60 bg-background/60">
              <Button
                type="button"
                className="h-12 w-full rounded-2xl bg-foreground text-background hover:bg-foreground/92"
                onClick={handleGoogleLogin}
                disabled={submitting || !isCloudAuthEnabled}
              >
                <GoogleIcon />
                <span className="ml-2">Continuar con Google</span>
              </Button>
            </Card>

            {!isCloudAuthEnabled ? (
              <>
                <div className="relative grid grid-cols-2 rounded-[24px] border border-border/70 bg-muted/45 p-1.5">
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
                    className={`relative z-10 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${mode === "login" ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                      setMessage("");
                    }}
                    className={`relative z-10 rounded-[18px] px-4 py-3 text-sm font-semibold transition ${mode === "register" ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    Crear cuenta
                  </button>
                </div>

                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                >
                  {mode === "login" ? (
                    <form className="space-y-4" onSubmit={runLogin}>
                      <Card className="space-y-5 border-border/60 bg-background/60">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Correo</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="email"
                              value={loginForm.email}
                              onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
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
                              onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                              className="h-12 rounded-2xl bg-background/80 pl-11"
                              required
                            />
                          </div>
                        </div>

                        <Button className="h-12 w-full rounded-2xl text-base" disabled={submitting}>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Entrar
                        </Button>
                      </Card>
                    </form>
                  ) : (
                    <form className="space-y-4" onSubmit={runRegister}>
                      <Card className="space-y-5 border-border/60 bg-background/60">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium">Nombre</label>
                            <Input
                              value={registerForm.name}
                              onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))}
                              className="h-12 rounded-2xl bg-background/80"
                              required
                            />
                          </div>

                          <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium">Correo</label>
                            <Input
                              type="email"
                              value={registerForm.email}
                              onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                              className="h-12 rounded-2xl bg-background/80"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Empresa</label>
                            <Input
                              value={registerForm.company}
                              onChange={(event) => setRegisterForm((current) => ({ ...current, company: event.target.value }))}
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
                              onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))}
                              className="h-12 rounded-2xl bg-background/80"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Confirmar</label>
                            <Input
                              type="password"
                              value={registerForm.confirmPassword}
                              onChange={(event) =>
                                setRegisterForm((current) => ({ ...current, confirmPassword: event.target.value }))
                              }
                              className="h-12 rounded-2xl bg-background/80"
                              required
                            />
                          </div>
                        </div>

                        <Button className="h-12 w-full rounded-2xl text-base" disabled={submitting}>
                          <UserPlus2 className="mr-2 h-4 w-4" />
                          Crear cuenta
                        </Button>
                      </Card>
                    </form>
                  )}
                </motion.div>
              </>
            ) : null}

            {message ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
                {error}
              </div>
            ) : null}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <Link href="/" className="font-semibold text-primary">
                Volver
              </Link>
              <span>{authBadge}</span>
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
