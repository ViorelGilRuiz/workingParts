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

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
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
