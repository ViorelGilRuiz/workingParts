"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { IncidentTrend, MonthlyMetric } from "@/types";
import { Card } from "@/components/ui/card";

export function RevenueChart({ data }: { data: MonthlyMetric[] }) {
  return (
    <Card className="h-[390px]">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Evolución mensual</p>
        <h3 className="text-xl font-bold">Carga operativa y facturación</h3>
      </div>
      <ResponsiveContainer width="100%" height="84%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(148,163,184,0.2)",
              background: "rgba(15,23,42,0.92)",
              color: "#fff"
            }}
          />
          <Area type="monotone" dataKey="hours" stroke="#0ea5e9" fill="url(#hoursGradient)" strokeWidth={3} />
          <Area type="monotone" dataKey="reports" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function IncidentChart({ data }: { data: IncidentTrend[] }) {
  return (
    <Card className="h-[390px]">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Top incidencias</p>
        <h3 className="text-xl font-bold">Frecuencia por categoría</h3>
      </div>
      <ResponsiveContainer width="100%" height="84%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="label" width={90} />
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(148,163,184,0.2)",
              background: "rgba(15,23,42,0.92)",
              color: "#fff"
            }}
          />
          <Bar dataKey="value" radius={[0, 10, 10, 0]} fill="#14b8a6" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
