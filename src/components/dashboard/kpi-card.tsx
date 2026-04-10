import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { KPI } from "@/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const trendIcons = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: ArrowRight
};

export function KpiCard({ item }: { item: KPI }) {
  const TrendIcon = trendIcons[item.trend];

  return (
    <Card className="relative overflow-hidden border-border/60">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-secondary/10 blur-3xl" />
      <p className="text-sm text-muted-foreground">{item.label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-extrabold tracking-tight">{item.value}</p>
          <p className="mt-3 max-w-[18rem] text-sm leading-6 text-muted-foreground">{item.helper}</p>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold shadow-sm",
            item.trend === "down"
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-300"
              : item.trend === "neutral"
                ? "bg-sky-500/10 text-sky-600 dark:text-sky-300"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
          )}
        >
          <TrendIcon className="h-4 w-4" />
          {item.change}
        </div>
      </div>
    </Card>
  );
}
