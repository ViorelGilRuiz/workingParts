import { Client, WorkReport } from "@/types";

export interface WorkingPartsRepository {
  readonly strategy: "local-browser" | "supabase";
  loadClients: () => Promise<Client[]>;
  saveClients: (clients: Client[]) => Promise<void>;
  loadReports: () => Promise<WorkReport[]>;
  saveReports: (reports: WorkReport[]) => Promise<void>;
}
