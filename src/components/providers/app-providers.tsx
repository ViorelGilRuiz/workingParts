"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReportsProvider } from "@/components/providers/reports-provider";

type Theme = "light" | "dark";

interface AppContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const THEME_STORAGE_KEY = "portal-incidencias-theme";

function getInitialTheme(): Theme {
  const fallbackTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME === "light" ? "light" : "dark";

  if (typeof window === "undefined") {
    return fallbackTheme;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return fallbackTheme;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark"))
    }),
    [theme]
  );

  return (
    <AuthProvider>
      <AppContext.Provider value={value}>
        <ReportsProvider>{children}</ReportsProvider>
      </AppContext.Provider>
    </AuthProvider>
  );
}

export function useAppTheme() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppTheme must be used within AppProviders");
  }

  return context;
}
