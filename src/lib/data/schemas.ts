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

export const savedReportFiltersSchema = z.object({
  query: z.string(),
  status: z.string(),
  priority: z.string(),
  category: z.string(),
  sortBy: z.enum(["recent", "duration", "client"]),
  compactView: z.boolean(),
  showExtraColumns: z.boolean()
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

export const reportDraftSchema = z.object({
  client: z.string(),
  company: z.string(),
  contact: z.string(),
  technicianId: z.string(),
  date: z.string(),
  type: z.string(),
  category: z.string(),
  priority: z.enum(["Alta", "Media", "Baja"]),
  status: z.enum(["Pendiente", "Resuelto", "En seguimiento", "Cerrado"]),
  startTime: z.string(),
  endTime: z.string(),
  reason: z.string(),
  workDone: z.string(),
  solution: z.string(),
  observations: z.string(),
  hasSignature: z.boolean()
});

export const userPreferencesSchema = z.object({
  userId: z.string(),
  favoriteView: z.string(),
  lastVisitedRoute: z.string(),
  recentClients: z.array(z.string()),
  recentTechnicians: z.array(z.string()),
  recentSearches: z.array(z.string()),
  savedReportFilters: savedReportFiltersSchema,
  reportDraft: reportDraftSchema.nullable(),
  reducedMotion: z.boolean().default(false),
  compactTables: z.boolean().default(false),
  savedFilters: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        query: z.string()
      })
    )
    .default([]),
  recentClientIds: z.array(z.string()).default([]),
  recentReportIds: z.array(z.string()).default([])
});

export const activityItemSchema = z.object({
  id: z.string(),
  type: z.enum(["client_created", "report_created", "report_updated", "report_deleted", "view_changed", "filters_updated"]),
  title: z.string(),
  description: z.string(),
  entityId: z.string().optional(),
  createdAt: z.string()
});

export const clientListSchema = z.array(clientSchema);
export const workReportListSchema = z.array(workReportSchema);
export const activityItemListSchema = z.array(activityItemSchema);
