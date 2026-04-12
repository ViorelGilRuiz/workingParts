"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clients as seedClients, reports as seedReports, teamMembers } from "@/data/demo";
import { useAuth } from "@/components/providers/auth-provider";
import { useWorkspace } from "@/components/providers/workspace-provider";
import { createWorkingPartsRepository } from "@/lib/data";
import { getReportAnalytics } from "@/lib/report-analytics";
import {
  ActivityItem,
  Client,
  ReportDraft,
  SavedReportFilters,
  UserPreferences,
  WorkReport
} from "@/types";

interface CreateClientInput {
  name: string;
  company: string;
  contact: string;
  sector: string;
  city: string;
  sla: string;
}

interface CreateReportInput extends ReportDraft {}

interface ReportsContextValue {
  reports: WorkReport[];
  clients: Client[];
  hydrated: boolean;
  storageStrategy: "local-browser" | "supabase";
  analytics: ReturnType<typeof getReportAnalytics>;
  preferences: UserPreferences | null;
  recentActivity: ActivityItem[];
  suggestedClients: Client[];
  createClient: (input: CreateClientInput) => { client: Client; isDuplicate: boolean };
  createReport: (input: CreateReportInput) => WorkReport;
  getReportById: (id: string) => WorkReport | undefined;
  updateReport: (id: string, updates: Partial<WorkReport>) => void;
  deleteReport: (id: string) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  saveReportDraft: (draft: ReportDraft) => void;
  clearReportDraft: () => void;
  setSavedReportFilters: (filters: SavedReportFilters) => void;
  rememberSearch: (query: string) => void;
  trackRouteVisit: (route: string) => void;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);
const DEFAULT_HOURLY_RATE = 50;
const DEFAULT_FILTERS: SavedReportFilters = {
  query: "",
  status: "Todos",
  priority: "Todas",
  category: "Todas",
  sortBy: "recent",
  compactView: false,
  showExtraColumns: true
};

function normalizeReport(report: WorkReport): WorkReport {
  return {
    ...report,
    clientSignatureName: report.clientSignatureName ?? "",
    clientSignatureDataUrl: report.clientSignatureDataUrl ?? "",
    signedAt: report.signedAt ?? null,
    hourlyRate: report.hourlyRate ?? DEFAULT_HOURLY_RATE,
    maintenanceIncluded: report.maintenanceIncluded ?? true
  };
}

function normalizeClient(client: Client): Client {
  return {
    ...client,
    monthlyHours: client.monthlyHours ?? 0,
    recurringIssues: client.recurringIssues ?? 0
  };
}

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeClientKey(name: string, company: string) {
  return `${normalizeText(name).toLowerCase()}::${normalizeText(company).toLowerCase()}`;
}

function getNextReportId(items: WorkReport[], reportDate: string) {
  const year = new Date(reportDate).getFullYear();
  const yearPrefix = `PT-${year}-`;

  const currentMax = items.reduce((max, report) => {
    if (!report.id.startsWith(yearPrefix)) return max;
    const suffix = Number(report.id.split("-").at(-1));
    return Number.isFinite(suffix) ? Math.max(max, suffix) : max;
  }, 0);

  return `${yearPrefix}${String(currentMax + 1).padStart(3, "0")}`;
}

function getDurationHours(startTime: string, endTime: string) {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const total = (eh * 60 + em - (sh * 60 + sm)) / 60;
  return Number(Math.max(total, 0).toFixed(1));
}

function buildTags(category: string, reason: string) {
  const words = reason
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}/-]/gu, ""))
    .filter((word) => word.length > 4);

  return Array.from(new Set([category, ...words.slice(0, 3)])).slice(0, 4);
}

