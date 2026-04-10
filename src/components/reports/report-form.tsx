"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileUp, Sparkles, TimerReset } from "lucide-react";
import { clients, teamMembers } from "@/data/demo";
import { useAuth } from "@/components/providers/auth-provider";
import { useReports } from "@/components/providers/reports-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  client: z.string().min(1),
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

export function ReportForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { createReport } = useReports();
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
      client: clients[0].name,
      technicianId: user && user.role !== "admin" ? user.id : teamMembers[1].id,
      date: "2026-04-09",
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

  const duration = useMemo(() => {
    if (!startTime || !endTime) return "0.0 h";
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const total = (eh * 60 + em - (sh * 60 + sm)) / 60;
    return `${Math.max(total, 0).toFixed(1)} h`;
  }, [endTime, startTime]);

  const onSubmit = form.handleSubmit((values) => {
    const report = createReport({
      client: values.client,
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

    router.push(`/app/partes/${report.id}`);
  });

  const saveDraft = () => {
    const values = form.getValues();
    const report = createReport({
      client: values.client,
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

    router.push(`/app/partes/${report.id}`);
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/10 blur-3xl" />
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Alta rápida de intervención</p>
          <h3 className="text-xl font-bold">Nuevo parte técnico</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Duración estimada: {duration}
          </div>
          <div className="rounded-2xl bg-secondary/15 px-4 py-2 text-sm font-semibold text-secondary-foreground">
            Autoguardado listo para backend
          </div>
        </div>
      </div>

      <form className="grid gap-4 lg:grid-cols-2" onSubmit={onSubmit}>
        <div className="rounded-[24px] border border-border/60 bg-background/35 p-4 lg:col-span-2">
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Flujo pensado para registrar rápido
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
              <TimerReset className="h-4 w-4 text-primary" />
              Cálculo automático de tiempo
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Trazabilidad lista para supervisión
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cliente</label>
          <Select {...form.register("client")}>
            {clients.map((client) => (
              <option key={client.id} value={client.name}>
                {client.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Técnico</label>
          <Select {...form.register("technicianId")}>
            {selectableTechnicians.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
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
          <label className="text-sm font-medium">Categoría</label>
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
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Trabajo realizado</label>
          <Textarea placeholder="Indica las comprobaciones y acciones realizadas..." {...form.register("workDone")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Solución aplicada</label>
          <Textarea placeholder="Documenta la solución final aplicada..." {...form.register("solution")} />
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
          <Button type="button" variant="ghost">
            <FileUp className="mr-2 h-4 w-4" />
            Adjuntar evidencias
          </Button>
        </div>
      </form>
    </Card>
  );
}
