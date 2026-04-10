import { Client, IncidentTrend, KPI, MonthlyMetric, User, WorkReport } from "@/types";

export const currentUser: User = {
  id: "u-1",
  name: "Carlos Martín",
  role: "supervisor",
  email: "carlos.martin@portalit.es",
  avatar: "CM"
};

export const teamMembers: User[] = [
  currentUser,
  { id: "u-2", name: "Lucía Gómez", role: "technician", email: "lucia@portalit.es", avatar: "LG" },
  { id: "u-3", name: "Diego Ramos", role: "technician", email: "diego@portalit.es", avatar: "DR" },
  { id: "u-4", name: "Sara Ortega", role: "admin", email: "sara@portalit.es", avatar: "SO" }
];

export const clients: Client[] = [
  {
    id: "c-1",
    name: "Grupo Aranda",
    company: "Grupo Aranda Logistics",
    contact: "María Serrano",
    sector: "Logística",
    city: "Madrid",
    monthlyHours: 52,
    recurringIssues: 6,
    sla: "4h"
  },
  {
    id: "c-2",
    name: "Clínica Montealto",
    company: "Montealto Salud",
    contact: "Pablo Giner",
    sector: "Sanidad",
    city: "Toledo",
    monthlyHours: 31,
    recurringIssues: 3,
    sla: "2h"
  },
  {
    id: "c-3",
    name: "Fábrica Torreluz",
    company: "Torreluz Manufacturing",
    contact: "Ana Paredes",
    sector: "Industria",
    city: "Guadalajara",
    monthlyHours: 44,
    recurringIssues: 7,
    sla: "8h"
  },
  {
    id: "c-4",
    name: "Asesoría Norte",
    company: "Asesoría Norte SL",
    contact: "Raúl Sanz",
    sector: "Servicios",
    city: "Madrid",
    monthlyHours: 19,
    recurringIssues: 2,
    sla: "12h"
  }
];

export const reports: WorkReport[] = [
  {
    id: "PT-2026-001",
    date: "2026-04-09",
    technician: "Lucía Gómez",
    technicianId: "u-2",
    client: "Grupo Aranda",
    company: "Grupo Aranda Logistics",
    contact: "María Serrano",
    type: "Remoto",
    category: "Office 365",
    priority: "Alta",
    startTime: "08:15",
    endTime: "09:35",
    durationHours: 1.3,
    reason: "Buzones no sincronizan en Outlook",
    workDone: "Revisión de perfiles, conectividad M365 y estado de Autodiscover",
    solution: "Recreación de perfil y limpieza de credenciales en Windows",
    observations: "Queda monitorizado durante 24h",
    status: "Resuelto",
    hasSignature: false,
    attachments: 2,
    tags: ["M365", "Outlook", "Correo"]
  },
  {
    id: "PT-2026-002",
    date: "2026-04-09",
    technician: "Diego Ramos",
    technicianId: "u-3",
    client: "Clínica Montealto",
    company: "Montealto Salud",
    contact: "Pablo Giner",
    type: "Presencial",
    category: "Impresoras",
    priority: "Media",
    startTime: "09:00",
    endTime: "10:40",
    durationHours: 1.7,
    reason: "Cola de impresión bloqueada en recepción",
    workDone: "Limpieza de spooler y revisión de conectividad de impresora Zebra",
    solution: "Reinstalación del driver y reserva de IP fija",
    observations: "Se recomienda renovación del equipo en Q3",
    status: "Resuelto",
    hasSignature: true,
    attachments: 3,
    tags: ["Impresión", "Recepción"]
  },
  {
    id: "PT-2026-003",
    date: "2026-04-08",
    technician: "Lucía Gómez",
    technicianId: "u-2",
    client: "Fábrica Torreluz",
    company: "Torreluz Manufacturing",
    contact: "Ana Paredes",
    type: "Remoto",
    category: "Copias de seguridad",
    priority: "Alta",
    startTime: "16:10",
    endTime: "18:00",
    durationHours: 1.8,
    reason: "Fallo recurrente en backup incremental de servidor de archivos",
    workDone: "Revisión de logs de Veeam Agent y espacio NAS",
    solution: "Ajuste de retención y expansión de repositorio",
    observations: "Incidencia recurrente en el último mes",
    status: "En seguimiento",
    hasSignature: false,
    attachments: 1,
    tags: ["Backup", "NAS", "Veeam"]
  },
  {
    id: "PT-2026-004",
    date: "2026-04-08",
    technician: "Diego Ramos",
    technicianId: "u-3",
    client: "Asesoría Norte",
    company: "Asesoría Norte SL",
    contact: "Raúl Sanz",
    type: "Remoto",
    category: "RDP / TSplus",
    priority: "Alta",
    startTime: "11:20",
    endTime: "13:00",
    durationHours: 1.7,
    reason: "Usuarios sin acceso a TSplus tras actualización",
    workDone: "Validación de licencias, puertos y servicio de publicación",
    solution: "Rollback controlado y actualización de certificados",
    observations: "Pendiente actualizar manual interno del cliente",
    status: "Pendiente",
    hasSignature: false,
    attachments: 2,
    tags: ["TSplus", "RDP", "Acceso remoto"]
  },
  {
    id: "PT-2026-005",
    date: "2026-04-07",
    technician: "Lucía Gómez",
    technicianId: "u-2",
    client: "Grupo Aranda",
    company: "Grupo Aranda Logistics",
    contact: "María Serrano",
    type: "Presencial",
    category: "Redes",
    priority: "Media",
    startTime: "12:00",
    endTime: "15:10",
    durationHours: 3.2,
    reason: "Microcortes de red en planta 2",
    workDone: "Pruebas de cableado, switch PoE y APs Ubiquiti",
    solution: "Sustitución de latiguillos y reconfiguración de VLAN de voz",
    observations: "Cliente solicita propuesta de renovación",
    status: "Cerrado",
    hasSignature: true,
    attachments: 4,
    tags: ["Switch", "WiFi", "Cableado"]
  }
];

export const dashboardKpis: KPI[] = [
  { label: "Horas esta semana", value: "42,6 h", change: "+12%", trend: "up", helper: "Productividad acumulada del equipo" },
  { label: "Partes registrados", value: "28", change: "+5", trend: "up", helper: "Comparado con la semana anterior" },
  { label: "Clientes activos", value: "14", change: "estable", trend: "neutral", helper: "Con intervenciones en 30 días" },
  { label: "Tiempo medio", value: "1,8 h", change: "-9%", trend: "up", helper: "Resolución media por incidencia" }
];

export const monthlyMetrics: MonthlyMetric[] = [
  { month: "Ene", reports: 96, hours: 142, billable: 9200 },
  { month: "Feb", reports: 101, hours: 149, billable: 9750 },
  { month: "Mar", reports: 118, hours: 171, billable: 11120 },
  { month: "Abr", reports: 84, hours: 126, billable: 8200 }
];

export const incidentTrends: IncidentTrend[] = [
  { label: "Office 365", value: 18 },
  { label: "Impresoras", value: 14 },
  { label: "Redes", value: 12 },
  { label: "Backups", value: 10 },
  { label: "RDP / TSplus", value: 8 }
];

export const quickFilters = ["Hoy", "Esta semana", "Alta prioridad", "Pendientes", "Cliente recurrente"];
