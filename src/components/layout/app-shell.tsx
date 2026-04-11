"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { useReports } from "@/components/providers/reports-provider";

export function AppShell({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { trackRouteVisit } = useReports();

  useEffect(() => {
    trackRouteVisit(pathname);
  }, [pathname, trackRouteVisit]);

  return (
    <div className="app-shell-background relative min-h-screen overflow-hidden p-3 lg:p-6">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-20" />
      <MobileNavigation />
      <div className="mx-auto grid max-w-[1680px] gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="hidden lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-3rem)]">
          <Sidebar />
        </div>

        <main className="space-y-6 pb-24 lg:pb-8">
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
