import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-2xl border border-border/80 bg-background/70 px-4 py-3 text-sm outline-none transition duration-200 placeholder:text-muted-foreground/70 focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10",
        className
      )}
      {...props}
    />
  );
}
