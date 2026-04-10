import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border/80 bg-background/70 px-4 py-2 text-sm outline-none transition duration-200 placeholder:text-muted-foreground/70 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10",
        className
      )}
      {...props}
    />
  );
}
