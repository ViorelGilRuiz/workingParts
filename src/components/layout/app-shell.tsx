"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="app-shell-background min-h-screen p-3 lg:p-6">
      <div className="mx-auto grid max-w-[1680px] gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <Sidebar />
        </div>

        <main className="space-y-6 pb-8">
          <div key={pathname}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
