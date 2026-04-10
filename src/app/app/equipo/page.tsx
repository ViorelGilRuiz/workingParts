import { teamMembers } from "@/data/demo";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <Topbar
        title="Equipo técnico"
        subtitle="Carga, productividad y organización interna del servicio de soporte"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((member, index) => (
          <Card key={member.id}>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">
                {member.avatar}
              </div>
              <div>
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-sm capitalize text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Horas esta semana</span>
                <span className="font-semibold">{[16, 21, 18, 9][index]} h</span>
              </div>
              <div className="flex justify-between">
                <span>Partes cerrados</span>
                <span className="font-semibold">{[11, 14, 12, 6][index]}</span>
              </div>
              <div className="flex justify-between">
                <span>SLA</span>
                <span className="font-semibold">{[97, 95, 93, 100][index]}%</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
