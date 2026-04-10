import { z } from "zod";

export const roleSchema = z.enum(["technician", "supervisor", "admin"]);

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  company: z.string(),
  contact: z.string(),
  sector: z.string(),
  city: z.string(),
  monthlyHours: z.number(),
  recurringIssues: z.number(),
  sla: z.string()
});

export const workReportSchema = z.object({
  id: z.string(),
  date: z.string(),
  technician: z.string(),
  technicianId: z.string(),
  client: z.string(),
  company: z.string(),
  contact: z.string(),
  type: z.string(),
  category: z.string(),
  priority: z.enum(["Alta", "Media", "Baja"]),
  startTime: z.string(),
  endTime: z.string(),
  durationHours: z.number(),
  reason: z.string(),
  workDone: z.string(),
  solution: z.string(),
  observations: z.string(),
  status: z.enum(["Pendiente", "Resuelto", "En seguimiento", "Cerrado"]),
  hasSignature: z.boolean(),
  clientSignatureName: z.string(),
  clientSignatureDataUrl: z.string(),
  signedAt: z.string().nullable(),
  attachments: z.number(),
  hourlyRate: z.number(),
  maintenanceIncluded: z.boolean(),
  tags: z.array(z.string())
});

export const clientListSchema = z.array(clientSchema);
export const workReportListSchema = z.array(workReportSchema);
