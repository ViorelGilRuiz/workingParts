"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileUp, Plus, Sparkles, TimerReset } from "lucide-react";
import { teamMembers } from "@/data/demo";
import { useAuth } from "@/components/providers/auth-provider";
import { useReports } from "@/components/providers/reports-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IBERSOFT_BRAND } from "@/lib/exports";
import { ticketTemplates } from "@/lib/constants";

const formSchema = z.object({
  client: z.string().min(1, "Indica el nombre del cliente"),
  company: z.string().min(1, "Indica la razon social o empresa"),
  contact: z.string().min(1, "Indica la persona de contacto"),
  technicianId: z.string().min(1),
  date: z.string().min(1),
  type: z.string().min(1),
  category: z.string().min(1),
  priority: z.string().min(1),
  status: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  reason: z.string().min(10),
  workDone: z.string().min(10),
  solution: z.string().min(10),
  observations: z.string().optional(),
  hasSignature: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;
const DRAFT_STORAGE_KEY = "workingparts:report-draft";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export function ReportForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { clients, createReport, reports } = useReports();
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [draftRecovered, setDraftRecovered] = useState(false);

  const selectableTechnicians = useMemo(() => {
    const baseMembers = teamMembers.filter((member) => member.role !== "admin");
    if (!user || user.role === "admin" || baseMembers.some((member) => member.id === user.id)) {
      return baseMembers;
    }

    return [...baseMembers, user];
  }, [user]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: "",
      company: "",
      contact: "",
      technicianId: user && user.role !== "admin" ? user.id : selectableTechnicians[0]?.id ?? "",
      date: getToday(),
      type: "Remoto",
      category: "Office 365",
      priority: "Media",
      status: "Pendiente",
      startTime: "09:00",
      endTime: "10:00",
      reason: "",
      workDone: "",
      solution: "",
      observations: "",
      hasSignature: false
    }
  });

  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const selectedClient = form.watch("client");
  const reason = form.watch("reason");

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!savedDraft) return;
      const parsedDraft = JSON.parse(savedDraft) as Partial<FormValues>;
      form.reset({
        ...form.getValues(),
        ...parsedDraft
      });
      setDraftRecovered(true);
    } catch {
      setDraftRecovered(false);
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const matchedClient = clients.find((item) => item.name.trim().toLowerCase() === selectedClient.trim().toLowerCase());
    if (!matchedClient) return;

    form.setValue("company", matchedClient.company, { shouldDirty: true });
    form.setValue("contact", matchedClient.contact, { shouldDirty: true });
  }, [clients, form, selectedClient]);

  const duration = useMemo(() => {
    if (!startTime || !endTime) return "0.0 h";
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const total = (eh * 60 + em - (sh * 60 + sm)) / 60;
    return `${Math.max(total, 0).toFixed(1)} h`;
  }, [endTime, startTime]);

  const possibleDuplicates = useMemo(
    () =>
      reports
        .filter(
          (report) =>
            selectedClient.trim() &&
            report.client.trim().toLowerCase() === selectedClient.trim().toLowerCase() &&
            reason.trim() &&
            report.reason.toLowerCase().includes(reason.trim().toLowerCase().slice(0, 12))
        )
        .slice(0, 2),
    [reason, reports, selectedClient]
  );

  const onSubmit = form.handleSubmit((values) => {
    const report = createReport({
      client: values.client,
      company: values.company,
      contact: values.contact,
      technicianId: values.technicianId,
      date: values.date,
      type: values.type,
      category: values.category,
      priority: values.priority as "Alta" | "Media" | "Baja",
      status: values.status as "Pendiente" | "Resuelto" | "En seguimiento" | "Cerrado",
      startTime: values.startTime,
      endTime: values.endTime,
      reason: values.reason,
      workDone: values.workDone,
      solution: values.solution,
      observations: values.observations,
      hasSignature: values.hasSignature
    });

    form.reset({
      client: values.client,
      company: values.company,
      contact: values.contact,
      technicianId: values.technicianId,
      date: values.date,
      type: values.type,
      category: values.category,
      priority: "Media",
      status: "Pendiente",
      startTime: values.endTime,
      endTime: values.endTime,
      reason: "",
      workDone: "",
      solution: "",
      observations: "",
      hasSignature: false
    });
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);

    router.push(`/app/partes/${report.id}`);
  });

  const saveDraft = () => {
    const values = form.getValues();
    const report = createReport({
      client: values.client,
      company: values.company,
      contact: values.contact,
      technicianId: values.technicianId,
      date: values.date,
      type: values.type,
      category: values.category,
      priority: values.priority as "Alta" | "Media" | "Baja",
      status: "Pendiente",
      startTime: values.startTime,
      endTime: values.endTime,
      reason: values.reason.trim() || "Borrador pendiente de completar",
      workDone: values.workDone.trim() || "Pendiente de documentar",
      solution: values.solution.trim() || "Pendiente de documentar",
      observations: values.observations,
      hasSignature: values.hasSignature
    });

    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form.getValues()));
    router.push(`/app/partes/${report.id}`);
  };

  const applyTemplate = (templateId: string) => {
    const template = ticketTemplates.find((item) => item.id === templateId);
    if (!template) return;

    form.setValue("category", template.category);
    form.setValue("type", template.type);
    form.setValue("priority", template.priority);
    form.setValue("reason", template.reason);
    form.setValue("workDone", template.workDone);
    form.setValue("solution", template.solution);
    form.setValue("observations", `Plantilla aplicada: ${template.title}`);
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Alta rapida de intervencion</p>
          <h3 className="text-xl font-bold">Nuevo ticket tecnico</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Duracion estimada: {duration}
          </div>
          <div className="rounded-2xl bg-secondary/15 px-4 py-2 text-sm font-semibold text-secondary-foreground">
            Tarifa base {IBERSOFT_BRAND.hourlyRate} EUR/h
          </div>
        </div>
      </div>

      <form className="grid gap-4 lg:grid-cols-2" onSubmit={onSubmit}>
        {draftRecovered ? (
          <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300 lg:col-span-2">
            Se ha recuperado un borrador automatico de este formulario para que puedas continuar.
          </div>
        ) : null}

        <div className="rounded-[24px] border border-border/60 bg-background/35 p-4 lg:col-span-2">
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Flujo pensado para registrar rapido
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
              <TimerReset className="h-4 w-4 text-primary" />
              Calculo automatico de tiempo
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Preparado para PDF y firma
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-border/60 bg-background/35 p-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Plantillas de ticket</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Rellena el parte mas rapido con patrones habituales de soporte, cloud, backup e infraestructura.
              </p>
            </div>
            {clients.length === 0 ? (
              <Button variant="outline" type="button" asChild>
                <Link href="/app/clientes">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primer cliente
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-3">
            {ticketTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template.id)}
                className="rounded-[22px] border border-border/70 bg-background/60 p-4 text-left transition hover:border-primary/40 hover:bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <template.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{template.label}</p>
                    <p className="text-xs text-muted-foreground">{template.title}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cliente</label>
          <Input list="clients-list" placeholder="Nombre comercial del cliente" {...form.register("client")} />
          <datalist id="clients-list">
            {clients.map((client) => (
              <option key={client.id} value={client.name} />
            ))}
          </datalist>
          <p className="text-xs text-muted-foreground">
            {clients.length > 0
              ? "Puedes escribir o elegir un cliente existente."
              : "Todavia no hay clientes guardados. Puedes escribir uno manualmente o crearlo en Clientes."}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tecnico</label>
          <Select {...form.register("technicianId")}>
            {selectableTechnicians.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Empresa / razon social</label>
          <Input placeholder="Ibersoft cliente SL" {...form.register("company")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contacto principal</label>
          <Input placeholder="Persona que valida el servicio" {...form.register("contact")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha</label>
          <Input type="date" {...form.register("date")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de trabajo</label>
          <Select {...form.register("type")}>
            <option>Remoto</option>
            <option>Presencial</option>
            <option>Mixto</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <Select {...form.register("category")}>
            <option>Office 365</option>
            <option>Impresoras</option>
            <option>Redes</option>
            <option>Copias de seguridad</option>
            <option>RDP / TSplus</option>
            <option>Windows</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prioridad</label>
          <Select {...form.register("priority")}>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Estado inicial</label>
          <Select {...form.register("status")}>
            <option>Pendiente</option>
            <option>En seguimiento</option>
            <option>Resuelto</option>
            <option>Cerrado</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hora de inicio</label>
          <Input type="time" {...form.register("startTime")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Hora de fin</label>
          <Input type="time" {...form.register("endTime")} />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium">Motivo / incidencia</label>
          <Textarea placeholder="Describe el problema detectado por el cliente..." {...form.register("reason")} />
          {possibleDuplicates.length > 0 ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              Posibles duplicados detectados: {possibleDuplicates.map((item) => item.id).join(", ")}.
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Trabajo realizado</label>
          <Textarea placeholder="Indica las comprobaciones y acciones realizadas..." {...form.register("workDone")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Solucion aplicada</label>
          <Textarea placeholder="Documenta la solucion final aplicada..." {...form.register("solution")} />
        </div>

        <div className="space-y-2 lg:col-span-2">
          <label className="text-sm font-medium">Observaciones</label>
          <Textarea placeholder="Notas internas, seguimiento o recomendaciones..." {...form.register("observations")} />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/40 px-4 py-3 text-sm font-medium lg:col-span-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            {...form.register("hasSignature")}
          />
          Marcar si el parte ya cuenta con firma del cliente
        </label>

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <Button type="submit">Guardar parte</Button>
          <Button type="button" variant="outline" onClick={saveDraft}>
            Guardar borrador
          </Button>
          <input
            ref={attachmentInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => setAttachmentCount(event.target.files?.length ?? 0)}
          />
          <Button type="button" variant="ghost" onClick={() => attachmentInputRef.current?.click()}>
            <FileUp className="mr-2 h-4 w-4" />
            {attachmentCount > 0 ? `Adjuntos: ${attachmentCount}` : "Adjuntar evidencias"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
