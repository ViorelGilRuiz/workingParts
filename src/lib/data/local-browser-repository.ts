import { clients as seedClients, reports as seedReports } from "@/data/demo";
import { Client, WorkReport } from "@/types";
import { clientListSchema, workReportListSchema } from "@/lib/data/schemas";
import { WorkingPartsRepository } from "@/lib/data/repository";

const CLIENTS_STORAGE_KEY = "portal-incidencias-clients";
const REPORTS_STORAGE_KEY = "portal-incidencias-reports";

function normalizeClient(client: Client): Client {
  return {
    ...client,
    monthlyHours: client.monthlyHours ?? 0,
    recurringIssues: client.recurringIssues ?? 0
  };
}

function normalizeReport(report: WorkReport): WorkReport {
  return {
    ...report,
    clientSignatureName: report.clientSignatureName ?? "",
    clientSignatureDataUrl: report.clientSignatureDataUrl ?? "",
    signedAt: report.signedAt ?? null,
    hourlyRate: report.hourlyRate ?? 50,
    maintenanceIncluded: report.maintenanceIncluded ?? true
  };
}

function readParsedValue<T>(key: string, fallback: T, parse: (value: unknown) => T) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return parse(JSON.parse(raw));
  } catch {
    return fallback;
  }
}

export function createLocalBrowserRepository(): WorkingPartsRepository {
  return {
    strategy: "local-browser",
    async loadClients() {
      return readParsedValue(CLIENTS_STORAGE_KEY, seedClients.map(normalizeClient), (value) =>
        clientListSchema.parse(value).map(normalizeClient)
      );
    },
    async saveClients(clients) {
      window.localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
    },
    async loadReports() {
      return readParsedValue(REPORTS_STORAGE_KEY, seedReports.map(normalizeReport), (value) =>
        workReportListSchema.parse(value).map(normalizeReport)
      );
    },
    async saveReports(reports) {
      window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    }
  };
}
