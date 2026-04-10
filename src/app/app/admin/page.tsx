import { clients, teamMembers } from "@/data/demo";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Topbar
        title="Administración"
        subtitle="Configuración general del portal, maestros y control operativo por roles"
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <p className="text-sm text-muted-foreground">Clientes</p>
          <h3 className="text-xl font-bold">{clients.length} cuentas activas</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Gestión de ficha, SLA, datos de contacto, coste/hora y acuerdos de servicio.
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Usuarios</p>
          <h3 className="text-xl font-bold">{teamMembers.length} perfiles</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Roles listos para técnico, supervisor y administrador con permisos segregados.
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Catálogos</p>
          <h3 className="text-xl font-bold">Estados, motivos y categorías</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Estructura pensada para maestras dinámicas y configuración desde backend.
          </p>
        </Card>
      </div>

      <Card>
        <p className="text-sm text-muted-foreground">Próxima integración</p>
        <h3 className="text-xl font-bold">Backoffice conectado a Supabase</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {["Usuarios", "Clientes", "Categorías", "Estados"].map((item) => (
            <div key={item} className="rounded-2xl bg-muted/40 p-4">
              <p className="font-semibold">{item}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                CRUD preparado para persistencia, auditoría y permisos.
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
