"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { currentUser, teamMembers } from "@/data/demo";
import { Role, User } from "@/types";

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
  login: (input: LoginInput) => { ok: true } | { ok: false; message: string };
  register: (input: RegisterInput) => { ok: true } | { ok: false; message: string };
  logout: () => void;
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
    avatar: user.avatar
  };
}

function createAvatar(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function createUserId() {
  return `u-${Math.random().toString(36).slice(2, 10)}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<StoredAuthUser[]>(seedUsers);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
      const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers) as StoredAuthUser[];
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          setUsers(parsedUsers);
        }
      }

      const availableUsers = savedUsers ? (JSON.parse(savedUsers) as StoredAuthUser[]) : seedUsers;

      if (savedSession) {
        const sessionUser = availableUsers.find((item) => item.id === savedSession);
        if (sessionUser) {
          setUser(toPublicUser(sessionUser));
        }
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [hydrated, users]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      login: ({ email, password }) => {
        const foundUser = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());

        if (!foundUser || foundUser.password !== password) {
          return { ok: false, message: "Correo o contraseña incorrectos." };
        }

        const publicUser = toPublicUser(foundUser);
        setUser(publicUser);
        window.localStorage.setItem(SESSION_STORAGE_KEY, foundUser.id);
        return { ok: true };
      },
      register: ({ name, email, password, role, company }) => {
        const normalizedEmail = email.trim().toLowerCase();

        if (users.some((item) => item.email.toLowerCase() === normalizedEmail)) {
          return { ok: false, message: "Ya existe una cuenta registrada con ese correo." };
        }

        const createdUser: StoredAuthUser = {
          id: createUserId(),
          name: name.trim(),
          email: normalizedEmail,
          role,
          avatar: createAvatar(name),
          company: company?.trim(),
          password
        };

        setUsers((current) => [...current, createdUser]);
        setUser(toPublicUser(createdUser));
        window.localStorage.setItem(SESSION_STORAGE_KEY, createdUser.id);
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }),
    [hydrated, user, users]
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
