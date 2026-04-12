export type Role = "technician" | "supervisor" | "admin";

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar: string;
  avatarUrl?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  bio?: string;
  authSource?: "local" | "supabase";
}

export interface SavedReportFilters {
  query: string;
  status: string;
  priority: string;
  category: string;
  sortBy: "recent" | "duration" | "client";
  compactView: boolean;
  showExtraColumns: boolean;
}

export interface ReportDraft {
  client: string;
  company: string;
  contact: string;
  technicianId: string;
  date: string;
  type: string;
  category: string;
  priority: WorkReport["priority"];
  status: WorkReport["status"];
  startTime: string;
  endTime: string;
  reason: string;
  workDone: string;
  solution: string;
  observations: string;
  hasSignature: boolean;
}

export interface UserPreferences {
  userId: string;
  favoriteView: string;
  lastVisitedRoute: string;
  recentClients: string[];
  recentTechnicians: string[];
  recentSearches: string[];
  savedReportFilters: SavedReportFilters;
  reportDraft: ReportDraft | null;
}

export interface ActivityItem {
  id: string;
  type: "client_created" | "report_created" | "report_updated" | "report_deleted" | "view_changed" | "filters_updated";
  title: string;
  description: string;
  entityId?: string;
  createdAt: string;
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
  clientSignatureName: string;
  clientSignatureDataUrl: string;
  signedAt: string | null;
  attachments: number;
  hourlyRate: number;
  maintenanceIncluded: boolean;
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
