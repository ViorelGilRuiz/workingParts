"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Eye, GripHorizontal, Paperclip, Search } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { statusStyles } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ReportTable() {
  const { reports, hydrated, preferences, setSavedReportFilters, rememberSearch } = useReports();
  const [query, setQuery] = useState(preferences?.savedReportFilters.query ?? "");
  const [status, setStatus] = useState(preferences?.savedReportFilters.status ?? "Todos");
  const [priority, setPriority] = useState(preferences?.savedReportFilters.priority ?? "Todas");
  const [category, setCategory] = useState(preferences?.savedReportFilters.category ?? "Todas");
  const [sortBy, setSortBy] = useState<"recent" | "duration" | "client">(preferences?.savedReportFilters.sortBy ?? "recent");
  const [compactView, setCompactView] = useState(preferences?.savedReportFilters.compactView ?? false);
  const [showExtraColumns, setShowExtraColumns] = useState(preferences?.savedReportFilters.showExtraColumns ?? true);

  useEffect(() => {
    if (!preferences) return;
    setQuery(preferences.savedReportFilters.query);
    setStatus(preferences.savedReportFilters.status);
    setPriority(preferences.savedReportFilters.priority);
    setCategory(preferences.savedReportFilters.category);
    setSortBy(preferences.savedReportFilters.sortBy);
    setCompactView(preferences.savedReportFilters.compactView);
    setShowExtraColumns(preferences.savedReportFilters.showExtraColumns);
  }, [preferences]);

  useEffect(() => {
    setSavedReportFilters({
      query,
      status,
      priority,
      category,
      sortBy,
      compactView,
      showExtraColumns
    });
  }, [category, compactView, query, setSavedReportFilters, showExtraColumns, sortBy, status, priority]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (query.trim().length >= 2) {
        rememberSearch(query);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [query, rememberSearch]);

  const filtered = useMemo(() => {
    const result = reports.filter((report) => {
      const matchesQuery = [report.id, report.client, report.technician, report.category, report.reason]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = status === "Todos" || report.status === status;
      const matchesPriority = priority === "Todas" || report.priority === priority;
      const matchesCategory = category === "Todas" || report.category === category;

      return matchesQuery && matchesStatus && matchesPriority && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sortBy === "duration") {
        return b.durationHours - a.durationHours;
      }

      if (sortBy === "client") {
        return a.client.localeCompare(b.client);
      }

      return `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`);
    });
  }, [category, priority, query, reports, sortBy, status]);

  const totalHours = useMemo(() => filtered.reduce((sum, report) => sum + report.durationHours, 0).toFixed(1), [filtered]);
  const categories = useMemo(() => ["Todas", ...Array.from(new Set(reports.map((report) => report.category)))], [reports]);
  const rowPaddingClass = compactView ? "py-2" : "py-4";

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-4 border-b border-border/70 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Vista tabla avanzada</p>
            <h3 className="text-lg font-bold">Partes de trabajo</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {hydrated ? `${filtered.length} resultados - ${totalHours} h acumuladas` : "Cargando partes..."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" onClick={() => setCompactView((value) => !value)}>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {compactView ? "Amplia" : "Compacta"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowExtraColumns((value) => !value)}>
              <GripHorizontal className="mr-2 h-4 w-4" />
              {showExtraColumns ? "Menos columnas" : "Mas columnas"}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.6fr))]">
          <div className="relative md:col-span-2 xl:col-span-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-full pl-11"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrar en tiempo real..."
            />
          </div>
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>Todos</option>
            <option>Pendiente</option>
            <option>En seguimiento</option>
            <option>Resuelto</option>
            <option>Cerrado</option>
          </Select>
          <Select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option>Todas</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </Select>
          <Select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
            <option value="recent">Mas recientes</option>
            <option value="duration">Mayor duracion</option>
            <option value="client">Cliente A-Z</option>
          </Select>
        </div>

        {preferences?.recentSearches?.length ? (
          <div className="flex flex-wrap gap-2">
            {preferences.recentSearches.slice(0, 5).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className="rounded-full border border-border/70 bg-background/55 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 border-b border-border/60 p-4 md:hidden">
        {filtered.length > 0 ? (
          filtered.map((report) => (
            <div key={report.id} className="rounded-[24px] border border-border/60 bg-background/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{report.id}</p>
                  <p className="mt-2 font-semibold">{report.reason}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{report.client}</p>
                </div>
                <Badge className={statusStyles[report.status]}>{report.status}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary">{report.category}</Badge>
                <Badge className="bg-muted text-muted-foreground">{report.durationHours} h</Badge>
                <Badge
                  className={cn(
                    report.priority === "Alta"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-300"
                      : report.priority === "Media"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                        : "bg-slate-500/10 text-slate-700 dark:text-slate-300"
                  )}
                >
                  {report.priority}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div>{formatDate(report.date)}</div>
                <div className="text-right">{report.technician}</div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{report.attachments} adjuntos</div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/app/partes/${report.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Abrir
                  </Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">No hay partes que coincidan con los filtros actuales.</div>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Parte</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              {showExtraColumns ? <th className="px-4 py-3 font-medium">Tecnico</th> : null}
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Duracion</th>
              {showExtraColumns ? <th className="px-4 py-3 font-medium">Prioridad</th> : null}
              <th className="px-4 py-3 font-medium">Estado</th>
              {showExtraColumns ? <th className="px-4 py-3 font-medium">Adjuntos</th> : null}
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((report) => (
                <tr key={report.id} className="border-t border-border/60 transition hover:bg-muted/25">
                  <td className={`px-4 font-semibold ${rowPaddingClass}`}>{report.id}</td>
                  <td className={`px-4 ${rowPaddingClass}`}>{formatDate(report.date)}</td>
                  {showExtraColumns ? <td className={`px-4 ${rowPaddingClass}`}>{report.technician}</td> : null}
                  <td className={`px-4 ${rowPaddingClass}`}>
                    <div className="font-medium">{report.client}</div>
                    {showExtraColumns ? <div className="text-xs text-muted-foreground">{report.contact}</div> : null}
                  </td>
                  <td className={`px-4 ${rowPaddingClass}`}>{report.category}</td>
                  <td className={`px-4 ${rowPaddingClass}`}>{report.durationHours} h</td>
                  {showExtraColumns ? (
                    <td className={`px-4 ${rowPaddingClass}`}>
                      <Badge
                        className={cn(
                          report.priority === "Alta"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-300"
                            : report.priority === "Media"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                              : "bg-slate-500/10 text-slate-700 dark:text-slate-300"
                        )}
                      >
                        {report.priority}
                      </Badge>
                    </td>
                  ) : null}
                  <td className={`px-4 ${rowPaddingClass}`}>
                    <Badge className={statusStyles[report.status]}>{report.status}</Badge>
                  </td>
                  {showExtraColumns ? (
                    <td className={`px-4 ${rowPaddingClass}`}>
                      <div className="inline-flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        {report.attachments}
                      </div>
                    </td>
                  ) : null}
                  <td className={`px-4 ${rowPaddingClass}`}>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/app/partes/${report.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t border-border/60">
                <td colSpan={showExtraColumns ? 10 : 7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No hay partes que coincidan con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
