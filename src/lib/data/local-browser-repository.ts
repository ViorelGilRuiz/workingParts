import { clients as seedClients, reports as seedReports } from "@/data/demo";
import { ActivityItem, Client, UserPreferences, WorkReport } from "@/types";
import { activityItemListSchema, clientListSchema, userPreferencesSchema, workReportListSchema } from "@/lib/data/schemas";
import { WorkingPartsRepository } from "@/lib/data/repository";

const CLIENTS_STORAGE_KEY = "portal-incidencias-clients";
const REPORTS_STORAGE_KEY = "portal-incidencias-reports";
const PREFERENCES_STORAGE_KEY = "portal-incidencias-preferences";
const ACTIVITY_STORAGE_KEY = "portal-incidencias-activity";

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

function readDictionary<T>(key: string): Record<string, T> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, T>) : {};
  } catch {
    return {};
  }
}

function writeDictionary<T>(key: string, value: Record<string, T>) {
  window.localStorage.setItem(key, JSON.stringify(value));
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
    },
    async loadPreferences(userId) {
      const items = readDictionary<unknown>(PREFERENCES_STORAGE_KEY);
      const raw = items[userId];
      if (!raw) return null;
      return userPreferencesSchema.parse(raw);
    },
    async savePreferences(preferences) {
      const items = readDictionary<UserPreferences>(PREFERENCES_STORAGE_KEY);
      items[preferences.userId] = preferences;
      writeDictionary(PREFERENCES_STORAGE_KEY, items);
    },
    async loadActivity(userId) {
      const items = readDictionary<unknown>(ACTIVITY_STORAGE_KEY);
      const raw = items[userId];
      if (!raw) return [];
      return activityItemListSchema.parse(raw);
    },
    async saveActivity(userId, items) {
      const dictionary = readDictionary<ActivityItem[]>(ACTIVITY_STORAGE_KEY);
      dictionary[userId] = items;
      writeDictionary(ACTIVITY_STORAGE_KEY, dictionary);
    }
  };
}
