export type Role = "technician" | "supervisor" | "admin";

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  contact: string;
  sector: string;
  city: string;
  monthlyHours: number;
  recurringIssues: number;
  sla: string;
}

export interface WorkReport {
  id: string;
  date: string;
  technician: string;
  technicianId: string;
  client: string;
  company: string;
  contact: string;
  type: string;
  category: string;
  priority: "Alta" | "Media" | "Baja";
  startTime: string;
  endTime: string;
  durationHours: number;
  reason: string;
  workDone: string;
  solution: string;
  observations: string;
  status: "Pendiente" | "Resuelto" | "En seguimiento" | "Cerrado";
  hasSignature: boolean;
  attachments: number;
  tags: string[];
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  helper: string;
}

export interface MonthlyMetric {
  month: string;
  reports: number;
  hours: number;
  billable: number;
}

export interface IncidentTrend {
  label: string;
  value: number;
}

export interface ReportAnalytics {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  averageResolutionHours: number;
  uniqueClients: number;
  mostFrequentCategory: string;
  topTechnicians: { name: string; hours: number; reports: number }[];
  clientSummaries: {
    clientId: string;
    name: string;
    hours: number;
    reports: number;
    repeatedIssues: number;
    lastVisit: string | null;
  }[];
  monthlySummary: MonthlyMetric[];
  incidentSummary: IncidentTrend[];
}
