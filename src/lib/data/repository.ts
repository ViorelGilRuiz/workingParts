import { ActivityItem, Client, UserPreferences, WorkReport } from "@/types";

export interface WorkingPartsRepository {
  readonly strategy: "local-browser" | "supabase";
  loadClients: () => Promise<Client[]>;
  saveClients: (clients: Client[]) => Promise<void>;
  loadReports: () => Promise<WorkReport[]>;
  saveReports: (reports: WorkReport[]) => Promise<void>;
  loadPreferences: (userId: string) => Promise<UserPreferences | null>;
  savePreferences: (preferences: UserPreferences) => Promise<void>;
  loadActivity: (userId: string) => Promise<ActivityItem[]>;
  saveActivity: (userId: string, items: ActivityItem[]) => Promise<void>;
}
