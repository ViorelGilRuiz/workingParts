"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthChangeEvent, Session, User as SupabaseUser } from "@supabase/supabase-js";
import { currentUser, teamMembers } from "@/data/demo";
import { Role, User } from "@/types";
import { getAuthCallbackUrl, getSafeAppPath, isSupabaseConfigured } from "@/lib/env";
import { getAvatarLabel, resolveUserRole } from "@/lib/auth/roles";
import { loginInputSchema, normalizeEmail, normalizeText, registerInputSchema } from "@/lib/auth/validation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const USERS_STORAGE_KEY = "portal-incidencias-auth-users";
const SESSION_STORAGE_KEY = "portal-incidencias-auth-session";

interface StoredAuthUser extends User {
  company?: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  company?: string;
}

interface AuthContextValue {
  user: User | null;
  hydrated: boolean;
  isCloudAuthEnabled: boolean;
  login: (input: LoginInput) => Promise<{ ok: true } | { ok: false; message: string }>;
  loginWithGoogle: (nextPath?: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  register: (input: RegisterInput) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => Promise<{ ok: true } | { ok: false; message: string }>;
}

const seedUsers: StoredAuthUser[] = [
  {
    ...currentUser,
    company: "Ibersoft",
    password: "demo1234"
  },
  ...teamMembers
    .filter((member) => member.id !== currentUser.id)
    .map((member, index) => ({
      ...member,
      company: "Ibersoft",
      password: `demo123${index + 5}`
    }))
];

const AuthContext = createContext<AuthContextValue | null>(null);

function toPublicUser(user: StoredAuthUser): User {
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    avatar: user.avatar,
    avatarUrl: user.avatarUrl,
    authSource: user.authSource ?? "local"
  };
}

function createUserId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `u-${Math.random().toString(36).slice(2, 10)}`;
}

function dedupeUsers(items: StoredAuthUser[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const normalizedEmail = normalizeEmail(item.email);
    if (seen.has(normalizedEmail)) {
      return false;
    }

    seen.add(normalizedEmail);
    item.email = normalizedEmail;
    item.name = normalizeText(item.name);
    item.company = item.company ? normalizeText(item.company) : item.company;
    return true;
  });
}

