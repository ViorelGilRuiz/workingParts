"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clients as seedClients, reports as seedReports, teamMembers } from "@/data/demo";
import { useAuth } from "@/components/providers/auth-provider";
import { getReportAnalytics } from "@/lib/report-analytics";
import { Client, WorkReport } from "@/types";

const REPORTS_STORAGE_KEY = "portal-incidencias-reports";
const CLIENTS_STORAGE_KEY = "portal-incidencias-clients";

interface CreateClientInput {
  name: string;
  company: string;
  contact: string;
  sector: string;
  city: string;
  sla: string;
}

interface CreateReportInput {
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
  observations?: string;
  hasSignature: boolean;
}

interface ReportsContextValue {
  reports: WorkReport[];
  clients: Client[];
  hydrated: boolean;
  analytics: ReturnType<typeof getReportAnalytics>;
  createClient: (input: CreateClientInput) => Client;
  createReport: (input: CreateReportInput) => WorkReport;
  getReportById: (id: string) => WorkReport | undefined;
  updateReport: (id: string, updates: Partial<WorkReport>) => void;
  deleteReport: (id: string) => void;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);
const DEFAULT_HOURLY_RATE = 50;

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
  return `c-${Math.random().toString(36).slice(2, 10)}`;
}

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [reports, setReports] = useState<WorkReport[]>(seedReports);
  const [clients, setClients] = useState<Client[]>(seedClients);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedReports = window.localStorage.getItem(REPORTS_STORAGE_KEY);
      const savedClients = window.localStorage.getItem(CLIENTS_STORAGE_KEY);

      if (savedReports) {
        const parsedReports = (JSON.parse(savedReports) as WorkReport[]).map(normalizeReport);
        if (Array.isArray(parsedReports)) {
          setReports(parsedReports);
        }
      }

      if (savedClients) {
        const parsedClients = (JSON.parse(savedClients) as Client[]).map(normalizeClient);
        if (Array.isArray(parsedClients)) {
          setClients(parsedClients);
        }
      }
    } catch {
      setReports(seedReports.map(normalizeReport));
      setClients(seedClients.map(normalizeClient));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  }, [hydrated, reports]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  }, [clients, hydrated]);

  const createClient = useCallback((input: CreateClientInput) => {
    const normalizedName = input.name.trim().toLowerCase();
    const existing = clients.find((item) => item.name.trim().toLowerCase() === normalizedName);

    if (existing) {
      return existing;
    }

    const createdClient: Client = {
      id: createClientId(),
      name: input.name.trim(),
      company: input.company.trim(),
      contact: input.contact.trim(),
      sector: input.sector.trim(),
      city: input.city.trim(),
      monthlyHours: 0,
      recurringIssues: 0,
      sla: input.sla.trim()
    };

    setClients((current) => [createdClient, ...current]);
    return createdClient;
  }, [clients]);

  const updateReport = useCallback((id: string, updates: Partial<WorkReport>) => {
    setReports((current) => current.map((report) => (report.id === id ? { ...report, ...updates } : report)));
  }, []);

  const deleteReport = useCallback((id: string) => {
    setReports((current) => current.filter((report) => report.id !== id));
  }, []);

  const value = useMemo<ReportsContextValue>(
    () => ({
      reports,
      clients,
      hydrated,
      analytics: getReportAnalytics(reports),
      createClient,
      createReport: (input) => {
        const selectedClient = clients.find((item) => item.name.trim().toLowerCase() === input.client.trim().toLowerCase());
        const technician =
          teamMembers.find((item) => item.id === input.technicianId) ??
          (user?.id === input.technicianId ? user : undefined);

        if (!technician) {
          throw new Error("No se ha podido asociar el tecnico.");
        }

        const clientName = selectedClient?.name ?? input.client.trim();
        const company = selectedClient?.company ?? (input.company.trim() || clientName);
        const contact = selectedClient?.contact ?? (input.contact.trim() || "Pendiente de definir");

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
          reason: input.reason.trim(),
          workDone: input.workDone.trim(),
          solution: input.solution.trim(),
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
        return newReport;
      },
      getReportById: (id) => reports.find((report) => report.id === id),
      updateReport,
      deleteReport
    }),
    [clients, createClient, deleteReport, hydrated, reports, updateReport, user]
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
