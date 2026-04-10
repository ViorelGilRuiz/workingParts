export default function AppLoading() {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-border/70 bg-card/75 p-5 shadow-soft backdrop-blur">
        <div className="h-4 w-40 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded-2xl bg-muted" />
        <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_auto]">
          <div className="h-12 animate-pulse rounded-2xl bg-muted" />
          <div className="flex gap-2">
            <div className="h-12 w-28 animate-pulse rounded-2xl bg-muted" />
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-[28px] border border-border/70 bg-card/80 shadow-soft" />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="h-[320px] animate-pulse rounded-[28px] border border-border/70 bg-card/80 shadow-soft" />
        <div className="h-[320px] animate-pulse rounded-[28px] border border-border/70 bg-card/80 shadow-soft" />
      </section>
    </div>
  );
}
