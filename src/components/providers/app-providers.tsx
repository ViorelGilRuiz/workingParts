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
  return "dark";
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
  }, [theme]);

  const value = useMemo<AppContextValue>(
    () => ({
      theme: "dark",
      toggleTheme: () => setTheme("dark")
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
