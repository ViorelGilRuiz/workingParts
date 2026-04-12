import { clients as seedClients, reports as seedReports } from "@/data/demo";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { WorkingPartsRepository } from "@/lib/data/repository";
import { ActivityItem, Client, UserPreferences, WorkReport } from "@/types";

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

export function createSupabaseBrowserRepository(): WorkingPartsRepository {
  return {
    strategy: "supabase",
    async loadClients() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return seedClients.map(normalizeClient);

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name", { ascending: true });

      if (error || !data) {
        return seedClients.map(normalizeClient);
      }

      return data.map((item: any) =>
        normalizeClient({
          id: item.id,
          name: item.name,
          company: item.legal_name ?? item.name,
          contact: item.primary_contact_name ?? "Pendiente",
          sector: item.sector ?? "General",
          city: item.city ?? "Sin ciudad",
          monthlyHours: Number(item.monthly_hours ?? 0),
          recurringIssues: Number(item.recurring_issues ?? 0),
          sla: item.sla_policy ?? "8h"
        })
      );
    },
    async saveClients(clients) {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      await supabase.from("clients").upsert(
        clients.map((client) => ({
          id: client.id,
          name: client.name,
          legal_name: client.company,
          primary_contact_name: client.contact,
          city: client.city,
          sector: client.sector,
          monthly_hours: client.monthlyHours,
          recurring_issues: client.recurringIssues,
          sla_policy: client.sla
        })),
        { onConflict: "id" }
      );
    },
    async loadReports() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return seedReports.map(normalizeReport);

      const [{ data: reportRows, error: reportError }, { data: clientRows }, { data: profileRows }] = await Promise.all([
        supabase.from("work_reports").select("*").order("created_at", { ascending: false }),
        supabase.from("clients").select("id,name,legal_name,primary_contact_name"),
        supabase.from("profiles").select("id,full_name")
      ]);

      if (reportError || !reportRows) {
        return seedReports.map(normalizeReport);
      }

      const clientMap = new Map<string, any>((clientRows ?? []).map((item: any) => [item.id, item]));
      const profileMap = new Map<string, any>((profileRows ?? []).map((item: any) => [item.id, item]));

      return reportRows.map((item: any) =>
        normalizeReport({
          id: item.report_number,
          date: item.work_date,
          technician: profileMap.get(item.technician_profile_id)?.full_name ?? "Tecnico",
          technicianId: item.technician_profile_id,
          client: clientMap.get(item.client_id)?.name ?? "Cliente",
          company: clientMap.get(item.client_id)?.legal_name ?? clientMap.get(item.client_id)?.name ?? "Cliente",
          contact: clientMap.get(item.client_id)?.primary_contact_name ?? "Pendiente",
          type: item.work_type,
          category: item.category_name ?? "General",
          priority: item.priority,
          startTime: item.start_time?.slice(0, 5) ?? "09:00",
          endTime: item.end_time?.slice(0, 5) ?? "10:00",
          durationHours: Number(item.duration_hours ?? 0),
          reason: item.reason,
          workDone: item.work_done,
          solution: item.solution ?? "",
          observations: item.observations ?? "",
          status: item.status,
          hasSignature: Boolean(item.has_signature),
          clientSignatureName: item.client_signature_name ?? "",
          clientSignatureDataUrl: item.client_signature_data_url ?? "",
          signedAt: item.signed_at,
          attachments: Number(item.attachments_count ?? 0),
          hourlyRate: Number(item.hourly_rate ?? 50),
          maintenanceIncluded: Boolean(item.maintenance_included ?? true),
          tags: Array.isArray(item.tags) ? item.tags : []
        })
      );
    },
    async saveReports(reports) {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      const { data: clients } = await supabase.from("clients").select("id,name");
      const clientMap = new Map<string, string>((clients ?? []).map((item: any) => [item.name.trim().toLowerCase(), item.id]));

      await supabase.from("work_reports").upsert(
        reports.map((report) => ({
          report_number: report.id,
          work_date: report.date,
          technician_profile_id: report.technicianId,
          client_id: clientMap.get(report.client.trim().toLowerCase()) ?? null,
          work_type: report.type,
          category_name: report.category,
          priority: report.priority,
          start_time: `${report.startTime}:00`,
          end_time: `${report.endTime}:00`,
          duration_hours: report.durationHours,
          reason: report.reason,
          work_done: report.workDone,
          solution: report.solution,
          observations: report.observations,
          status: report.status,
          has_signature: report.hasSignature,
          client_signature_name: report.clientSignatureName,
          client_signature_data_url: report.clientSignatureDataUrl,
          signed_at: report.signedAt,
          attachments_count: report.attachments,
          hourly_rate: report.hourlyRate,
          maintenance_included: report.maintenanceIncluded,
          tags: report.tags
        })),
        { onConflict: "report_number" }
      );
    },
    async loadPreferences(userId) {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return null;

      const { data, error } = await supabase.from("user_preferences").select("*").eq("user_id", userId).maybeSingle();
      if (error || !data) return null;

      return {
        userId,
        favoriteView: data.favorite_view ?? "/app/dashboard",
        lastVisitedRoute: data.last_visited_route ?? "/app/dashboard",
        recentClients: Array.isArray(data.recent_clients) ? data.recent_clients : [],
        recentTechnicians: Array.isArray(data.recent_technicians) ? data.recent_technicians : [],
        recentSearches: Array.isArray(data.recent_searches) ? data.recent_searches : [],
        savedReportFilters: data.saved_report_filters ?? {
          query: "",
          status: "Todos",
          priority: "Todas",
          category: "Todas",
          sortBy: "recent",
          compactView: false,
          showExtraColumns: true
        },
        reportDraft: data.report_draft ?? null,
        reducedMotion: Boolean(data.reduced_motion ?? true),
        compactTables: Boolean(data.compact_tables ?? false),
        savedFilters: Array.isArray(data.saved_filters) ? data.saved_filters : [],
        recentClientIds: Array.isArray(data.recent_client_ids) ? data.recent_client_ids : [],
        recentReportIds: Array.isArray(data.recent_report_ids) ? data.recent_report_ids : []
      };
    },
    async savePreferences(preferences) {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      await supabase.from("user_preferences").upsert(
        {
          user_id: preferences.userId,
          favorite_view: preferences.favoriteView,
          last_visited_route: preferences.lastVisitedRoute,
          recent_clients: preferences.recentClients,
          recent_technicians: preferences.recentTechnicians,
          recent_searches: preferences.recentSearches,
          saved_report_filters: preferences.savedReportFilters,
          report_draft: preferences.reportDraft,
          reduced_motion: preferences.reducedMotion,
          compact_tables: preferences.compactTables,
          saved_filters: preferences.savedFilters,
          recent_client_ids: preferences.recentClientIds,
          recent_report_ids: preferences.recentReportIds
        },
        { onConflict: "user_id" }
      );
    },
    async loadActivity(userId) {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from("recent_activity")
        .select("*")
        .eq("actor_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error || !data) return [];

      return data.map((item: any): ActivityItem => ({
        id: item.id,
        type:
          item.event_type === "report_deleted"
            ? "report_deleted"
            : item.event_type === "report_updated"
              ? "report_updated"
              : item.event_type === "client_created"
                ? "client_created"
                : "report_created",
        title: item.title,
        description: item.description,
        entityId: item.entity_id,
        createdAt: item.created_at
      }));
    },
    async saveActivity(userId, items) {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return;

      await supabase.from("recent_activity").upsert(
        items.map((item) => ({
          id: item.id,
          actor_user_id: userId,
          actor_name: "Usuario",
          event_type: item.type,
          entity_type: "report",
          entity_id: item.entityId ?? item.id,
          title: item.title,
          description: item.description,
          created_at: item.createdAt
        })),
        { onConflict: "id" }
      );
    }
  };
}
