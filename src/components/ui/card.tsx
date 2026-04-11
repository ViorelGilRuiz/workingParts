import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel surface-elevated rounded-[28px] border border-border/70 bg-card/80 p-5 shadow-soft backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/20",
        className
      )}
      {...props}
    />
  );
}
