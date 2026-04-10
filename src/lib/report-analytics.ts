import { clients } from "@/data/demo";
import { IncidentTrend, MonthlyMetric, ReportAnalytics, WorkReport } from "@/types";

function getWeekKey(date: Date) {
  const day = new Date(date);
  const first = new Date(day);
  first.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  first.setHours(0, 0, 0, 0);
  return first.getTime();
}

function buildMonthlySummary(reports: WorkReport[]): MonthlyMetric[] {
  const monthMap = new Map<string, MonthlyMetric>();

  reports.forEach((report) => {
    const currentDate = new Date(report.date);
    const month = currentDate.toLocaleDateString("es-ES", { month: "short" });
    const current = monthMap.get(month) ?? { month, reports: 0, hours: 0, billable: 0 };
    current.reports += 1;
    current.hours += report.durationHours;
    current.billable += report.durationHours * 52;
    monthMap.set(month, current);
  });

  return Array.from(monthMap.values()).map((item) => ({
    ...item,
    hours: Number(item.hours.toFixed(1)),
    billable: Math.round(item.billable)
  }));
}

function buildIncidentSummary(reports: WorkReport[]): IncidentTrend[] {
  const categoryMap = new Map<string, number>();

  reports.forEach((report) => {
    categoryMap.set(report.category, (categoryMap.get(report.category) ?? 0) + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function getReportAnalytics(reports: WorkReport[]): ReportAnalytics {
  const now = new Date();
  const todayKey = now.toDateString();
  const currentWeek = getWeekKey(now);
  const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;

  const technicianMap = new Map<string, { name: string; hours: number; reports: number }>();
  const clientMap = new Map<
    string,
    { clientId: string; name: string; hours: number; reports: number; repeatedIssues: number; lastVisit: string | null }
  >();
  const issueMap = new Map<string, number>();

  let todayHours = 0;
  let weekHours = 0;
  let monthHours = 0;
  let pendingReports = 0;
  let resolvedReports = 0;

  reports.forEach((report) => {
    const reportDate = new Date(report.date);
    const dateKey = reportDate.toDateString();
    const weekKey = getWeekKey(reportDate);
    const monthKey = `${reportDate.getFullYear()}-${reportDate.getMonth()}`;
    const issueKey = `${report.client}:${report.category}:${report.reason.toLowerCase()}`;

    if (dateKey === todayKey) todayHours += report.durationHours;
    if (weekKey === currentWeek) weekHours += report.durationHours;
    if (monthKey === currentMonth) monthHours += report.durationHours;
    if (report.status === "Pendiente" || report.status === "En seguimiento") pendingReports += 1;
    if (report.status === "Resuelto" || report.status === "Cerrado") resolvedReports += 1;

    const tech = technicianMap.get(report.technician) ?? { name: report.technician, hours: 0, reports: 0 };
    tech.hours += report.durationHours;
    tech.reports += 1;
    technicianMap.set(report.technician, tech);

    issueMap.set(issueKey, (issueMap.get(issueKey) ?? 0) + 1);

    const clientId = clients.find((client) => client.name === report.client)?.id ?? report.client;
    const clientSummary =
      clientMap.get(report.client) ??
      ({ clientId, name: report.client, hours: 0, reports: 0, repeatedIssues: 0, lastVisit: null } as const);

    const nextClientSummary = {
      ...clientSummary,
      hours: clientSummary.hours + report.durationHours,
      reports: clientSummary.reports + 1,
      lastVisit:
        !clientSummary.lastVisit || new Date(report.date) > new Date(clientSummary.lastVisit) ? report.date : clientSummary.lastVisit
    };

    clientMap.set(report.client, nextClientSummary);
  });

  issueMap.forEach((count, compositeKey) => {
    if (count < 2) return;
    const clientName = compositeKey.split(":")[0];
    const summary = clientMap.get(clientName);
    if (summary) {
      summary.repeatedIssues += 1;
      clientMap.set(clientName, summary);
    }
  });

  const incidentSummary = buildIncidentSummary(reports);

  return {
    todayHours: Number(todayHours.toFixed(1)),
    weekHours: Number(weekHours.toFixed(1)),
    monthHours: Number(monthHours.toFixed(1)),
    totalReports: reports.length,
    pendingReports,
    resolvedReports,
    averageResolutionHours: Number(
      (reports.reduce((sum, report) => sum + report.durationHours, 0) / Math.max(reports.length, 1)).toFixed(1)
    ),
    uniqueClients: new Set(reports.map((report) => report.client)).size,
    mostFrequentCategory: incidentSummary[0]?.label ?? "Sin datos",
    topTechnicians: Array.from(technicianMap.values())
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5)
      .map((item) => ({ ...item, hours: Number(item.hours.toFixed(1)) })),
    clientSummaries: Array.from(clientMap.values())
      .sort((a, b) => b.hours - a.hours)
      .map((item) => ({ ...item, hours: Number(item.hours.toFixed(1)) })),
    monthlySummary: buildMonthlySummary(reports),
    incidentSummary
  };
}
