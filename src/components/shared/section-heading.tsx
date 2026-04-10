export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
      <p className="max-w-2xl text-muted-foreground">{description}</p>
    </div>
  );
}
