"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown, Eye, GripHorizontal, Paperclip } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { statusStyles } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ReportTable() {
  const { reports, hydrated } = useReports();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [priority, setPriority] = useState("Todas");
  const [category, setCategory] = useState("Todas");
  const [sortBy, setSortBy] = useState<"recent" | "duration" | "client">("recent");
  const [compactView, setCompactView] = useState(false);
  const [showExtraColumns, setShowExtraColumns] = useState(true);

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
      <div className="flex flex-col gap-3 border-b border-border/70 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Vista tabla avanzada</p>
          <h3 className="text-lg font-bold">Partes de trabajo</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {hydrated ? `${filtered.length} resultados · ${totalHours} h acumuladas` : "Cargando partes..."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="w-full lg:w-80"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filtrar en tiempo real..."
          />
          <Select className="w-full lg:w-44" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>Todos</option>
            <option>Pendiente</option>
            <option>En seguimiento</option>
            <option>Resuelto</option>
            <option>Cerrado</option>
          </Select>
          <Select className="w-full lg:w-40" value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option>Todas</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </Select>
          <Select className="w-full lg:w-48" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select className="w-full lg:w-44" value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
            <option value="recent">Mas recientes</option>
            <option value="duration">Mayor duracion</option>
            <option value="client">Cliente A-Z</option>
          </Select>
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
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{formatDate(report.date)}</div>
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
