"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clients, reports as seedReports, teamMembers } from "@/data/demo";
import { useAuth } from "@/components/providers/auth-provider";
import { getReportAnalytics } from "@/lib/report-analytics";
import { WorkReport } from "@/types";

const STORAGE_KEY = "portal-incidencias-reports";

interface CreateReportInput {
  client: string;
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
  hydrated: boolean;
  analytics: ReturnType<typeof getReportAnalytics>;
  createReport: (input: CreateReportInput) => WorkReport;
  getReportById: (id: string) => WorkReport | undefined;
  updateReport: (id: string, updates: Partial<WorkReport>) => void;
  deleteReport: (id: string) => void;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);

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

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [reports, setReports] = useState<WorkReport[]>(seedReports);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedReports = window.localStorage.getItem(STORAGE_KEY);

      if (savedReports) {
        const parsedReports = JSON.parse(savedReports) as WorkReport[];
        if (Array.isArray(parsedReports) && parsedReports.length > 0) {
          setReports(parsedReports);
        }
      }
    } catch {
      setReports(seedReports);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [hydrated, reports]);

  const updateReport = useCallback((id: string, updates: Partial<WorkReport>) => {
    setReports((current) => current.map((report) => (report.id === id ? { ...report, ...updates } : report)));
  }, []);

  const deleteReport = useCallback((id: string) => {
    setReports((current) => current.filter((report) => report.id !== id));
  }, []);

  const value = useMemo<ReportsContextValue>(
    () => ({
      reports,
      hydrated,
      analytics: getReportAnalytics(reports),
      createReport: (input) => {
        const client = clients.find((item) => item.name === input.client);
        const technician =
          teamMembers.find((item) => item.id === input.technicianId) ??
          (user?.id === input.technicianId ? user : undefined);

        if (!client || !technician) {
          throw new Error("No se ha podido asociar el cliente o el técnico.");
        }

        const newReport: WorkReport = {
          id: getNextReportId(reports, input.date),
          date: input.date,
          technician: technician.name,
          technicianId: technician.id,
          client: client.name,
          company: client.company,
          contact: client.contact,
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
          attachments: 0,
          tags: buildTags(input.category, input.reason)
        };

        setReports((current) => [newReport, ...current]);
        return newReport;
      },
      getReportById: (id) => reports.find((report) => report.id === id),
      updateReport,
      deleteReport
    }),
    [deleteReport, hydrated, reports, updateReport, user]
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
