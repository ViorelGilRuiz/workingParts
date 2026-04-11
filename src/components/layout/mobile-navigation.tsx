"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MobileNavigation() {
  const pathname = usePathname();
  const primaryItems = navigation.slice(0, 4);

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between rounded-[26px] border border-border/70 bg-card/88 px-4 py-3 shadow-soft backdrop-blur lg:hidden">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[360px] border-r border-white/10 bg-slate-950/96 p-5 text-white shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">WorkingParts</p>
                  <p className="mt-1 text-lg font-bold">Navegacion</p>
                </div>
                <Dialog.Close asChild>
                  <Button variant="outline" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </Dialog.Close>
              </div>

              <div className="grid gap-3">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Dialog.Close asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-[22px] border px-4 py-4 transition",
                          isActive
                            ? "border-primary/20 bg-primary text-primary-foreground"
                            : "border-white/10 bg-white/5 text-slate-200"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-semibold">{item.label}</span>
                      </Link>
                    </Dialog.Close>
                  );
                })}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Vista</p>
          <p className="text-sm font-semibold text-foreground">{navigation.find((item) => item.href === pathname)?.label ?? "Panel"}</p>
        </div>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 gap-2 rounded-[28px] border border-border/70 bg-card/92 p-2 shadow-soft backdrop-blur lg:hidden">
        {primaryItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-[18px] px-2 py-3 text-[11px] font-semibold transition",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
