"use client";

import { useMemo, useState } from "react";
import { Building2, Mail, MapPin, Plus, ShieldCheck, Users2 } from "lucide-react";
import { useReports } from "@/components/providers/reports-provider";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const initialClientForm = {
  name: "",
  company: "",
  contact: "",
  sector: "Servicios",
  city: "",
  sla: "24h"
};

export default function ClientsPage() {
  const { clients, createClient, reports } = useReports();
  const [message, setMessage] = useState("");
  const [clientForm, setClientForm] = useState(initialClientForm);

  const clientCards = useMemo(() => {
    return clients.map((client) => {
      const clientReports = reports.filter((report) => report.client === client.name);
      const totalHours = clientReports.reduce((sum, report) => sum + report.durationHours, 0);
      const totalBilling = clientReports.reduce((sum, report) => sum + report.durationHours * report.hourlyRate, 0);
      const openReports = clientReports.filter((report) => report.status === "Pendiente" || report.status === "En seguimiento").length;

      return {
        ...client,
        totalHours,
        totalBilling,
        openReports,
        lastVisit: clientReports[0]?.date ?? null
      };
    });
  }, [clients, reports]);

  const handleCreateClient = () => {
    if (!clientForm.name.trim() || !clientForm.company.trim() || !clientForm.contact.trim()) {
      setMessage("Completa al menos nombre, empresa y contacto.");
      return;
    }

    const { client: created, isDuplicate } = createClient(clientForm);
    setClientForm(initialClientForm);
    setMessage(
      isDuplicate
        ? `El cliente ${created.name} ya existia y se ha reutilizado.`
        : `Cliente ${created.name} guardado correctamente.`
    );
  };

  return (
    <div className="space-y-6">
      <Topbar title="Clientes" />

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">Nuevo cliente</p>
            <h3 className="text-xl font-bold">Alta rapida y ordenada</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Nombre comercial</label>
              <Input
                value={clientForm.name}
                onChange={(event) => setClientForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Cliente principal"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Empresa / razon social</label>
              <Input
                value={clientForm.company}
                onChange={(event) => setClientForm((current) => ({ ...current, company: event.target.value }))}
                placeholder="Empresa SL"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Contacto</label>
              <Input
                value={clientForm.contact}
                onChange={(event) => setClientForm((current) => ({ ...current, contact: event.target.value }))}
                placeholder="Persona responsable"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sector</label>
              <Input
                value={clientForm.sector}
                onChange={(event) => setClientForm((current) => ({ ...current, sector: event.target.value }))}
                placeholder="Servicios"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Ciudad</label>
              <Input
                value={clientForm.city}
                onChange={(event) => setClientForm((current) => ({ ...current, city: event.target.value }))}
                placeholder="Madrid"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SLA</label>
              <Select
                value={clientForm.sla}
                onChange={(event) => setClientForm((current) => ({ ...current, sla: event.target.value }))}
              >
                <option value="2h">2h</option>
                <option value="4h">4h</option>
                <option value="8h">8h</option>
                <option value="24h">24h</option>
              </Select>
            </div>
          </div>

          <Button type="button" className="w-full" onClick={handleCreateClient}>
            <Plus className="mr-2 h-4 w-4" />
            Guardar cliente
          </Button>

          {message ? <p className="text-sm text-primary">{message}</p> : null}
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-muted-foreground">Clientes guardados</p>
            <p className="mt-3 text-3xl font-extrabold">{clients.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Cartera real disponible</p>
          </Card>
          <Card>
            <p className="text-sm text-muted-foreground">Facturacion visible</p>
            <p className="mt-3 text-3xl font-extrabold">
              {formatCurrency(clientCards.reduce((sum, client) => sum + client.totalBilling, 0))}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Calculada desde tickets reales</p>
          </Card>
          <Card className="bg-gradient-to-br from-primary/12 via-card to-secondary/12">
            <p className="text-sm text-muted-foreground">Estado de cartera</p>
            <p className="mt-3 text-2xl font-extrabold">{clients.length === 0 ? "Lista para arrancar" : "Operativa"}</p>
            <p className="mt-2 text-sm text-muted-foreground">Todo queda preparado para crecer sin datos ficticios</p>
          </Card>
        </section>
      </section>

      {clientCards.length === 0 ? (
        <Card className="rounded-[32px] border-dashed border-border/70 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Users2 className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-xl font-bold">Todavia no hay clientes cargados</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Usa el formulario superior para crear la cartera desde cero. Luego podras asignarles tickets, horas,
            facturas y firmas.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_0.92fr]">
          <div className="space-y-4">
            {clientCards.map((client) => (
              <Card key={client.id} className="relative overflow-hidden">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{client.sector}</p>
                        <h3 className="text-xl font-bold">{client.name}</h3>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-primary/10 text-primary">{client.sla}</Badge>
                      <Badge className="bg-muted text-muted-foreground">{client.contact}</Badge>
                      <Badge className="bg-muted text-muted-foreground">{client.city || "Sin ciudad"}</Badge>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-border/60 bg-background/60 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Facturacion</p>
                    <p className="mt-2 text-2xl font-extrabold">{formatCurrency(client.totalBilling)}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">Horas</p>
                    <p className="font-semibold">{client.totalHours.toFixed(1)} h</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">Tickets</p>
                    <p className="font-semibold">{reports.filter((report) => report.client === client.name).length}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="font-semibold">{client.openReports}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/40 p-3">
                    <p className="text-sm text-muted-foreground">Ultima visita</p>
                    <p className="font-semibold">{client.lastVisit ? formatDate(client.lastVisit) : "Sin tickets"}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <p className="text-sm text-muted-foreground">Historial vinculado</p>
            <h3 className="text-xl font-bold">Ultimos trabajos realizados</h3>
            <div className="mt-6 space-y-4">
              {reports.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-border/70 p-5 text-sm text-muted-foreground">
                  Aun no hay tickets asociados. Cuando el tecnico registre partes, esta zona mostrara actividad por
                  cliente, importes y seguimiento.
                </div>
              ) : (
                reports.slice(0, 8).map((report) => (
                  <div key={report.id} className="rounded-2xl border border-border/60 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{report.client}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{report.reason}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge className="bg-primary/10 text-primary">{report.category}</Badge>
                          <Badge className="bg-muted text-muted-foreground">{formatDate(report.date)}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(report.durationHours * report.hourlyRate)}</p>
                        <p className="text-sm text-muted-foreground">{report.durationHours} h</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 rounded-[24px] bg-primary/8 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Cartera preparada para crecer
              </div>
              <p className="mt-2">
                Cada cliente queda listo para tickets, horas, PDF de factura y seguimiento por parte del jefe o
                administracion.
              </p>
            </div>

            <div className="mt-4 rounded-[24px] bg-muted/35 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                Siguiente paso recomendado
              </div>
              <p className="mt-2">Conecta esta cartera con envio real de presupuestos y facturas cuando quieras.</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