function createClientId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c-${Math.random().toString(36).slice(2, 10)}`;
}

function createActivity(type: ActivityItem["type"], title: string, description: string, entityId?: string): ActivityItem {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `a-${Math.random().toString(36).slice(2, 10)}`,
    type,
    title,
    description,
    entityId,
    createdAt: new Date().toISOString()
  };
}

function createDefaultPreferences(userId: string): UserPreferences {
  return {
    userId,
    favoriteView: "/app/dashboard",
    lastVisitedRoute: "/app/dashboard",
    recentClients: [],
    recentTechnicians: [],
    recentSearches: [],
    savedReportFilters: DEFAULT_FILTERS,
    reportDraft: null,
    reducedMotion: true,
    compactTables: false,
    savedFilters: [],
    recentClientIds: [],
    recentReportIds: []
  };
}

function limitRecent(items: string[], value: string, max = 6) {
  const normalized = normalizeText(value);
  return [normalized, ...items.filter((item) => item.toLowerCase() !== normalized.toLowerCase())].slice(0, max);
}

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { recordActivity, pushNotification, savePreferences: saveWorkspacePreferences } = useWorkspace();
  const [reports, setReports] = useState<WorkReport[]>(seedReports);
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const repository = useMemo(() => createWorkingPartsRepository(), []);

  useEffect(() => {
    const syncRepositoryState = async () => {
      try {
        const [storedReports, storedClients] = await Promise.all([repository.loadReports(), repository.loadClients()]);
        setReports(storedReports.map(normalizeReport));
        setClients(storedClients.map(normalizeClient));
      } catch {
        setReports(seedReports.map(normalizeReport));
        setClients(seedClients.map(normalizeClient));
      } finally {
        setHydrated(true);
      }
    };

    void syncRepositoryState();
  }, [repository]);

  useEffect(() => {
    if (!hydrated || !user) return;

    const syncUserState = async () => {
      const [storedPreferences, storedActivity] = await Promise.all([
        repository.loadPreferences(user.id),
        repository.loadActivity(user.id)
      ]);

      setPreferences(storedPreferences ?? createDefaultPreferences(user.id));
      setRecentActivity(storedActivity.slice(0, 12));
    };

    void syncUserState();
  }, [hydrated, repository, user]);

  useEffect(() => {
    if (!hydrated) return;
    void repository.saveReports(reports);
  }, [hydrated, reports, repository]);

  useEffect(() => {
    if (!hydrated) return;
    void repository.saveClients(clients);
  }, [clients, hydrated, repository]);

  useEffect(() => {
    if (!hydrated || !preferences || !user) return;
    void repository.savePreferences(preferences);
    void saveWorkspacePreferences({
      favoriteView: preferences.favoriteView,
      reducedMotion: preferences.reducedMotion,
      compactTables: preferences.compactTables,
      recentClientIds: preferences.recentClientIds,
      recentReportIds: preferences.recentReportIds
    });
  }, [hydrated, preferences, repository, saveWorkspacePreferences, user]);

  useEffect(() => {
    if (!hydrated || !user) return;
    void repository.saveActivity(user.id, recentActivity);
  }, [hydrated, recentActivity, repository, user]);

  const pushActivity = useCallback((item: ActivityItem) => {
    setRecentActivity((current) => [item, ...current].slice(0, 12));
  }, []);

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      setPreferences((current) => {
        if (!user) return current;
        const base = current ?? createDefaultPreferences(user.id);
        return { ...base, ...updates };
      });
    },
    [user]
  );

  const trackRouteVisit = useCallback(
    (route: string) => {
      if (!user) return;

      setPreferences((current) => {
        const base = current ?? createDefaultPreferences(user.id);
        if (base.lastVisitedRoute === route) return base;
        return {
          ...base,
          lastVisitedRoute: route,
          favoriteView: base.favoriteView || route
        };
      });
    },
    [user]
  );

  const rememberSearch = useCallback(
    (query: string) => {
      if (!user || !query.trim()) return;

      setPreferences((current) => {
        const base = current ?? createDefaultPreferences(user.id);
        return {
          ...base,
          recentSearches: limitRecent(base.recentSearches, query)
        };
      });
    },
    [user]
  );

  const setSavedReportFilters = useCallback(
    (filters: SavedReportFilters) => {
      if (!user) return;

      setPreferences((current) => {
        const base = current ?? createDefaultPreferences(user.id);
        return {
          ...base,
          savedReportFilters: filters
        };
      });
    },
    [user]
  );

  const saveReportDraft = useCallback(
    (draft: ReportDraft) => {
      if (!user) return;

      setPreferences((current) => {
        const base = current ?? createDefaultPreferences(user.id);
        return {
          ...base,
          reportDraft: draft
        };
      });
    },
    [user]
  );

  const clearReportDraft = useCallback(() => {
    if (!user) return;

    setPreferences((current) => {
      const base = current ?? createDefaultPreferences(user.id);
      return {
        ...base,
        reportDraft: null
      };
    });
  }, [user]);

  const createClient = useCallback(
    (input: CreateClientInput) => {
      const normalizedName = normalizeText(input.name);
      const normalizedCompany = normalizeText(input.company);
      const existing = clients.find(
        (item) => normalizeClientKey(item.name, item.company) === normalizeClientKey(normalizedName, normalizedCompany)
      );

      if (existing) {
        return { client: existing, isDuplicate: true };
      }

      const createdClient: Client = {
        id: createClientId(),
        name: normalizedName,
        company: normalizedCompany,
        contact: normalizeText(input.contact),
        sector: normalizeText(input.sector),
        city: normalizeText(input.city),
        monthlyHours: 0,
        recurringIssues: 0,
        sla: input.sla.trim()
      };

      setClients((current) => [createdClient, ...current]);
      pushActivity(createActivity("client_created", "Cliente creado", `${createdClient.name} ya forma parte de la cartera.`, createdClient.id));

      if (user) {
        void recordActivity({
          actorUserId: user.id,
          actorName: user.name,
          type: "report_updated",
          entityType: "client",
          entityId: createdClient.id,
          title: "Cliente registrado",
          description: `${user.name} ha creado el cliente ${createdClient.name}.`
        });
      }

      return { client: createdClient, isDuplicate: false };
    },
    [clients, pushActivity, recordActivity, user]
  );

  const updateReport = useCallback(
    (id: string, updates: Partial<WorkReport>) => {
      setReports((current) => current.map((report) => (report.id === id ? { ...report, ...updates } : report)));
      pushActivity(createActivity("report_updated", "Parte actualizado", `Se ha actualizado el parte ${id}.`, id));

      if (user) {
        void recordActivity({
          actorUserId: user.id,
          actorName: user.name,
          type: "report_updated",
          entityType: "report",
          entityId: id,
          title: "Parte actualizado",
          description: `${user.name} ha actualizado el parte ${id}.`
        });
      }
    },
    [pushActivity, recordActivity, user]
  );

  const deleteReport = useCallback(
    (id: string) => {
      setReports((current) => current.filter((report) => report.id !== id));
      pushActivity(createActivity("report_deleted", "Parte eliminado", `Se ha eliminado el parte ${id}.`, id));

      if (user) {
        void recordActivity({
          actorUserId: user.id,
          actorName: user.name,
          type: "report_deleted",
          entityType: "report",
          entityId: id,
          title: "Parte eliminado",
          description: `${user.name} ha eliminado el parte ${id}.`
        });
      }
    },
    [pushActivity, recordActivity, user]
  );

  const suggestedClients = useMemo(() => {
    if (!preferences?.recentClients?.length) return clients;

    const order = new Map(preferences.recentClients.map((item, index) => [item.toLowerCase(), index]));
    return [...clients].sort((a, b) => {
      const aRank = order.get(a.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
      const bRank = order.get(b.name.toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
      return aRank - bRank || a.name.localeCompare(b.name);
    });
  }, [clients, preferences?.recentClients]);

  const value = useMemo<ReportsContextValue>(
    () => ({
      reports,
      clients,
      hydrated,
      storageStrategy: repository.strategy,
      analytics: getReportAnalytics(reports),
      preferences,
      recentActivity,
      suggestedClients,
      createClient,
      createReport: (input) => {
        const selectedClient = clients.find(
          (item) => item.name.trim().toLowerCase() === input.client.trim().toLowerCase()
        );
        const technician =
          teamMembers.find((item) => item.id === input.technicianId) ??
          (user?.id === input.technicianId ? user : undefined);

        if (!technician) {
          throw new Error("No se ha podido asociar el tecnico.");
        }

        const clientName = selectedClient?.name ?? normalizeText(input.client);
        const company = selectedClient?.company ?? (normalizeText(input.company) || clientName);
        const contact = selectedClient?.contact ?? (normalizeText(input.contact) || "Pendiente de definir");

        const newReport: WorkReport = {
          id: getNextReportId(reports, input.date),
          date: input.date,
          technician: technician.name,
          technicianId: technician.id,
          client: clientName,
          company,
          contact,
          type: input.type,
          category: input.category,
          priority: input.priority,
          startTime: input.startTime,
          endTime: input.endTime,
          durationHours: getDurationHours(input.startTime, input.endTime),
          reason: normalizeText(input.reason),
          workDone: normalizeText(input.workDone),
          solution: normalizeText(input.solution),
          observations: input.observations?.trim() ?? "",
          status: input.status,
          hasSignature: input.hasSignature,
          clientSignatureName: "",
          clientSignatureDataUrl: "",
          signedAt: null,
          attachments: 0,
          hourlyRate: DEFAULT_HOURLY_RATE,
          maintenanceIncluded: true,
          tags: buildTags(input.category, input.reason)
        };

        setReports((current) => [newReport, ...current]);

        if (user) {
          setPreferences((current) => {
            const base = current ?? createDefaultPreferences(user.id);
            return {
              ...base,
              recentClients: limitRecent(base.recentClients, clientName),
              recentTechnicians: limitRecent(base.recentTechnicians, technician.id),
              recentClientIds: Array.from(new Set([clientName, ...base.recentClientIds])).slice(0, 6),
              recentReportIds: Array.from(new Set([newReport.id, ...base.recentReportIds])).slice(0, 8),
              reportDraft: null
            };
          });

          void Promise.all([
            recordActivity({
              actorUserId: user.id,
              actorName: user.name,
              type: "report_created",
              entityType: "report",
              entityId: newReport.id,
              title: "Parte registrado",
              description: `${user.name} ha registrado el parte ${newReport.id} para ${newReport.client}.`
            }),
            pushNotification({
              userId: user.id,
              type: newReport.status === "Pendiente" ? "warning" : "success",
              category: newReport.status === "Pendiente" ? "review" : "report",
              title: newReport.status === "Pendiente" ? "Parte pendiente de revision" : "Parte guardado",
              message:
                newReport.status === "Pendiente"
                  ? `${newReport.id} ha quedado pendiente y visible para seguimiento.`
                  : `${newReport.id} se ha guardado correctamente para ${newReport.client}.`,
              link: `/app/partes/${newReport.id}`
            })
          ]);
        }

        pushActivity(createActivity("report_created", "Parte creado", `${newReport.id} para ${clientName}.`, newReport.id));
        return newReport;
      },
      getReportById: (id) => reports.find((report) => report.id === id),
      updateReport,
      deleteReport,
      updatePreferences,
      saveReportDraft,
      clearReportDraft,
      setSavedReportFilters,
      rememberSearch,
      trackRouteVisit
    }),
    [
      clients,
      createClient,
      deleteReport,
      hydrated,
      preferences,
      pushActivity,
      pushNotification,
      recentActivity,
      recordActivity,
      rememberSearch,
      reports,
      repository.strategy,
      saveReportDraft,
      setSavedReportFilters,
      suggestedClients,
      trackRouteVisit,
      updatePreferences,
      updateReport,
      user
    ]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const context = useContext(ReportsContext);

  if (!context) {
    throw new Error("useReports must be used within ReportsProvider");
  }

  return context;
}
