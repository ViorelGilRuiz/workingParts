import { Card } from "@/components/ui/card";

export function StatList({
  items
}: {
  items: { label: string; value: string; helper: string }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="mt-3 text-3xl font-extrabold">{item.value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{item.helper}</p>
        </Card>
      ))}
    </div>
  );
}
