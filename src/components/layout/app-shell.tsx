"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="app-shell-background relative min-h-screen overflow-hidden p-3 lg:p-6">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-20" />
      <div className="mx-auto grid max-w-[1680px] gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <Sidebar />
        </div>

        <main className="space-y-6 pb-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
