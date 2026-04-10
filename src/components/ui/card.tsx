import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-panel rounded-[28px] border border-border/70 bg-card/80 p-5 shadow-soft backdrop-blur transition duration-300 hover:border-border",
        className
      )}
      {...props}
    />
  );
}
