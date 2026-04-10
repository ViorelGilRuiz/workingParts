import {
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Cloud,
  Cpu,
  Database,
  Gauge,
  HardDrive,
  LayoutDashboard,
  LifeBuoy,
  LockKeyhole,
  MonitorCog,
  Server,
  ShieldCheck,
  Users
} from "lucide-react";

export const navigation = [
  { href: "/app/dashboard", label: "Dashboard", description: "Vision general y actividad", icon: LayoutDashboard },
  { href: "/app/partes", label: "Tickets y partes", description: "Crear, editar y seguir trabajo", icon: ClipboardList },
  { href: "/app/clientes", label: "Clientes", description: "Alta manual y cartera", icon: Building2 },
  { href: "/app/resumen-mensual", label: "Resumen mensual", description: "Horas, firmas y facturacion", icon: Gauge },
  { href: "/app/incidencias-frecuentes", label: "Patrones", description: "Historico y recurrencia", icon: BriefcaseBusiness },
  { href: "/app/equipo", label: "Equipo", description: "Carga y supervision", icon: Users },
  { href: "/app/admin", label: "Administracion", description: "Control y crecimiento", icon: ShieldCheck }
];

export const statusStyles: Record<string, string> = {
  Resuelto: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Pendiente: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "En seguimiento": "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Cerrado: "bg-slate-500/10 text-slate-700 dark:text-slate-300"
};

export const ticketTemplates = [
  {
    id: "m365",
    label: "Microsoft 365",
    icon: Cloud,
    category: "Office 365",
    type: "Remoto",
    priority: "Media",
    title: "Sincronizacion de Outlook y correo",
    reason: "Usuario con problemas de sincronizacion en Outlook, OneDrive o credenciales de Microsoft 365.",
    workDone: "Revision de credenciales, conectividad, perfil y estado de servicios de Microsoft 365.",
    solution: "Reconfiguracion de perfil, validacion de licencia y limpieza de credenciales en el equipo."
  },
  {
    id: "infra",
    label: "Infraestructura",
    icon: Server,
    category: "Windows",
    type: "Remoto",
    priority: "Alta",
    title: "Servidor o puesto critico",
    reason: "Incidencia sobre servidor Windows, recursos compartidos, perfiles o acceso a servicios internos.",
    workDone: "Comprobacion de eventos, recursos, servicios y acceso remoto sobre la infraestructura afectada.",
    solution: "Ajuste de servicios, revision de permisos y validacion operativa tras la intervencion."
  },
  {
    id: "backup",
    label: "Backup",
    icon: HardDrive,
    category: "Copias de seguridad",
    type: "Remoto",
    priority: "Alta",
    title: "Error en copia de seguridad",
    reason: "El sistema de copias o el repositorio muestra errores recurrentes o no finaliza correctamente.",
    workDone: "Revision de logs, repositorio, espacio disponible y planificacion de tareas de copia.",
    solution: "Ajuste de tarea, correccion del repositorio y validacion de la siguiente ejecucion."
  },
  {
    id: "network",
    label: "Redes",
    icon: Cpu,
    category: "Redes",
    type: "Presencial",
    priority: "Alta",
    title: "Conexion o red local",
    reason: "Se detectan microcortes, lentitud o perdida de conectividad en puestos, switches o WiFi.",
    workDone: "Pruebas de red, verificacion de cableado, equipos intermedios y cobertura inalambrica.",
    solution: "Reconfiguracion de red, sustitucion de elementos y estabilizacion del acceso."
  },
  {
    id: "bd",
    label: "Datos",
    icon: Database,
    category: "RDP / TSplus",
    type: "Remoto",
    priority: "Media",
    title: "Acceso remoto o aplicacion central",
    reason: "El usuario no puede acceder a escritorio remoto, TSplus o a la aplicacion de negocio centralizada.",
    workDone: "Revision de sesion, credenciales, publicacion, certificados y conectividad al entorno remoto.",
    solution: "Reinicio controlado del servicio, ajuste de permisos y validacion de acceso."
  },
  {
    id: "support",
    label: "Soporte premium",
    icon: LifeBuoy,
    category: "Impresoras",
    type: "Presencial",
    priority: "Media",
    title: "Visita de mantenimiento",
    reason: "Revision preventiva, soporte de puesto, impresoras y tareas de mantenimiento general del cliente.",
    workDone: "Chequeo de puesto, perifericos, actualizaciones y consultas pendientes del cliente.",
    solution: "Mantenimiento completado y recomendaciones trasladadas al responsable."
  }
] as const;

export const loginTechIcons = [
  { icon: Cloud, label: "cloud" },
  { icon: Server, label: "server" },
  { icon: MonitorCog, label: "monitor" },
  { icon: ShieldCheck, label: "shield" },
  { icon: Database, label: "database" },
  { icon: Cpu, label: "cpu" },
  { icon: HardDrive, label: "backup" },
  { icon: LockKeyhole, label: "security" }
] as const;

export const quickFilters = ["Hoy", "Esta semana", "Pendientes", "Facturable", "Cliente"];
