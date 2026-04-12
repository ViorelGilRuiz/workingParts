"use client";

import Link from "next/link";
import { Suspense, startTransition, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, UserPlus2 } from "lucide-react";
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
  const oauthError = searchParams.get("error");

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
    if (!oauthError) return;

    if (oauthError === "oauth_callback_failed") {
      setError("No se pudo completar el acceso con Google.");
      return;
    }

    if (oauthError === "missing_oauth_code" || oauthError === "missing_code") {
      setError("El flujo de acceso no devolvio un codigo valido.");
    }
  }, [oauthError]);

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

    setMessage("Redirigiendo a Google...");
  };

  return (
    <main className="min-h-screen px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto grid max-w-[1120px] gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[36px] border border-border/70 bg-card/88 p-6 shadow-soft lg:p-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <LockKeyhole className="h-4 w-4" />
              WorkingParts
            </div>
            <h1 className="text-4xl font-extrabold tracking-[-0.05em] lg:text-5xl">
              Acceso estable a la aplicacion.
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              Hemos simplificado esta pantalla para priorizar fiabilidad, velocidad y entrada limpia en Netlify.
            </p>
          </div>
        </section>

        <section>
          <Card className="space-y-5 rounded-[34px] border-border/70 bg-card/92 p-5 shadow-soft lg:p-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight">Iniciar sesion</h2>
              <p className="text-sm text-muted-foreground">
                {isCloudAuthEnabled ? "Acceso con Google activo" : "Modo local activo"}
              </p>
            </div>

            <Card className="space-y-4 border-border/60 bg-background/60">
              <Button
                type="button"
                className="h-12 w-full rounded-2xl"
                onClick={handleGoogleLogin}
                disabled={submitting || !isCloudAuthEnabled}
              >
                <GoogleIcon />
                <span className="ml-2">Continuar con Google</span>
              </Button>
              {!isCloudAuthEnabled ? (
                <p className="text-sm text-muted-foreground">
                  Google Login no esta disponible hasta configurar Supabase en produccion.
                </p>
              ) : null}
            </Card>

            {!isCloudAuthEnabled ? (
              <>
                <div className="grid grid-cols-2 gap-2 rounded-[24px] border border-border/70 bg-muted/40 p-1.5">
                  <Button type="button" variant={mode === "login" ? "default" : "ghost"} onClick={() => setMode("login")}>
                    Entrar
                  </Button>
                  <Button
                    type="button"
                    variant={mode === "register" ? "default" : "ghost"}
                    onClick={() => setMode("register")}
                  >
                    Crear cuenta
                  </Button>
                </div>

                {mode === "login" ? (
                  <form className="space-y-4" onSubmit={runLogin}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Correo</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          value={loginForm.email}
                          onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
                          className="h-12 pl-11"
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
                          className="h-12 pl-11"
                          required
                        />
                      </div>
                    </div>

                    <Button className="h-12 w-full" disabled={submitting}>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Entrar
                    </Button>
                  </form>
                ) : (
                  <form className="space-y-4" onSubmit={runRegister}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">Nombre</label>
                        <Input
                          value={registerForm.name}
                          onChange={(event) => setRegisterForm((current) => ({ ...current, name: event.target.value }))}
                          className="h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium">Correo</label>
                        <Input
                          type="email"
                          value={registerForm.email}
                          onChange={(event) => setRegisterForm((current) => ({ ...current, email: event.target.value }))}
                          className="h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Empresa</label>
                        <Input
                          value={registerForm.company}
                          onChange={(event) => setRegisterForm((current) => ({ ...current, company: event.target.value }))}
                          className="h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Perfil</label>
                        <Select
                          value={registerForm.role}
                          onChange={(event) => setRegisterForm((current) => ({ ...current, role: event.target.value }))}
                          className="h-12"
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
                          className="h-12"
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
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <Button className="h-12 w-full" disabled={submitting}>
                      <UserPlus2 className="mr-2 h-4 w-4" />
                      Crear cuenta
                    </Button>
                  </form>
                )}
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
                Volver a la portada
              </Link>
              <span>{hydrated ? "Listo" : "Cargando sesion..."}</span>
            </div>
          </Card>
        </section>
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