function mapSupabaseUser(user: SupabaseUser): User {
  const fullName =
    user.user_metadata.full_name ??
    user.user_metadata.name ??
    user.email?.split("@")[0]?.replace(/[._-]/g, " ") ??
    "Usuario";
  const avatarUrl = user.user_metadata.avatar_url ?? user.user_metadata.picture ?? undefined;
  const role = resolveUserRole({
    email: user.email,
    appRole: typeof user.app_metadata.role === "string" ? user.app_metadata.role : null,
    userRole: typeof user.user_metadata.role === "string" ? user.user_metadata.role : null
  });

  return {
    id: user.id,
    name: fullName,
    role,
    email: user.email ?? "",
    avatar: getAvatarLabel(fullName, user.email),
    avatarUrl,
    authSource: "supabase"
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<StoredAuthUser[]>(seedUsers);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const isSigningOutRef = useRef(false);
  const isCloudAuthEnabled = isSupabaseConfigured();

  useEffect(() => {
    if (isCloudAuthEnabled) {
      const supabase = getSupabaseBrowserClient();

      if (!supabase) {
        setHydrated(true);
        return;
      }

      let mounted = true;
      const syncSession = async () => {
        try {
          const sessionResult = await supabase.auth.getSession();
          if (!mounted) return;
          setUser(sessionResult.data.session?.user ? mapSupabaseUser(sessionResult.data.session.user) : null);
          setHydrated(true);
        } catch {
          if (!mounted) return;
          setUser(null);
          setHydrated(true);
        }
      };

      void syncSession();

      const {
        data: { subscription }
      } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;
        setUser(session?.user ? mapSupabaseUser(session.user) : null);
        if (isSigningOutRef.current && !session) {
          isSigningOutRef.current = false;
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    try {
      const savedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
      const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

      if (savedUsers) {
        const parsedUsers = dedupeUsers(JSON.parse(savedUsers) as StoredAuthUser[]);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          setUsers(parsedUsers);
        }
      }

      const availableUsers = savedUsers ? dedupeUsers(JSON.parse(savedUsers) as StoredAuthUser[]) : seedUsers;

      if (savedSession) {
        const sessionUser = availableUsers.find((item) => item.id === savedSession);
        if (sessionUser) {
          setUser(toPublicUser(sessionUser));
        }
      }
    } finally {
      setHydrated(true);
    }
  }, [isCloudAuthEnabled]);

  useEffect(() => {
    if (!hydrated || isCloudAuthEnabled) return;
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [hydrated, isCloudAuthEnabled, users]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      isCloudAuthEnabled,
      login: async ({ email, password }) => {
        if (isCloudAuthEnabled) {
          return { ok: false, message: "Usa el acceso con Google para esta instalacion." };
        }

        const parsed = loginInputSchema.safeParse({ email, password });
        if (!parsed.success) {
          return { ok: false, message: parsed.error.issues[0]?.message ?? "No se pudo validar el acceso." };
        }

        const normalizedEmail = normalizeEmail(parsed.data.email);
        const foundUser = users.find((item) => normalizeEmail(item.email) === normalizedEmail);

        if (!foundUser || foundUser.password !== password) {
          return { ok: false, message: "Correo o contrasena incorrectos." };
        }

        const publicUser = toPublicUser(foundUser);
        setUser(publicUser);
        window.localStorage.setItem(SESSION_STORAGE_KEY, foundUser.id);
        return { ok: true };
      },
      loginWithGoogle: async (nextPath = "/app/dashboard") => {
        const supabase = getSupabaseBrowserClient();
        const safeNextPath = getSafeAppPath(nextPath);

        if (!isCloudAuthEnabled || !supabase) {
          return { ok: false, message: "Google Login requiere configurar Supabase Auth." };
        }

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: getAuthCallbackUrl(safeNextPath),
            queryParams: {
              access_type: "offline",
              prompt: "select_account"
            }
          }
        });

        if (error) {
          return { ok: false, message: "No se ha podido iniciar el acceso con Google. Revisa la configuracion OAuth." };
        }

        return { ok: true };
      },
      register: async ({ name, email, password, role, company }) => {
        if (isCloudAuthEnabled) {
          return { ok: false, message: "El alta manual queda desactivada cuando usas autenticacion cloud." };
        }

        const parsed = registerInputSchema.safeParse({ name, email, password, company });
        if (!parsed.success) {
          return { ok: false, message: parsed.error.issues[0]?.message ?? "No se pudo validar el alta." };
        }

        const normalizedEmail = normalizeEmail(parsed.data.email);
        const normalizedName = normalizeText(parsed.data.name);
        const normalizedCompany = parsed.data.company ? normalizeText(parsed.data.company) : undefined;

        if (users.some((item) => normalizeEmail(item.email) === normalizedEmail)) {
          return { ok: false, message: "Ya existe una cuenta registrada con ese correo." };
        }

        const createdUser: StoredAuthUser = {
          id: createUserId(),
          name: normalizedName,
          email: normalizedEmail,
          role,
          avatar: getAvatarLabel(normalizedName, normalizedEmail),
          company: normalizedCompany,
          password: parsed.data.password,
          authSource: "local"
        };

        setUsers((current) => [...current, createdUser]);
        setUser(toPublicUser(createdUser));
        window.localStorage.setItem(SESSION_STORAGE_KEY, createdUser.id);
        return { ok: true };
      },
      logout: async () => {
        if (isCloudAuthEnabled) {
          const supabase = getSupabaseBrowserClient();
          isSigningOutRef.current = true;
          await Promise.allSettled([
            supabase?.auth.signOut({ scope: "local" }),
            fetch("/auth/logout", {
              method: "POST",
              credentials: "include"
            })
          ]);
          setUser(null);
          return { ok: true };
        }

        setUser(null);
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
        return { ok: true };
      }
    }),
    [hydrated, isCloudAuthEnabled, user, users]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
